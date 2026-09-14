import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, KeyRound, Lock, Phone, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mockAuthConfig } from '@/data'
import { GoldButton } from '@/components/ui/GoldButton'
import { GoldInput } from '@/components/ui/GoldInput'
import { IconButton } from '@/components/ui/IconButton'
import { digitsOnly } from '@/lib/inputs'
import { staggerContainer, staggerItem } from '@/lib/motion'
import { generateCaptcha } from '@/lib/captcha'
import { Captcha } from './Captcha'

/* ------------------------------------------------------------------
   LoginForm — phone + MPIN (toggle) + numeric captcha → Login
------------------------------------------------------------------- */

const loginSchema = z.object({
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  mpin: z.string().regex(/^\d{4}$/, 'Enter your 4-digit MPIN'),
  captcha: z.string().trim().min(1, 'Please enter the captcha'),
})

export type LoginValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  defaultPhone?: string
  onSubmit: (values: LoginValues) => Promise<{ ok: true } | { ok: false; reason: string }>
  /** Called after a successful login (for the success transition). */
  onSuccess?: () => void
}

type Phase = 'idle' | 'submitting' | 'success'

export function LoginForm({ defaultPhone = '', onSubmit, onSuccess }: LoginFormProps) {
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha)
  const [showMpin, setShowMpin] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    resetField,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: defaultPhone, mpin: '', captcha: '' },
    mode: 'onTouched',
  })

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha())
    resetField('captcha')
  }

  const submit = handleSubmit(async (values) => {
    setFormError(null)
    if (values.captcha !== captchaCode) {
      refreshCaptcha()
      setError('captcha', { message: 'Captcha does not match. Please try again.' })
      return
    }
    setPhase('submitting')
    const result = await onSubmit(values)
    if (result.ok) {
      setPhase('success')
      window.setTimeout(() => onSuccess?.(), 650)
    } else {
      setPhase('idle')
      setFormError(result.reason)
      refreshCaptcha()
    }
  })

  const busy = phase !== 'idle'

  return (
    <motion.form noValidate onSubmit={submit} variants={staggerContainer(0.09, 0.25)} initial="hidden" animate="show" className="flex flex-col gap-4">
      <motion.div variants={staggerItem}>
        <GoldInput
          label="Phone Number"
          icon={<Phone />}
          prefix="+91"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          onInput={digitsOnly}
          error={errors.phone?.message}
          disabled={busy}
          {...register('phone')}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <GoldInput
          label="Enter MPIN"
          icon={<Lock />}
          type={showMpin ? 'text' : 'password'}
          inputMode="numeric"
          autoComplete="current-password"
          maxLength={4}
          onInput={digitsOnly}
          error={errors.mpin?.message}
          disabled={busy}
          className="tracking-[0.35em]"
          trailing={
            <IconButton
              label={showMpin ? 'Hide MPIN' : 'Show MPIN'}
              size="sm"
              tone="ghost"
              aria-pressed={showMpin}
              onClick={() => setShowMpin((s) => !s)}
            >
              {showMpin ? <EyeOff strokeWidth={1.6} /> : <Eye strokeWidth={1.6} />}
            </IconButton>
          }
          {...register('mpin')}
        />
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-1 gap-3 xs:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Captcha code={captchaCode} onRefresh={refreshCaptcha} />
        <GoldInput
          label="Enter Captcha"
          icon={<KeyRound />}
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          onInput={digitsOnly}
          error={errors.captcha?.message}
          disabled={busy}
          {...register('captcha')}
        />
      </motion.div>

      {formError && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[12px] border border-rose/30 bg-rose/10 px-4 py-3 text-[13px] text-rose"
        >
          {formError}
        </motion.p>
      )}

      <motion.div variants={staggerItem} className="pt-1">
        <GoldButton
          type="submit"
          size="lg"
          fullWidth
          loading={phase === 'submitting'}
          loadingText="Logging in…"
          icon={phase === 'success' ? <ShieldCheck strokeWidth={2.2} /> : undefined}
          disabled={phase === 'success'}
        >
          {phase === 'success' ? 'Welcome back' : 'Login'}
        </GoldButton>
      </motion.div>

      <motion.div variants={staggerItem} className="flex items-center justify-between pt-1 text-[13px]">
        <Link to="/register" className="inline-flex h-11 items-center rounded-full pr-2 text-cream-faint transition-colors hover:text-gold-pale">
          New here? <span className="text-gold-muted">Register</span>
        </Link>
        <button type="button" className="inline-flex h-11 items-center rounded-full pl-2 text-gold-muted transition-colors hover:text-gold-bright" onClick={() => setFormError('MPIN recovery will be available with the live service.')}>
          Forgot MPIN?
        </button>
      </motion.div>

      <motion.p variants={staggerItem} className="mt-2 rounded-[12px] border border-dashed border-[rgba(249,223,50,0.2)] px-4 py-2.5 text-center text-[11.5px] leading-relaxed text-cream-faint">
        Demo access — phone <span className="text-gold-pale lining-nums">{mockAuthConfig.demoUser.phone}</span>, MPIN{' '}
        <span className="text-gold-pale lining-nums">{mockAuthConfig.demoUser.mpin}</span>
      </motion.p>
    </motion.form>
  )
}
