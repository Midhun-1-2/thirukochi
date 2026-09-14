import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { mockAuthConfig, mockProfile } from '@/data'
import type { UserProfile } from '@/data'
import { readStorage, removeStorage, writeStorage } from '@/lib/storage'

/* ------------------------------------------------------------------
   Mock authentication.
   Replace the async methods with real API calls; the shape of the
   context value is designed to stay the same.
------------------------------------------------------------------- */

interface StoredAccount {
  name: string
  phone: string
  mpin: string
  referralCode: string
  memberSince: string
}

interface Registration {
  name: string
  phone: string
  otpVerified: boolean
}

interface AuthState {
  account: StoredAccount | null
  registration: Registration | null
  session: { phone: string } | null
}

export interface AuthContextValue {
  /** Registered account (mock persistence). */
  account: StoredAccount | null
  /** In-progress registration (name + phone before MPIN is set). */
  registration: Registration | null
  isAuthenticated: boolean
  user: UserProfile | null

  startRegistration: (input: { name: string; phone: string }) => Promise<void>
  verifyOtp: (code: string) => Promise<boolean>
  resendOtp: () => Promise<void>
  setMpin: (mpin: string) => Promise<void>
  login: (input: { phone: string; mpin: string }) => Promise<{ ok: true } | { ok: false; reason: string }>
  logout: () => void
}

const STORAGE_KEY = 'tkgd.auth.v1'

const AuthContext = createContext<AuthContextValue | null>(null)

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

function loadInitial(): AuthState {
  const stored = readStorage<AuthState | null>(STORAGE_KEY, null)
  if (stored) return { account: stored.account ?? null, registration: stored.registration ?? null, session: stored.session ?? null }
  return { account: null, registration: null, session: null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadInitial)

  useEffect(() => {
    writeStorage(STORAGE_KEY, state)
  }, [state])

  const startRegistration = useCallback<AuthContextValue['startRegistration']>(async ({ name, phone }) => {
    await wait(mockAuthConfig.latencyMs)
    setState((s) => ({ ...s, registration: { name, phone, otpVerified: false } }))
  }, [])

  const verifyOtp = useCallback<AuthContextValue['verifyOtp']>(async (code) => {
    await wait(mockAuthConfig.latencyMs)
    const ok = code === mockAuthConfig.otp
    if (ok) setState((s) => (s.registration ? { ...s, registration: { ...s.registration, otpVerified: true } } : s))
    return ok
  }, [])

  const resendOtp = useCallback(async () => {
    await wait(500)
  }, [])

  const setMpin = useCallback<AuthContextValue['setMpin']>(async (mpin) => {
    await wait(mockAuthConfig.latencyMs)
    setState((s) => {
      if (!s.registration) return s
      const account: StoredAccount = {
        name: s.registration.name,
        phone: s.registration.phone,
        mpin,
        referralCode: mockProfile.referralCode,
        memberSince: mockProfile.memberSince,
      }
      return { account, registration: null, session: null }
    })
  }, [])

  const login = useCallback<AuthContextValue['login']>(
    async ({ phone, mpin }) => {
      await wait(mockAuthConfig.latencyMs)
      const demo = mockAuthConfig.demoUser
      const candidates: StoredAccount[] = []
      if (state.account) candidates.push(state.account)
      candidates.push({
        name: demo.name,
        phone: demo.phone,
        mpin: demo.mpin,
        referralCode: mockProfile.referralCode,
        memberSince: mockProfile.memberSince,
      })
      const match = candidates.find((c) => c.phone === phone)
      if (!match) return { ok: false, reason: 'We could not find an account with this number.' }
      if (match.mpin !== mpin) return { ok: false, reason: 'Incorrect MPIN. Please try again.' }
      setState((s) => ({ ...s, account: match, session: { phone: match.phone } }))
      return { ok: true }
    },
    [state.account],
  )

  const logout = useCallback(() => {
    setState((s) => ({ ...s, session: null }))
    removeStorage('tkgd.scheme.v1')
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const isAuthenticated = Boolean(state.session && state.account && state.session.phone === state.account.phone)
    const user: UserProfile | null =
      isAuthenticated && state.account
        ? {
            name: state.account.name,
            phone: state.account.phone,
            referralCode: state.account.referralCode,
            memberSince: state.account.memberSince,
          }
        : null
    return {
      account: state.account,
      registration: state.registration,
      isAuthenticated,
      user,
      startRegistration,
      verifyOtp,
      resendOtp,
      setMpin,
      login,
      logout,
    }
  }, [state, startRegistration, verifyOtp, resendOtp, setMpin, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
