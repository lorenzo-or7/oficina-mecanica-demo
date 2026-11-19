import { motion, useReducedMotion } from 'motion/react'
import { ChevronsLeftRight } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { SectionHeader } from '../ui/SectionHeader'

/* ---------- Ilustrações técnicas (desenhadas para representar o mesmo componente) ---------- */

function BrakeDisc({ worn }: { worn: boolean }) {
  const holes = Array.from({ length: 5 }).map((_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2
    return [200 + Math.cos(a) * 30, 200 + Math.sin(a) * 30]
  })
  const vents = Array.from({ length: 36 }).map((_, i) => (i / 36) * Math.PI * 2)
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={worn ? 'dw' : 'dn'} cx="45%" cy="40%" r="65%">
          {worn ? (
            <>
              <stop offset="0" stopColor="#7a6a5c" />
              <stop offset="0.55" stopColor="#5d4a3b" />
              <stop offset="1" stopColor="#3b2c22" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#e3e6e8" />
              <stop offset="0.6" stopColor="#b5bcc1" />
              <stop offset="1" stopColor="#848c92" />
            </>
          )}
        </radialGradient>
        {worn && (<filter id="rust" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="4" />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.27  0 0 0 0 0.12  0 0 0 0.9 -0.25" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>)}
      </defs>
      <rect width="400" height="400" fill={worn ? '#1c1814' : '#1d2226'} />
      {/* ventilação vista pela borda */}
      {vents.map((a, i) => (
        <line
          key={i}
          x1={200 + Math.cos(a) * 160}
          y1={200 + Math.sin(a) * 160}
          x2={200 + Math.cos(a) * 172}
          y2={200 + Math.sin(a) * 172}
          stroke={worn ? '#2a211b' : '#3a4248'}
          strokeWidth="5"
        />
      ))}
      <circle cx="200" cy="200" r="160" fill={`url(#${worn ? 'dw' : 'dn'})`} />
      {/* sulcos de usinagem / desgaste */}
      {Array.from({ length: worn ? 16 : 26 }).map((_, i) => (
        <circle
          key={i}
          cx="200"
          cy="200"
          r={84 + i * (worn ? 4.6 : 2.9)}
          fill="none"
          stroke={worn ? (i % 3 === 0 ? '#2b1f17' : '#8a7462') : '#ffffff'}
          strokeOpacity={worn ? (i % 3 === 0 ? 0.9 : 0.35) : 0.18}
          strokeWidth={worn ? (i % 3 === 0 ? 2.4 : 1) : 0.6}
        />
      ))}
      {worn && (
        <>
          <circle cx="200" cy="200" r="160" filter="url(#rust)" opacity="0.75" />
          {/* ressalto de desgaste na borda */}
          <circle cx="200" cy="200" r="157" fill="none" stroke="#9b5a2c" strokeWidth="6" opacity="0.9" />
          <path d="M120 260 Q170 240 230 280" stroke="#2b1f17" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M260 120 Q290 160 280 210" stroke="#2b1f17" strokeWidth="1.6" fill="none" opacity="0.5" />
        </>
      )}
      {/* chapéu do disco */}
      <circle cx="200" cy="200" r="78" fill={worn ? '#4a3a2e' : '#9aa2a8'} />
      <circle cx="200" cy="200" r="78" fill="none" stroke={worn ? '#2b1f17' : '#6d757b'} strokeWidth="3" />
      <circle cx="200" cy="200" r="24" fill={worn ? '#1c1814' : '#1d2226'} />
      {holes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="7.5" fill={worn ? '#1c1814' : '#1d2226'} />
      ))}
    </svg>
  )
}

function AirFilter({ dirty }: { dirty: boolean }) {
  const pleats = 22
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
      <defs>
        {dirty && (<filter id="dust" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="9" />
          <feColorMatrix values="0 0 0 0 0.18  0 0 0 0 0.14  0 0 0 0 0.1  0 0 0 1.1 -0.35" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>)}
      </defs>
      <rect width="400" height="400" fill={dirty ? '#1c1814' : '#1d2226'} />
      {/* moldura de borracha */}
      <rect x="40" y="70" width="320" height="260" rx="14" fill="#2b2f33" />
      <rect x="56" y="86" width="288" height="228" rx="4" fill={dirty ? '#6f5c45' : '#efe9d6'} />
      {Array.from({ length: pleats }).map((_, i) => {
        const x = 56 + (i * 288) / pleats
        const w = 288 / pleats
        return (
          <g key={i}>
            <rect x={x} y="86" width={w / 2} height="228" fill={dirty ? '#58472f' : '#d9d1b8'} />
            <line x1={x} y1="86" x2={x} y2="314" stroke={dirty ? '#3d3122' : '#c4bb9f'} strokeWidth="1.2" />
          </g>
        )
      })}
      {dirty && (
        <>
          <rect x="56" y="86" width="288" height="228" filter="url(#dust)" />
          <ellipse cx="170" cy="220" rx="110" ry="70" fill="#2a2016" opacity="0.45" />
          {Array.from({ length: 18 }).map((_, i) => (
            <circle key={i} cx={70 + ((i * 73) % 260)} cy={100 + ((i * 41) % 200)} r={1.5 + (i % 3)} fill="#2a2016" opacity="0.7" />
          ))}
          <path d="M240 110 l12 8 l-6 4 z" fill="#3a3a2a" opacity="0.8" />
        </>
      )}
      <rect x="40" y="70" width="320" height="260" rx="14" fill="none" stroke="#15181a" strokeWidth="3" />
    </svg>
  )
}

const comparisons = [
  {
    id: 'disco',
    title: 'Disco de freio',
    before: 'Disco com sulcos profundos, ressalto na borda e oxidação',
    after: 'Disco novo, superfície usinada uniforme',
    note: 'Discos com desgaste além do limite indicado pelo fabricante devem ser substituídos, nunca apenas limpos.',
    render: (after: boolean) => <BrakeDisc worn={!after} />,
  },
  {
    id: 'filtro',
    title: 'Filtro de ar',
    before: 'Elemento filtrante saturado de poeira e detritos',
    after: 'Elemento filtrante novo, pregas limpas',
    note: 'Um filtro saturado restringe a entrada de ar do motor. A troca segue o intervalo do manual ou a condição observada.',
    render: (after: boolean) => <AirFilter dirty={!after} />,
  },
]

function CompareSlider({ c }: { c: (typeof comparisons)[number] }) {
  const [pos, setPos] = useState(50)
  const box = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const setFromX = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
  }, [])

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setPos((p) => Math.max(0, p - step))
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setPos((p) => Math.min(100, p + step))
    else if (e.key === 'Home') setPos(0)
    else if (e.key === 'End') setPos(100)
    else if (e.key === 'PageDown') setPos((p) => Math.max(0, p - 10))
    else if (e.key === 'PageUp') setPos((p) => Math.min(100, p + 10))
    else return
    e.preventDefault()
  }

  return (
    <figure className="flex flex-col gap-4">
      <div
        ref={box}
        className="relative aspect-square cursor-ew-resize touch-pan-y overflow-hidden rounded-[10px] border border-line select-none sm:aspect-[5/4]"
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          setFromX(e.clientX)
        }}
        onPointerMove={(e) => dragging.current && setFromX(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* depois (fundo) */}
        <div className="absolute inset-0 grid place-items-center">{c.render(true)}</div>
        {/* antes (recortado) */}
        <div className="absolute inset-0 grid place-items-center" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {c.render(false)}
        </div>

        <span className="tech pointer-events-none absolute top-3 left-3 rounded-[3px] bg-[rgb(16_18_20/0.8)] px-2 py-1 text-[#F5F5F0]">Antes</span>
        <span className="tech pointer-events-none absolute top-3 right-3 rounded-[3px] bg-[#F1B544] px-2 py-1 text-[#101214]">Depois</span>

        {/* divisor + alça (o slider acessível) */}
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
          <span className="absolute inset-y-0 -left-px w-[2px] bg-[#F1B544]" />
        </div>
        <button
          type="button"
          role="slider"
          aria-label={`Comparação ${c.title}: antes e depois`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% mostrando o antes`}
          onKeyDown={onKey}
          className="absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#F1B544] bg-[#101214] text-[#F1B544] shadow-lg"
          style={{ left: `${pos}%` }}
        >
          <ChevronsLeftRight size={20} aria-hidden />
        </button>
      </div>
      <figcaption className="grid gap-3 text-sm sm:grid-cols-2">
        <p>
          <span className="tech block text-muted">Antes</span>
          {c.before}
        </p>
        <p>
          <span className="tech block text-accent-ink">Depois</span>
          {c.after}
        </p>
      </figcaption>
    </figure>
  )
}

export function BeforeAfter() {
  const [tab, setTab] = useState(0)
  const reduce = useReducedMotion()
  const c = comparisons[tab]

  return (
    <section id="detalhes" aria-labelledby="detalhes-title" className="relative border-t border-line py-24 sm:py-32">
      <div className="shell">
        <SectionHeader
          id="detalhes"
          code="Detalhes"
          label="Antes e depois"
          title={['O desgaste', 'que não se vê.']}
          intro={
            <p className="text-lg leading-relaxed">
              Muitas peças se desgastam longe dos olhos. Arraste o divisor para comparar um componente desgastado com um novo.
            </p>
          }
        />

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <div role="tablist" aria-label="Componentes para comparar" className="flex gap-2 lg:flex-col">
              {comparisons.map((x, i) => (
                <button
                  key={x.id}
                  role="tab"
                  type="button"
                  aria-selected={tab === i}
                  aria-controls="compare-panel"
                  tabIndex={tab === i ? 0 : -1}
                  onClick={() => setTab(i)}
                  onKeyDown={(e) => {
                    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
                      e.preventDefault()
                      const n = (i + 1) % comparisons.length
                      setTab(n)
                      ;(e.currentTarget.parentElement?.children[n] as HTMLElement)?.focus()
                    }
                  }}
                  className={`flex min-h-12 flex-1 items-center justify-between gap-3 rounded-[8px] border px-4 text-left font-display text-xl font-semibold uppercase transition-colors lg:flex-none lg:py-4 lg:text-2xl ${
                    tab === i ? 'border-accent bg-elevated text-fg' : 'border-line text-muted hover:border-line-strong hover:text-fg'
                  }`}
                >
                  {x.title}
                  <span className="tech hidden normal-case lg:inline">{String(i + 1).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
            <motion.p
              key={c.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-muted"
            >
              {c.note}
            </motion.p>
            <p className="tech text-muted">
              Ilustrações técnicas demonstrativas. Não retratam um atendimento ou veículo real.
            </p>
          </div>
          <div id="compare-panel" role="tabpanel" aria-label={c.title} className="lg:col-span-8">
            <CompareSlider key={c.id} c={c} />
          </div>
        </div>
      </div>
    </section>
  )
}
