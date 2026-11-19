import { motion, useReducedMotion } from 'motion/react'
import type { SystemId } from '../../content/diagnostic'

/**
 * Ilustração técnica lateral (viewBox 1000×420), estilo "raio-x":
 * carroceria em traço, sistemas internos em camadas destacáveis.
 */
/** recorte da prancheta: enquadra o carro e as cotas */
export const VB = { x: 40, y: 88, w: 950, h: 330 }

/** converte coordenadas do conteúdo (% de 1000×420) para % do recorte */
export const toStage = (x: number, y: number) => ({
  left: `${((x * 10 - VB.x) / VB.w) * 100}%`,
  top: `${((y * 4.2 - VB.y) / VB.h) * 100}%`,
})

export function VehicleSvg({ active }: { active: SystemId }) {
  const reduce = useReducedMotion()

  const zone = (id: SystemId) => ({
    'data-zone': id,
    'data-active': active === id ? 'true' : 'false',
    className: 'veh-zone',
  })

  const wheel = (cx: number) => (
    <>
      <circle cx={cx} cy={318} r={60} className="veh-tire" />
      <circle cx={cx} cy={318} r={52} className="veh-tire-inner" />
    </>
  )

  return (
    <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="veh h-auto w-full" role="img" aria-label="Ilustração técnica de um automóvel com os sistemas de manutenção destacáveis">
      <defs>
        <pattern id="veh-grid" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M25 0H0V25" fill="none" stroke="var(--line)" strokeWidth="0.6" />
        </pattern>
        <linearGradient id="veh-scan" x1="0" x2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="0.85" stopColor="var(--accent)" stopOpacity="0.16" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <rect width="1000" height="420" fill="url(#veh-grid)" opacity="0.55" />

      {/* cotas de engenharia */}
      <g className="veh-dim">
        <line x1="70" y1="404" x2="945" y2="404" />
        <line x1="70" y1="396" x2="70" y2="412" />
        <line x1="945" y1="396" x2="945" y2="412" />
        <line x1="230" y1="392" x2="230" y2="404" />
        <line x1="770" y1="392" x2="770" y2="404" />
        <text x="500" y="398" textAnchor="middle">entre-eixos</text>
        <line x1="975" y1="112" x2="975" y2="378" />
        <line x1="967" y1="112" x2="983" y2="112" />
        <line x1="967" y1="378" x2="983" y2="378" />
      </g>

      {/* solo */}
      <line x1="20" y1="378" x2="980" y2="378" className="veh-ground" />

      {/* carroceria */}
      <path
        className="veh-body"
        d="M70 300 C70 270 80 250 110 242 L260 212 C300 170 350 130 400 118 L610 112 C670 114 720 150 760 196 L900 214 C930 220 945 240 945 270 L945 312 L848 312 A78 78 0 0 0 692 312 L308 312 A78 78 0 0 0 152 312 L82 312 C74 312 70 306 70 300 Z"
      />
      <path className="veh-glass" d="M285 210 C320 172 360 140 405 130 L500 127 L500 208 Z" />
      <path className="veh-glass" d="M515 208 L515 126 L605 125 C650 128 690 160 722 200 Z" />
      <path className="veh-line" d="M507 212 L507 302 M300 214 L300 302 M712 210 L712 300" />
      <path className="veh-line" d="M440 236 h28 M650 236 h28" />
      <path className="veh-line" d="M78 266 L124 252 L126 266 Z" />
      <path className="veh-line" d="M928 236 L944 240 L944 262 L928 262 Z" />

      {/* ---------- sistemas ---------- */}
      <g {...zone('motor')}>
        <rect x="96" y="226" width="124" height="66" rx="6" />
        <path d="M112 226 v-10 h22 v10 M142 226 v-10 h22 v10 M172 226 v-10 h22 v10" />
        <circle cx="122" cy="262" r="10" />
        <circle cx="122" cy="262" r="3" />
        <path d="M144 248 h60 M144 262 h60 M144 276 h60" />
        <path d="M220 258 h22 v28" />
      </g>

      <g {...zone('ar')}>
        <rect x="312" y="206" width="56" height="30" rx="4" />
        <path d="M322 216 h36 M322 226 h36" />
        <path className="veh-flow" d="M368 214 C400 200 420 186 440 182 M368 222 C405 214 430 206 452 204" />
        <rect x="74" y="270" width="12" height="34" rx="2" />
        <path className="veh-flow" d="M86 288 C150 300 260 296 312 228" />
      </g>

      <g {...zone('eletrico')}>
        <rect x="846" y="232" width="42" height="26" rx="3" />
        <path d="M856 232 v-6 M878 232 v-6" />
        <path className="veh-flow" d="M120 272 C160 296 220 298 300 298 L700 298 C780 298 830 280 846 252" />
        <path className="veh-flow" d="M888 246 L928 246" />
      </g>

      <g {...zone('suspensao')}>
        <path d="M770 232 l-14 6 l28 8 l-28 8 l28 8 l-28 8 l28 8 l-14 6" />
        <rect x="764" y="226" width="12" height="6" />
        <path d="M230 236 l-12 5 l24 7 l-24 7 l24 7 l-24 7 l12 5" />
        <path d="M230 276 V300 M770 284 V302" />
        <path d="M232 300 L330 300 M690 302 L768 302" />
      </g>

      <g {...zone('pneus')}>
        {wheel(230)}
        {wheel(770)}
        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i / 18) * Math.PI * 2
          return (
            <g key={i}>
              <line x1={230 + Math.cos(a) * 54} y1={318 + Math.sin(a) * 54} x2={230 + Math.cos(a) * 60} y2={318 + Math.sin(a) * 60} />
              <line x1={770 + Math.cos(a) * 54} y1={318 + Math.sin(a) * 54} x2={770 + Math.cos(a) * 60} y2={318 + Math.sin(a) * 60} />
            </g>
          )
        })}
      </g>

      {/* aros (sempre visíveis) */}
      {[230, 770].map((cx) => (
        <g key={cx} className="veh-rim">
          <circle cx={cx} cy={318} r={38} />
          {Array.from({ length: 5 }).map((_, i) => {
            const a = (i / 5) * Math.PI * 2 - Math.PI / 2
            return <line key={i} x1={cx + Math.cos(a) * 10} y1={318 + Math.sin(a) * 10} x2={cx + Math.cos(a) * 34} y2={318 + Math.sin(a) * 34} />
          })}
          <circle cx={cx} cy={318} r={8} />
        </g>
      ))}

      <g {...zone('freios')}>
        <circle cx="230" cy="318" r="30" />
        <circle cx="230" cy="318" r="22" strokeDasharray="3 4" />
        <path d="M206 290 A36 36 0 0 1 254 290 L248 298 A26 26 0 0 0 212 298 Z" />
        <circle cx="770" cy="318" r="28" />
        <path d="M748 292 A34 34 0 0 1 792 292 L786 299 A25 25 0 0 0 754 299 Z" />
      </g>

      {/* varredura de leitura a cada troca de sistema */}
      {!reduce && (
        <motion.rect
          key={active}
          y="96"
          height="290"
          width="140"
          fill="url(#veh-scan)"
          initial={{ x: -160, opacity: 1 }}
          animate={{ x: 1000, opacity: [1, 1, 0] }}
          transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
        />
      )}
    </svg>
  )
}
