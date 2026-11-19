import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, CalendarCheck } from 'lucide-react'
import { useRef } from 'react'
import { site } from '../../config/site'
import { useApp } from '../../context/AppContext'
import { scrollToSection } from '../../lib/scroll'
import { Button } from '../ui/Button'
import { Img } from '../ui/Img'
import { MaskLines } from '../ui/Reveal'

const ease = [0.22, 1, 0.36, 1] as const

const specs = [
  { k: 'Especialidades', v: '6 frentes de serviço' },
  { k: 'Orçamento', v: 'Antes de qualquer execução' },
  { k: 'Solicitação', v: 'Online, em 4 etapas' },
  { k: 'Atendimento', v: 'Seg. a sáb. (horário demo)' },
]

/** Anotação técnica sobre a fotografia: ponto + linha guia + rótulo. */
function Callout({
  x,
  y,
  label,
  side = 'right',
  delay,
}: {
  x: string
  y: string
  label: string
  side?: 'left' | 'right'
  delay: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      aria-hidden
      className="absolute flex items-center"
      style={{ left: x, top: y, flexDirection: side === 'right' ? 'row' : 'row-reverse', translate: side === 'right' ? '-5px -50%' : 'calc(-100% + 5px) -50%' }}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <span className="relative grid h-2.5 w-2.5 place-items-center">
        <span className="absolute inset-0 rounded-full bg-accent" />
        <span className="absolute -inset-1.5 rounded-full border border-accent/60 [animation:ping-ring_2.6s_ease-out_infinite]" />
      </span>
      <motion.span
        className="h-px w-10 bg-accent sm:w-16"
        style={{ originX: side === 'right' ? 0 : 1 }}
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay + 0.15, duration: 0.6, ease }}
      />
      <span className="tech rounded-[3px] bg-[rgb(16_18_20/0.78)] px-2 py-1 whitespace-nowrap text-[#F5F5F0] backdrop-blur-sm">
        {label}
      </span>
    </motion.div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { requestBooking } = useApp()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '14%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-10%'])
  const needle = useTransform(scrollYProgress, [0, 1], [-62, reduce ? -62 : 40])

  return (
    <section ref={ref} id="topo" aria-labelledby="hero-title" className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-0">
      <div className="shell grid gap-10 lg:min-h-[max(100svh,46rem)] lg:grid-cols-12 lg:gap-8">
        {/* Coluna tipográfica */}
        <motion.div style={{ y: textY }} className="relative z-10 flex flex-col justify-center lg:col-span-7 lg:pt-32 lg:pb-40">
          <motion.p
            className="tech mb-6 flex items-center gap-3 text-muted sm:mb-8"
            initial={reduce ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
          >
            <span className="inline-block h-2 w-2 bg-accent" aria-hidden />
            Oficina mecânica, diagnóstico e manutenção
          </motion.p>

          <h1 id="hero-title" className="display text-[clamp(3.6rem,17vw,10.5rem)] font-bold uppercase lg:text-[clamp(5.5rem,10.4vw,11.5rem)]">
            <MaskLines lines={['Precisão', 'em cada', 'detalhe.']} delay={0.35} lineClassName="[&]:tracking-[-0.015em]" />
          </h1>

          <motion.p
            className="mt-7 max-w-[32ch] text-lg leading-relaxed text-muted sm:text-xl"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease }}
          >
            Do diagnóstico à manutenção, cuidado técnico para você seguir com confiança.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-3 xs:flex-row"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease }}
          >
            <Button size="lg" magnetic onClick={() => requestBooking()} icon={<CalendarCheck size={18} />}>
              {site.cta.primary}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => scrollToSection('servicos')} icon={<ArrowDown size={18} />}>
              {site.cta.secondary}
            </Button>
          </motion.div>
        </motion.div>

        {/* Coluna fotográfica */}
        <div className="relative lg:col-span-5 lg:pt-28 lg:pb-36">
          <motion.div
            className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-surface sm:aspect-[16/11] lg:aspect-auto lg:h-full"
            initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 1.3, delay: 0.2, ease }}
          >
            <motion.div
              className="absolute inset-0 -top-[8%] h-[116%] will-change-transform"
              style={{ y: imgY }}
              initial={reduce ? false : { scale: 1.22 }}
              animate={{ scale: 1.04 }}
              transition={{ duration: 2.2, delay: 0.2, ease }}
            >
              <Img image={site.images.hero} priority sizes="(min-width: 1024px) 42vw, 100vw" maxWidth={1440} />
            </motion.div>
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(16_18_20/0)_55%,rgb(16_18_20/0.55))]" />

            <Callout x="52%" y="80%" label="Cofre do motor" delay={1.6} />
            <Callout x="38%" y="34%" label="Inspeção visual" side="left" delay={1.85} />

            {/* moldura técnica */}
            <span aria-hidden className="absolute top-3 left-3 h-5 w-5 border-t-2 border-l-2 border-accent" />
            <span aria-hidden className="absolute right-3 bottom-3 h-5 w-5 border-r-2 border-b-2 border-accent" />
            <p className="tech absolute right-10 bottom-4 left-4 text-right text-[0.6875rem] text-[#d7dcdf]">
              Foto: {site.images.hero.credit} / Unsplash
            </p>
          </motion.div>

          {/* mostrador de torque: o ponteiro acompanha a rolagem da hero */}
          <motion.div
            aria-hidden
            className="absolute -bottom-6 -left-4 hidden h-36 w-36 rounded-full border border-line bg-bg p-3 shadow-[0_20px_50px_-25px_rgb(0_0_0/0.6)] lg:-left-14 lg:block xl:bottom-24"
            initial={reduce ? false : { opacity: 0, scale: 0.85, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 1.3, ease }}
          >
            <svg viewBox="0 0 100 100" className="h-full w-full">
              {Array.from({ length: 41 }).map((_, i) => {
                const a = (-130 + i * 6.5) * (Math.PI / 180)
                const long = i % 5 === 0
                const r1 = long ? 36 : 40
                return (
                  <line
                    key={i}
                    x1={50 + Math.sin(a) * r1}
                    y1={50 - Math.cos(a) * r1}
                    x2={50 + Math.sin(a) * 45}
                    y2={50 - Math.cos(a) * 45}
                    stroke={i > 32 ? 'var(--accent)' : 'var(--line-strong)'}
                    strokeWidth={long ? 1.6 : 0.8}
                  />
                )
              })}
              <motion.g style={{ rotate: needle, originX: '50px', originY: '50px' }}>
                <line x1="50" y1="50" x2="50" y2="18" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" />
              </motion.g>
              <circle cx="50" cy="50" r="4.5" fill="var(--fg)" />
              <text x="50" y="74" textAnchor="middle" className="fill-[var(--muted)] font-mono text-[7px]">
                N·m
              </text>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* faixa de especificações */}
      <motion.div
        className="shell relative z-10 mt-12 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.35 }}
      >
        <div aria-hidden className="ruler opacity-60" />
        <dl className="grid grid-cols-2 border-t border-line md:grid-cols-4">
          {specs.map((s, i) => (
            <div
              key={s.k}
              className={`flex flex-col gap-1 py-4 pr-4 md:py-6 ${i % 2 === 1 ? 'pl-4 border-l border-line' : ''} ${i >= 2 ? 'border-t border-line md:border-t-0' : ''} ${i === 2 ? 'md:border-l md:pl-4' : ''}`}
            >
              <dt className="tech text-muted">{s.k}</dt>
              <dd className="font-display text-xl font-semibold tracking-[0.01em] sm:text-2xl">{s.v}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  )
}
