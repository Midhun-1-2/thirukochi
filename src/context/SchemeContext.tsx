import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { JoinedScheme, SchemeSelection } from '@/data'
import { readStorage, writeStorage } from '@/lib/storage'

/* ------------------------------------------------------------------
   Scheme enrolment flow state:
   Join (draft) → Details (review) → Success (confirmed)
------------------------------------------------------------------- */

interface SchemeState {
  draft: SchemeSelection | null
  lastJoined: JoinedScheme | null
  joined: JoinedScheme[]
}

interface SchemeContextValue extends SchemeState {
  setDraft: (draft: SchemeSelection) => void
  clearDraft: () => void
  confirmDraft: () => Promise<JoinedScheme | null>
}

const STORAGE_KEY = 'tkgd.scheme.v1'
const SchemeContext = createContext<SchemeContextValue | null>(null)

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

function makeReference(): string {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `TKGD-${n}`
}

export function SchemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SchemeState>(() =>
    readStorage<SchemeState>(STORAGE_KEY, { draft: null, lastJoined: null, joined: [] }),
  )

  useEffect(() => {
    writeStorage(STORAGE_KEY, state)
  }, [state])

  const setDraft = useCallback((draft: SchemeSelection) => setState((s) => ({ ...s, draft })), [])
  const clearDraft = useCallback(() => setState((s) => ({ ...s, draft: null })), [])

  const confirmDraft = useCallback(async () => {
    if (!state.draft) return null
    await wait(1100)
    const joined: JoinedScheme = {
      ...state.draft,
      id: `${Date.now()}`,
      joinedAt: new Date().toISOString(),
      referenceNo: makeReference(),
    }
    setState((s) => ({ draft: null, lastJoined: joined, joined: [joined, ...s.joined] }))
    return joined
  }, [state.draft])

  const value = useMemo<SchemeContextValue>(
    () => ({ ...state, setDraft, clearDraft, confirmDraft }),
    [state, setDraft, clearDraft, confirmDraft],
  )

  return <SchemeContext.Provider value={value}>{children}</SchemeContext.Provider>
}

export function useSchemeFlow(): SchemeContextValue {
  const ctx = useContext(SchemeContext)
  if (!ctx) throw new Error('useSchemeFlow must be used within <SchemeProvider>')
  return ctx
}
