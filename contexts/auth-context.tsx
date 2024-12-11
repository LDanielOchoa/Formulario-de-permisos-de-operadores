'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  code: string
  name: string
  role: 'admin' | 'operator'
}

interface AuthContextType {
  user: User | null
  login: (code: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (code: string) => {
    try {
      let user: User
      if (code === 'sao6admin') {
        user = {
          id: '1',
          code: 'sao6admin',
          name: 'Administrador',
          role: 'admin',
        }
      } else {
        user = {
          id: code,
          code: code,
          name: `Operador ${code}`,
          role: 'operator',
        }
      }
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      router.push(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

