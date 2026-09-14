import { useEffect, useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, CreditCard, Gem, IndianRupee } from 'lucide-react'
import { getScheme, mockPaymentMethods, mockSchemes } from '@/data'
import type { SchemeSelection } from '@/data'
import { cn } from '@/lib/cn'
import { useEntrance } from '@/lib/entrance'
import { formatINR } from '@/lib/format'
import { digitsOnly } from '@/lib/inputs'
import { luxuryEase, staggerContainer, staggerItem } from '@/lib/motion'
import { GoldButton } from '@/components/ui/GoldButton'
import { GoldInput } from '@/components/ui/GoldInput'
import { GoldSelect } from '@/components/ui/GoldSelect'

/* ------------------------------------------------------------------
   SchemeForm — Scheme · Amount · Tenure · Payment Method → Join Now
   With an animated gold progress indicator.
------------------------------------------------------------------- */

const schemeFormSchema = z
  .object({
    schemeId: z.string().min(1, 'Please select a scheme'),
    amount: z
      .string()
      .min(1, 'Please enter an amount')
      .transform((v) => Number(v.replace(/\D/g, '')))
      .pipe(z.number().min(1, 'Please enter an amount')),
    tenure: z.number({ error: 'Please select a tenure' }).min(1, 'Please select a tenure'),
    paymentMethodId: z.string().min(1, 'Please select a payment method'),
  })
  .superRefine((val, ctx) => {
    const scheme = getScheme(val.schemeId)
    if (!scheme) return
    if (val.amount < scheme.minAmount) {
      ctx.addIssue({ code: 'custom', path: ['amount'], message: `Minimum amount for this scheme is ${formatINR(scheme.minAmount, { whole: true })}` })
    } else if (val.amount > scheme.maxAmount) {
      ctx.addIssue({ code: 'custom', path: ['amount'], message: `Maximum amount for this scheme is ${formatINR(scheme.maxAmount, { whole: true })}` })
    } else if (val.amount % scheme.amountStep !== 0) {
      ctx.addIssue({ code: 'custom', path: ['amount'], message: `Amount should be in multiples of ${formatINR(scheme.amountStep, { whole: true })}` })
    }
    if (!scheme.tenures.includes(val.tenure)) {
      ctx.addIssue({ code: 'custom', path: ['tenure'], message: 'Please select a tenure available for this scheme' })
    }
  })

type FormInput = z.input<typeof schemeFormSchema>
type FormOutput = z.output<typeof schemeFormSchema>

interface SchemeFormProps {
  defaultValues?: Partial<SchemeSelection>
  onSubmit: (values: SchemeSelection) => void
  onValuesChange?: (values: Partial<SchemeSelection>) => void
  className?: string
}

export function SchemeForm({ defaultValues, onSubmit, onValuesChange, className }: SchemeFormProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schemeFormSchema),
    defaultValues: {
      schemeId: defaultValues?.schemeId ?? '',
      amount: defaultValues?.amount ? String(defaultValues.amount) : '',
      tenure: defaultValues?.tenure ?? (undefined as unknown as number),
      paymentMethodId: defaultValues?.paymentMethodId ?? '',
    },
    mode: 'onTouched',
  })

  const values = useWatch({ control })
  const scheme = getScheme(values.schemeId)

  // keep the live summary in sync
  useEffect(() => {
    onValuesChange?.({
      schemeId: values.schemeId || undefined,
      amount: values.amount ? Number(String(values.amount).replace(/\D/g, '')) || undefined : undefined,
      tenure: values.tenure || undefined,
      paymentMethodId: values.paymentMethodId || undefined,
    })
  }, [values.schemeId, values.amount, values.tenure, values.paymentMethodId, onValuesChange])

  // reset tenure if the new scheme doesn't offer it
  useEffect(() => {
    if (scheme && values.tenure && !scheme.tenures.includes(values.tenure)) {
      setValue('tenure', undefined as unknown as number, { shouldValidate: false })
    }
  }, [scheme, values.tenure, setValue])

  const schemeOptions = useMemo(() => mockSchemes.map((s) => ({ value: s.id, label: s.name, description: s.tagline })), [])
  const tenureOptions = useMemo(
    () => (scheme?.tenures ?? [6, 12, 18, 24]).map((t) => ({ value: t, label: `${t} Months` })),
    [scheme],
  )
  const entrance = useEntrance()
  const paymentOptions = useMemo(() => mockPaymentMethods.map((p) => ({ value: p.id, label: p.label, description: p.description })), [])

  const completed = [
    Boolean(values.schemeId),
    Boolean(values.amount && Number(String(values.amount).replace(/\D/g, '')) > 0),
    Boolean(values.tenure),
    Boolean(values.paymentMethodId),
  ].filter(Boolean).length

  return (
    <motion.form
      noValidate
      onSubmit={handleSubmit((v) => onSubmit(v))}
      variants={staggerContainer(0.08, 0.2)}
      initial={entrance ? 'hidden' : false}
      animate="show"
      className={cn('flex flex-col gap-3 sm:gap-4', className)}
    >
      <motion.div variants={staggerItem}>
        <SchemeProgress completed={completed} total={4} />
      </motion.div>

      <motion.div variants={staggerItem}>
        <Controller
          control={control}
          name="schemeId"
          render={({ field }) => (
            <GoldSelect
              label="Scheme Name"
              icon={<Gem />}
              options={schemeOptions}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.schemeId?.message}
              placeholder="Select Scheme"
            />
          )}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <GoldInput
          label="Amount"
          icon={<IndianRupee />}
          prefix="₹"
          inputMode="numeric"
          autoComplete="off"
          maxLength={7}
          onInput={digitsOnly}
          error={errors.amount?.message}
          hint={scheme ? `${formatINR(scheme.minAmount, { whole: true })} – ${formatINR(scheme.maxAmount, { whole: true })} per month` : undefined}
          {...register('amount')}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <Controller
          control={control}
          name="tenure"
          render={({ field }) => (
            <GoldSelect
              label="Tenure"
              icon={<CalendarDays />}
              options={tenureOptions}
              value={field.value ?? null}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.tenure?.message}
              placeholder="Select Tenure"
            />
          )}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <Controller
          control={control}
          name="paymentMethodId"
          render={({ field }) => (
            <GoldSelect
              label="Payment Method"
              icon={<CreditCard />}
              options={paymentOptions}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.paymentMethodId?.message}
              placeholder="Select Payment Method"
            />
          )}
        />
      </motion.div>

      <motion.div variants={staggerItem} className="pt-2">
        <GoldButton type="submit" size="lg" fullWidth loading={isSubmitting} iconRight={<ArrowRight />}>
          Join Now
        </GoldButton>
      </motion.div>
    </motion.form>
  )
}

/** Four gold segments that fill as the form is completed. */
function SchemeProgress({ completed, total }: { completed: number; total: number }) {
  const pct = Math.round((completed / total) * 100)
  return (
    <div className="flex flex-col gap-2" aria-live="polite">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em]">
        <span className="text-gold-muted">Scheme Details</span>
        <span className="text-cream-faint lining-nums">
          {completed}/{total} complete
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
        aria-label={`${pct}% complete`}
        className="grid grid-cols-4 gap-1.5"
      >
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className="relative h-1.5 overflow-clip rounded-full bg-[rgba(249,223,50,0.12)]">
            <motion.span
              className="absolute inset-0 origin-left rounded-full gold-bg shadow-[0_0_10px_rgba(249,223,50,0.5)]"
              initial={false}
              animate={{ scaleX: i < completed ? 1 : 0 }}
              transition={{ duration: 0.5, ease: luxuryEase, delay: i < completed ? i * 0.05 : 0 }}
            />
          </span>
        ))}
      </div>
    </div>
  )
}
