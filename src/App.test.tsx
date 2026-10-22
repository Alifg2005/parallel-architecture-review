import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import { THEME_KEY } from './lib/theme';
import { chapters } from './content/registry';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('routes', () => {
  it('home page shows branding, midterm info and a card for every lecture', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1, name: /Parallel Computer Architecture/ })).toBeInTheDocument();
    expect(screen.getAllByText('ALi Feras Alghanim').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /Lectures 1–6/ })).toBeInTheDocument();
    expect(screen.getByText('Week 9')).toBeInTheDocument();
    for (const title of ['Why Parallel Computing?', 'MultiCore Processors', 'PThreads', 'Parallel Programming Using OpenMP']) {
      expect(screen.getAllByRole('link', { name: title }).length).toBeGreaterThan(0);
    }
    expect(screen.queryByText('Not yet added')).not.toBeInTheDocument();
  });

  it('renders a lecture review with objectives, exam points and quick revision', () => {
    renderAt('/lectures/lecture-03');
    expect(screen.getByRole('heading', { level: 1, name: /Introduction to Parallel Computer Architecture/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Learning objectives/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Important exam points' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Quick revision' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /quiz/i })[0]).toHaveAttribute('href', '/lectures/lecture-03/quiz');
  });

  it('renders the quiz page for a lecture', () => {
    renderAt('/lectures/lecture-06/quiz');
    expect(screen.getByRole('heading', { level: 1, name: /OpenMP: Quiz/ })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
  });

  it('renders lecture essays with hidden model answers that can be revealed', async () => {
    const user = userEvent.setup();
    renderAt('/lectures/lecture-04/essays');
    const reveal = screen.getAllByRole('button', { name: 'Reveal model answer' });
    expect(reveal.length).toBeGreaterThanOrEqual(5);
    expect(screen.queryByRole('region', { name: 'Model answer' })).not.toBeInTheDocument();
    await user.click(reveal[0]!);
    expect(screen.getByRole('region', { name: 'Model answer' })).toBeInTheDocument();
  });

  it('essay index can filter by lecture', async () => {
    const user = userEvent.setup();
    renderAt('/essays');
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBe(chapters.length);
    await user.click(screen.getByRole('button', { name: 'Lecture 2' }));
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
  });

  it('shows a helpful page for an unknown lecture', () => {
    renderAt('/lectures/lecture-42');
    expect(screen.getByRole('heading', { name: 'That lecture is not available' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
  });

  it('shows a helpful page for an unknown quiz', () => {
    renderAt('/lectures/lecture-42/quiz');
    expect(screen.getByRole('heading', { name: 'That lecture is not available' })).toBeInTheDocument();
  });

  it('shows a 404 for unknown routes', () => {
    renderAt('/does/not/exist');
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });

  it('theme toggle switches and persists the theme across navigation', async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute('data-theme', 'light');
    renderAt('/');
    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(THEME_KEY)).toBe('dark');
    await user.click(screen.getAllByRole('link', { name: 'Why Parallel Computing?' })[0]!);
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });
});
