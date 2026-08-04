import { createContext, useContext, useState } from 'react'
import { AUTH } from '../config/auth.config.js'

const AuthContext = createContext(null)

async function sha256(text) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(AUTH.SESSION_KEY) === 'true'
  )

  async function login(username, password) {
    if (username !== AUTH.USERNAME) return false
    const hash = await sha256(password)
    if (hash !== AUTH.PASSWORD_HASH) return false
    sessionStorage.setItem(AUTH.SESSION_KEY, 'true')
    setIsAuthenticated(true)
    return true
  }

  function logout() {
    sessionStorage.removeItem(AUTH.SESSION_KEY)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
