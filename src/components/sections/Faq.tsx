import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { faq } from '../../content/misc'
import { SectionHeader } from '../ui/SectionHeader'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const reduce = useReducedMotion()
  const uid = useId()

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative border-t border-line py-24 sm:py-32">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeader
              id="faq"
              code="Dúvidas"
              label="Perguntas frequentes"
              title={['Antes de', 'agendar.']}
              align="stack"
              intro={<p>Respostas gerais. Prazos, valores e condições são combinados diretamente com a oficina.</p>}
            />
          </div>
        </div>

        <ul className="border-t border-line lg:col-span-7">
          {faq.map((item, i) => {
            const isOpen = open === i
            const bid = `${uid}-b${i}`
            const pid = `${uid}-p${i}`
            return (
              <li key={item.q} className="border-b border-line">
                <h3>
                  <button
                    id={bid}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={pid}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold sm:text-xl"
                  >
                    <span className="transition-colors group-hover:text-accent-ink">{item.q}</span>
                    <span
                      aria-hidden
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                        isOpen ? 'rotate-45 border-accent bg-accent text-on-accent' : 'border-line-strong text-muted group-hover:border-fg'
                      }`}
                    >
                      <Plus size={18} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={pid}
                      role="region"
                      aria-labelledby={bid}
                      initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[62ch] pr-14 pb-6 text-muted">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
