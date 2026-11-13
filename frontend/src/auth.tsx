import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { type Account, ApiError, fetchAccount, login as apiLogin, logout as apiLogout, register as apiRegister, setAuthToken, setSignedOutHandler } from './api'

/** Signed-in customer. The token is kept in this browser so the customer stays signed in. */
type AuthState = {
  account: Account | null
  ready: boolean
  signIn: (email: string, password: string) => Promise<Account>
  signUp: (name: string, email: string, password: string) => Promise<Account>
  signOut: () => Promise<void>
  setAccount: (a: Account) => void
}

const TOKEN_KEY = 'hx-token'
const read = () => { try { return localStorage.getItem(TOKEN_KEY) } catch { return null } }
const write = (t: string | null) => {
  setAuthToken(t)
  try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY) } catch { /* storage unavailable */ }
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null)
  const [ready, setReady] = useState(false)

  // The server ended the session (expired): forget it here too.
  useEffect(() => { setSignedOutHandler(() => { write(null); setAccount(null) }) }, [])

  // Restore a saved session on load.
  useEffect(() => {
    const token = read()
    if (!token) { setReady(true); return }
    setAuthToken(token)
    fetchAccount()
      .then(setAccount)
      .catch(e => { if (e instanceof ApiError && e.status === 401) write(null) })  // expired or signed out elsewhere
      .finally(() => setReady(true))
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const s = await apiLogin({ email, password })
    write(s.token); setAccount(s.account); return s.account
  }, [])
  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const s = await apiRegister({ name, email, password })
    write(s.token); setAccount(s.account); return s.account
  }, [])
  const signOut = useCallback(async () => {
    try { await apiLogout() } catch { /* already signed out on the server */ }
    write(null); setAccount(null)
  }, [])

  const value = useMemo(() => ({ account, ready, signIn, signUp, signOut, setAccount }), [account, ready, signIn, signUp, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export const firstName = (a: Account | null) => (a?.name || '').trim().split(/\s+/)[0] || ''
