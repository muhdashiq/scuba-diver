import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('keeps text colour alongside custom font sizes', () => {
    expect(cn('text-primary', 'text-subhead')).toBe('text-primary text-subhead');
    expect(cn('text-callout', 'text-footnote')).toBe('text-footnote');
    expect(cn('text-primary', 'text-destructive')).toBe('text-destructive');
  });
});
