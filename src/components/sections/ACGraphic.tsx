/** Ilustração técnica do circuito de climatização (usada no card sem foto). */
export function ACGraphic({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 180" className={className} aria-hidden="true" fill="none">
      <g stroke="var(--line-strong)" strokeWidth="1">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1={20 + i * 35} y1="10" x2={20 + i * 35} y2="170" strokeDasharray="2 6" />
        ))}
      </g>
      {/* condensador */}
      <rect x="22" y="40" width="70" height="100" rx="3" stroke="var(--muted)" strokeWidth="1.5" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1="30" x2="84" y1={50 + i * 10} y2={50 + i * 10} stroke="var(--muted)" strokeWidth="1" />
      ))}
      {/* compressor */}
      <circle cx="160" cy="132" r="22" stroke="var(--muted)" strokeWidth="1.5" />
      <circle cx="160" cy="132" r="8" stroke="var(--accent)" strokeWidth="2" />
      {/* evaporador */}
      <rect x="232" y="40" width="66" height="56" rx="3" stroke="var(--muted)" strokeWidth="1.5" />
      <path d="M240 52h50M240 62h50M240 72h50M240 82h50" stroke="var(--muted)" />
      {/* linhas de alta e baixa */}
      <path className="ac-flow" d="M92 70 H200 V68 H232" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 6" />
      <path className="ac-flow" d="M265 96 V132 H182" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 6" />
      <path className="ac-flow" d="M138 132 H57 V140" stroke="var(--muted)" strokeWidth="2" strokeDasharray="6 6" />
      {/* saída de ar frio */}
      <path d="M300 60c8 4 8 12 0 16M306 54c13 7 13 21 0 28" stroke="var(--accent)" strokeWidth="1.5" />
    </svg>
  )
}
