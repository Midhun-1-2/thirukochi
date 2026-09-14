import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, FileText, Headset, KeyRound, LogOut, Mail, Phone, ShieldCheck, type LucideIcon } from 'lucide-react'
import { routes } from '@/app/navigation'
import { useAuth } from '@/context/AuthContext'
import { formatPhone, initials } from '@/lib/format'
import { staggerContainer, staggerItem } from '@/lib/motion'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/motion/PageTransition'
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
      <PageContainer className="py-5 sm:py-6 lg:py-8">
        <motion.div variants={staggerContainer(0.1)} initial="hidden" animate="show" className="mx-auto grid max-w-[980px] gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6">
          <motion.div variants={staggerItem}>
            <GoldCard variant="edge" className="relative overflow-clip text-center">
              <GoldGlow className="-top-28 left-1/2 -translate-x-1/2" size={360} intensity={0.3} />
              <div className="relative">
                <span className="mx-auto flex size-24 items-center justify-center rounded-full gold-bg font-display text-[32px] font-medium text-maroon-dark shadow-[0_14px_40px_rgba(249,223,50,0.3)] ring-4 ring-[rgba(249,223,50,0.18)] ring-offset-4 ring-offset-[#2a0000]">
                  {initials(user?.name ?? 'M')}
                </span>
                <h1 className="mt-5 font-display text-[26px] font-medium text-cream">{user?.name}</h1>
                <p className="mt-1 text-[13.5px] text-cream-muted lining-nums">{user ? formatPhone(user.phone) : ''}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[rgba(249,223,50,0.3)] bg-[rgba(249,223,50,0.08)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-gold-bright">
                  <ShieldCheck size={12} aria-hidden /> Gold Member
                </span>
                <GoldDivider ornament className="my-5" />
                <dl className="grid grid-cols-2 gap-3 text-left">
                  <div className="rounded-[12px] bg-[rgba(13,0,0,0.35)] px-3.5 py-3">
                    <dt className="text-[10.5px] uppercase tracking-[0.16em] text-cream-faint">Referral code</dt>
                    <dd className="mt-0.5 font-display text-[18px] font-medium tracking-[0.1em] text-gold-bright">{user?.referralCode}</dd>
                  </div>
                  <div className="rounded-[12px] bg-[rgba(13,0,0,0.35)] px-3.5 py-3">
                    <dt className="text-[10.5px] uppercase tracking-[0.16em] text-cream-faint">Member since</dt>
                    <dd className="mt-0.5 text-[14px] font-medium text-cream">{user?.memberSince}</dd>
                  </div>
                </dl>
              </div>
            </GoldCard>
          </motion.div>

          <div className="flex flex-col gap-5">
            <motion.div variants={staggerItem}>
              <SettingsGroup title="Security" rows={security} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <SettingsGroup title="Support" rows={support} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <SettingsGroup title="Legal" rows={legal} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <GoldButton variant="secondary" size="lg" fullWidth icon={<LogOut />} onClick={() => setConfirmOpen(true)}>
                Log out
              </GoldButton>
            </motion.div>
          </div>
        </motion.div>
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

function SettingsGroup({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <GoldCard padding="none">
      <p className="px-5 pb-1 pt-4 text-[11px] uppercase tracking-[0.2em] text-gold-muted">{title}</p>
      <ul className="p-2">
        {rows.map((r) => (
          <li key={r.label} id={r.id}>
            <button
              type="button"
              onClick={r.onClick}
              className="group flex w-full items-center gap-3.5 rounded-[12px] px-3 py-3 text-left transition-colors hover:bg-[rgba(249,223,50,0.06)]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[rgba(249,223,50,0.2)] bg-[rgba(38,0,0,0.5)] text-gold-muted transition-colors group-hover:text-gold-bright">
                <r.icon size={18} strokeWidth={1.6} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-medium text-cream">{r.label}</span>
                <span className="block text-[12px] text-cream-faint">{r.description}</span>
              </span>
              <ChevronRight size={16} className="text-cream-faint transition-transform group-hover:translate-x-0.5" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </GoldCard>
  )
}
