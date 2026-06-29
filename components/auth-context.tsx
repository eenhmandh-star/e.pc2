'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  name: string
  email: string
}

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string, name?: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'epc_user'
const ACCOUNTS_KEY = 'epc_accounts'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setUser(JSON.parse(stored))
    } catch {}
    setIsLoading(false)
  }, [])

  function login(email: string, password: string, name?: string): boolean {
    try {
      const accountsRaw = localStorage.getItem(ACCOUNTS_KEY)
      const accounts: Record<string, { name: string; password: string }> = accountsRaw
        ? JSON.parse(accountsRaw)
        : {}

      if (name) {
        // Register
        if (accounts[email]) return false
        accounts[email] = { name, password }
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
        const newUser = { name, email }
        setUser(newUser)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
        return true
      } else {
        // Login
        const account = accounts[email]
        if (!account || account.password !== password) return false
        const loggedUser = { name: account.name, email }
        setUser(loggedUser)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser))
        return true
      }
    } catch {
      return false
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
