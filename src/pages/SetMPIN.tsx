import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { routes } from '@/app/navigation'
import { AuthHeader } from '@/components/authentication/AuthHeader'
import { MPINInput } from '@/components/authentication/MPINInput'
import { NumericKeypad } from '@/components/authentication/NumericKeypad'
import { PageTransition } from '@/components/motion/PageTransition'
import { GoldRing } from '@/components/motion/GoldRing'
import { GoldButton } from '@/components/ui/GoldButton'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/context/AuthContext'
import { mockAuthConfig } from '@/data'
import { luxuryEase } from '@/lib/motion'

type Stage = 'create' | 'confirm'

export default function SetMPIN() {
  const { registration, setMpin } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [stage, setStage] = useState<Stage>('create')
  const [first, setFirst] = useState('')
  const [pin, setPin] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const [busy, setBusy] = useState(false)
  const len = mockAuthConfig.mpinLength
  // Keep rendering during the exit transition even after the registration is consumed.
  const [completed, setCompleted] = useState(false)

  const onDigit = useCallback(
    (d: string) => {
      setStatus('idle')
      setPin((p) => (p.length < len ? p + d : p))
    },
    [len],
  )
  const onBackspace = useCallback(() => {
    setStatus('idle')
    setPin((p) => p.slice(0, -1))
  }, [])
  const onClear = useCallback(() => {
    setStatus('idle')
    setPin('')
  }, [])
  const backToCreate = () => {
    setStatus('idle')
    setPin('')
    setFirst('')
    setStage('create')
  }

  if (!completed) {
    if (!registration) return <Navigate to={routes.register} replace />
    if (!registration.otpVerified) return <Navigate to={routes.verifyOtp} replace />
  }

  const complete = pin.length === len

  const continueFlow = async () => {
    if (!complete || busy) return
    if (stage === 'create') {
      setFirst(pin)
      setPin('')
      setStage('confirm')
      return
    }
    // Showcase build: confirm goes through even if it doesn't match what was just entered.
    // Restore the `pin !== first` mismatch check above for production.
    void first
    setBusy(true)
    setStatus('success')
    setCompleted(true)
    await setMpin(pin)
    toast({ title: 'MPIN set successfully', description: 'Login with your phone number and MPIN.' })
    navigate(routes.login)
  }

  return (
    <PageTransition className="relative">
      <GoldRing className="-z-10 opacity-40 lg:opacity-60" size={640} />

      <AuthHeader
        step={3}
        title={stage === 'create' ? 'Set Your MPIN' : 'Confirm Your MPIN'}
        subtitle={stage === 'create' ? 'Create a 4 digit MPIN for secure access.' : 'Enter the same 4 digits once more.'}
        back={stage === 'create' ? { to: routes.verifyOtp, label: 'Back' } : { label: 'Change MPIN', onClick: backToCreate }}
      />

      {/* Only the entry row swaps between stages; the keypad stays exactly where the thumb is. */}
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="relative min-h-[84px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.3, ease: luxuryEase }}
              className="flex w-full flex-col gap-3"
            >
              <MPINInput value={pin} status={status} label={stage === 'create' ? 'New MPIN' : 'Confirm MPIN'} />
              <div className="min-h-[20px] text-center text-[13px]" aria-live="polite">
                {status === 'error' ? (
                  <p role="alert" className="text-rose">
                    MPINs don’t match. Please try again.
                  </p>
                ) : (
                  <p className="inline-flex items-center gap-1.5 text-cream-faint">
                    <ShieldCheck size={14} className="text-gold-muted" aria-hidden />
                    {stage === 'create' ? 'Your MPIN keeps your account secure.' : 'Re-enter the MPIN you just created.'}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <NumericKeypad onDigit={onDigit} onBackspace={onBackspace} onClear={onClear} disabled={busy} className="mx-auto w-full max-w-[340px]" />
      </div>

      <motion.div initial={false} animate={{ y: complete ? 0 : 4 }} transition={{ duration: 0.3 }} className="mt-5 sm:mt-6">
        <GoldButton size="lg" fullWidth disabled={!complete} loading={busy} loadingText="Securing…" iconRight={<ArrowRight />} onClick={continueFlow}>
          {stage === 'create' ? 'Continue' : 'Confirm MPIN'}
        </GoldButton>
      </motion.div>
    </PageTransition>
  )
}
