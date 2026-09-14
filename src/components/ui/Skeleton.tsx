import { cn } from '@/lib/cn'

/** Gold shimmer placeholder block. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('skeleton-gold', className)} />
}
