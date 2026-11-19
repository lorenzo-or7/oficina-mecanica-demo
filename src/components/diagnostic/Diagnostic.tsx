import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AirVent, CalendarCheck, CircleDot, Cog, Disc3, Info, MoveVertical, Zap, type LucideIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { systems, type SystemId } from '../../content/diagnostic'
import { serviceById } from '../../content/services'
import { useApp } from '../../context/AppContext'
import { Button } from '../ui/Button'
import { SectionHeader } from '../ui/SectionHeader'
import { toStage, VehicleSvg } from './VehicleSvg'

const icons: Record<SystemId, LucideIcon> = {
  motor: Cog,
  freios: Disc3,
  ar: AirVent,
  eletrico: Zap,
  suspensao: MoveVertical,
  pneus: CircleDot,
}

const ease = [0.22, 1, 0.36, 1] as const

export function Diagnostic() {
  const [active, setActive] = useState<SystemId>('freios')
  const { requestBooking, setOpenService } = useApp()
  const reduce = useReducedMotion()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const idx = systems.findIndex((s) => s.id === active)
  const sys = systems[idx]
  const service = serviceById(sys.service)

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % systems.length
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + systems.length) % systems.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = systems.length - 1
    if (next < 0) return
    e.preventDefault()
    setActive(systems[next].id)
    tabs.current[next]?.focus()
  }

  return (
    <section id="diagnostico" aria-labelledby="diagnostico-title" className="relative overflow-hidden border-t border-line py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <SectionHeader
          id="diagnostico"
          code="Diagnóstico"
          label="Explore o veículo"
          title={['Onde está', 'o sintoma?']}
          intro={
            <p className="text-lg leading-relaxed">
              Escolha um sistema do carro para ver sinais comuns, o que costuma ser verificado e qual serviço solicitar. É um guia
              para conversar com a oficina, não um diagnóstico.
            </p>
          }
        />

        <div className="mt-12 flex flex-col gap-5 lg:mt-16">
          {/* palco do veículo */}
            <div className="relative flex flex-1 flex-col overflow-hidden rounded-[12px] border border-line bg-surface">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5 sm:px-5">
                <p className="tech text-muted">Vista lateral, camadas técnicas</p>
                <p className="tech text-muted" aria-live="off">
                  <span className="text-accent-ink">{String(idx + 1).padStart(2, '0')}</span> / {String(systems.length).padStart(2, '0')}
                </p>
              </div>
              <div className="flex flex-1 items-center px-2 py-4 sm:px-6 sm:py-8">
              <div className="relative w-full">
                <VehicleSvg active={active} />
                {/* marcadores clicáveis sobre a ilustração (atalho visual; o teclado usa a lista abaixo) */}
                <div className="absolute inset-0">
                  {systems.map((s) => {
                    const on = s.id === active
                    return (
                      <button
                        key={s.id}
                        type="button"
                        tabIndex={-1}
                        aria-label={`Selecionar ${s.name}`}
                        onClick={() => setActive(s.id)}
                        className="group absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
                        style={toStage(s.x, s.y)}
                      >
                        {on && !reduce && (
                          <span aria-hidden className="absolute h-7 w-7 rounded-full border border-accent [animation:ping-ring_1.8s_ease-out_infinite]" />
                        )}
                        <span
                          aria-hidden
                          className={`relative grid h-6 w-6 place-items-center rounded-full border-2 transition-all duration-300 sm:h-7 sm:w-7 ${
                            on
                              ? 'scale-110 border-accent bg-accent'
                              : 'border-fg/70 bg-bg group-hover:scale-110 group-hover:border-accent'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-on-accent' : 'bg-fg/70 group-hover:bg-accent'}`} />
                        </span>
                        <span
                          aria-hidden
                          className={`tech pointer-events-none absolute top-full mt-0.5 hidden rounded-[3px] px-1.5 py-0.5 whitespace-nowrap transition-opacity sm:block ${
                            on ? 'bg-accent text-on-accent opacity-100' : 'bg-elevated text-fg opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          {s.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
              </div>
              <div aria-hidden className="tech flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line px-4 py-2.5 text-muted sm:px-5">
                <span className="flex items-center gap-2">
                  <span className="h-[2px] w-6 bg-accent" /> {sys.name}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-6 border-t-[1.5px] border-dashed border-muted" /> Outros sistemas
                </span>
                <span className="ml-auto hidden sm:inline">Toque ou clique em um marcador</span>
              </div>
            </div>

          <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
            {/* seletor acessível: grade visual no mobile, régua no desktop */}
            <div
              role="tablist"
              aria-label="Sistemas do veículo"
              aria-orientation="horizontal"
              onKeyDown={onKeyDown}
              className="grid grid-cols-2 content-start gap-2 xs:grid-cols-3 lg:col-span-3 lg:grid-cols-1"
            >
              {systems.map((s, i) => {
                const Icon = icons[s.id]
                const on = s.id === active
                return (
                  <button
                    key={s.id}
                    ref={(el) => {
                      tabs.current[i] = el
                    }}
                    role="tab"
                    id={`tab-${s.id}`}
                    aria-selected={on}
                    aria-controls="diag-panel"
                    tabIndex={on ? 0 : -1}
                    type="button"
                    onClick={() => setActive(s.id)}
                    className={`relative flex min-h-14 items-center gap-2.5 overflow-hidden rounded-[8px] border px-3 py-2.5 text-left text-[0.875rem] font-semibold transition-colors duration-200 lg:min-h-13 ${
                      on ? 'border-accent bg-elevated text-fg' : 'border-line bg-transparent text-muted hover:border-line-strong hover:text-fg'
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.8} aria-hidden className={on ? 'text-accent-ink' : ''} />
                    <span className="leading-tight">{s.name}</span>
                    {on && (
                      <motion.span
                        layoutId="diag-tab"
                        className="absolute inset-x-0 bottom-0 h-[3px] bg-accent"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

          {/* painel contextual */}
          <div
            id="diag-panel"
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            className="relative flex flex-col overflow-hidden rounded-[12px] border border-line bg-surface lg:col-span-9"
          >
            <div aria-hidden className="ruler opacity-60" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={sys.id}
                className="grid flex-1 gap-7 p-6 sm:p-7 md:grid-cols-2 md:gap-x-10"
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -18 }}
                transition={{ duration: 0.35, ease }}
              >
                <header>
                  <p className="tech text-muted">Sistema selecionado</p>
                  <h3 className="display mt-1 text-[3.25rem] font-bold uppercase">{sys.name}</h3>
                  <p className="mt-2 text-[0.9375rem] text-muted">{sys.summary}</p>
                </header>

                <div>
                  <h4 className="tech mb-3 text-muted">Sinais comuns</h4>
                  <ul className="flex flex-col gap-2.5">
                    {sys.symptoms.map((t, i) => (
                      <motion.li
                        key={t}
                        className="flex gap-3 text-[0.9375rem]"
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + i * 0.05, duration: 0.35 }}
                      >
                        <span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-accent" />
                        <span>{t}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="tech mb-3 text-muted">Possíveis verificações</h4>
                  <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[6px] border border-line bg-line xs:grid-cols-2">
                    {sys.checks.map((c, i) => (
                      <li key={c} className="relative bg-bg px-3 py-2.5 text-sm">
                        <motion.span
                          aria-hidden
                          className="absolute top-0 left-0 h-[2px] bg-accent"
                          initial={{ width: reduce ? '100%' : '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 0.25 + i * 0.12, duration: 0.6, ease }}
                        />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex flex-col gap-3 border-t border-line pt-5">
                  <p className="text-sm text-muted">
                    Serviço relacionado:{' '}
                    <button
                      type="button"
                      onClick={() => setOpenService(service.id)}
                      className="font-semibold text-fg underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-ink"
                    >
                      {service.name}
                    </button>
                  </p>
                  <Button onClick={() => requestBooking(service.id)} icon={<CalendarCheck size={17} />} size="lg">
                    Agendar avaliação
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
            <p className="flex gap-2 border-t border-line bg-bg/50 px-6 py-3.5 text-xs leading-relaxed text-muted sm:px-7">
              <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
              Conteúdo educativo. Somente a avaliação presencial do veículo identifica a causa de um sintoma.
            </p>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
