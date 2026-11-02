import { useId } from 'react';
import type { MarineArtKey } from '@/types';

const EYE = (x: number, y: number, r = 4) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#fff" />
    <circle cx={x - r * 0.15} cy={y} r={r * 0.55} fill="#0f172a" />
  </g>
);

/** Original stylised marine-life artwork. Each piece fits a 200×140 viewBox. */
const ART: Record<MarineArtKey, JSX.Element> = {
  clownfish: (
    <g>
      <path d="M150 70 L 186 46 L 178 70 L 186 94 Z" fill="#ea580c" stroke="#0f172a" strokeWidth="2" />
      <path d="M20 70 C 40 30, 120 26, 156 70 C 120 114, 40 110, 20 70 Z" fill="#f97316" stroke="#0f172a" strokeWidth="2" />
      <path d="M58 36 C 50 56, 50 86, 58 104" stroke="#fff" strokeWidth="12" fill="none" />
      <path d="M58 36 C 50 56, 50 86, 58 104" stroke="#0f172a" strokeWidth="14" fill="none" opacity="0.15" />
      <path d="M100 34 C 92 56, 92 86, 100 106" stroke="#fff" strokeWidth="13" fill="none" />
      <path d="M144 56 C 140 66, 140 76, 144 84" stroke="#fff" strokeWidth="8" fill="none" />
      <path d="M70 32 C 90 14, 120 20, 130 40" fill="#ea580c" stroke="#0f172a" strokeWidth="2" />
      {EYE(38, 64, 6)}
    </g>
  ),
  angelfish: (
    <g>
      <path d="M100 20 C 150 30, 170 60, 170 70 C 170 80, 150 110, 100 120 C 60 110, 30 90, 26 70 C 30 50, 60 30, 100 20 Z" fill="#1d4ed8" />
      <path d="M100 20 L 120 2 L 128 30 Z M100 120 L 120 138 L 128 110 Z" fill="#facc15" />
      {[50, 70, 90, 110, 130].map((x) => (
        <path key={x} d={`M${x} 34 C ${x - 10} 60, ${x - 10} 80, ${x} 106`} stroke="#facc15" strokeWidth="4" fill="none" />
      ))}
      <path d="M168 70 L 192 52 L 192 88 Z" fill="#facc15" />
      {EYE(44, 64, 6)}
    </g>
  ),
  butterflyfish: (
    <g>
      <path d="M150 70 L 180 54 L 180 86 Z" fill="#facc15" />
      <ellipse cx="100" cy="70" rx="56" ry="46" fill="#fde047" />
      <path d="M90 26 L 150 40 L 156 70 Z" fill="#facc15" />
      <path d="M40 66 L 64 66" stroke="#0f172a" strokeWidth="10" strokeLinecap="round" />
      <circle cx="132" cy="86" r="9" fill="#0f172a" />
      {[70, 90, 110].map((x) => (
        <path key={x} d={`M${x} 30 L ${x + 20} 110`} stroke="#f59e0b" strokeWidth="3" />
      ))}
      <path d="M44 70 L 26 74" stroke="#fde047" strokeWidth="6" strokeLinecap="round" />
      {EYE(54, 64, 4)}
    </g>
  ),
  parrotfish: (
    <g>
      <path d="M160 70 L 192 46 L 186 70 L 192 94 Z" fill="#7c3aed" />
      <path d="M14 72 C 30 30, 130 24, 166 70 C 130 116, 30 112, 14 72 Z" fill="#14b8a6" />
      <path d="M14 72 C 18 64, 24 62, 30 64 L 30 80 C 24 82, 18 80, 14 72 Z" fill="#f0abfc" />
      {[50, 80, 110, 140].map((x) => (
        <path key={x} d={`M${x} 40 q 8 30 0 64`} stroke="#5eead4" strokeWidth="3" fill="none" />
      ))}
      <path d="M60 34 C 90 22, 130 30, 146 48" stroke="#ec4899" strokeWidth="6" fill="none" />
      {EYE(40, 62, 5)}
    </g>
  ),
  lionfish: (
    <g>
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${60 + i * 10} 54 L ${44 + i * 14} ${6 + (i % 2) * 8}`} stroke="#fecaca" strokeWidth="3" />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M${70 + i * 8} 86 C ${60 + i * 10} 120, ${40 + i * 12} 130, ${30 + i * 14} 136`} stroke="#fca5a5" strokeWidth="5" fill="none" opacity="0.8" />
      ))}
      <path d="M30 70 C 50 44, 140 44, 166 70 C 140 96, 50 96, 30 70 Z" fill="#fef2f2" />
      {[50, 66, 82, 98, 114, 130, 146].map((x) => (
        <path key={x} d={`M${x} 50 q -6 20 0 40`} stroke="#b91c1c" strokeWidth="6" fill="none" />
      ))}
      <path d="M164 70 L 192 54 L 192 86 Z" fill="#fecaca" />
      {EYE(42, 66, 5)}
    </g>
  ),
  'moorish-idol': (
    <g>
      <path d="M60 46 C 70 20, 90 10, 120 4 C 100 30, 100 40, 104 48" fill="#f8fafc" />
      <path d="M40 72 C 50 40, 110 30, 150 60 C 150 90, 110 110, 50 100 Z" fill="#fef9c3" />
      <path d="M60 40 L 80 104 L 100 104 L 82 36 Z" fill="#0f172a" />
      <path d="M118 48 L 138 96 L 150 80 L 136 54 Z" fill="#0f172a" />
      <path d="M150 64 L 178 52 L 178 82 L 150 78 Z" fill="#0f172a" />
      <path d="M40 72 L 22 76 L 40 82 Z" fill="#fb923c" />
      {EYE(50, 68, 4)}
    </g>
  ),
  'reef-shark': (
    <g>
      <path d="M10 76 C 40 54, 120 46, 168 66 L 196 40 L 186 76 L 198 104 L 166 84 C 120 98, 40 96, 10 76 Z" fill="#64748b" />
      <path d="M10 76 C 40 90, 120 94, 166 84 C 120 86, 40 84, 14 78 Z" fill="#e2e8f0" />
      <path d="M86 56 L 104 22 L 118 54 Z" fill="#475569" />
      <path d="M100 22 L 104 22 L 110 34 Z" fill="#f8fafc" />
      <path d="M60 86 L 76 112 L 90 88 Z" fill="#475569" />
      <path d="M186 40 L 196 40 L 190 50 Z" fill="#0f172a" />
      {[40, 46, 52].map((x) => <path key={x} d={`M${x} 70 v 12`} stroke="#334155" strokeWidth="2" />)}
      {EYE(26, 72, 3)}
    </g>
  ),
  'whale-shark': (
    <g>
      <path d="M6 70 C 30 40, 130 36, 170 60 L 196 30 L 190 70 L 198 110 L 168 82 C 130 104, 30 100, 6 70 Z" fill="#1e3a8a" />
      <path d="M6 70 h 26" stroke="#0f172a" strokeWidth="4" />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={30 + ((i * 37) % 140)} cy={48 + ((i * 23) % 40)} r="2.6" fill="#e0f2fe" />
      ))}
      <path d="M96 46 L 112 20 L 124 48 Z" fill="#1e40af" />
      {EYE(22, 66, 2.5)}
    </g>
  ),
  manta: (
    <g>
      <path d="M100 40 C 70 40, 40 50, 6 86 C 50 80, 80 84, 100 104 C 120 84, 150 80, 194 86 C 160 50, 130 40, 100 40 Z" fill="#1f2937" />
      <path d="M86 40 C 82 30, 86 22, 90 20 C 92 28, 92 36, 94 40 Z M114 40 C 118 30, 114 22, 110 20 C 108 28, 108 36, 106 40 Z" fill="#111827" />
      <path d="M100 104 C 100 118, 104 130, 110 138" stroke="#111827" strokeWidth="3" fill="none" />
      <path d="M80 54 C 90 48, 110 48, 120 54" stroke="#f8fafc" strokeWidth="4" fill="none" opacity="0.6" />
      <path d="M60 66 C 80 60, 120 60, 140 66" stroke="#f8fafc" strokeWidth="3" fill="none" opacity="0.4" />
    </g>
  ),
  stingray: (
    <g>
      <path d="M100 28 C 150 34, 176 70, 160 96 C 140 118, 60 118, 40 96 C 24 70, 50 34, 100 28 Z" fill="#a8a29e" />
      <path d="M100 112 C 104 124, 120 132, 150 136" stroke="#78716c" strokeWidth="4" fill="none" />
      {Array.from({ length: 18 }, (_, i) => (
        <circle key={i} cx={60 + ((i * 29) % 80)} cy={46 + ((i * 17) % 56)} r="3.5" fill="#38bdf8" opacity="0.85" />
      ))}
      {EYE(88, 52, 3)}
      {EYE(112, 52, 3)}
    </g>
  ),
  turtle: (
    <g>
      <path d="M48 52 C 30 34, 20 30, 8 36 C 20 46, 32 56, 50 62 Z" fill="#65a30d" />
      <path d="M48 92 C 30 108, 18 112, 8 106 C 22 96, 34 88, 50 84 Z" fill="#65a30d" />
      <path d="M142 56 C 156 46, 168 46, 172 52 C 164 58, 154 62, 144 64 Z" fill="#65a30d" />
      <path d="M142 86 C 156 96, 168 96, 172 90 C 164 84, 154 80, 144 78 Z" fill="#65a30d" />
      <ellipse cx="96" cy="72" rx="56" ry="40" fill="#854d0e" />
      {[[80, 60], [112, 60], [96, 84], [72, 84], [120, 84], [96, 52]].map(([x, y], i) => (
        <path key={i} d={`M${x - 10} ${y} l 10 -9 l 10 9 l -4 12 h -12 z`} fill="#a16207" stroke="#facc15" strokeWidth="1.5" opacity="0.9" />
      ))}
      <ellipse cx="164" cy="72" rx="18" ry="14" fill="#84cc16" />
      {EYE(172, 66, 3)}
    </g>
  ),
  'coral-branching': (
    <g fill="none" strokeLinecap="round">
      <path d="M100 136 V 90 M100 100 C 80 80, 70 70, 66 44 M100 96 C 120 76, 130 66, 136 40 M100 90 C 98 70, 104 50, 100 24 M66 60 C 54 54, 48 44, 46 30 M136 56 C 150 50, 156 40, 158 26 M82 76 C 70 74, 60 70, 52 62 M118 72 C 130 70, 140 66, 150 60" stroke="#fb7185" strokeWidth="10" />
      <path d="M40 136 C 40 116, 30 104, 26 90 M160 136 C 160 116, 172 104, 176 92" stroke="#c084fc" strokeWidth="8" />
    </g>
  ),
  'coral-brain': (
    <g>
      <ellipse cx="100" cy="100" rx="80" ry="44" fill="#a3e635" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${30 + i * 4} ${100 - i * 8} C 60 ${80 - i * 8}, 80 ${120 - i * 8}, 110 ${96 - i * 8} S 150 ${86 - i * 6}, ${170 - i * 4} ${100 - i * 8}`} stroke="#4d7c0f" strokeWidth="4" fill="none" />
      ))}
    </g>
  ),
  'coral-fan': (
    <g fill="none" strokeLinecap="round">
      <path d="M100 136 V 100" stroke="#7c2d12" strokeWidth="8" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = -70 + i * 17.5;
        const x = 100 + 90 * Math.sin((a * Math.PI) / 180);
        const y = 100 - 80 * Math.cos((a * Math.PI) / 180);
        return <path key={i} d={`M100 100 Q ${(100 + x) / 2} ${(100 + y) / 2 - 10}, ${x} ${y}`} stroke="#c026d3" strokeWidth="4" />;
      })}
      {[40, 60, 80].map((r) => (
        <path key={r} d={`M${100 - r} ${100 - r * 0.4} Q 100 ${100 - r * 1.25}, ${100 + r} ${100 - r * 0.4}`} stroke="#e879f9" strokeWidth="2.5" />
      ))}
    </g>
  ),
  nudibranch: (
    <g>
      <path d="M20 96 C 30 70, 160 66, 182 92 C 186 100, 176 106, 160 106 L 34 108 C 24 108, 18 102, 20 96 Z" fill="#7c3aed" />
      <path d="M24 100 C 60 98, 140 98, 178 98" stroke="#facc15" strokeWidth="4" />
      {[50, 80, 110].map((x) => <circle key={x} cx={x} cy="86" r="6" fill="#facc15" />)}
      <path d="M150 74 C 150 60, 160 52, 170 52 M150 74 C 160 66, 176 66, 184 70 M150 74 C 158 60, 170 58, 176 60" stroke="#f97316" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M36 76 L 30 50 M44 76 L 46 50" stroke="#f97316" strokeWidth="5" strokeLinecap="round" />
    </g>
  ),
  seahorse: (
    <g fill="none" strokeLinecap="round">
      <path d="M110 26 C 90 20, 74 30, 78 44 L 52 46 L 76 52 C 82 60, 96 60, 104 66 C 120 80, 120 96, 104 108 C 92 118, 92 132, 108 134 C 120 136, 124 124, 116 120" stroke="#f59e0b" strokeWidth="14" />
      <path d="M104 30 L 112 14 M114 34 L 124 22" stroke="#f59e0b" strokeWidth="5" />
      <path d="M118 60 C 132 66, 136 76, 130 84" stroke="#fbbf24" strokeWidth="6" />
      <circle cx="92" cy="36" r="4" fill="#0f172a" />
    </g>
  ),
  lobster: (
    <g>
      <path d="M60 70 C 80 56, 140 56, 160 70 C 140 84, 80 84, 60 70 Z" fill="#dc2626" />
      {[90, 110, 130].map((x) => <path key={x} d={`M${x} 58 v 24`} stroke="#991b1b" strokeWidth="3" />)}
      <path d="M160 70 L 190 54 L 196 70 L 190 86 Z" fill="#b91c1c" />
      <path d="M60 64 C 40 50, 30 40, 20 40 M60 76 C 40 90, 30 100, 20 100" stroke="#dc2626" strokeWidth="6" fill="none" />
      <ellipse cx="18" cy="38" rx="14" ry="8" fill="#dc2626" />
      <ellipse cx="18" cy="102" rx="14" ry="8" fill="#dc2626" />
      <path d="M62 66 C 30 20, 10 10, 2 8 M62 74 C 30 120, 10 130, 2 132" stroke="#fca5a5" strokeWidth="2" fill="none" />
      {EYE(66, 64, 3)}
    </g>
  ),
  shrimp: (
    <g>
      <path d="M50 90 C 50 50, 110 40, 150 60 C 170 70, 170 90, 156 100 L 176 120 L 150 112 C 120 110, 70 120, 50 90 Z" fill="#fdf2f8" stroke="#f43f5e" strokeWidth="3" />
      {[80, 100, 120, 140].map((x) => (
        <path key={x} d={`M${x} 52 C ${x - 6} 70, ${x - 6} 90, ${x} 108`} stroke="#f43f5e" strokeWidth="5" fill="none" />
      ))}
      <path d="M52 76 C 30 40, 10 30, 4 26 M54 80 C 30 60, 10 60, 4 62" stroke="#f43f5e" strokeWidth="2" fill="none" />
      {EYE(62, 74, 4)}
    </g>
  ),
  crab: (
    <g>
      <ellipse cx="100" cy="82" rx="54" ry="34" fill="#ea580c" />
      {[-1, 1].map((s) => (
        <g key={s}>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${100 + s * 46} ${86 + i * 8} l ${s * 30} ${10 + i * 6} l ${s * 10} ${16}`} stroke="#c2410c" strokeWidth="5" fill="none" strokeLinecap="round" />
          ))}
          <path d={`M${100 + s * 40} 62 C ${100 + s * 60} 40, ${100 + s * 70} 36, ${100 + s * 76} 34`} stroke="#c2410c" strokeWidth="7" fill="none" strokeLinecap="round" />
          <ellipse cx={100 + s * 80} cy="28" rx="14" ry="10" fill="#ea580c" />
        </g>
      ))}
      {EYE(88, 54, 5)}
      {EYE(112, 54, 5)}
    </g>
  ),
  wreck: (
    <g>
      <path d="M10 130 C 60 118, 140 118, 196 130 V 140 H 10 Z" fill="#a16207" opacity="0.6" />
      <path d="M24 112 L 40 70 L 168 76 L 182 116 C 140 124, 70 124, 24 112 Z" fill="#475569" transform="rotate(-6 100 100)" />
      <rect x="80" y="44" width="40" height="30" fill="#334155" transform="rotate(-6 100 100)" />
      <path d="M96 44 V 10" stroke="#334155" strokeWidth="6" transform="rotate(-6 100 100)" />
      {[50, 70, 130, 150].map((x) => <circle key={x} cx={x} cy="94" r="5" fill="#0f172a" transform="rotate(-6 100 100)" />)}
      <path d="M40 96 C 46 80, 52 70, 50 56" stroke="#2dd4bf" strokeWidth="3" fill="none" />
      <path d="M160 92 C 166 76, 160 66, 164 54" stroke="#fb7185" strokeWidth="3" fill="none" />
    </g>
  ),
  kelp: (
    <g fill="none" strokeLinecap="round">
      {[30, 70, 110, 150, 180].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 140 C ${x - 14} 100, ${x + 14} 60, ${x - 4} ${10 + i * 6}`} stroke="#65a30d" strokeWidth="5" />
          {[110, 80, 50].map((y) => (
            <ellipse key={y} cx={x + 8} cy={y} rx="10" ry="4" fill="#84cc16" stroke="none" transform={`rotate(-30 ${x + 8} ${y})`} />
          ))}
        </g>
      ))}
    </g>
  ),
  cave: (
    <g>
      <path d="M0 0 H 200 V 140 H 0 Z" fill="#020617" opacity="0.4" />
      <path d="M0 140 V 60 C 20 20, 60 10, 100 18 C 150 26, 190 40, 200 70 V 140 H 150 C 140 100, 120 80, 100 80 C 80 80, 60 100, 50 140 Z" fill="#1e293b" />
      <path d="M100 82 L 82 140 H 118 Z" fill="#38bdf8" opacity="0.25" />
      <circle cx="100" cy="100" r="3" fill="#fef9c3" />
    </g>
  ),
  seagrass: (
    <g fill="none" strokeLinecap="round">
      {Array.from({ length: 22 }, (_, i) => {
        const x = 8 + i * 9;
        return <path key={i} d={`M${x} 140 C ${x + (i % 2 ? 10 : -10)} 110, ${x} 80, ${x + (i % 3) * 6} ${50 + (i % 4) * 10}`} stroke={i % 2 ? '#16a34a' : '#4ade80'} strokeWidth="4" />;
      })}
    </g>
  ),
};

export function MarineArt({ art, palette, className, label }: { art: MarineArtKey; palette: [string, string]; className?: string; label?: string }) {
  const id = `mbg-${useId().replace(/:/g, '')}`;
  return (
    <svg viewBox="0 0 200 140" className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={palette[0]} />
          <stop offset="1" stopColor={palette[1]} />
        </linearGradient>
      </defs>
      <rect width="200" height="140" fill={`url(#${id})`} />
      <circle cx="170" cy="20" r="3" fill="#fff" opacity="0.4" />
      <circle cx="180" cy="34" r="2" fill="#fff" opacity="0.4" />
      {ART[art]}
    </svg>
  );
}
