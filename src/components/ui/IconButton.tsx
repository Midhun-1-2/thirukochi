import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { springSnappy } from '@/lib/motion'

/* ------------------------------------------------------------------
   IconButton — circular 44px control. `label` is required and
   rendered as aria-label so icon-only buttons stay accessible.
------------------------------------------------------------------- */

type Tone = 'ghost' | 'outline' | 'gold' | 'surface'
type Size = 'sm' | 'md' | 'lg'

interface IconButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'children'
  > {
  label: string
  tone?: Tone
  size?: Size
  children: ReactNode
  /** Show a small gold notification dot. */
  dot?: boolean
}

const tones: Record<Tone, string> = {
  ghost: 'text-gold-muted hover:text-gold-bright hover:bg-[rgba(249,223,50,0.08)]',
  outline:
    'text-gold-pale border border-[rgba(249,223,50,0.28)] hover:border-gold-bright/70 hover:text-gold-bright bg-[rgba(38,0,0,0.35)]',
  gold: 'gold-bg text-maroon-dark shadow-[0_8px_24px_rgba(249,223,50,0.22)]',
  surface: 'surface text-gold-pale hover:text-gold-bright',
}

const sizes: Record<Size, string> = {
  sm: 'size-10 [&>svg]:size-[17px]',
  md: 'size-11 [&>svg]:size-[19px]',
  lg: 'size-12 [&>svg]:size-[21px]',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, tone = 'ghost', size = 'md', className, children, dot, type, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type ?? 'button'}
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      transition={springSnappy}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-200',
        tones[tone],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
      {dot && (
        <span
          aria-hidden
          className="absolute right-[9px] top-[9px] size-2 rounded-full bg-gold-bright shadow-[0_0_0_2px_#260000,0_0_8px_rgba(249,223,50,0.9)]"
        />
      )}
    </motion.button>
  )
})
