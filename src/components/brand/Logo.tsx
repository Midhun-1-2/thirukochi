import { cn } from '@/lib/cn'

/* ------------------------------------------------------------------
   Logo — renders the client-supplied THIRUKOCHI GOLD & DIAMONDS
   artwork as an image asset. The artwork itself is never altered;
   only an optional soft radial light is rendered *behind* it.
------------------------------------------------------------------- */

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface LogoProps {
  size?: Size
  className?: string
  /** Soft gold light behind the logo (does not touch the artwork). */
  glow?: boolean
  priority?: boolean
}

/** Intrinsic aspect ratio of the supplied artwork (2262 × 1115). */
const RATIO = 2262 / 1115

const widths: Record<Size, number> = {
  xs: 96,
  sm: 128,
  md: 176,
  lg: 240,
  xl: 320,
}

export const LOGO_SRC = '/assets/logo/thirukochi-logo.png'
export const LOGO_ALT = 'Thirukochi Gold & Diamonds'

export function Logo({ size = 'md', className, glow, priority }: LogoProps) {
  const width = widths[size]
  const height = Math.round(width / RATIO)

  return (
    <span className={cn('relative inline-block shrink-0', className)} style={{ width, height }}>
      {glow && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: width * 1.6,
            height: width * 1.6,
            background: 'radial-gradient(circle, rgba(249,223,50,0.22) 0%, rgba(179,135,28,0.08) 38%, rgba(84,0,0,0) 68%)',
            filter: 'blur(18px)',
          }}
        />
      )}
      <img
        src={LOGO_SRC}
        srcSet="/assets/logo/thirukochi-logo-400.png 400w, /assets/logo/thirukochi-logo-800.png 800w, /assets/logo/thirukochi-logo.png 2262w"
        sizes={`${width}px`}
        alt={LOGO_ALT}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        draggable={false}
        className="h-full w-full select-none object-contain"
      />
    </span>
  )
}
