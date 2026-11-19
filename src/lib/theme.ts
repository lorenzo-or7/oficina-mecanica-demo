import { useCallback, useEffect, useState } from 'react'
import { prefersReducedMotion } from './scroll'

export type Theme = 'dark' | 'light'
const KEY = 'torq-theme'

function current(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => (typeof document === 'undefined' ? 'dark' : current()))

  useEffect(() => {
    const meta = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    meta.forEach((m) => (m.content = theme === 'dark' ? '#101214' : '#F5F4F0'))
  }, [theme])

  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const next: Theme = current() === 'dark' ? 'light' : 'dark'
    const apply = () => {
      document.documentElement.setAttribute('data-theme', next)
      setThemeState(next)
      try {
        localStorage.setItem(KEY, next)
      } catch {
        /* armazenamento indisponível: tema vale só para esta visita */
      }
    }

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> }
    }
    if (!doc.startViewTransition || prefersReducedMotion()) {
      apply()
      return
    }
    const x = origin?.x ?? window.innerWidth - 80
    const y = origin?.y ?? 40
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const t = doc.startViewTransition(apply)
    t.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 620, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
      .catch(() => {})
  }, [])

  return { theme, toggle }
}
