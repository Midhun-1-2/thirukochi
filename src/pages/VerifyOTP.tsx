import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigate, useNavigate } from 'react-router-dom'
import { Clock, RefreshCw } from 'lucide-react'
import { routes } from '@/app/navigation'
import { AuthHeader } from '@/components/authentication/AuthHeader'
import { OTPInput } from '@/components/authentication/OTPInput'
import { PageTransition } from '@/components/motion/PageTransition'
import { GoldRing } from '@/components/motion/GoldRing'
import { GoldButton } from '@/components/ui/GoldButton'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/context/AuthContext'
import { useCountdown } from '@/hooks/useCountdown'
import { mockAuthConfig } from '@/data'
import { formatPhone, formatSeconds } from '@/lib/format'
import { luxuryEase } from '@/lib/motion'

export default function VerifyOTP() {
  const { registration, verifyOtp, resendOtp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const [busy, setBusy] = useState(false)
  const [resending, setResending] = useState(false)
  const { remaining, done, restart } = useCountdown(mockAuthConfig.resendSeconds)

  if (!registration) return <Navigate to={routes.register} replace />

  const submit = async (value = code) => {
    if (value.length !== mockAuthConfig.otpLength || busy) return
    setBusy(true)
    const ok = await verifyOtp(value)
    if (ok) {
      setStatus('success')
      toast({ title: 'OTP verified', description: 'Now let’s secure your account.' })
      window.setTimeout(() => navigate(routes.setMpin), 700)
    } else {
      setStatus('error')
      setBusy(false)
    }
  }

  const resend = async () => {
    setResending(true)
    await resendOtp()
    setResending(false)
    setCode('')
    setStatus('idle')
    restart()
    toast({ title: 'OTP sent again', description: `Sent to ${formatPhone(registration.phone)}`, tone: 'info' })
  }

  return (
    <PageTransition className="relative">
      <GoldRing className="-z-10 opacity-40 lg:opacity-60" size={620} />

      <AuthHeader
        step={2}
        title="Verify OTP"
        subtitle={`We've sent a 6 digit OTP to your mobile number ${formatPhone(registration.phone)}.`}
        back={{ to: routes.register, label: 'Change number' }}
      />

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="flex flex-col gap-6"
      >
        <OTPInput
          value={code}
          onChange={(v) => {
            setCode(v)
            if (status === 'error') setStatus('idle')
          }}
          onComplete={(v) => submit(v)} status={status} disabled={busy && status !== 'error'} />

        <div className="flex min-h-[22px] items-center justify-between text-[13px]" aria-live="polite">
          {status === 'error' ? (
            <p role="alert" className="text-rose">
              Incorrect OTP. Please check and try again.
            </p>
          ) : (
            <p className="inline-flex items-center gap-1.5 text-cream-faint">
              <Clock size={14} aria-hidden className="text-gold-muted" />
              <span className="lining-nums tabular-nums">{done ? 'You can resend the code now' : `Resend in ${formatSeconds(remaining)}`}</span>
            </p>
          )}
          <p className="text-[11.5px] text-cream-faint">
            Demo OTP <span className="text-gold-pale lining-nums">{mockAuthConfig.otp}</span>
          </p>
        </div>

        <GoldButton type="submit" size="lg" fullWidth loading={busy && status !== 'error'} loadingText="Verifying…" disabled={code.length !== mockAuthConfig.otpLength}>
          {status === 'success' ? 'Verified' : 'Verify'}
        </GoldButton>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5, ease: luxuryEase }} className="text-center">
          <GoldButton variant="ghost" size="sm" disabled={!done || resending} loading={resending} loadingText="Sending…" icon={<RefreshCw />} onClick={resend}>
            Resend OTP
          </GoldButton>
          <p className="mt-2 text-[12px] text-cream-faint">Didn’t receive the code? Check your SMS or resend.</p>
        </motion.div>
      </form>
    </PageTransition>
  )
}
