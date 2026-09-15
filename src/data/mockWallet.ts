/** DEMO DATA — wallet placeholders (no real balances). */
export interface WalletTransaction {
  id: string
  title: string
  amount: number
  date: string
}

export interface ReferralCredit {
  id: string
  friendName: string
  amount: number
  /** ISO date credited (or expected, if pending). */
  date: string
  status: 'credited' | 'pending'
}

export const mockReferralCredits: ReferralCredit[] = [
  { id: 'r-3', friendName: 'Sabu Thomas', amount: 250, date: '2026-09-10', status: 'pending' },
  { id: 'r-2', friendName: 'Divya Nair', amount: 250, date: '2026-08-18', status: 'credited' },
  { id: 'r-1', friendName: 'Arjun Menon', amount: 250, date: '2026-07-02', status: 'credited' },
]

export const mockWallet = {
  goldGrams: 0,
  valueINR: 0,
  referralEarningsINR: mockReferralCredits.filter((c) => c.status === 'credited').reduce((sum, c) => sum + c.amount, 0),
  isDemo: true,
  transactions: [] as WalletTransaction[],
}
