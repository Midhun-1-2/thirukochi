/* ------------------------------------------------------------------
   Domain types. These mirror the shape a future backend is expected
   to return so components never need to change when APIs land.
------------------------------------------------------------------- */

export type Purity = '24K' | '22K' | '18K'

export interface GoldRate {
  id: string
  label: string // "1 Gram"
  weightGrams: number
  purity: Purity
  price: number // INR
  change: number // INR delta vs previous update (negative = down)
  history: number[] // recent price points for the sparkline
}

export interface GoldRateData {
  date: string // display date, e.g. "14/09/2026"
  updatedAt: string // ISO timestamp
  live: boolean
  isDemo: boolean
  rates: GoldRate[]
}

export interface Scheme {
  id: string
  name: string
  tagline: string
  description: string
  minAmount: number
  maxAmount: number
  amountStep: number
  tenures: number[] // months
  benefits: string[]
  accent?: 'gold' | 'maroon'
}

export interface PaymentMethod {
  id: string
  label: string
  description: string
}

export interface SchemeSelection {
  schemeId: string
  amount: number
  tenure: number
  paymentMethodId: string
}

export interface JoinedScheme extends SchemeSelection {
  id: string
  joinedAt: string
  referenceNo: string
}

export type ActivityType = 'scheme' | 'payment' | 'rate' | 'reminder' | 'offer'

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  time: string // display string, e.g. "2h ago"
  unread?: boolean
}

export interface PromoSlide {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  cta: string
  href: string
  image: string // public path
}

export interface SocialLink {
  id: 'instagram' | 'facebook' | 'youtube'
  label: string
  href: string
}

export interface UserProfile {
  name: string
  phone: string
  referralCode: string
  memberSince: string
}
