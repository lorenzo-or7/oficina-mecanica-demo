import { site } from '../../config/site'
import { navLinks } from '../../content/misc'
import { services } from '../../content/services'
import { useApp } from '../../context/AppContext'
import { scrollToSection } from '../../lib/scroll'
import { Logo } from '../ui/Logo'

export function Footer() {
  const { setOpenService, requestBooking } = useApp()
  const photoCredits = [
    site.images.hero,
    site.images.workshop,
    site.images.tools,
    site.images.contact,
    ...services.flatMap((s) => (s.image ? [s.image] : [])),
  ]

  return (
    <footer className="border-t border-line bg-bg pt-16 pb-8">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="flex flex-col gap-4 md:col-span-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted">
              Marca fictícia criada para demonstrar um site profissional de oficina mecânica.
            </p>
          </div>

          <nav aria-label="Rodapé" className="md:col-span-2">
            <h2 className="tech mb-4 text-muted">Navegação</h2>
            <ul className="flex flex-col gap-1">
              {[...navLinks, { id: 'agendar', label: 'Agendar' }].map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(l.id)
                    }}
                    className="inline-flex min-h-9 items-center text-sm hover:text-accent-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="tech mb-4 text-muted">Serviços</h2>
            <ul className="flex flex-col gap-1">
              {services.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setOpenService(s.id)}
                    className="inline-flex min-h-9 items-center text-left text-sm hover:text-accent-ink"
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="tech mb-4 text-muted">Contato demonstrativo</h2>
            <ul className="flex flex-col gap-2 text-sm">
              <li>{site.contact.phoneDisplay}</li>
              <li>{site.contact.email}</li>
              <li className="text-muted">{site.contact.addressLines.join(', ')}</li>
              <li>
                <button type="button" onClick={() => requestBooking()} className="inline-flex min-h-9 items-center font-semibold text-accent-ink hover:underline">
                  {site.cta.primary}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 rounded-[8px] border border-dashed border-line-strong p-4 text-sm text-muted">
          <strong className="text-fg">Aviso de protótipo.</strong> TORQ Automotive Service é uma empresa fictícia. Endereço, telefone,
          horários e depoimentos são exemplos. Nenhum dado é coletado ou enviado por este site.
        </div>

        <p className="mt-6 text-xs leading-relaxed text-muted">
          Fotografias via Unsplash:{' '}
          {photoCredits.map((p, i) => (
            <span key={p.unsplashId}>
              <a href={p.creditUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-fg hover:underline">
                {p.credit}
              </a>
              {i < photoCredits.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </p>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="tech text-muted">© {new Date().getFullYear()} TORQ (marca demonstrativa)</p>
          <a
            href={site.signatureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tech inline-flex min-h-9 items-center gap-2 text-muted transition-colors hover:text-fg"
          >
            {site.or7Watermark && <img src={site.or7Watermark} alt="" className="h-4 w-auto opacity-80" />}
            {site.signature}
          </a>
        </div>
      </div>
    </footer>
  )
}
