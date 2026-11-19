import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'

/**
 * Painel modal acessível: lateral no desktop, folha inferior no mobile.
 * Foco preso, Esc fecha, foco devolvido ao gatilho, fundo inerte.
 */
export function Drawer({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  children: ReactNode
}) {
  const panel = useRef<HTMLDivElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    returnTo.current = document.activeElement as HTMLElement
    const root = document.getElementById('root')
    root?.setAttribute('inert', '')
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus())

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
      if (e.key === 'Tab' && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE))
        if (!f.length) return
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
    return () => {
      document.removeEventListener('keydown', onKey)
      root?.removeAttribute('inert')
      document.body.style.overflow = prev
      const target = returnTo.current
      // devolve o foco ao gatilho se ele ainda estiver na página
      requestAnimationFrame(() => {
        if (target && document.contains(target) && !document.activeElement?.closest('#agendar')) target.focus({ preventScroll: true })
      })
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            className="absolute inset-0 bg-[rgb(var(--scrim)/0.6)] backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className="absolute inset-x-0 bottom-0 flex max-h-[92svh] flex-col overflow-hidden rounded-t-[14px] border border-line bg-surface shadow-2xl md:inset-y-3 md:right-3 md:left-auto md:max-h-none md:w-[min(36rem,calc(100vw-1.5rem))] md:rounded-[12px]"
            initial={reduce ? { opacity: 0 } : { y: '100%', x: 0 }}
            animate={reduce ? { opacity: 1 } : { y: 0, x: 0 }}
            exit={reduce ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            style={{ willChange: 'transform' }}
          >
            <button
              type="button"
              onClick={onClose}
              data-autofocus
              aria-label="Fechar detalhes"
              className="absolute top-3 right-3 z-10 grid h-11 w-11 place-items-center rounded-[6px] bg-[rgb(16_18_20/0.55)] text-[#F5F5F0] backdrop-blur transition-colors hover:bg-[rgb(16_18_20/0.8)]"
            >
              <X size={20} />
            </button>
            <div className="overflow-y-auto overscroll-contain">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
