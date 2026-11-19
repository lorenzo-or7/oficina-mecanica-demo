import { commitments, sampleTestimonials } from '../../content/misc'
import { RevealItem, Stagger } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export function Trust() {
  return (
    <section id="confianca" aria-labelledby="confianca-title" className="relative border-t border-line py-24 sm:py-32">
      <div className="shell">
        <SectionHeader
          id="confianca"
          code="Transparência"
          label="Nossos compromissos"
          title={['Confiança se', 'constrói por escrito.']}
          intro={
            <p className="text-lg leading-relaxed">
              Compromissos práticos do atendimento, os mesmos em qualquer serviço.
            </p>
          }
        />

        <Stagger as="ol" className="mt-14 grid border-t border-line lg:mt-20 lg:grid-cols-2">
          {commitments.map((c, i) => (
            <RevealItem
              as="li"
              key={c.title}
              className={`grid grid-cols-[3.5rem_1fr] gap-4 border-b border-line py-8 sm:grid-cols-[5rem_1fr] lg:py-10 ${
                i % 2 === 0 ? 'lg:border-r lg:pr-10' : 'lg:pl-10'
              }`}
            >
              <span aria-hidden className="display text-5xl font-bold text-accent-ink sm:text-6xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-display text-3xl font-semibold uppercase">{c.title}</h3>
                <p className="mt-2 max-w-md text-muted">{c.text}</p>
              </div>
            </RevealItem>
          ))}
        </Stagger>

        <div className="mt-20 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h3 className="font-display text-3xl font-semibold uppercase">Como um depoimento aparece aqui</h3>
            <p className="mt-3 text-muted">
              Os textos ao lado são exemplos fictícios para demonstrar o layout. Em um site real, entram apenas relatos autorizados
              de clientes, com a fonte indicada.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {sampleTestimonials.map((t) => (
              <li key={t.name}>
                <figure className="flex h-full flex-col gap-6 rounded-[10px] border border-dashed border-line-strong p-6 sm:p-7">
                  <span className="tech self-start rounded-[3px] bg-elevated px-2 py-1 text-muted">Exemplo fictício</span>
                  <blockquote className="text-lg leading-relaxed">“{t.quote}”</blockquote>
                  <figcaption className="mt-auto text-sm">
                    <span className="font-semibold">{t.name}</span>
                    <span className="text-muted">, {t.vehicle}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
