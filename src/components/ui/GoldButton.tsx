import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { springSnappy } from '@/lib/motion'

/* ------------------------------------------------------------------
   GoldButton — the primary call-to-action.
   Metallic gold gradient, maroon type, highlight sweep on hover,
   press scale, and a branded loading state (no spinner).
------------------------------------------------------------------- */

type Variant = 'primary' | 'secondary' | 'ghost' | 'subtle'
type Size = 'sm' | 'md' | 'lg'

interface BaseProps {
  variant?: Variant
  size?: Size
  loading?: boolean
  loadingText?: string
  icon?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
  className?: string
  children?: ReactNode
}

export type GoldButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps | 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> & {
    /** Render as a router link. */
    to?: string
  }

const sizeClasses: Record<Size, string> = {
  sm: 'h-11 px-4 text-[13px] gap-2 rounded-[12px]',
  md: 'h-12 px-6 text-[14px] gap-2.5 rounded-[14px]',
  lg: 'h-[54px] px-7 text-[15px] gap-3 rounded-[16px]',
}

const variantClasses: Record<Variant, string> = {
  primary: cn(
    'gold-bg-button text-maroon-dark font-semibold',
    'shadow-[0_10px_30px_rgba(249,223,50,0.18),inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(120,80,0,0.35)]',
    'hover:shadow-[0_14px_40px_rgba(249,223,50,0.28),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(120,80,0,0.35)]',
    'disabled:opacity-60 disabled:shadow-none',
  ),
  secondary: cn(
    'gold-edge bg-[rgba(84,0,0,0.35)] text-gold-pale font-medium',
    'hover:bg-[rgba(110,10,10,0.5)] hover:text-gold-bright',
    'disabled:opacity-55',
  ),
  ghost: 'text-gold-muted font-medium hover:text-gold-bright hover:bg-[rgba(249,223,50,0.06)] disabled:opacity-50',
  subtle: 'bg-[rgba(249,223,50,0.08)] text-gold-pale font-medium hover:bg-[rgba(249,223,50,0.14)] disabled:opacity-50',
}

const MotionLink = motion.create(Link)

export const GoldButton = forwardRef<HTMLButtonElement, GoldButtonProps>(function GoldButton(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    icon,
    iconRight,
    fullWidth,
    className,
    children,
    disabled,
    to,
    type,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading

  const classes = cn(
    'group relative inline-flex select-none items-center justify-center overflow-clip whitespace-nowrap',
    'font-body tracking-[0.01em] transition-[box-shadow,background-color,color] duration-300',
    'disabled:cursor-not-allowed',
    sizeClasses[size],
    variantClasses[variant],
    fullWidth && 'w-full',
    className,
  )

  const content = (
    <>
      {/* highlight sweep */}
      {variant === 'primary' && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-[-18deg]',
            'bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.55)_50%,transparent_100%)]',
            'transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
            'group-hover:translate-x-[120%] group-focus-visible:translate-x-[120%]',
            loading && 'animate-shimmer',
          )}
        />
      )}

      <span className={cn('relative inline-flex items-center', sizeClasses[size].includes('gap-3') ? 'gap-3' : 'gap-2.5')}>
        {loading ? (
          <>
            <LoadingBars dark={variant === 'primary'} />
            <span>{loadingText ?? children}</span>
          </>
        ) : (
          <>
            {icon && <span className="inline-flex shrink-0 [&>svg]:size-[18px]">{icon}</span>}
            {children && <span>{children}</span>}
            {iconRight && (
              <span className="inline-flex shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 [&>svg]:size-[18px]">
                {iconRight}
              </span>
            )}
          </>
        )}
      </span>
    </>
  )

  const motionProps: HTMLMotionProps<'button'> = {
    whileHover: isDisabled ? undefined : { scale: 1.02 },
    whileTap: isDisabled ? undefined : { scale: 0.97 },
    transition: springSnappy,
  }

  if (to && !isDisabled) {
    return (
      <MotionLink to={to} className={classes} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={springSnappy}>
        {content}
      </MotionLink>
    )
  }

  return (
    <motion.button
      ref={ref}
      type={type ?? 'button'}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...motionProps}
      {...rest}
    >
      {content}
    </motion.button>
  )
})

/** Three gold bars rising & falling — a subtle alternative to a spinner. */
function LoadingBars({ dark }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-end gap-[3px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={cn('block w-[3px] rounded-full', dark ? 'bg-maroon-dark/80' : 'bg-gold-bright')}
          animate={{ height: ['6px', '14px', '6px'] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
        />
      ))}
    </span>
  )
}
