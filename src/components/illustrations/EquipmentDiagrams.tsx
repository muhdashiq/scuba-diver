import { DiagramFrame, Marker, type DiagramProps } from './DiagramParts';

export function RegulatorDiagram({ highlight, showLabels, className, title = 'Scuba regulator set' }: DiagramProps) {
  const m = { highlight, showLabels };
  return (
    <DiagramFrame viewBox="0 0 480 300" className={className} title={title}>
      {/* cylinder */}
      <rect x="40" y="110" width="70" height="170" rx="30" fill="#facc15" />
      <rect x="40" y="150" width="70" height="10" fill="#0f172a" opacity="0.4" />
      <rect x="62" y="84" width="26" height="32" rx="4" fill="#cbd5e1" />
      <rect x="54" y="78" width="42" height="10" rx="4" fill="#475569" />
      {/* first stage */}
      <rect x="90" y="70" width="58" height="40" rx="10" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
      <circle cx="119" cy="90" r="9" fill="#64748b" />
      {/* hoses */}
      <path d="M148 80 C 220 40, 280 40, 330 70" stroke="#0f172a" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M148 98 C 230 120, 280 130, 340 160" stroke="#eab308" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M130 110 C 140 180, 200 220, 250 236" stroke="#0f172a" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M110 76 C 110 40, 170 20, 210 30" stroke="#1e3a8a" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* primary second stage */}
      <g transform="translate(330 52)">
        <rect width="58" height="44" rx="16" fill="#1e293b" />
        <circle cx="29" cy="22" r="12" fill="#334155" />
        <rect x="56" y="16" width="18" height="12" rx="4" fill="#0f172a" />
      </g>
      {/* octopus */}
      <g transform="translate(338 142)">
        <rect width="58" height="44" rx="16" fill="#eab308" />
        <circle cx="29" cy="22" r="12" fill="#ca8a04" />
        <rect x="56" y="16" width="18" height="12" rx="4" fill="#a16207" />
      </g>
      {/* SPG */}
      <g transform="translate(250 212)">
        <rect x="-6" y="-6" width="76" height="62" rx="16" fill="#0f172a" />
        <circle cx="32" cy="25" r="24" fill="#f8fafc" />
        <path d="M14 34 A 20 20 0 0 1 20 10" stroke="#ef4444" strokeWidth="5" fill="none" />
        <line x1="32" y1="25" x2="46" y2="12" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* LPI end */}
      <rect x="206" y="24" width="24" height="14" rx="4" fill="#1e3a8a" />
      <Marker id="valve" n={1} x={75} y={70} label="Cylinder valve" labelX={20} labelY={58} anchor="start" {...m} />
      <Marker id="first-stage" n={2} x={128} y={66} label="First stage" labelX={150} labelY={124} {...m} />
      <Marker id="second-stage" n={3} x={392} y={52} label="Primary 2nd stage" labelX={466} labelY={118} anchor="end" {...m} />
      <Marker id="octopus" n={4} x={404} y={142} label="Alternate air (octopus)" labelX={472} labelY={206} anchor="end" {...m} />
      <Marker id="spg" n={5} x={330} y={222} label="Pressure gauge (SPG)" labelX={330} labelY={290} anchor="middle" {...m} />
      <Marker id="lpi" n={6} x={238} y={22} label="Low-pressure inflator hose" labelX={258} labelY={26} {...m} />
    </DiagramFrame>
  );
}

export function BcdDiagram({ highlight, showLabels, className, title = 'Buoyancy control device (BCD)' }: DiagramProps) {
  const m = { highlight, showLabels };
  return (
    <DiagramFrame viewBox="0 0 480 300" className={className} title={title}>
      {/* jacket */}
      <path d="M170 40 C 200 30, 280 30, 310 40 L 340 90 L 330 260 C 300 276, 180 276, 150 260 L 140 90 Z" fill="#0e7490" stroke="#164e63" strokeWidth="4" />
      <path d="M200 40 L 240 120 L 280 40" fill="#082f49" />
      <rect x="236" y="120" width="8" height="140" fill="#082f49" opacity="0.5" />
      {/* chest strap */}
      <rect x="190" y="112" width="100" height="8" rx="3" fill="#0f172a" />
      {/* weight pockets */}
      <rect x="160" y="200" width="56" height="44" rx="10" fill="#155e75" stroke="#0f172a" strokeWidth="3" />
      <rect x="264" y="200" width="56" height="44" rx="10" fill="#155e75" stroke="#0f172a" strokeWidth="3" />
      <path d="M170 212 h36 M274 212 h36" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
      {/* shoulder dump */}
      <circle cx="318" cy="70" r="10" fill="#ef4444" />
      <path d="M318 80 v24" stroke="#ef4444" strokeWidth="3" />
      {/* lower dump */}
      <circle cx="160" cy="254" r="9" fill="#ef4444" />
      <path d="M160 263 v14" stroke="#ef4444" strokeWidth="3" />
      {/* corrugated hose & inflator */}
      <path d="M166 54 C 120 70, 110 130, 112 170" stroke="#1e293b" strokeWidth="14" fill="none" strokeLinecap="round" strokeDasharray="2 4" />
      <path d="M166 54 C 120 70, 110 130, 112 170" stroke="#334155" strokeWidth="8" fill="none" strokeLinecap="round" />
      <g transform="translate(92 168)">
        <rect width="40" height="58" rx="10" fill="#0f172a" />
        <rect x="8" y="10" width="24" height="14" rx="5" fill="#22c55e" />
        <rect x="8" y="32" width="24" height="14" rx="5" fill="#f97316" />
      </g>
      {/* tank band (behind) */}
      <rect x="128" y="150" width="14" height="40" rx="4" fill="#475569" />
      <Marker id="inflator" n={1} x={70} y={186} label="Power inflator" labelX={14} labelY={246} {...m} />
      <Marker id="shoulder-dump" n={2} x={350} y={66} label="Shoulder dump" labelX={364} labelY={70} {...m} />
      <Marker id="lower-dump" n={3} x={130} y={276} label="Lower dump" labelX={14} labelY={296} {...m} />
      <Marker id="weight-pocket" n={4} x={350} y={222} label="Weight pocket" labelX={364} labelY={226} {...m} />
      <Marker id="chest-strap" n={5} x={240} y={98} label="Chest strap" labelX={256} labelY={102} {...m} />
      <Marker id="tank-band" n={6} x={135} y={140} label="Cylinder band" labelX={14} labelY={124} {...m} />
    </DiagramFrame>
  );
}

export function SpgDiagram({ highlight, showLabels, className, value = 120, title = 'Submersible pressure gauge' }: DiagramProps & { value?: number }) {
  const m = { highlight, showLabels };
  // 0–300 bar mapped onto a 270° sweep starting at 135°.
  const angle = (v: number) => ((135 + (v / 300) * 270) * Math.PI) / 180;
  const cx = 240;
  const cy = 150;
  const r = 100;
  const pt = (v: number, rr: number) => [cx + rr * Math.cos(angle(v)), cy + rr * Math.sin(angle(v))];
  const [nx, ny] = pt(value, 82);
  const arc = (from: number, to: number, rr: number) => {
    const [x1, y1] = pt(from, rr);
    const [x2, y2] = pt(to, rr);
    const large = ((to - from) / 300) * 270 > 180 ? 1 : 0;
    return `M${x1} ${y1} A ${rr} ${rr} 0 ${large} 1 ${x2} ${y2}`;
  };
  return (
    <DiagramFrame viewBox="0 0 480 300" className={className} title={title}>
      <circle cx={cx} cy={cy} r={124} fill="#0f172a" />
      <circle cx={cx} cy={cy} r={112} fill="#f8fafc" />
      <path d={arc(0, 50, r - 6)} stroke="#ef4444" strokeWidth="12" fill="none" />
      <path d={arc(50, 300, r - 6)} stroke="#22c55e" strokeWidth="6" fill="none" opacity="0.6" />
      {Array.from({ length: 13 }, (_, i) => i * 25).map((v) => {
        const [x1, y1] = pt(v, r - 14);
        const [x2, y2] = pt(v, r - 26);
        const [tx, ty] = pt(v, r - 40);
        return (
          <g key={v}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0f172a" strokeWidth={v % 50 === 0 ? 3 : 1.5} />
            {v % 50 === 0 && (
              <text x={tx} y={ty + 4} fontSize="13" textAnchor="middle" fill="#0f172a" fontWeight="600">
                {v}
              </text>
            )}
          </g>
        );
      })}
      <text x={cx} y={cy + 52} textAnchor="middle" fontSize="14" fill="#334155" fontWeight="700">
        BAR
      </text>
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="9" fill="#0f172a" />
      <path d="M240 274 v 22" stroke="#0f172a" strokeWidth="14" />
      <Marker id="needle" n={1} x={nx + 18} y={ny - 6} label={`Needle — about ${value} bar`} labelX={nx + 34} labelY={ny - 2} {...m} />
      <Marker id="reserve-zone" n={2} x={pt(25, r + 16)[0]} y={pt(25, r + 16)[1]} label="Red reserve zone" labelX={pt(25, r + 16)[0] - 10} labelY={pt(25, r + 16)[1] + 28} anchor="middle" {...m} />
    </DiagramFrame>
  );
}

export function DiveComputerDiagram({ highlight, showLabels, className, title = 'Dive computer display' }: DiagramProps) {
  const m = { highlight, showLabels };
  return (
    <DiagramFrame viewBox="0 0 480 300" className={className} title={title}>
      <rect x="70" y="120" width="40" height="60" rx="8" fill="#0f172a" />
      <rect x="370" y="120" width="40" height="60" rx="8" fill="#0f172a" />
      <rect x="100" y="40" width="280" height="220" rx="44" fill="#1e293b" stroke="#475569" strokeWidth="6" />
      <rect x="126" y="66" width="228" height="168" rx="22" fill="#0b1220" />
      {/* depth */}
      <text x="140" y="92" fontSize="12" fill="#67e8f9" fontWeight="700">DEPTH m</text>
      <text x="140" y="140" fontSize="46" fill="#ecfeff" fontWeight="800" fontFamily="ui-monospace, monospace">17.4</text>
      {/* time */}
      <text x="270" y="92" fontSize="12" fill="#67e8f9" fontWeight="700">DIVE min</text>
      <text x="270" y="134" fontSize="36" fill="#ecfeff" fontWeight="800" fontFamily="ui-monospace, monospace">24</text>
      {/* NDL */}
      <text x="140" y="172" fontSize="12" fill="#86efac" fontWeight="700">NDL min</text>
      <text x="140" y="210" fontSize="32" fill="#86efac" fontWeight="800" fontFamily="ui-monospace, monospace">19</text>
      {/* temp */}
      <text x="270" y="172" fontSize="12" fill="#67e8f9" fontWeight="700">TEMP °C</text>
      <text x="270" y="206" fontSize="26" fill="#ecfeff" fontWeight="800" fontFamily="ui-monospace, monospace">26</text>
      {/* ascent rate bars */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={336} y={196 - i * 24} width="10" height="18" rx="2" fill={i < 2 ? '#22c55e' : '#334155'} />
      ))}
      <Marker id="depth" n={1} x={126} y={120} label="Current depth" labelX={14} labelY={30} {...m} />
      <Marker id="time" n={2} x={354} y={100} label="Dive time" labelX={392} labelY={78} {...m} />
      <Marker id="ndl" n={3} x={126} y={196} label="No-deco time left" labelX={14} labelY={284} {...m} />
      <Marker id="temp" n={4} x={320} y={232} label="Water temp" labelX={300} labelY={288} anchor="middle" {...m} />
      <Marker id="ascent-rate" n={5} x={366} y={148} label="Ascent rate" labelX={474} labelY={240} anchor="end" {...m} />
    </DiagramFrame>
  );
}
