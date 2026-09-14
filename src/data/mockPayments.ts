/* ------------------------------------------------------------------
   DEMO DATA — payment (instalment) history.
   Replace with the live ledger; components depend only on `Payment`.
------------------------------------------------------------------- */

export type PaymentStatus = 'paid' | 'upcoming' | 'failed'

export interface Payment {
  id: string
  schemeId: string
  /** 1-based instalment number within the scheme. */
  installmentNo: number
  /** Total instalments in the scheme (tenure). */
  ofInstallments: number
  amount: number // INR
  /** ISO date (paid on, or due on for upcoming). */
  date: string
  paymentMethodId: string
  status: PaymentStatus
  referenceNo: string
}

export const mockPayments: Payment[] = [
  { id: 'p-6', schemeId: 'gold-savings', installmentNo: 6, ofInstallments: 12, amount: 5000, date: '2026-10-05', paymentMethodId: 'upi', status: 'upcoming', referenceNo: 'TKGD-INS-000106' },
  { id: 'p-5', schemeId: 'gold-savings', installmentNo: 5, ofInstallments: 12, amount: 5000, date: '2026-09-05', paymentMethodId: 'upi', status: 'paid', referenceNo: 'TKGD-INS-000105' },
  { id: 'p-4', schemeId: 'gold-savings', installmentNo: 4, ofInstallments: 12, amount: 5000, date: '2026-08-05', paymentMethodId: 'upi', status: 'paid', referenceNo: 'TKGD-INS-000104' },
  { id: 'p-3', schemeId: 'gold-savings', installmentNo: 3, ofInstallments: 12, amount: 5000, date: '2026-07-05', paymentMethodId: 'card', status: 'paid', referenceNo: 'TKGD-INS-000103' },
  { id: 'p-2', schemeId: 'gold-savings', installmentNo: 2, ofInstallments: 12, amount: 5000, date: '2026-06-05', paymentMethodId: 'upi', status: 'paid', referenceNo: 'TKGD-INS-000102' },
  { id: 'p-1', schemeId: 'gold-savings', installmentNo: 1, ofInstallments: 12, amount: 5000, date: '2026-05-05', paymentMethodId: 'upi', status: 'paid', referenceNo: 'TKGD-INS-000101' },
]

export const paymentsMockConfig = {
  isDemo: true,
  /** Flip to preview the designed empty state. */
  simulateEmpty: false,
}
