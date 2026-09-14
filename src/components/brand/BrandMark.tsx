import { cn } from '@/lib/cn'

/* ------------------------------------------------------------------
   BrandMark — the emblem from the supplied logo (cropped, unaltered),
   for compact contexts such as the collapsed sidebar rail.
------------------------------------------------------------------- */

interface BrandMarkProps {
  size?: number
  className?: string
}

export function BrandMark({ size = 40, className }: BrandMarkProps) {
  return (
    <img
      src="/assets/logo/thirukochi-emblem-512.png"
      alt="Thirukochi Gold & Diamonds emblem"
      width={size}
      height={size}
      decoding="async"
      draggable={false}
      className={cn('select-none object-contain', className)}
      style={{ width: size, height: size }}
    />
  )
}
