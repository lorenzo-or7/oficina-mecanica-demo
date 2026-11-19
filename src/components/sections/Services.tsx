import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Check, CalendarCheck } from 'lucide-react'
import { useCallback } from 'react'
import { services, type Service } from '../../content/services'
import { useApp } from '../../context/AppContext'
import { Button } from '../ui/Button'
import { Drawer } from '../ui/Drawer'
import { Img } from '../ui/Img'
import { RevealItem, Stagger } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { ACGraphic } from './ACGraphic'

/** Distribuição editorial: um serviço principal e cards de pesos diferentes. */
const layout: Record<string, { cell: string; variant: 'feature' | 'tall' | 'wide' | 'compact' | 'graphic' }> = {
  diagnostico: { cell: 'md:col-span-2 lg:col-span-7 lg:row-span-2', variant: 'feature' },
  revisao: { cell: 'lg:col-span-5', variant: 'wide' },
  'freios-suspensao': { cell: 'lg:col-span-5', variant: 'wide' },
  'motor-transmissao': { cell: 'lg:col-span-4', variant: 'compact' },
  'oleo-filtros': { cell: 'lg:col-span-4', variant: 'compact' },
  'ar-condicionado': { cell: 'md:col-span-2 lg:col-span-4', variant: 'graphic' },
}

/** Indicador discreto: um traço por item verificado na avaliação. */
function CheckTicks({ n, light = false }: { n: number; light?: boolean }) {
  return (
    <span className="flex items-center gap-2" aria-label={`${n} itens verificados`}>
      <span className="flex gap-[3px]" aria-hidden>
        {Array.from({ length: n }).map((_, i) => (
          <span
            key={i}
            className={`h-3 w-[3px] origin-bottom transition-transform duration-300 group-hover:scale-y-150 ${light ? 'bg-[#F1B544]' : 'bg-accent'}`}
            style={{ transitionDelay: `${i * 40}ms` }}
          />
        ))}
      </span>
      <span className={`tech ${light ? 'text-[#d7dcdf]' : 'text-muted'}`}>{n} verificações</span>
    </span>
  )
}

function ServiceCard({ s, onOpen }: { s: Service; onOpen: (s: Service) => void }) {
  const { cell, variant } = layout[s.id]
  const photo = s.image && variant !== 'graphic'
  const overlay = variant === 'feature' || variant === 'wide'

  return (
    <RevealItem as="li" className={`${cell} min-w-0`}>
      <button
        type="button"
        onClick={() => onOpen(s)}
        aria-haspopup="dialog"
        className={`group relative flex h-full w-full overflow-hidden rounded-[10px] border border-line text-left transition-colors duration-300 hover:border-line-strong ${
          overlay ? 'min-h-[20rem] flex-col justify-end bg-[#101214] text-[#F5F5F0]' : 'flex-col bg-surface'
        } ${variant === 'feature' ? 'min-h-[26rem] sm:min-h-[32rem] lg:min-h-full' : ''}`}
      >
        {photo && overlay && (
          <>
            <span className="absolute inset-0 transition-transform duration-[1.2s] ease-(--ease-mech) group-hover:scale-[1.05]">
              <Img image={s.image!} sizes={variant === 'feature' ? '(min-width:1024px) 55vw, 100vw' : '(min-width:1024px) 40vw, 100vw'} />
            </span>
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgb(16_18_20/0.15)_0%,rgb(16_18_20/0.45)_45%,rgb(16_18_20/0.92)_100%)] transition-opacity duration-500 group-hover:opacity-90"
            />
          </>
        )}

        {photo && !overlay && (
          <span className="relative block aspect-[16/9] overflow-hidden">
            <span className="absolute inset-0 transition-transform duration-[1.2s] ease-(--ease-mech) group-hover:scale-[1.06]">
              <Img image={s.image!} sizes="(min-width:1024px) 30vw, (min-width:768px) 50vw, 100vw" maxWidth={1080} />
            </span>
          </span>
        )}

        {variant === 'graphic' && (
          <span className="relative block border-b border-line bg-bg px-6 pt-6 pb-2">
            <ACGraphic className="mx-auto h-32 w-full max-w-sm" />
          </span>
        )}

        <span className={`relative flex flex-col gap-3 p-6 ${variant === 'feature' ? 'sm:p-9' : 'sm:p-7'} ${overlay ? '' : 'flex-1'}`}>
          <span className="flex items-center justify-between gap-4">
            <span className={`tech ${overlay ? 'text-[#d7dcdf]' : 'text-muted'}`}>
              {s.index} / {s.category}
            </span>
            <span
              aria-hidden
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-300 group-hover:rotate-45 ${
                overlay
                  ? 'border-[rgb(245_245_240/0.35)] group-hover:border-[#F1B544] group-hover:bg-[#F1B544] group-hover:text-[#101214]'
                  : 'border-line-strong group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent'
              }`}
            >
              <ArrowUpRight size={18} />
            </span>
          </span>
          <span
            className={`display block font-bold uppercase ${
              variant === 'feature' ? 'text-[clamp(2.6rem,5vw,4.5rem)]' : 'text-[2rem] sm:text-[2.25rem]'
            }`}
          >
            {s.name}
          </span>
          <span className={`block max-w-md text-[0.9375rem] ${overlay ? 'text-[#d7dcdf]' : 'text-muted'}`}>{s.short}</span>
          <span className="mt-auto pt-3">
            <CheckTicks n={s.checks.length} light={overlay} />
          </span>
        </span>
      </button>
    </RevealItem>
  )
}

function ServiceDetail({ s }: { s: Service }) {
  const { requestBooking } = useApp()
  const reduce = useReducedMotion()
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 10 },
    show: { opacity: 1, y: 0 },
  }
  return (
    <article>
      <div className="relative aspect-[16/9] overflow-hidden bg-bg">
        {s.image ? (
          <Img image={s.image} sizes="36rem" maxWidth={1080} />
        ) : (
          <span className="grid h-full place-items-center p-8">
            <ACGraphic className="h-full w-full max-w-md" />
          </span>
        )}
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(transparent,var(--surface))]" />
      </div>
      <motion.div
        className="flex flex-col gap-8 px-6 pt-2 pb-8 sm:px-8"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.06, delayChildren: 0.15 }}
      >
        <motion.header variants={item}>
          <p className="tech text-accent-ink">
            {s.index} / {s.category}
          </p>
          <h3 id="service-title" className="display mt-2 text-5xl font-bold uppercase">
            {s.name}
          </h3>
          <p className="mt-4 text-muted">{s.description}</p>
        </motion.header>

        <motion.section variants={item} aria-labelledby="checks-title">
          <h4 id="checks-title" className="tech mb-3 text-muted">
            O que será avaliado
          </h4>
          <ul className="divide-y divide-line border-y border-line">
            {s.checks.map((c, i) => (
              <li key={c} className="flex gap-4 py-3">
                <span className="tech pt-0.5 text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section variants={item} aria-labelledby="benefits-title">
          <h4 id="benefits-title" className="tech mb-3 text-muted">
            Benefícios
          </h4>
          <ul className="flex flex-col gap-2.5">
            {s.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <Check size={18} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.div variants={item} className="flex flex-col gap-3 border-t border-line pt-6">
          <Button size="lg" onClick={() => requestBooking(s.id)} icon={<CalendarCheck size={18} />}>
            Solicitar atendimento
          </Button>
          <p className="text-center text-sm text-muted">O serviço já vem selecionado no formulário de agendamento.</p>
        </motion.div>

        {s.image && (
          <p className="tech text-muted">
            Foto:{' '}
            <a href={s.image.creditUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-fg">
              {s.image.credit} / Unsplash
            </a>
          </p>
        )}
      </motion.div>
    </article>
  )
}

export function Services() {
  const { openService, setOpenService } = useApp()
  const current = services.find((s) => s.id === openService)
  const close = useCallback(() => setOpenService(null), [setOpenService])

  return (
    <section id="servicos" aria-labelledby="servicos-title" className="relative border-t border-line bg-surface/40 py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <SectionHeader
          id="servicos"
          code="Serviços"
          label="Catálogo técnico"
          title={['Serviços de', 'precisão.']}
          intro={
            <p className="text-lg leading-relaxed">
              Seis frentes de atendimento, cada uma com um roteiro de verificação próprio. Abra um serviço para ver o que é avaliado
              e solicite o atendimento direto dele.
            </p>
          }
        />

        <Stagger as="ul" gap={0.07} className="mt-14 grid auto-rows-auto gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-12 lg:gap-5">
          {services.map((s) => (
            <ServiceCard key={s.id} s={s} onOpen={(x) => setOpenService(x.id)} />
          ))}
        </Stagger>
      </div>

      <Drawer open={!!current} onClose={close} labelledBy="service-title">
        {current && <ServiceDetail s={current} />}
      </Drawer>
    </section>
  )
}
