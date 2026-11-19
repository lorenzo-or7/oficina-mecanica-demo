import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ClipboardList, Eye, MessagesSquare, Wrench } from 'lucide-react'
import { useRef } from 'react'
import { site } from '../../config/site'
import { Img } from '../ui/Img'
import { RevealItem, Stagger } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

const pillars = [
  {
    icon: MessagesSquare,
    title: 'Atendimento transparente',
    text: 'Você entende o que está sendo avaliado, por que e quanto custa antes de decidir.',
  },
  {
    icon: Eye,
    title: 'Diagnóstico cuidadoso',
    text: 'Leitura eletrônica e inspeção física caminham juntas antes de qualquer proposta.',
  },
  {
    icon: ClipboardList,
    title: 'Organização profissional',
    text: 'Cada veículo segue um checklist, com registro do que foi verificado.',
  },
  {
    icon: Wrench,
    title: 'Atenção aos detalhes',
    text: 'Torque correto, peças conferidas e o carro devolvido como deve ser.',
  },
]

export function Workshop() {
  const imgRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start end', 'center center'] })
  // revelação ligada ao scroll: a moldura abre das laterais para o centro
  const clip = useTransform(scrollYProgress, [0, 1], reduce ? ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] : ['inset(12% 14% 12% 14%)', 'inset(0% 0% 0% 0%)'])
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 1.18, 1])
  const { scrollYProgress: p2 } = useScroll({ target: imgRef, offset: ['start end', 'end start'] })
  const toolsY = useTransform(p2, [0, 1], reduce ? ['0%', '0%'] : ['18%', '-18%'])

  return (
    <section id="oficina" aria-labelledby="oficina-title" className="relative py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <SectionHeader
          id="oficina"
          code="A oficina"
          label="Proposta de valor"
          title={['Muito além', 'da manutenção.']}
          intro={
            <p className="text-lg leading-relaxed">
              Uma oficina organizada para que você saiba o que acontece com o seu carro em cada etapa: da chegada à entrega, sem
              termos técnicos jogados no ar.
            </p>
          }
        />

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          <div ref={imgRef} className="relative lg:col-span-8">
            <motion.div
              style={{ clipPath: clip }}
              className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-surface sm:aspect-[16/10]"
            >
              <motion.div style={{ scale }} className="absolute inset-0">
                <Img image={site.images.workshop} sizes="(min-width: 1024px) 60vw, 100vw" />
              </motion.div>
            </motion.div>
            <p className="tech mt-3 text-muted">
              Ambiente de oficina ilustrativo. Foto: {site.images.workshop.credit} / Unsplash
            </p>
          </div>

          <div className="flex flex-col justify-between gap-10 lg:col-span-4">
            <div className="max-w-md">
              <p className="font-display text-3xl leading-[1.05] font-semibold uppercase sm:text-4xl">
                Cada carro chega com uma história. A gente começa ouvindo.
              </p>
              <p className="mt-5 text-muted">
                Antes da chave de roda, vem a conversa: o que você percebeu, quando começou, em que situação aparece. Esse relato,
                somado à avaliação técnica, define o que precisa ser feito e o que pode esperar.
              </p>
            </div>
            <div className="relative hidden aspect-[4/5] w-3/4 self-end overflow-hidden rounded-[10px] bg-surface lg:block">
              <motion.div style={{ y: toolsY }} className="absolute inset-0 -top-[15%] h-[130%]">
                <Img image={site.images.tools} sizes="22vw" maxWidth={768} />
              </motion.div>
            </div>
          </div>
        </div>

        <Stagger as="ul" className="mt-16 grid gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {pillars.map((p) => (
            <RevealItem as="li" key={p.title} className="flex flex-col gap-4 bg-bg p-6 sm:p-7">
              <p.icon size={22} strokeWidth={1.6} className="text-accent-ink" aria-hidden />
              <h3 className="font-display text-2xl font-semibold uppercase">{p.title}</h3>
              <p className="text-[0.9375rem] text-muted">{p.text}</p>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
