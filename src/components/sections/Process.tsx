import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useRef, useState } from 'react'
import { processSteps } from '../../content/misc'
import { SectionHeader } from '../ui/SectionHeader'

export function Process() {
  const track = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 80%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const [reached, setReached] = useState(reduce ? processSteps.length : 0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduce) return
    // cada etapa "acende" quando a linha de progresso chega ao seu marcador
    setReached(Math.min(processSteps.length, Math.floor(v * processSteps.length + 0.35)))
  })

  return (
    <section id="processo" aria-labelledby="processo-title" className="relative border-t border-line bg-surface/40 py-24 sm:py-32">
      <div className="shell">
        <SectionHeader
          id="processo"
          code="Processo"
          label="Como trabalhamos"
          title={['Quatro etapas,', 'nenhuma surpresa.']}
          intro={<p className="text-lg leading-relaxed">Você acompanha o atendimento do começo ao fim e decide o que será feito.</p>}
        />

        <ol ref={track} className="relative mt-14 grid gap-0 lg:mt-20 lg:grid-cols-4 lg:gap-8">
          {/* trilho */}
          <span aria-hidden className="absolute top-0 bottom-0 left-[19px] w-px bg-line lg:top-[19px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-full" />
          <motion.span
            aria-hidden
            className="absolute top-0 bottom-0 left-[19px] w-[2px] origin-top bg-accent lg:hidden"
            style={{ scaleY: reduce ? 1 : progress }}
          />
          <motion.span
            aria-hidden
            className="absolute top-[18px] left-0 hidden h-[2px] w-full origin-left bg-accent lg:block"
            style={{ scaleX: reduce ? 1 : progress }}
          />

          {processSteps.map((s, i) => {
            const on = i < reached
            return (
              <li key={s.n} className="relative grid grid-cols-[40px_1fr] gap-5 pb-10 last:pb-0 lg:block lg:pb-0">
                <span
                  className={`relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 font-mono text-sm font-medium transition-all duration-500 ${
                    on ? 'border-accent bg-accent text-on-accent' : 'border-line-strong bg-bg text-muted'
                  }`}
                >
                  {s.n}
                </span>
                <div className="lg:mt-8 lg:pr-4">
                  <h3
                    className={`font-display text-[1.9rem] leading-none font-semibold uppercase transition-colors duration-500 ${
                      on ? 'text-fg' : 'text-muted'
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-[0.9375rem] text-muted">{s.text}</p>
                  {i === 2 && (
                    <p className="tech mt-4 inline-flex items-center gap-2 rounded-[4px] border border-accent/50 px-2.5 py-1.5 text-accent-ink">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                      Execução só com o seu aval
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
