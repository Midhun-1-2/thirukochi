import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'gold' | 'maroon' | 'live' | 'outline' | 'muted'

interface GoldBadgeProps {
  tone?: Tone
  children: ReactNode
  className?: string
  icon?: ReactNode
}

const tones: Record<Tone, string> = {
  gold: 'gold-bg text-maroon-dark font-semibold',
  maroon: 'bg-maroon text-gold-pale border border-[rgba(249,223,50,0.18)]',
  live: 'bg-[rgba(249,223,50,0.1)] text-gold-bright border border-[rgba(249,223,50,0.32)] font-semibold',
  outline: 'border border-[rgba(249,223,50,0.32)] text-gold-pale',
  muted: 'bg-[rgba(248,248,248,0.06)] text-cream-muted',
}

export function GoldBadge({ tone = 'gold', children, className, icon }: GoldBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[11px] uppercase tracking-[0.14em]',
        tones[tone],
        className,
      )}
    >
      {tone === 'live' && <LiveDot />}
      {icon}
      {children}
    </span>
  )
}

/** Glowing gold LIVE indicator. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn('relative inline-flex size-2', className)} aria-hidden>
      <span className="absolute inset-0 rounded-full bg-gold-bright animate-live-pulse will-change-transform" />
      <span className="relative size-2 rounded-full bg-gold-bright shadow-[0_0_8px_rgba(249,223,50,0.9)]" />
    </span>
  )
}
