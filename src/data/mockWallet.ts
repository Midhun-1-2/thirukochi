/** DEMO DATA — wallet placeholders (no real balances). */
export interface WalletTransaction {
  id: string
  title: string
  amount: number
  date: string
}

export const mockWallet = {
  goldGrams: 0,
  valueINR: 0,
  isDemo: true,
  transactions: [] as WalletTransaction[],
}
