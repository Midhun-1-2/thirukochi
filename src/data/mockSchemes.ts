import type { PaymentMethod, Scheme } from './types'

/**
 * DEMO DATA — scheme catalogue placeholders.
 * Benefit copy is intentionally generic; no returns or guarantees
 * are stated. Replace with the approved product catalogue.
 */
export const mockSchemes: Scheme[] = [
  {
    id: 'gold-savings',
    name: 'Gold Savings Scheme',
    tagline: 'Save today, secure tomorrow.',
    description: 'A monthly savings plan towards your future jewellery purchase at Thirukochi.',
    minAmount: 1000,
    maxAmount: 100000,
    amountStep: 500,
    tenures: [6, 12, 18, 24],
    benefits: ['Attractive returns', 'Safe & secure', 'Flexible tenure', 'Trusted by lakhs'],
    accent: 'gold',
  },
  {
    id: 'diamond-advantage',
    name: 'Diamond Advantage Plan',
    tagline: 'Brilliance, one instalment at a time.',
    description: 'A savings plan tailored towards diamond jewellery purchases.',
    minAmount: 2000,
    maxAmount: 200000,
    amountStep: 500,
    tenures: [12, 18, 24],
    benefits: ['Attractive returns', 'Safe & secure', 'Flexible tenure', 'Trusted by lakhs'],
    accent: 'maroon',
  },
  {
    id: 'flexi-gold',
    name: 'Flexi Gold Plan',
    tagline: 'Your pace. Your gold.',
    description: 'A flexible plan that lets you choose how much you set aside each month.',
    minAmount: 500,
    maxAmount: 50000,
    amountStep: 500,
    tenures: [6, 9, 12],
    benefits: ['Attractive returns', 'Safe & secure', 'Flexible tenure', 'Trusted by lakhs'],
    accent: 'gold',
  },
]

export const mockPaymentMethods: PaymentMethod[] = [
  { id: 'upi', label: 'UPI', description: 'Pay instantly with any UPI app' },
  { id: 'netbanking', label: 'Net Banking', description: 'All major Indian banks supported' },
  { id: 'card', label: 'Debit Card', description: 'Visa, Mastercard, RuPay' },
  { id: 'autodebit', label: 'Auto-debit (SI)', description: 'Standing instruction on your bank account' },
]

export const defaultSchemeSelection = {
  schemeId: 'gold-savings',
  amount: 5000,
  tenure: 12,
  paymentMethodId: 'upi',
} as const

export function getScheme(id: string | undefined): Scheme | undefined {
  return mockSchemes.find((s) => s.id === id)
}

export function getPaymentMethod(id: string | undefined): PaymentMethod | undefined {
  return mockPaymentMethods.find((p) => p.id === id)
}
