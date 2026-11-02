export type FishVariant = 'tropical' | 'striped' | 'slim' | 'round';

interface FishProps {
  className?: string;
  body?: string;
  fin?: string;
  stripe?: string;
  variant?: FishVariant;
  flip?: boolean;
}

/** Generic original fish silhouettes used for decoration. */
export function Fish({ className, body = '#fb923c', fin = '#f97316', stripe = '#ffffff', variant = 'tropical', flip }: FishProps) {
  return (
    <svg viewBox="0 0 120 70" className={className} aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {variant === 'round' ? (
        <>
          <path d="M92 35 L 118 14 L 112 35 L 118 56 Z" fill={fin} />
          <ellipse cx="54" cy="35" rx="42" ry="30" fill={body} />
          <path d="M44 6 C 56 0, 72 4, 78 12 L 50 14 Z" fill={fin} />
          <path d="M44 64 C 56 70, 72 66, 78 58 L 50 56 Z" fill={fin} />
        </>
      ) : variant === 'slim' ? (
        <>
          <path d="M96 35 L 120 20 L 114 35 L 120 50 Z" fill={fin} />
          <path d="M4 35 C 20 18, 70 16, 98 35 C 70 54, 20 52, 4 35 Z" fill={body} />
          <path d="M40 22 L 64 14 L 70 24 Z" fill={fin} />
        </>
      ) : (
        <>
          <path d="M90 35 L 118 12 L 110 35 L 118 58 Z" fill={fin} />
          <path d="M6 35 C 18 10, 70 6, 94 35 C 70 64, 18 60, 6 35 Z" fill={body} />
          <path d="M36 14 C 50 2, 70 6, 74 16 Z" fill={fin} />
        </>
      )}
      {(variant === 'striped' || variant === 'tropical') && (
        <>
          <path d="M34 12 C 28 26, 28 44, 34 58" stroke={stripe} strokeWidth="6" fill="none" />
          <path d="M62 12 C 56 26, 56 44, 62 58" stroke={stripe} strokeWidth="5" fill="none" opacity={variant === 'striped' ? 1 : 0.6} />
        </>
      )}
      <circle cx="22" cy="31" r="5" fill="#fff" />
      <circle cx="21" cy="31" r="2.6" fill="#0f172a" />
    </svg>
  );
}
