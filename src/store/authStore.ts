import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { USERS } from '../data/mockData'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isDarkMode: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  toggleDarkMode: () => void
}

// Hardcoded credentials for demo
const CREDENTIALS: Record<string, string> = {
  'admin@duodi.com': 'duodi2025',
  'valen@duodi.com': 'duodi2025',
  'mateo@duodi.com': 'duodi2025',
  'camila@duodi.com': 'duodi2025',
  'luis@clinicasmile.com': 'cliente2025',
  'ana@restaurantebello.com': 'cliente2025',
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isDarkMode: true,

      login: async (email: string, password: string) => {
        await new Promise((r) => setTimeout(r, 800))
        const expectedPwd = CREDENTIALS[email.toLowerCase()]
        if (!expectedPwd || expectedPwd !== password) return false
        const user = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (!user) return false
        set({ user, isAuthenticated: true })
        return true
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      toggleDarkMode: () => set((s) => {
        const next = !s.isDarkMode
        if (next) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        return { isDarkMode: next }
      }),
    }),
    {
      name: 'duodi-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, isDarkMode: state.isDarkMode }),
    }
  )
)
