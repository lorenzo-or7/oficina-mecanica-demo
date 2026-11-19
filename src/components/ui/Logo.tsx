import { site } from '../../config/site'

/** Marca fictícia TORQ: mostrador de torque com ponteiro, em SVG. */
export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="14" fill="none" stroke="var(--accent)" strokeWidth="3" />
      <path d="M20 4v7M20 29v7M4 20h7" stroke="var(--accent)" strokeWidth="3" />
      <path d="M21 20l9-6" stroke="var(--fg)" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="20" cy="20" r="2.6" fill="var(--fg)" />
    </svg>
  )
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className={compact ? 'h-7 w-7' : 'h-8 w-8'} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.45rem] font-bold tracking-[0.08em]">{site.brand.name}</span>
        <span className="tech -mt-0.5 text-[0.625rem] text-muted">{site.brand.descriptor}</span>
      </span>
    </span>
  )
}
