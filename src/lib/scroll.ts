export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Rola até a seção e move o foco para ela, para leitores de tela e teclado. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  const focusTarget = el.querySelector<HTMLElement>('[data-section-focus]') ?? el
  if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1')
  focusTarget.focus({ preventScroll: true })
  history.replaceState(null, '', `#${id}`)
}
