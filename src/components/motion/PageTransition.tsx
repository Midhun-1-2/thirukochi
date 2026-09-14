import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { pageVariants } from '@/lib/motion'

/** Shared route transition: opacity 0→1, y 20→0, 0.45s. */
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className={cn('w-full', className)}>
      {children}
    </motion.div>
  )
}
