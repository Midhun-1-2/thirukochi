import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SectionHeadingProps {
  title: string
  eyebrow?: string
  action?: { label: string; to: string }
  children?: ReactNode
  className?: string
  as?: 'h2' | 'h3'
}

export function SectionHeading({ title, eyebrow, action, children, className, as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-gold-muted">{eyebrow}</p>}
        <Tag className="font-display text-[20px] font-medium leading-tight text-cream sm:text-[22px]">{title}</Tag>
      </div>
      {action && (
        <Link
          to={action.to}
          className="group inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium text-gold-muted transition-colors hover:text-gold-bright"
        >
          {action.label}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
      {children}
    </div>
  )
}
