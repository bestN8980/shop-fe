import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const stored = localStorage.getItem('user')
    if (token && stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    const res = await authAPI.login(credentials)
    const { access_token } = res.data
    localStorage.setItem('token', access_token)
    const meRes = await authAPI.getMe()
    localStorage.setItem('user', JSON.stringify(meRes.data))
    setUser(meRes.data)
    return meRes.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const refreshUser = async () => {
    const res = await authAPI.getMe()
    localStorage.setItem('user', JSON.stringify(res.data))
    setUser(res.data)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
