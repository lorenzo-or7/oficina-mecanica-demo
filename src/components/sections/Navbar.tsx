import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { CalendarCheck, Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { site } from '../../config/site'
import { navLinks } from '../../content/misc'
import { useApp } from '../../context/AppContext'
import { scrollToSection } from '../../lib/scroll'
import { useTheme } from '../../lib/theme'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

// observa todas as seções; só as do menu acendem o indicador
const ids = ['topo', 'oficina', 'servicos', 'diagnostico', 'processo', 'detalhes', 'confianca', 'agendar', 'faq', 'contato']

export function Navbar() {
  const { scrollY } = useScroll()
  const [compact, setCompact] = useState(false)
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const { requestBooking } = useApp()
  const active = useActiveSection(ids)
  const reduce = useReducedMotion()
  const menuBtn = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useMotionValueEvent(scrollY, 'change', (v) => setCompact(v > 40))

  // menu mobile: Esc fecha, foco preso dentro, scroll do body travado
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuBtn.current?.focus()
      }
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a,button')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>('a')?.focus())
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 64rem)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    requestAnimationFrame(() => scrollToSection(id))
  }

  const onTheme = (e: React.MouseEvent) => toggle({ x: e.clientX, y: e.clientY })

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-3 focus:text-on-accent"
      >
        Pular para o conteúdo
      </a>
      <motion.header
        initial={reduce ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          aria-label="Principal"
          className={`pointer-events-auto relative flex w-full items-center justify-between gap-3 rounded-[10px] border transition-[max-width,padding,background-color,border-color,box-shadow] duration-500 ease-(--ease-mech) ${
            compact
              ? 'max-w-[68rem] border-line bg-[color-mix(in_oklab,var(--surface)_82%,transparent)] py-1.5 pr-1.5 pl-3.5 shadow-[0_12px_40px_-18px_rgb(0_0_0/0.55)] backdrop-blur-md'
              : 'max-w-[88rem] border-transparent bg-[color-mix(in_oklab,var(--bg)_35%,transparent)] py-2.5 pr-2.5 pl-4 backdrop-blur-[2px]'
          }`}
        >
          {/* marcas técnicas nos cantos: aparecem quando a barra compacta */}
          <span aria-hidden className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${compact ? 'opacity-100' : 'opacity-0'}`}>
            <span className="absolute -top-px left-6 h-px w-8 bg-accent" />
            <span className="absolute right-6 -bottom-px h-px w-8 bg-accent" />
          </span>

          <a href="#topo" onClick={go('topo')} className="flex min-h-11 items-center rounded" aria-label={`${site.brand.name} ${site.brand.descriptor}, início`}>
            <Logo compact={compact} />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => {
              const isActive = active === l.id
              return (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={go(l.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`relative flex min-h-11 items-center rounded px-3.5 text-[0.9375rem] font-medium transition-colors ${
                      isActive ? 'text-fg' : 'text-muted hover:text-fg'
                    }`}
                  >
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3.5 bottom-1.5 h-[2px] bg-accent"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onTheme}
              className="relative grid h-11 w-11 place-items-center rounded-[6px] text-muted transition-colors hover:bg-[color-mix(in_oklab,var(--fg)_8%,transparent)] hover:text-fg"
              aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={reduce ? false : { rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={reduce ? undefined : { rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
                </motion.span>
              </AnimatePresence>
            </button>
            <span className="hidden sm:block">
              <Button onClick={() => requestBooking()} magnetic icon={<CalendarCheck size={17} />}>
                {site.cta.primary}
              </Button>
            </span>
            <span className="sm:hidden">
              <Button onClick={() => requestBooking()} className="!px-3" aria-label={site.cta.primary}>
                <CalendarCheck size={18} aria-hidden />
              </Button>
            </span>
            <button
              ref={menuBtn}
              type="button"
              className="grid h-11 w-11 place-items-center rounded-[6px] text-fg hover:bg-[color-mix(in_oklab,var(--fg)_8%,transparent)] lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-bg px-4 pt-24 pb-6 lg:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div aria-hidden className="ruler mb-6 opacity-70" />
            <ul className="flex flex-col">
              {[...navLinks, { id: 'agendar', label: 'Agendar' }].map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-line"
                >
                  <a
                    href={`#${l.id}`}
                    onClick={go(l.id)}
                    className="flex min-h-16 items-baseline justify-between py-3"
                  >
                    <span className="display text-[2.6rem] uppercase">{l.label}</span>
                    <span className="tech text-muted">{String(i + 1).padStart(2, '0')}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3 pt-8">
              <Button
                size="lg"
                onClick={() => {
                  setOpen(false)
                  requestBooking()
                }}
                icon={<CalendarCheck size={18} />}
              >
                {site.cta.primary}
              </Button>
              <p className="tech text-center text-muted">Protótipo com marca fictícia</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
