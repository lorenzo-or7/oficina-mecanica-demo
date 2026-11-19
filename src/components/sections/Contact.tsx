import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { CalendarCheck, Clock, MapPin, MessageCircle } from 'lucide-react'
import { useRef } from 'react'
import { hasWhatsApp, site } from '../../config/site'
import { useApp } from '../../context/AppContext'
import { whatsappUrl } from '../../lib/booking'
import { Button, ButtonLink } from '../ui/Button'
import { Img } from '../ui/Img'
import { MaskLines } from '../ui/Reveal'

export function Contact() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { requestBooking } = useApp()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-12%', '8%'])
  const scale = useTransform(scrollYProgress, [0, 0.5], [reduce ? 1 : 1.15, 1.02])

  return (
    <section ref={ref} id="contato" aria-labelledby="contato-title" className="relative isolate overflow-hidden bg-[#101214] text-[#F5F5F0]">
      <motion.div aria-hidden className="absolute inset-0 -z-10 h-[125%] -top-[12%]" style={{ y, scale }}>
        <Img image={site.images.contact} sizes="100vw" className="!opacity-60" />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(16_18_20/0.95)_0%,rgb(16_18_20/0.75)_50%,rgb(16_18_20/0.35)_100%),linear-gradient(0deg,rgb(16_18_20/0.9),transparent_45%)]"
      />

      <div className="shell flex min-h-[min(100svh,58rem)] flex-col justify-between gap-16 py-24 sm:py-32">
        <div className="max-w-4xl">
          <p className="tech mb-6 flex items-center gap-3 text-[#c8ced2]">
            <span className="text-[#F1B544]">Contato</span>
            <span aria-hidden className="h-px w-10 bg-[#4a545a]" />
            Pronto para a estrada
          </p>
          <h2 id="contato-title" data-section-focus tabIndex={-1} className="display text-[clamp(3.25rem,9vw,8.5rem)] font-bold uppercase">
            <MaskLines lines={['Seu próximo', 'quilômetro', 'começa aqui.']} inView />
          </h2>
          <div className="mt-10 flex flex-col gap-3 xs:flex-row">
            <Button size="lg" magnetic onClick={() => requestBooking()} icon={<CalendarCheck size={18} />} className="!bg-[#F1B544] !text-[#101214]">
              Solicitar avaliação
            </Button>
            {hasWhatsApp() ? (
              <ButtonLink
                size="lg"
                variant="secondary"
                href={whatsappUrl(site.contact.whatsapp, 'Olá! Gostaria de falar com a oficina.')}
                target="_blank"
                rel="noopener noreferrer"
                icon={<MessageCircle size={18} />}
                className="!border-[rgb(245_245_240/0.4)] !text-[#F5F5F0]"
              >
                {site.cta.whatsapp}
              </ButtonLink>
            ) : (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => requestBooking()}
                icon={<MessageCircle size={18} />}
                className="!border-[rgb(245_245_240/0.4)] !text-[#F5F5F0] hover:!bg-[rgb(245_245_240/0.08)]"
                aria-describedby="wa-demo-note"
              >
                {site.cta.whatsapp}
              </Button>
            )}
          </div>
          {!hasWhatsApp() && (
            <p id="wa-demo-note" className="mt-3 max-w-md text-sm text-[#c8ced2]">
              Demonstração sem número configurado: o botão leva ao formulário, que gera a mensagem pronta para o WhatsApp.
            </p>
          )}
        </div>

        <div className="grid gap-px overflow-hidden rounded-[10px] border border-[#353D42] bg-[#353D42] md:grid-cols-3">
          <div className="flex flex-col gap-3 bg-[rgb(26_30_33/0.88)] p-6 backdrop-blur-sm">
            <p className="tech flex items-center gap-2 text-[#c8ced2]">
              <MapPin size={15} aria-hidden /> Localização
            </p>
            <address className="not-italic">
              {site.contact.addressLines.map((l) => (
                <span key={l} className="block font-semibold">
                  {l}
                </span>
              ))}
            </address>
            <p className="tech rounded-[3px] border border-dashed border-[#4a545a] px-2 py-1.5 text-[#c8ced2]">{site.contact.addressNote}</p>
          </div>
          <div className="flex flex-col gap-3 bg-[rgb(26_30_33/0.88)] p-6 backdrop-blur-sm">
            <p className="tech flex items-center gap-2 text-[#c8ced2]">
              <Clock size={15} aria-hidden /> Horários
            </p>
            <dl className="grid gap-1.5">
              {site.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 text-[0.9375rem]">
                  <dt className="text-[#c8ced2]">{h.days}</dt>
                  <dd className="font-mono font-medium">{h.time}</dd>
                </div>
              ))}
            </dl>
            <p className="tech text-[#c8ced2]">{site.hoursNote}</p>
          </div>
          <div className="flex flex-col gap-3 bg-[rgb(26_30_33/0.88)] p-6 backdrop-blur-sm">
            <p className="tech flex items-center gap-2 text-[#c8ced2]">
              <MessageCircle size={15} aria-hidden /> Canais
            </p>
            <p className="font-semibold">{site.contact.phoneDisplay}</p>
            <p className="font-semibold">{site.contact.email}</p>
            <p className="tech text-[#c8ced2]">Contatos demonstrativos.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
