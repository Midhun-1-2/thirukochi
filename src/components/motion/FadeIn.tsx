import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, scaleIn, fadeIn as fadeOnly } from '@/lib/motion'

interface FadeInProps {
  children: ReactNode
  delay?: number
  distance?: number
  mode?: 'up' | 'scale' | 'fade'
  className?: string
  /** Animate when scrolled into view instead of on mount. */
  inView?: boolean
  as?: 'div' | 'section' | 'span' | 'p' | 'li'
}

export function FadeIn({ children, delay = 0, distance = 18, mode = 'up', className, inView, as = 'div' }: FadeInProps) {
  const variants = mode === 'scale' ? scaleIn(delay) : mode === 'fade' ? fadeOnly(delay) : fadeUp(delay, distance)
  const Tag = motion[as]
  return (
    <Tag
      variants={variants}
      initial="hidden"
      {...(inView ? { whileInView: 'show', viewport: { once: true, margin: '-40px' } } : { animate: 'show' })}
      className={className}
    >
      {children}
    </Tag>
  )
}
