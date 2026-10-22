import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../lib/theme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="relative inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink-2 transition-colors hover:border-accent hover:text-accent-ink"
    >
      {theme === 'dark' ? <Sun className="size-[1.15rem]" aria-hidden /> : <Moon className="size-[1.15rem]" aria-hidden />}
    </button>
  );
}
