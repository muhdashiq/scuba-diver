import { DiagramFrame } from './DiagramParts';

export type HandSignal = 'ok' | 'out-of-air' | 'up' | 'problem' | 'down' | 'stop';

const GLOVE = '#1e293b';

function Palm({ x, y, w = 70, h = 70 }: { x: number; y: number; w?: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx="22" fill={GLOVE} />;
}

function Finger({ x, y, h, w = 16, rotate = 0, cx, cy }: { x: number; y: number; h: number; w?: number; rotate?: number; cx?: number; cy?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={w / 2} fill={GLOVE} transform={rotate ? `rotate(${rotate} ${cx ?? x + w / 2} ${cy ?? y + h})` : undefined} />;
}

/** Original stylised hand-signal illustrations (gloved hand). */
export function HandSignalArt({ signal, className, caption }: { signal: HandSignal; className?: string; caption?: string }) {
  const labels: Record<HandSignal, string> = {
    ok: 'OK / Are you OK?',
    'out-of-air': 'Out of air',
    up: 'Up / End the dive',
    problem: 'Something is wrong',
    down: 'Go down',
    stop: 'Stop / Hold',
  };
  return (
    <DiagramFrame viewBox="0 0 300 240" className={className} title={`Hand signal: ${labels[signal]}`}>
      <g transform="translate(0 0)">
        {signal === 'ok' && (
          <g>
            <Palm x={110} y={120} />
            <Finger x={120} y={50} h={80} />
            <Finger x={140} y={44} h={86} />
            <Finger x={160} y={52} h={78} />
            {/* index + thumb ring */}
            <circle cx="186" cy="112" r="22" fill="none" stroke={GLOVE} strokeWidth="16" />
            <rect x="120" y="180" width="50" height="50" fill={GLOVE} />
          </g>
        )}
        {signal === 'up' && (
          <g>
            <rect x="110" y="110" width="80" height="70" rx="22" fill={GLOVE} />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x="102" y={116 + i * 16} width="30" height="16" rx="8" fill="#334155" />
            ))}
            <Finger x={150} y={40} h={86} w={20} />
            <rect x="130" y="176" width="50" height="54" fill={GLOVE} />
            <path d="M240 150 V 50 M 222 70 L 240 48 L 258 70" stroke="#facc15" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {signal === 'down' && (
          <g>
            <rect x="110" y="60" width="80" height="70" rx="22" fill={GLOVE} />
            <Finger x={150} y={114} h={86} w={20} />
            <rect x="130" y="10" width="50" height="54" fill={GLOVE} />
            <path d="M240 60 V 170 M 222 150 L 240 172 L 258 150" stroke="#facc15" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {signal === 'out-of-air' && (
          <g>
            {/* diver head */}
            <circle cx="110" cy="96" r="52" fill="#0f172a" />
            <path d="M68 82 h56 a10 10 0 0 1 10 10 v8 a10 10 0 0 1 -10 10 h-56 z" fill="#67e8f9" stroke="#020617" strokeWidth="4" />
            <rect x="96" y="150" width="30" height="70" fill="#0f172a" />
            {/* flat hand across throat */}
            <rect x="120" y="150" width="120" height="26" rx="13" fill={GLOVE} stroke="#64748b" strokeWidth="2" />
            <rect x="226" y="146" width="40" height="34" rx="12" fill={GLOVE} />
            <path d="M260 196 H 140 M 158 182 L 138 196 L 158 210" stroke="#facc15" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {signal === 'problem' && (
          <g>
            <g transform="rotate(-12 150 140)">
              <rect x="100" y="110" width="100" height="44" rx="20" fill={GLOVE} />
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={196} y={112 + i * 11} width="54" height="10" rx="5" fill={GLOVE} />
              ))}
              <rect x="120" y="94" width="40" height="18" rx="9" fill={GLOVE} />
            </g>
            <path d="M120 70 C 140 52, 170 52, 190 70 M 112 58 L 118 74 L 102 76 M 198 58 L 192 74 L 208 76" stroke="#facc15" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M120 210 C 140 228, 170 228, 190 210" stroke="#facc15" strokeWidth="6" fill="none" strokeLinecap="round" />
          </g>
        )}
        {signal === 'stop' && (
          <g>
            <Palm x={110} y={100} w={80} h={80} />
            {[0, 1, 2, 3].map((i) => (
              <Finger key={i} x={114 + i * 19} y={36} h={80} />
            ))}
            <Finger x={84} y={110} h={50} rotate={-40} cx={110} cy={150} />
            <rect x="125" y="176" width="50" height="54" fill={GLOVE} />
          </g>
        )}
      </g>
      {caption && (
        <text x="150" y="232" textAnchor="middle" fontSize="15" fontWeight="700" fill="#ecfeff">
          {caption}
        </text>
      )}
    </DiagramFrame>
  );
}
