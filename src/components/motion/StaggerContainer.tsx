import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/motion'

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  inView?: boolean
  as?: 'div' | 'ul' | 'ol' | 'section'
}

export function StaggerContainer({ children, className, stagger = 0.08, delay = 0, inView, as = 'div' }: StaggerContainerProps) {
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

export function StaggerItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' }) {
  const Tag = motion[as]
  return (
    <Tag variants={staggerItem} className={className}>
      {children}
    </Tag>
  )
}
