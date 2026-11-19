import type { ReactNode } from 'react'
import { MaskLines } from './Reveal'

/**
 * Cabeçalho de seção: código de seção técnico à esquerda (mono, caixa normal)
 * e título industrial revelado por máscara.
 */
export function SectionHeader({
  id,
  code,
  label,
  title,
  intro,
  align = 'split',
}: {
  id: string
  code: string
  label: string
  title: string[]
  intro?: ReactNode
  align?: 'split' | 'stack'
}) {
  return (
    <header
      className={
        align === 'split'
          ? 'grid gap-6 md:grid-cols-12 md:items-end md:gap-8'
          : 'flex max-w-3xl flex-col gap-5'
      }
    >
      <div className={align === 'split' ? 'md:col-span-7 lg:col-span-7' : ''}>
        <p className="tech mb-5 flex items-center gap-3 text-muted">
          <span className="text-accent-ink">{code}</span>
          <span aria-hidden className="ruler w-10" />
          <span>{label}</span>
        </p>
        <h2 id={`${id}-title`} data-section-focus tabIndex={-1} className="display text-[clamp(2.75rem,7vw,5.75rem)] uppercase">
          <MaskLines lines={title} inView />
        </h2>
      </div>
      {intro && (
        <div className={align === 'split' ? 'max-w-md text-muted md:col-span-5 md:justify-self-end md:pb-2' : 'max-w-xl text-muted'}>
          {intro}
        </div>
      )}
    </header>
  )
}
