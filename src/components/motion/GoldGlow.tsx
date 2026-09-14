import { cn } from '@/lib/cn'

interface GoldGlowProps {
  className?: string
  /** 0–1 opacity of the glow. */
  intensity?: number
  size?: number
  drift?: boolean
}

/**
 * Slowly drifting radial gold light — placed behind hero elements.
 * The drift is a compositor-only CSS transform animation, so a page
 * full of glows costs the main thread nothing (reduced-motion aware
 * via the global keyframe override).
 */
export function GoldGlow({ className, intensity = 0.32, size = 520, drift = true }: GoldGlowProps) {
  return (
    <div
      aria-hidden
      data-glow
      className={cn('pointer-events-none absolute rounded-full', drift && 'animate-glow-drift', className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(249,223,50,${intensity}) 0%, rgba(249,223,50,${intensity * 0.55}) 18%, rgba(179,135,28,${intensity * 0.3}) 38%, rgba(84,0,0,0) 66%)`,
        willChange: 'transform',
      }}
    />
  )
}
