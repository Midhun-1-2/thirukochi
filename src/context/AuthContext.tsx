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
    // Showcase build: any code (even blank) verifies. Restore the `code === mockAuthConfig.otp`
    // check above for production.
    void code
    setState((s) => (s.registration ? { ...s, registration: { ...s.registration, otpVerified: true } } : s))
    return true
  }, [])

  const resendOtp = useCallback(async () => {
    await wait(500)
  }, [])

  const setMpin = useCallback<AuthContextValue['setMpin']>(async (mpin) => {
    await wait(mockAuthConfig.latencyMs)
    setState((s) => {
      if (!s.registration) return s
      const account: StoredAccount = {
        // Showcase build: blank name falls back to the demo member's name.
        name: s.registration.name.trim() || mockAuthConfig.demoUser.name,
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
      // Showcase build: any phone + MPIN signs in, even blank fields. A number already
      // registered in this demo keeps its own name; anything else walks in as the demo
      // member. Restore the match/MPIN checks above for production.
      void mpin
      const demo = mockAuthConfig.demoUser
      const match = state.account?.phone === phone ? state.account : null
      const account: StoredAccount = match ?? {
        name: demo.name,
        phone: phone || demo.phone,
        mpin: demo.mpin,
        referralCode: mockProfile.referralCode,
        memberSince: mockProfile.memberSince,
      }
      setState((s) => ({ ...s, account, session: { phone: account.phone } }))
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
