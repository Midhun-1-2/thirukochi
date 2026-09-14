import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useEntrance } from '@/lib/entrance'
import { staggerContainer, staggerItem } from '@/lib/motion'

/* ------------------------------------------------------------------
   StaggerContainer / StaggerItem — staggered reveal for a group of
   blocks. When the page is not playing its entrance (every in-app
   navigation after the first) they render as plain elements: nothing
   to animate, and no motion instances to mount on a slow device.
------------------------------------------------------------------- */

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  inView?: boolean
  as?: 'div' | 'ul' | 'ol' | 'section'
}

export function StaggerContainer({ children, className, stagger = 0.08, delay = 0, inView, as = 'div' }: StaggerContainerProps) {
  const entrance = useEntrance()
  if (!entrance) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }
  const Tag = motion[as]
  return (
    <Tag
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      {...(inView ? { whileInView: 'show', viewport: { once: true, margin: '-40px' } } : { animate: 'show' })}
      className={className}
    >
      {children}
    </Tag>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'section'
  id?: string
  'aria-labelledby'?: string
}

export function StaggerItem({ children, className, as = 'div', ...rest }: StaggerItemProps) {
  const entrance = useEntrance()
  if (!entrance) {
    const Tag = as
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }
  const Tag = motion[as]
  return (
    <Tag variants={staggerItem} className={className} {...rest}>
      {children}
    </Tag>
  )
}
