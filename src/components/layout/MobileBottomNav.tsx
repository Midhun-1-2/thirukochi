import { Link } from 'react-router-dom'
import { navItems } from '@/app/navigation'
import { useOptimisticNav } from '@/hooks/useOptimisticNav'
import { cn } from '@/lib/cn'

/* ------------------------------------------------------------------
   MobileBottomNav — solid maroon bar, gold active state. The active
   indicator is a single element that slides with a CSS transform
   transition (compositor-only), so it moves the instant an item is
   tapped without competing with the page render. Safe-area aware.
   Hidden on lg+.
------------------------------------------------------------------- */

export function MobileBottomNav() {
  const items = navItems.filter((i) => i.mobile)
  const { isActive, onNavigate } = useOptimisticNav()
  const activeIndex = items.findIndex((i) => isActive(i.to))

  return (
    <nav
      aria-label="Primary"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 lg:hidden',
        'border-t border-[rgba(249,223,50,0.12)] bg-[#160000]',
        'pb-[var(--safe-bottom)]',
      )}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(249,223,50,0.45),transparent)]" />
      <ul className="relative mx-auto flex h-[var(--bottom-nav-height)] max-w-[560px] items-stretch px-2">
        {/* sliding active indicator */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-2 transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{
            width: `calc((100% - 16px) / ${items.length})`,
            transform: `translateX(${Math.max(0, activeIndex) * 100}%)`,
            opacity: activeIndex < 0 ? 0 : 1,
          }}
        >
          <span className="absolute left-1/2 top-3 h-8 w-14 -translate-x-1/2 rounded-full bg-[rgba(249,223,50,0.12)] shadow-[inset_0_0_0_1px_rgba(249,223,50,0.22)]" />
          <span className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-gold-bright shadow-[0_0_6px_rgba(249,223,50,0.9)]" />
        </span>

        {items.map(({ to, label, icon: Icon }) => {
          const active = isActive(to)
          return (
            <li key={to} className="relative flex flex-1">
              <Link
                to={to}
                aria-current={active ? 'page' : undefined}
                onClick={() => onNavigate(to)}
                className={cn(
                  'relative flex w-full min-w-0 flex-col items-center justify-center gap-1 rounded-2xl',
                  // no colour transitions here: they would repaint every frame while the new page renders
                  'text-[10.5px] font-medium tracking-[0.02em]',
                  active ? 'text-gold-bright' : 'text-cream-faint active:text-cream',
                )}
              >
                <span className="relative flex h-8 w-14 items-center justify-center active:scale-90">
                  <Icon
                    size={21}
                    strokeWidth={active ? 1.9 : 1.6}
                    aria-hidden
                    className={cn('relative', active && 'scale-105 drop-shadow-[0_0_6px_rgba(249,223,50,0.55)]')}
                  />
                </span>
                <span className="relative truncate">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
