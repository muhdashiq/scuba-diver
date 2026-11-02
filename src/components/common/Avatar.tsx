import { UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

export const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

/** Circular avatar with initials (Contacts-style gradient), or a person glyph when no name is set. */
export function Avatar({ name, size = 40, className }: { name: string; size?: number; className?: string }) {
  const initials = initialsOf(name);
  return (
    <span
      className={cn('inline-flex shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-b from-[#A5ABB8] to-[#858994] font-semibold text-white', className)}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {initials || <UserRound style={{ width: size * 0.55, height: size * 0.55 }} strokeWidth={2} />}
    </span>
  );
}
