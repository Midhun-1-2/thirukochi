import { cn } from '@/lib/cn'

/* ------------------------------------------------------------------
   RouteFallback — gold shimmer skeleton shown while a route chunk
   loads. Inline (inside the layout) keeps header / navigation on
   screen; fullScreen is only for the very first paint.
------------------------------------------------------------------- */

export function RouteFallback({ fullScreen }: { fullScreen?: boolean }) {
  if (fullScreen) {
    // Mirrors the static splash in index.html so first paint → first route is seamless.
    return (
      <div className="bg-cinematic fixed inset-0 flex flex-col items-center justify-center gap-[22px]" role="status" aria-label="Loading">
        <img src="/assets/logo/thirukochi-logo-400.png" alt="" width={176} height={87} className="drop-shadow-[0_12px_40px_rgba(249,223,50,0.22)]" />
        <span className="skeleton-gold h-[2px] w-[120px] rounded-full" />
      </div>
    )
  }
  return (
    <div role="status" aria-label="Loading" className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-12 lg:gap-6">
        <div className={cn('skeleton-gold h-[220px] rounded-[var(--radius-lg)] md:col-span-8')} />
        <div className={cn('skeleton-gold h-[220px] rounded-[var(--radius-lg)] md:col-span-4')} />
        <div className={cn('skeleton-gold h-[180px] rounded-[var(--radius-lg)] md:col-span-12')} />
      </div>
    </div>
  )
}
