import { useNavigate } from 'react-router-dom'
import { routes } from '@/app/navigation'
import { AuthHeader } from '@/components/authentication/AuthHeader'
import { LoginForm } from '@/components/authentication/LoginForm'
import { PageTransition } from '@/components/motion/PageTransition'
import { GoldRing } from '@/components/motion/GoldRing'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const { login, account } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  return (
    <PageTransition className="relative">
      <GoldRing className="-z-10 opacity-35 lg:opacity-55" size={680} />
      <LockEmblem />

      <AuthHeader title="Welcome Back" subtitle="Login to your account." />

      <LoginForm
        defaultPhone={account?.phone ?? ''}
        onSubmit={(v) => login({ phone: v.phone, mpin: v.mpin })}
        onSuccess={() => {
          toast({ title: 'Logged in', description: 'Welcome back to Thirukochi.' })
          navigate(routes.home, { replace: true })
        }}
      />
    </PageTransition>
  )
}

/** Minimal golden lock — jewellery-inspired, sits behind the heading. */
function LockEmblem() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 120"
      className="pointer-events-none absolute -right-10 -top-16 -z-10 h-[140px] w-[140px] opacity-[0.2] lg:-right-16 lg:-top-16 lg:h-[220px] lg:w-[220px] lg:opacity-[0.28]"
      fill="none"
    >
      <defs>
        <linearGradient id="lock-g" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F9DF32" />
          <stop offset="1" stopColor="#91640F" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" stroke="url(#lock-g)" strokeWidth="0.8" strokeDasharray="2 6" />
      <rect x="34" y="52" width="52" height="42" rx="10" stroke="url(#lock-g)" strokeWidth="1.4" />
      <path d="M44 52V42a16 16 0 0 1 32 0v10" stroke="url(#lock-g)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M60 66v10M55 71l5-5 5 5" stroke="url(#lock-g)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 80l4 4-4 4-4-4z" fill="url(#lock-g)" />
    </svg>
  )
}
