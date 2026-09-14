import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { Headset, Plus } from 'lucide-react'
import { navItems, routes } from '@/app/navigation'
import { Logo } from '@/components/brand/Logo'
import { BrandMark } from '@/components/brand/BrandMark'
import { cn } from '@/lib/cn'
import { springSoft } from '@/lib/motion'

/* ------------------------------------------------------------------
   DesktopSidebar — compact premium rail.
   lg  (1024px+): 88px icon rail with tooltips
   xl  (1280px+): 264px expanded navigation
------------------------------------------------------------------- */

export function DesktopSidebar() {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 hidden flex-col lg:flex',
        'w-[88px] xl:w-[264px]',
        'border-r border-[rgba(249,223,50,0.1)] bg-[linear-gradient(180deg,#1c0000_0%,#160000_100%)]',
      )}
    >
      {/* gold hairline glow along the edge */}
      <span aria-hidden className="absolute inset-y-0 right-0 w-px bg-[linear-gradient(180deg,transparent,rgba(249,223,50,0.35)_30%,rgba(249,223,50,0.35)_70%,transparent)]" />

      <div className="flex h-[96px] items-center justify-center px-4 xl:justify-start xl:px-7">
        <NavLink to={routes.home} aria-label="Thirukochi Gold & Diamonds — Home">
          <span className="xl:hidden">
            <BrandMark size={44} />
          </span>
          <span className="hidden xl:block">
            <Logo size="sm" priority />
          </span>
        </NavLink>
      </div>

      <nav aria-label="Primary" className="mt-2 flex-1 px-3 xl:px-4">
        <ul className="flex flex-col gap-1.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'group relative flex h-12 items-center gap-3.5 rounded-[14px] px-0 xl:px-4',
                    'justify-center xl:justify-start',
                    'text-[14px] font-medium transition-colors duration-200',
                    isActive ? 'text-gold-bright' : 'text-cream-muted hover:text-cream',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active"
                        transition={springSoft}
                        className="absolute inset-0 rounded-[14px] bg-[rgba(249,223,50,0.08)] shadow-[inset_0_0_0_1px_rgba(249,223,50,0.18)]"
                      />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-bar"
                        transition={springSoft}
                        className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full gold-bg shadow-[0_0_10px_rgba(249,223,50,0.7)] xl:-left-4"
                      />
                    )}
                    <Icon
                      size={20}
                      strokeWidth={1.6}
                      className={cn('relative transition-transform duration-300 group-hover:scale-110', isActive && 'drop-shadow-[0_0_6px_rgba(249,223,50,0.5)]')}
                      aria-hidden
                    />
                    <span className="relative hidden xl:inline">{label}</span>
                    {/* tooltip for the rail */}
                    <span
                      role="tooltip"
                      className={cn(
                        'pointer-events-none absolute left-[calc(100%+10px)] whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[12px] text-cream',
                        'surface-glass opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 xl:hidden',
                      )}
                    >
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col gap-3 px-3 pb-6 xl:px-4">
        {/* Join scheme */}
        <NavLink
          to={routes.joinScheme}
          aria-label="Join Scheme"
          className={cn(
            'group relative flex h-12 items-center justify-center gap-2.5 overflow-clip rounded-[14px]',
            'gold-bg-button text-maroon-dark text-[13.5px] font-semibold',
            'shadow-[0_10px_28px_rgba(249,223,50,0.18)] transition-shadow hover:shadow-[0_14px_36px_rgba(249,223,50,0.28)]',
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-[-18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] transition-transform duration-[900ms] group-hover:translate-x-[120%]"
          />
          <Plus size={18} strokeWidth={2.4} aria-hidden className="relative" />
          <span className="relative hidden xl:inline">Join Scheme</span>
        </NavLink>

        <NavLink
          to={`${routes.profile}#support`}
          className="flex h-11 items-center justify-center gap-3 rounded-[12px] text-[13px] text-cream-faint transition-colors hover:text-gold-pale xl:justify-start xl:px-4"
        >
          <Headset size={18} strokeWidth={1.6} aria-hidden />
          <span className="hidden xl:inline">Support</span>
        </NavLink>
      </div>
    </aside>
  )
}
