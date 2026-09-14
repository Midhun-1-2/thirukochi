import { Activity, Gift, Home, ReceiptIndianRupee, User, Wallet, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Show in the mobile bottom navigation. */
  mobile?: boolean
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Home', icon: Home, mobile: true },
  { to: '/wallet', label: 'Wallet', icon: Wallet, mobile: true },
  { to: '/schemes', label: 'Schemes', icon: Gift },
  { to: '/payments', label: 'Payments', icon: ReceiptIndianRupee, mobile: true },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/profile', label: 'Profile', icon: User, mobile: true },
]

export const routes = {
  register: '/register',
  verifyOtp: '/verify-otp',
  setMpin: '/set-mpin',
  login: '/login',
  home: '/',
  wallet: '/wallet',
  schemes: '/schemes',
  payments: '/payments',
  activity: '/activity',
  profile: '/profile',
  joinScheme: '/schemes/join',
  schemeDetails: '/schemes/details',
  schemeSuccess: '/schemes/success',
} as const

export const authPaths = new Set<string>([routes.register, routes.verifyOtp, routes.setMpin, routes.login])
