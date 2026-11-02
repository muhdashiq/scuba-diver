import { motion, useReducedMotion } from 'framer-motion';
import { useId, type ReactNode } from 'react';

export interface DiagramProps {
  highlight?: string;
  showLabels?: boolean;
  className?: string;
  title?: string;
}

interface MarkerProps {
  id: string;
  n: number;
  x: number;
  y: number;
  label: string;
  highlight?: string;
  showLabels?: boolean;
  labelX?: number;
  labelY?: number;
  anchor?: 'start' | 'end' | 'middle';
}

/** Numbered callout used for annotated diagrams. */
export function Marker({ id, n, x, y, label, highlight, showLabels, labelX, labelY, anchor = 'start' }: MarkerProps) {
  const reduce = useReducedMotion();
  const active = highlight === id;
  const lx = labelX ?? x + 14;
  const ly = labelY ?? y + 4;
  return (
    <g>
      {active && (
        <motion.circle
          cx={x}
          cy={y}
          r={14}
          fill="none"
          stroke="#facc15"
          strokeWidth={3}
          animate={reduce ? undefined : { r: [12, 22, 12], opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      )}
      <circle cx={x} cy={y} r={11} fill={active ? '#facc15' : '#0f172a'} stroke="#fff" strokeWidth={2} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={active ? '#0f172a' : '#fff'}>
        {n}
      </text>
      {showLabels && (
        <text x={lx} y={ly} textAnchor={anchor} fontSize="13" fontWeight="600" fill="#ecfeff" stroke="#04192b" strokeWidth={4} paintOrder="stroke">
          {label}
        </text>
      )}
    </g>
  );
}

export function DiagramFrame({ children, viewBox, className, title }: { children: ReactNode; viewBox: string; className?: string; title?: string }) {
  const bg = useId();
  return (
    <svg viewBox={viewBox} className={className} role="img" aria-label={title}>
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e7490" />
          <stop offset="1" stopColor="#082f49" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" rx="18" fill={`url(#${bg})`} />
      {children}
    </svg>
  );
}
