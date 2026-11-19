import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { forwardRef, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

type Common = {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  magnetic?: boolean
  className?: string
  children: ReactNode
}

const base =
  'group relative inline-flex select-none items-center justify-center gap-2.5 rounded-[6px] font-semibold tracking-[0.005em] whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-200 disabled:opacity-45 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:brightness-[1.06] active:brightness-95',
  secondary:
    'border border-line-strong text-fg bg-transparent hover:border-fg hover:bg-[color-mix(in_oklab,var(--fg)_6%,transparent)]',
  ghost: 'text-fg hover:bg-[color-mix(in_oklab,var(--fg)_8%,transparent)]',
}

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-4 text-[0.9375rem]',
  lg: 'min-h-13 px-6 text-base',
}

export const btnClass = (variant: Variant = 'primary', size: Size = 'md', extra = '') =>
  `${base} ${variants[variant]} ${sizes[size]} ${extra}`

/** Feedback magnético discreto (máx. ~6px), só com ponteiro fino e sem movimento reduzido. */
function useMagnetic(enabled: boolean) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })
  const active = enabled && !reduce
  const fine = useRef(typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches)

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!active || !fine.current) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set(((e.clientX - r.left) / r.width - 0.5) * 10)
    y.set(((e.clientY - r.top) / r.height - 0.5) * 8)
  }
  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }
  return { style: active ? { x: sx, y: sy } : undefined, onPointerMove, onPointerLeave }
}

const press = { scale: 0.965 }
const spring = { type: 'spring' as const, stiffness: 500, damping: 26 }

type ButtonProps = Common & Omit<ComponentPropsWithoutRef<typeof motion.button>, 'children'>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', icon, magnetic = false, className = '', children, ...rest },
  ref,
) {
  const m = useMagnetic(magnetic)
  return (
    <motion.button
      ref={ref}
      type="button"
      whileTap={press}
      transition={spring}
      className={btnClass(variant, size, className)}
      style={m.style}
      onPointerMove={m.onPointerMove}
      onPointerLeave={m.onPointerLeave}
      {...rest}
    >
      <span>{children}</span>
      {icon && (
        <span aria-hidden className="transition-transform duration-300 ease-(--ease-mech) group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </motion.button>
  )
})

type LinkProps = Common & Omit<ComponentPropsWithoutRef<typeof motion.a>, 'children'>

export function ButtonLink({ variant = 'primary', size = 'md', icon, magnetic = false, className = '', children, ...rest }: LinkProps) {
  const m = useMagnetic(magnetic)
  return (
    <motion.a
      whileTap={press}
      transition={spring}
      className={btnClass(variant, size, className)}
      style={m.style}
      onPointerMove={m.onPointerMove}
      onPointerLeave={m.onPointerLeave}
      {...rest}
    >
      <span>{children}</span>
      {icon && (
        <span aria-hidden className="transition-transform duration-300 ease-(--ease-mech) group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </motion.a>
  )
}
