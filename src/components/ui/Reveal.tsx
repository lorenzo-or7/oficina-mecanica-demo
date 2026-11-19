import { motion, useReducedMotion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

/** Entrada escalonada: o contêiner orquestra, os filhos `RevealItem` entram em sequência. */
export function Stagger({
  children,
  className = '',
  delay = 0,
  gap = 0.08,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  gap?: number
  as?: 'div' | 'ul' | 'ol'
}) {
  const reduce = useReducedMotion()
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : gap, delayChildren: delay } },
  }
  const Comp = motion[as]
  return (
    <Comp className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }} variants={variants}>
      {children}
    </Comp>
  )
}

export function RevealItem({
  children,
  className = '',
  as = 'div',
  y = 18,
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'p' | 'h2' | 'h3' | 'article'
  y?: number
}) {
  const reduce = useReducedMotion()
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0.01 : 0.7, ease } },
  }
  const Comp = motion[as]
  return (
    <Comp className={className} variants={variants}>
      {children}
    </Comp>
  )
}

/** Texto revelado por máscara: cada linha sobe de dentro de um recorte. */
export function MaskLines({
  lines,
  className = '',
  lineClassName = '',
  delay = 0,
  inView = false,
}: {
  lines: string[]
  className?: string
  lineClassName?: string
  delay?: number
  inView?: boolean
}) {
  const reduce = useReducedMotion()
  const trigger = inView
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.6 } }
    : { initial: 'hidden', animate: 'show' }
  return (
    <motion.span className={`block ${className}`} {...trigger} transition={{ staggerChildren: 0.09, delayChildren: delay }}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className={`block ${lineClassName}`}
            variants={{
              hidden: { y: reduce ? 0 : '105%', opacity: reduce ? 0 : 1 },
              show: { y: 0, opacity: 1, transition: { duration: reduce ? 0.01 : 0.9, ease } },
            }}
          >
            {l}
          </motion.span>
          {/* espaço para leitores de tela entre as linhas */}
          {i < lines.length - 1 && <span className="sr-only"> </span>}
        </span>
      ))}
    </motion.span>
  )
}
