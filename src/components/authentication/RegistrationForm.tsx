import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ArrowRight, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GoldButton } from '@/components/ui/GoldButton'
import { GoldInput } from '@/components/ui/GoldInput'
import { PhoneInput } from './PhoneInput'
import { staggerContainer, staggerItem } from '@/lib/motion'

/* ------------------------------------------------------------------
   RegistrationForm — Full name + Indian mobile number → Get OTP
------------------------------------------------------------------- */

const registrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name')
    .max(60, 'That name looks a little long')
    .regex(/^[A-Za-z][A-Za-z .'-]*$/, 'Please use letters only'),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
})

export type RegistrationValues = z.infer<typeof registrationSchema>

interface RegistrationFormProps {
  defaultValues?: Partial<RegistrationValues>
  onSubmit: (values: RegistrationValues) => Promise<void> | void
  submitting?: boolean
}

export function RegistrationForm({ defaultValues, onSubmit, submitting }: RegistrationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { fullName: '', phone: '', ...defaultValues },
    mode: 'onTouched',
  })

  const busy = submitting || isSubmitting

  return (
    <motion.form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      variants={staggerContainer(0.09, 0.25)}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4"
    >
      <motion.div variants={staggerItem}>
        <GoldInput
          label="Full Name"
          icon={<User />}
          autoComplete="name"
          autoCapitalize="words"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <PhoneInput error={errors.phone?.message} {...register('phone')} />
      </motion.div>

      <motion.div variants={staggerItem} className="pt-2">
        <GoldButton type="submit" size="lg" fullWidth loading={busy} loadingText="Sending OTP…" iconRight={<ArrowRight />}>
          Get OTP
        </GoldButton>
      </motion.div>

      <motion.p variants={staggerItem} className="pt-1 text-center text-[12px] leading-relaxed text-cream-faint">
        By continuing, you agree to our{' '}
        <Link to="/profile#terms" className="inline-block py-1 text-gold-muted underline-offset-4 transition-colors hover:text-gold-bright hover:underline">
          Terms &amp; Conditions
        </Link>{' '}
        and{' '}
        <Link to="/profile#privacy" className="inline-block py-1 text-gold-muted underline-offset-4 transition-colors hover:text-gold-bright hover:underline">
          Privacy Policy
        </Link>
        .
      </motion.p>
    </motion.form>
  )
}
