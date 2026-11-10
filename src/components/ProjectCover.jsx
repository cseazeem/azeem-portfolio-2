import { useMemo } from 'react';

/**
 * Project cover. Uses the project's own image when `cover.image` is set;
 * otherwise draws an abstract, code-generated motif for the kind of system
 * (never a fake screenshot).
 */

function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Graph({ rnd }) {
  const { nodes, sizes } = useMemo(() => {
    const n = 11;
    const pts = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + rnd() * 0.35;
      const r = 90 + rnd() * 70;
      return [320 + Math.cos(a) * r * 1.45, 205 + Math.sin(a) * r * 0.82];
    });
    return { nodes: pts, sizes: pts.map(() => 3 + rnd() * 4) };
  }, [rnd]);
  return (
    <g>
      {nodes.map(([x, y], i) => {
        const [nx, ny] = nodes[(i + 1) % nodes.length];
        return (
          <g key={i}>
            <line className="cv-line" x1={x} y1={y} x2={nx} y2={ny} />
            {i % 2 === 0 && <line className="cv-line cv-faint" x1={x} y1={y} x2={320} y2={205} />}
          </g>
        );
      })}
      {nodes.map(([x, y], i) => (
        <circle key={i} className="cv-dot" cx={x} cy={y} r={sizes[i]} />
      ))}
      <circle className="cv-acc cv-pulse" cx="320" cy="205" r="40" />
      <circle className="cv-acc" cx="320" cy="205" r="22" />
      <circle className="cv-accf" cx="320" cy="205" r="8" />
    </g>
  );
}

function Services() {
  const cols = [150, 275, 400];
  return (
    <g>
      <rect className="cv-line" x="250" y="62" width="140" height="36" rx="8" />
      <line className="cv-line" x1="285" y1="80" x2="355" y2="80" />
      {cols.map((x, i) => (
        <g key={x}>
          <path className="cv-line cv-faint" d={`M320 98 V128 H${x + 45} V160`} />
          <rect className={i === 1 ? 'cv-acc' : 'cv-line'} x={x} y="160" width="90" height="52" rx="8" />
          <line className="cv-line" x1={x + 16} y1="180" x2={x + 60} y2="180" />
          <line className="cv-line cv-faint" x1={x + 16} y1="194" x2={x + 44} y2="194" />
          <line className="cv-line cv-faint" x1={x + 45} y1="212" x2={x + 45} y2="250" strokeDasharray="4 5" />
          <rect className="cv-line" x={x + 10} y="250" width="70" height="44" rx="22" />
          <circle className={i === 1 ? 'cv-accf' : 'cv-dot'} cx={x + 45} cy="272" r="5" />
        </g>
      ))}
      <line className="cv-acc" x1="150" y1="320" x2="490" y2="320" strokeDasharray="2 8" />
    </g>
  );
}

function Waves() {
  const ox = 150;
  const oy = 215;
  const arc = (r) => {
    const a = (60 * Math.PI) / 180;
    return `M${ox + r * Math.cos(-a)} ${oy + r * Math.sin(-a)} A${r} ${r} 0 0 1 ${ox + r * Math.cos(a)} ${oy + r * Math.sin(a)}`;
  };
  return (
    <g>
      {[50, 95, 140, 185, 230, 275].map((r, i) => (
        <path key={r} className={i === 2 ? 'cv-acc' : `cv-line${i > 3 ? ' cv-faint' : ''}`} d={arc(r)} />
      ))}
      <circle className="cv-accf" cx={ox} cy={oy} r="9" />
      {[
        [ox + 95 * Math.cos(-0.5), oy + 95 * Math.sin(-0.5)],
        [ox + 140 * Math.cos(0.3), oy + 140 * Math.sin(0.3)],
        [ox + 185 * Math.cos(-0.2), oy + 185 * Math.sin(-0.2)],
        [ox + 230 * Math.cos(0.65), oy + 230 * Math.sin(0.65)],
      ].map(([x, y], i) => (
        <circle key={i} className="cv-dot" cx={x} cy={y} r="5" />
      ))}
      {[
        [510, 120],
        [540, 225],
        [500, 320],
      ].map(([x, y]) => (
        <g key={x + y}>
          <rect className="cv-line" x={x - 26} y={y - 18} width="52" height="36" rx="10" />
          <line className="cv-line cv-faint" x1={x - 12} y1={y} x2={x + 12} y2={y} />
        </g>
      ))}
    </g>
  );
}

function Window() {
  return (
    <g>
      <rect className="cv-line" x="110" y="64" width="420" height="270" rx="12" />
      <line className="cv-line" x1="110" y1="96" x2="530" y2="96" />
      {[132, 148, 164].map((x) => (
        <circle key={x} className="cv-dot" cx={x} cy="80" r="4" />
      ))}
      <line className="cv-line cv-faint" x1="220" y1="96" x2="220" y2="334" />
      {[124, 156, 188, 220].map((y, i) => (
        <g key={y}>
          <circle className={i === 1 ? 'cv-accf' : 'cv-dot'} cx="136" cy={y} r="6" />
          <line className="cv-line" x1="152" y1={y} x2="200" y2={y} />
        </g>
      ))}
      {[128, 170, 212].map((y, i) => (
        <g key={y}>
          <rect className={i === 2 ? 'cv-acc' : 'cv-line'} x={i === 2 ? 330 : 244} y={y} width={i === 2 ? 176 : 190} height="30" rx="14" />
        </g>
      ))}
      <rect className="cv-line" x="244" y="290" width="262" height="28" rx="14" />
      <path className="cv-acc" d="M484 304 l8 -6 m-8 6 l8 6" />
    </g>
  );
}

function Phone() {
  return (
    <g>
      <rect className="cv-line" x="240" y="44" width="160" height="312" rx="26" />
      <rect className="cv-line cv-faint" x="292" y="56" width="56" height="10" rx="5" />
      {[100, 150, 200, 250].map((y, i) => (
        <g key={y}>
          <circle className="cv-dot" cx="268" cy={y} r="11" />
          <line className="cv-line" x1="288" y1={y - 5} x2={i % 2 ? 360 : 376} y2={y - 5} />
          <line className="cv-line cv-faint" x1="288" y1={y + 7} x2="340" y2={y + 7} />
        </g>
      ))}
      <rect className="cv-line" x="256" y="300" width="128" height="34" rx="17" />
      <circle className="cv-accf" cx="400" cy="52" r="10" />
      <circle className="cv-acc cv-pulse" cx="400" cy="52" r="22" />
      <path className="cv-line cv-faint" d="M120 300 q40 -50 80 -10" />
      <path className="cv-line cv-faint" d="M520 110 q-40 50 -80 10" />
    </g>
  );
}

function Ledger({ rnd }) {
  const bars = useMemo(() => [0, 1, 2, 3, 4].map(() => 60 + rnd() * 120), [rnd]);
  const pts = [
    [110, 300],
    [180, 270],
    [250, 282],
    [320, 220],
    [390, 232],
    [460, 160],
    [530, 112],
  ];
  return (
    <g>
      {[100, 150, 200, 250, 300].map((y, i) => (
        <g key={y}>
          <line className="cv-line cv-faint" x1="100" y1={y} x2="540" y2={y} />
          <rect className="cv-line" x="100" y={y - 30} width={bars[i]} height="14" rx="7" />
        </g>
      ))}
      <polyline className="cv-acc cv-thick" points={pts.map((p) => p.join(',')).join(' ')} />
      {pts.map(([x, y], i) => (
        <circle key={x} className={i === pts.length - 1 ? 'cv-accf' : 'cv-dot'} cx={x} cy={y} r={i === pts.length - 1 ? 7 : 4} />
      ))}
      <line className="cv-line" x1="100" y1="330" x2="540" y2="330" strokeDasharray="3 6" />
    </g>
  );
}

function Shield() {
  return (
    <g>
      {[150, 190, 230].map((r, i) => (
        <circle key={r} className={`cv-line${i ? ' cv-faint' : ''}`} cx="320" cy="200" r={r} strokeDasharray={i === 2 ? '3 8' : undefined} />
      ))}
      <path className="cv-line" d="M320 66 L412 100 V196 C412 262 368 306 320 330 C272 306 228 262 228 196 V100 Z" />
      <path className="cv-acc cv-thick" d="M284 200 l26 26 l50 -56" />
      {[
        [150, 110],
        [500, 150],
        [470, 300],
      ].map(([x, y]) => (
        <g key={x}>
          <circle className="cv-accf" cx={x} cy={y} r="5" />
          <circle className="cv-acc cv-pulse" cx={x} cy={y} r="14" />
        </g>
      ))}
    </g>
  );
}

function Docs() {
  return (
    <g>
      <rect className="cv-line cv-faint" x="270" y="52" width="190" height="250" rx="8" />
      <rect className="cv-line" x="240" y="72" width="190" height="250" rx="8" />
      <rect className="cv-line" x="208" y="94" width="190" height="250" rx="8" />
      {[130, 152, 174, 196, 218, 240].map((y, i) => (
        <line key={y} className={`cv-line${i % 3 === 2 ? ' cv-faint' : ''}`} x1="232" y1={y} x2={i % 2 ? 340 : 372} y2={y} />
      ))}
      <path className="cv-acc cv-thick" d="M234 300 c12 -24 22 -24 26 -4 s14 10 22 -12 s12 8 24 -2 s18 -6 30 4" />
      <circle className="cv-acc" cx="370" cy="296" r="18" />
      <circle className="cv-accf" cx="370" cy="296" r="5" />
    </g>
  );
}

const MOTIFS = {
  graph: Graph,
  services: Services,
  waves: Waves,
  window: Window,
  phone: Phone,
  ledger: Ledger,
  shield: Shield,
  docs: Docs,
};

export function ProjectCover({ project, number, eager = false }) {
  const cover = project.cover || {};
  const rnd = useMemo(() => seeded(project.id), [project.id]);

  if (cover.image) {
    return (
      <div className="cover cover--image">
        <img
          src={cover.image}
          alt={cover.alt || `${project.title} — cover image`}
          width={cover.width}
          height={cover.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
    );
  }

  const Motif = MOTIFS[cover.motif] || Graph;
  return (
    <div className="cover" aria-hidden="true">
      <div className="cover__grid" />
      <svg className="cover__art" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet" focusable="false">
        <Motif rnd={rnd} />
      </svg>
      <span className="cover__label">{project.category}</span>
      {number && <span className="cover__num">{number}</span>}
    </div>
  );
}
