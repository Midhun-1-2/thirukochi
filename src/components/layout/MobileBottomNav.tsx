import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { navItems } from '@/app/navigation'
import { cn } from '@/lib/cn'
import { springSoft } from '@/lib/motion'

/* ------------------------------------------------------------------
   MobileBottomNav — glass maroon bar, gold active state with a
   shared-layout indicator. Safe-area aware. Hidden on lg+.
------------------------------------------------------------------- */

export function MobileBottomNav() {
  const items = navItems.filter((i) => i.mobile)

  return (
    <nav
      aria-label="Primary"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 lg:hidden',
        'border-t border-[rgba(249,223,50,0.12)] bg-[rgba(22,0,0,0.96)]',
        'pb-[var(--safe-bottom)]',
      )}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(249,223,50,0.45),transparent)]" />
      <ul className="mx-auto flex h-[var(--bottom-nav-height)] max-w-[560px] items-stretch px-2">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative flex w-full min-w-0 flex-col items-center justify-center gap-1 rounded-2xl',
                  'text-[10.5px] font-medium tracking-[0.02em] transition-colors duration-200',
                  isActive ? 'text-gold-bright' : 'text-cream-faint active:text-cream',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative flex h-8 w-14 items-center justify-center">
                    {isActive && (
                      <motion.span
                        layoutId="bottomnav-active"
                        transition={springSoft}
                        className="absolute inset-0 rounded-full bg-[rgba(249,223,50,0.12)] shadow-[inset_0_0_0_1px_rgba(249,223,50,0.22)]"
                      />
                    )}
                    <Icon
                      size={21}
                      strokeWidth={isActive ? 1.9 : 1.6}
                      aria-hidden
                      className={cn('relative transition-transform duration-300', isActive && 'scale-105 drop-shadow-[0_0_6px_rgba(249,223,50,0.55)]')}
                    />
                  </span>
                  <span className="relative truncate">{label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="bottomnav-dot"
                      transition={springSoft}
                      className="absolute -bottom-0.5 size-1 rounded-full bg-gold-bright shadow-[0_0_6px_rgba(249,223,50,0.9)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
