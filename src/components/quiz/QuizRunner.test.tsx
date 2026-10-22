import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QuizRunner } from './QuizRunner';
import { chapter } from '../../content/chapters/lecture-05';
import type { QuizResult } from '../../lib/quiz';

const questions = chapter.quiz;

function setup(onSubmit = vi.fn<(r: QuizResult) => void>()) {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <QuizRunner questions={questions} reviewHref="/lectures/lecture-05" essaysHref="/lectures/lecture-05/essays" onSubmit={onSubmit} />
    </MemoryRouter>,
  );
  return { user, onSubmit };
}

const optionRadio = (index: number) => screen.getAllByRole('radio')[index]!;

/** Waits until question n is the one rendered (the previous one animates out first). */
async function questionRadios(n: number) {
  const group = await screen.findByRole('group', { name: new RegExp('^Question ' + n + ' of 20') });
  return within(group).getAllByRole('radio');
}

describe('QuizRunner', () => {
  it('shows progress and the first question without revealing answers', () => {
    setup();
    expect(screen.getAllByText('Question 1 of 20').length).toBeGreaterThan(0);
    expect(screen.getByText('0/20 answered')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
    expect(screen.queryByText(/Why:/)).not.toBeInTheDocument();
    expect(screen.queryByText(questions[0]!.explanation)).not.toBeInTheDocument();
  });

  it('lets the student select, navigate and change answers', async () => {
    const { user } = setup();
    await user.click(optionRadio(2));
    expect(optionRadio(2)).toBeChecked();
    expect(screen.getByText('1/20 answered')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next question' }));
    const q2 = await questionRadios(2);
    expect(q2.some((r) => (r as HTMLInputElement).checked)).toBe(false);

    await user.click(screen.getByRole('button', { name: 'Previous question' }));
    const q1 = await questionRadios(1);
    expect(q1[2]).toBeChecked();
    await user.click(q1[0]!);
    expect(q1[0]).toBeChecked();
    expect(screen.getByText('1/20 answered')).toBeInTheDocument();
  });

  it('supports keyboard shortcuts A–D', async () => {
    const { user } = setup();
    await user.keyboard('d');
    expect(optionRadio(3)).toBeChecked();
  });

  it('jumps to a question from the navigator', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Question 12, not answered' }));
    expect(await questionRadios(12)).toHaveLength(4);
  });

  it('summarises unanswered questions before submission and scores from the answer key', async () => {
    const { user, onSubmit } = setup();
    // Answer Q1 correctly and Q2 incorrectly; leave the rest blank.
    await user.click(optionRadio(questions[0]!.answer));
    await user.click(screen.getByRole('button', { name: 'Next question' }));
    const q2 = await questionRadios(2);
    await user.click(q2[(questions[1]!.answer + 1) % 4]!);

    await user.click(screen.getByRole('button', { name: /Finish & review answers/ }));
    expect(screen.getByRole('heading', { name: 'You answered 2 of 20 questions' })).toBeInTheDocument();
    expect(screen.getByText(/18 questions are unanswered/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Submit quiz' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]![0]).toMatchObject({ correct: 1, incorrect: 1, unanswered: 18, percentage: 5 });

    expect(screen.getByRole('heading', { name: /You scored 1 out of 20 \(5%\)/ })).toBeInTheDocument();
    // Explanations are now visible.
    expect(screen.getByText(questions[0]!.explanation)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Submit quiz' })).not.toBeInTheDocument();
  });

  it('filters the review to missed questions and supports retry', async () => {
    const { user } = setup();
    await user.click(optionRadio(questions[0]!.answer));
    await user.click(screen.getByRole('button', { name: /Finish & review answers/ }));
    await user.click(screen.getByRole('button', { name: 'Submit quiz' }));

    const review = screen.getByRole('heading', { name: 'Question review' }).closest('section')!;
    expect(within(review).getAllByRole('listitem').filter((li) => li.textContent?.startsWith('Q')).length).toBe(20);
    await user.click(screen.getByRole('button', { name: 'Missed 19' }));
    expect(within(review).queryByText(questions[0]!.explanation)).not.toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: /Retry quiz/ })[0]!);
    expect(screen.getByText('0/20 answered')).toBeInTheDocument();
    expect(screen.getAllByText('Question 1 of 20').length).toBeGreaterThan(0);
  });

  it('links back to the lecture review from the results', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /Finish & review answers/ }));
    await user.click(screen.getByRole('button', { name: 'Submit quiz' }));
    const links = screen.getAllByRole('link', { name: /Back to lecture review/ });
    expect(links[0]).toHaveAttribute('href', '/lectures/lecture-05');
  });
});
