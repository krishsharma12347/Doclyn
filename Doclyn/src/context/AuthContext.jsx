import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import api, { tokenStore } from '../services/api'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = localStorage.getItem('doclyn_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  // Token lives in memory for renders, and in localStorage so a refresh keeps the session.
  const [accessToken, setAccessToken] = useState(() => tokenStore.getAccess())
  const [user, setUser] = useState(() => readStoredUser())

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    const payload = data?.data || data || {}

    const access = payload.access_token || payload.accessToken
    const refresh = payload.refresh_token || payload.refreshToken
    if (!access) throw new Error('Login response did not include an access token.')

    tokenStore.set(access, refresh)
    setAccessToken(access)

    const nextUser = payload.user || { email }
    localStorage.setItem('doclyn_user', JSON.stringify(nextUser))
    setUser(nextUser)

    return nextUser
  }, [])

  // Register does NOT sign the user in — the caller redirects to /login on success.
  const register = useCallback(async ({ name, email, password }) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    return data?.data || data || {}
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    localStorage.removeItem('doclyn_user')
    setAccessToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken),
      login,
      register,
      logout,
    }),
    [user, accessToken, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export default AuthContext
