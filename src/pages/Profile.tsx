import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, FileText, Headset, KeyRound, LogOut, Mail, Phone, ShieldCheck, type LucideIcon } from 'lucide-react'
import { routes } from '@/app/navigation'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/cn'
import { formatPhone, initials } from '@/lib/format'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/motion/PageTransition'
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer'
import { GoldGlow } from '@/components/motion/GoldGlow'
import { GoldButton } from '@/components/ui/GoldButton'
import { GoldCard } from '@/components/ui/GoldCard'
import { GoldDivider } from '@/components/ui/GoldDivider'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

interface Row {
  icon: LucideIcon
  label: string
  description: string
  id?: string
  onClick?: () => void
}

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const notYet = (what: string) => () => toast({ title: `${what} coming soon`, description: 'Available with the live service.', tone: 'info' })

  const security: Row[] = [
    { icon: KeyRound, label: 'Change MPIN', description: 'Update your 4-digit secure PIN', onClick: notYet('MPIN change') },
    { icon: ShieldCheck, label: 'Security', description: 'Devices and login activity', onClick: notYet('Security settings') },
  ]
  const support: Row[] = [
    { id: 'support', icon: Headset, label: 'Contact Support', description: 'We are here to help', onClick: notYet('Support chat') },
    { icon: Phone, label: 'Call the store', description: 'Speak to our team', onClick: notYet('Calling') },
    { icon: Mail, label: 'Email us', description: 'Write to customer care', onClick: notYet('Email') },
  ]
  const legal: Row[] = [
    { id: 'terms', icon: FileText, label: 'Terms & Conditions', description: 'How the service works', onClick: notYet('Terms') },
    { id: 'privacy', icon: FileText, label: 'Privacy Policy', description: 'How we handle your data', onClick: notYet('Privacy policy') },
  ]

  const doLogout = () => {
    setConfirmOpen(false)
    logout()
    toast({ title: 'Logged out', description: 'See you soon.', tone: 'info' })
    navigate(routes.login, { replace: true })
  }

  return (
    <PageTransition>
      <PageContainer className="py-4 pb-24 sm:py-6 lg:py-8">
        <StaggerContainer stagger={0.06} className="mx-auto grid max-w-[980px] gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6">
          {/* Identity — a horizontal card on phones, a portrait card from lg */}
          <StaggerItem>
            <GoldCard variant="edge" padding="sm" className="relative overflow-clip sm:p-6 lg:text-center">
              <GoldGlow className="-top-28 left-1/2 -translate-x-1/2" size={360} intensity={0.3} />
              <div className="relative">
                <div className="flex items-center gap-4 lg:flex-col lg:gap-0">
                  <span className="flex size-16 shrink-0 items-center justify-center rounded-full gold-bg font-display text-[22px] font-medium text-maroon-dark shadow-[0_14px_40px_rgba(249,223,50,0.3)] ring-4 ring-[rgba(249,223,50,0.18)] ring-offset-4 ring-offset-[#2a0000] sm:size-20 sm:text-[26px] lg:size-24 lg:text-[32px]">
                    {initials(user?.name ?? 'M')}
                  </span>
                  <div className="min-w-0 lg:mt-5">
                    <h1 className="truncate font-display text-[22px] font-medium leading-tight text-cream sm:text-[26px]">{user?.name}</h1>
                    <p className="mt-0.5 text-[13px] text-cream-muted lining-nums sm:text-[13.5px]">{user ? formatPhone(user.phone) : ''}</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[rgba(249,223,50,0.3)] bg-[rgba(249,223,50,0.08)] px-2.5 py-0.5 text-[10.5px] uppercase tracking-[0.18em] text-gold-bright sm:mt-3 sm:px-3 sm:py-1 sm:text-[11px]">
                      <ShieldCheck size={12} aria-hidden /> Gold Member
                    </span>
                  </div>
                </div>
                <GoldDivider ornament className="my-3.5 sm:my-5" />
                <dl className="grid grid-cols-2 gap-2.5 text-left sm:gap-3">
                  <div className="rounded-[12px] bg-[rgba(13,0,0,0.35)] px-3.5 py-2.5 sm:py-3">
                    <dt className="text-[10.5px] uppercase tracking-[0.16em] text-cream-faint">Referral code</dt>
                    <dd className="mt-0.5 font-display text-[17px] font-medium tracking-[0.1em] text-gold-bright sm:text-[18px]">{user?.referralCode}</dd>
                  </div>
                  <div className="rounded-[12px] bg-[rgba(13,0,0,0.35)] px-3.5 py-2.5 sm:py-3">
                    <dt className="text-[10.5px] uppercase tracking-[0.16em] text-cream-faint">Member since</dt>
                    <dd className="mt-0.5 text-[13.5px] font-medium text-cream sm:text-[14px]">{user?.memberSince}</dd>
                  </div>
                </dl>
              </div>
            </GoldCard>
          </StaggerItem>

          <div className="flex flex-col gap-3.5 sm:gap-5">
            <StaggerItem>
              <SettingsGroup title="Security" rows={security} />
            </StaggerItem>
            <StaggerItem>
              <SettingsGroup title="Support" rows={support} />
            </StaggerItem>
            {/* Legal + sign-out: a card and a button from md; one slim footer row on phones */}
            <StaggerItem className="hidden gap-5 md:flex md:items-stretch">
              <SettingsGroup title="Legal" rows={legal} compact className="md:flex-1" />
              <GoldButton variant="secondary" size="lg" icon={<LogOut />} onClick={() => setConfirmOpen(true)} className="h-auto min-w-[180px]">
                Log out
              </GoldButton>
            </StaggerItem>
            <StaggerItem className="flex items-center justify-between gap-3 px-1 md:hidden">
              <nav aria-label="Legal" className="flex min-w-0 flex-wrap items-center gap-x-2 text-[12px] text-cream-muted">
                {legal.map((r, i) => (
                  <span key={r.label} className="inline-flex items-center gap-x-2">
                    {i > 0 && <span aria-hidden className="text-gold-muted">·</span>}
                    <button type="button" onClick={r.onClick} className="py-2 underline-offset-4 transition-colors hover:text-gold-bright hover:underline">
                      {r.label}
                    </button>
                  </span>
                ))}
              </nav>
              <GoldButton variant="secondary" size="sm" icon={<LogOut />} onClick={() => setConfirmOpen(true)} className="shrink-0">
                Log out
              </GoldButton>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </PageContainer>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Log out of Thirukochi?"
        description="You will need your phone number and MPIN to log back in."
        footer={
          <>
            <GoldButton variant="ghost" onClick={() => setConfirmOpen(false)}>
              Stay logged in
            </GoldButton>
            <GoldButton icon={<LogOut />} onClick={doLogout} data-autofocus>
              Log out
            </GoldButton>
          </>
        }
      />
    </PageTransition>
  )
}

/**
 * A titled list of tappable rows. `compact` drops the descriptions and
 * lays the rows side by side — for short groups such as Legal.
 */
function SettingsGroup({ title, rows, compact, className }: { title: string; rows: Row[]; compact?: boolean; className?: string }) {
  return (
    <GoldCard padding="none" className={className}>
      <p className="px-4 pb-0.5 pt-3 text-[10.5px] uppercase tracking-[0.2em] text-gold-muted sm:px-5 sm:pb-1 sm:pt-4 sm:text-[11px]">{title}</p>
      <ul className={cn('p-1.5 sm:p-2', compact && 'flex flex-wrap gap-1')}>
        {rows.map((r) => (
          <li key={r.label} id={r.id} className={cn(compact && 'flex-1')}>
            <button
              type="button"
              onClick={r.onClick}
              className={cn(
                'group flex w-full items-center rounded-[12px] text-left transition-colors hover:bg-[rgba(249,223,50,0.06)]',
                compact ? 'gap-2.5 px-2.5 py-2' : 'gap-3 px-2.5 py-1.5 sm:gap-3.5 sm:px-3 sm:py-3',
              )}
            >
              <span
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-full border border-[rgba(249,223,50,0.2)] bg-[rgba(38,0,0,0.5)] text-gold-muted transition-colors group-hover:text-gold-bright',
                  compact ? 'size-8' : 'size-9 sm:size-10',
                )}
              >
                <r.icon size={compact ? 15 : 17} strokeWidth={1.6} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-medium text-cream sm:text-[14px]">{r.label}</span>
                {!compact && <span className="hidden truncate text-[11.5px] text-cream-faint sm:block sm:text-[12px]">{r.description}</span>}
              </span>
              {!compact && <ChevronRight size={16} className="shrink-0 text-cream-faint transition-transform group-hover:translate-x-0.5" aria-hidden />}
            </button>
          </li>
        ))}
      </ul>
    </GoldCard>
  )
}
