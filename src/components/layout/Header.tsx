import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Check, Copy } from 'lucide-react'
import { routes } from '@/app/navigation'
import { Logo } from '@/components/brand/Logo'
import { IconButton } from '@/components/ui/IconButton'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/context/AuthContext'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { mockActivity } from '@/data'
import { cn } from '@/lib/cn'
import { greeting, initials } from '@/lib/format'
import { luxuryEase, springSnappy } from '@/lib/motion'
import { PageContainer } from './PageContainer'

/* ------------------------------------------------------------------
   Header — mobile: compact logo · bell · avatar
             desktop: greeting · referral chip · bell · avatar
------------------------------------------------------------------- */

export function Header() {
  const { user } = useAuth()
  const name = user?.name ?? 'Member'
  const firstName = name.split(' ')[0]
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b border-[rgba(249,223,50,0.1)]',
        'bg-[linear-gradient(90deg,#2a0202_0%,#1c0000_55%,#180000_100%)]',
        'pt-[var(--safe-top)]',
      )}
    >
      <PageContainer className="flex h-[var(--nav-height)] items-center justify-between gap-4 lg:h-[88px]">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          <Link to={routes.home} className="lg:hidden" aria-label="Thirukochi Gold & Diamonds — Home">
            <Logo size="xs" priority />
          </Link>
          <div className="hidden min-w-0 lg:block">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-muted">{today}</p>
            <h1 className="mt-0.5 truncate font-display text-[24px] font-medium leading-tight text-cream xl:text-[26px]">
              {greeting()}, <span className="gold-text">{firstName}</span>
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user && <ReferralChip code={user.referralCode} className="hidden md:inline-flex" />}
          <NotificationsMenu />
          <Link
            to={routes.profile}
            aria-label="Profile"
            className="group flex items-center gap-3 rounded-full pl-1 pr-1 transition-colors hover:bg-[rgba(249,223,50,0.06)] lg:pr-3"
          >
            <span className="relative flex size-10 items-center justify-center rounded-full gold-bg text-[13px] font-semibold text-maroon-dark shadow-[0_6px_18px_rgba(249,223,50,0.25)] ring-2 ring-[rgba(249,223,50,0.25)] ring-offset-2 ring-offset-[#160000] transition-transform group-hover:scale-105">
              {initials(name)}
            </span>
            <span className="hidden text-left lg:block">
              <span className="block text-[13px] font-medium leading-tight text-cream">{name}</span>
              <span className="block text-[11px] text-cream-faint">Gold Member</span>
            </span>
          </Link>
        </div>
      </PageContainer>
    </header>
  )
}

/* Compact copyable referral pill (desktop header). */
function ReferralChip({ code, className }: { code: string; className?: string }) {
  const { copied, copy } = useCopyToClipboard()
  const { toast } = useToast()

  const onCopy = async () => {
    if (await copy(code)) toast({ title: 'Referral code copied', description: code })
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={`Copy referral code ${code}`}
      className={cn(
        'group h-10 items-center gap-2.5 rounded-full border border-[rgba(249,223,50,0.22)] bg-[rgba(38,0,0,0.5)] pl-4 pr-2 transition-colors hover:border-[rgba(249,223,50,0.45)]',
        className,
      )}
    >
      <span className="text-[11px] uppercase tracking-[0.18em] text-cream-faint">Referral</span>
      <span className="font-display text-[15px] font-medium tracking-[0.12em] text-gold-bright">{code}</span>
      <span className="flex size-7 items-center justify-center rounded-full bg-[rgba(249,223,50,0.1)] text-gold-muted transition-colors group-hover:text-gold-bright">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span key="check" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={springSnappy}>
              <Check size={14} strokeWidth={2.4} aria-hidden />
            </motion.span>
          ) : (
            <motion.span key="copy" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={springSnappy}>
              <Copy size={14} aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  )
}

/* Bell with an animated dropdown of the latest activity. */
function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const items = mockActivity.slice(0, 3)
  const unread = mockActivity.filter((a) => a.unread).length

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <IconButton
        label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        tone="outline"
        dot={unread > 0}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
      >
        <Bell strokeWidth={1.6} />
      </IconButton>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Notifications"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: luxuryEase }}
            className="surface-solid gold-edge absolute right-0 top-[calc(100%+10px)] z-50 w-[min(340px,calc(100vw-32px))] origin-top-right rounded-[18px] p-2"
          >
            <div className="flex items-center justify-between px-3 pb-2 pt-2">
              <p className="font-display text-[16px] font-medium text-cream">Notifications</p>
              {unread > 0 && <span className="rounded-full bg-[rgba(249,223,50,0.12)] px-2 py-0.5 text-[11px] font-medium text-gold-bright">{unread} new</span>}
            </div>
            <ul className="flex flex-col">
              {items.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpen(false)
                      navigate(routes.activity)
                    }}
                    className="flex w-full items-start gap-3 rounded-[12px] px-3 py-2.5 text-left transition-colors hover:bg-[rgba(249,223,50,0.07)]"
                  >
                    <span className={cn('mt-2 size-1.5 shrink-0 rounded-full', a.unread ? 'bg-gold-bright shadow-[0_0_6px_rgba(249,223,50,0.9)]' : 'bg-[rgba(248,248,248,0.2)]')} />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium text-cream">{a.title}</span>
                      <span className="block truncate text-[12px] text-cream-faint">{a.description}</span>
                      <span className="mt-0.5 block text-[11px] text-gold-muted">{a.time}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <Link
              to={routes.activity}
              onClick={() => setOpen(false)}
              className="mt-1 flex h-10 items-center justify-center rounded-[12px] text-[12.5px] font-medium text-gold-muted transition-colors hover:bg-[rgba(249,223,50,0.07)] hover:text-gold-bright"
            >
              View all activity
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
