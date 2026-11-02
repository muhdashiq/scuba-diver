import { DiagramFrame, Marker, type DiagramProps } from './DiagramParts';

export function DiveProfileDiagram({ highlight, showLabels, className, title = 'Dive profile diagram' }: DiagramProps) {
  const m = { highlight, showLabels };
  return (
    <DiagramFrame viewBox="0 0 480 300" className={className} title={title}>
      <line x1="50" y1="40" x2="450" y2="40" stroke="#bae6fd" strokeWidth="2" strokeDasharray="6 6" />
      <text x="456" y="44" fontSize="11" fill="#bae6fd">0 m</text>
      <line x1="50" y1="40" x2="50" y2="270" stroke="#bae6fd" strokeWidth="2" />
      {[0, 6, 12, 18].map((d, i) => (
        <text key={d} x="44" y={44 + i * 70} textAnchor="end" fontSize="11" fill="#bae6fd">{d}</text>
      ))}
      <text x="250" y="292" textAnchor="middle" fontSize="11" fill="#bae6fd">time →</text>
      <path d="M50 40 L 100 250 L 300 250 L 360 110 L 376 110 L 380 110 L 410 110 L 440 40" stroke="#22d3ee" strokeWidth="5" fill="none" strokeLinejoin="round" />
      <rect x="360" y="98" width="50" height="24" rx="6" fill="#facc15" opacity="0.25" />
      <Marker id="descent" n={1} x={64} y={150} label="Descent" labelX={80} labelY={150} {...m} />
      <Marker id="bottom" n={2} x={200} y={250} label="Bottom phase (max depth)" labelX={200} labelY={232} anchor="middle" {...m} />
      <Marker id="ascent" n={3} x={340} y={170} label="Slow ascent" labelX={300} labelY={190} anchor="end" {...m} />
      <Marker id="safety-stop" n={4} x={385} y={84} label="Safety stop ≈ 5 m" labelX={385} labelY={70} anchor="middle" {...m} />
    </DiagramFrame>
  );
}

export function UnsafeAscentDiagram({ highlight, showLabels, className, title = 'Two ascent profiles compared' }: DiagramProps) {
  const m = { highlight, showLabels };
  return (
    <DiagramFrame viewBox="0 0 480 300" className={className} title={title}>
      <line x1="40" y1="40" x2="450" y2="40" stroke="#bae6fd" strokeWidth="2" strokeDasharray="6 6" />
      <text x="40" y="30" fontSize="11" fill="#bae6fd">surface</text>
      {/* profile A */}
      <path d="M40 40 L 70 240 L 190 240 L 196 40" stroke="#f87171" strokeWidth="5" fill="none" strokeLinejoin="round" />
      <text x="120" y="270" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fecaca">Diver A</text>
      {/* profile B */}
      <path d="M250 40 L 280 240 L 380 240 L 420 110 L 440 110 L 450 40" stroke="#4ade80" strokeWidth="5" fill="none" strokeLinejoin="round" />
      <text x="350" y="270" textAnchor="middle" fontSize="14" fontWeight="700" fill="#bbf7d0">Diver B</text>
      <Marker id="fast" n={1} x={210} y={140} label="Near-vertical ascent" labelX={214} labelY={170} {...m} />
      <Marker id="stop" n={2} x={430} y={128} label="Controlled + stop" labelX={460} labelY={150} anchor="end" {...m} />
    </DiagramFrame>
  );
}

export function CompassReciprocalDiagram({ highlight, showLabels, className, title = 'Compass heading and reciprocal' }: DiagramProps) {
  const m = { highlight, showLabels };
  const cx = 240;
  const cy = 150;
  const r = 110;
  const pos = (deg: number, rr = r) => [cx + rr * Math.sin((deg * Math.PI) / 180), cy - rr * Math.cos((deg * Math.PI) / 180)];
  const [hx, hy] = pos(60, 92);
  const [rx, ry] = pos(240, 92);
  return (
    <DiagramFrame viewBox="0 0 480 300" className={className} title={title}>
      <circle cx={cx} cy={cy} r={r + 12} fill="#0f172a" />
      <circle cx={cx} cy={cy} r={r} fill="#082f49" stroke="#67e8f9" strokeWidth="2" />
      {Array.from({ length: 36 }, (_, i) => i * 10).map((d) => {
        const [x1, y1] = pos(d, r - 2);
        const [x2, y2] = pos(d, r - (d % 30 === 0 ? 16 : 8));
        return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#bae6fd" strokeWidth={d % 90 === 0 ? 3 : 1.5} />;
      })}
      {(['N', 'E', 'S', 'W'] as const).map((l, i) => {
        const [x, y] = pos(i * 90, r - 30);
        return (
          <text key={l} x={x} y={y + 6} textAnchor="middle" fontSize="18" fontWeight="800" fill={l === 'N' ? '#f87171' : '#ecfeff'}>
            {l}
          </text>
        );
      })}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={rx} y2={ry} stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" strokeDasharray="10 6" />
      <circle cx={cx} cy={cy} r="7" fill="#ecfeff" />
      <Marker id="heading" n={1} x={hx + 16} y={hy - 12} label="Out: 060°" labelX={hx + 34} labelY={hy - 8} {...m} />
      <Marker id="reciprocal" n={2} x={rx - 16} y={ry + 12} label="Back: 240°" labelX={rx - 34} labelY={ry + 16} anchor="end" {...m} />
    </DiagramFrame>
  );
}

/** Boyle's law: balloon volume at depth. */
export function PressureVolumeDiagram({ className }: { className?: string }) {
  const rows = [
    { depth: '0 m', bar: '1 bar', vol: '1', r: 34 },
    { depth: '10 m', bar: '2 bar', vol: '1/2', r: 24 },
    { depth: '20 m', bar: '3 bar', vol: '1/3', r: 19.6 },
    { depth: '30 m', bar: '4 bar', vol: '1/4', r: 17 },
  ];
  return (
    <DiagramFrame viewBox="0 0 480 300" className={className} title="Pressure and volume at depth (Boyle's law)">
      <rect x="0" y="0" width="480" height="40" rx="18" fill="#38bdf8" opacity="0.25" />
      {rows.map((row, i) => {
        const y = 50 + i * 64;
        return (
          <g key={row.depth}>
            <line x1="20" y1={y} x2="460" y2={y} stroke="#bae6fd" strokeOpacity="0.25" />
            <text x="24" y={y + 34} fontSize="15" fontWeight="700" fill="#ecfeff">{row.depth}</text>
            <text x="100" y={y + 34} fontSize="14" fill="#a5f3fc">{row.bar} absolute</text>
            <ellipse cx="300" cy={y + 30} rx={row.r} ry={row.r * 1.1} fill="#f43f5e" opacity="0.9" />
            <path d={`M300 ${y + 30 + row.r * 1.1} l -4 8 h 8 z`} fill="#be123c" />
            <text x="380" y={y + 34} fontSize="14" fill="#ecfeff">volume {row.vol}</text>
          </g>
        );
      })}
    </DiagramFrame>
  );
}

/** Ear cross-section showing the Eustachian tube and equalisation. */
export function EqualizationDiagram({ className }: { className?: string }) {
  return (
    <DiagramFrame viewBox="0 0 480 300" className={className} title="Ear equalisation diagram">
      <path d="M40 150 C 40 70, 120 40, 160 90 C 180 120, 150 140, 150 170 C 150 220, 110 250, 70 230 C 50 220, 40 190, 40 150 Z" fill="#fcd9b8" opacity="0.9" />
      <rect x="150" y="135" width="100" height="26" rx="10" fill="#fda4af" opacity="0.6" />
      <text x="200" y="128" textAnchor="middle" fontSize="12" fill="#ecfeff">ear canal</text>
      <rect x="248" y="118" width="8" height="60" rx="3" fill="#f472b6" />
      <text x="252" y="110" textAnchor="middle" fontSize="12" fill="#ecfeff">eardrum</text>
      <ellipse cx="300" cy="148" rx="42" ry="34" fill="#0ea5e9" opacity="0.5" stroke="#bae6fd" strokeWidth="2" />
      <text x="300" y="152" textAnchor="middle" fontSize="12" fill="#ecfeff" fontWeight="700">middle ear</text>
      <path d="M320 178 C 340 220, 360 240, 410 254" stroke="#facc15" strokeWidth="10" fill="none" strokeLinecap="round" />
      <text x="420" y="240" fontSize="12" fill="#fde68a" textAnchor="middle">Eustachian</text>
      <text x="420" y="254" fontSize="12" fill="#fde68a" textAnchor="middle">tube → throat</text>
      <path d="M200 60 v 40 M 188 86 L 200 102 L 212 86" stroke="#f87171" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="200" y="52" textAnchor="middle" fontSize="12" fill="#fecaca">water pressure pushes in</text>
      <path d="M380 210 C 360 190, 340 180, 326 170 M 336 164 L 324 168 L 330 180" stroke="#4ade80" strokeWidth="4" fill="none" strokeLinecap="round" />
      <text x="410" y="190" textAnchor="middle" fontSize="12" fill="#bbf7d0">air in to balance</text>
    </DiagramFrame>
  );
}

/** Buoyancy states: negative, neutral, positive. */
export function BuoyancyDiagram({ className }: { className?: string }) {
  const states = [
    { x: 80, label: 'Negative', sub: 'sinks', dy: 70, color: '#f87171' },
    { x: 240, label: 'Neutral', sub: 'hovers', dy: 0, color: '#4ade80' },
    { x: 400, label: 'Positive', sub: 'floats up', dy: -70, color: '#38bdf8' },
  ];
  return (
    <DiagramFrame viewBox="0 0 480 300" className={className} title="Negative, neutral and positive buoyancy">
      {states.map((s) => (
        <g key={s.label}>
          <circle cx={s.x} cy={150 + s.dy} r="26" fill="#0f172a" stroke={s.color} strokeWidth="4" />
          <circle cx={s.x - 8} cy={142 + s.dy} r="5" fill="#67e8f9" />
          <circle cx={s.x + 8} cy={142 + s.dy} r="5" fill="#67e8f9" />
          <path d={`M${s.x} ${150 + s.dy + (s.dy > 0 ? 36 : s.dy < 0 ? -36 : 0)} v ${s.dy > 0 ? 30 : s.dy < 0 ? -30 : 0}`} stroke={s.color} strokeWidth="5" strokeLinecap="round" />
          <text x={s.x} y="276" textAnchor="middle" fontSize="16" fontWeight="800" fill="#ecfeff">{s.label}</text>
          <text x={s.x} y="294" textAnchor="middle" fontSize="12" fill="#a5f3fc">{s.sub}</text>
        </g>
      ))}
    </DiagramFrame>
  );
}
