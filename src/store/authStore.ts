import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import type { User } from '../types'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isDarkMode: boolean
  loading: boolean

  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  toggleDarkMode: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isDarkMode: true,
      loading: true,

      initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const profile = await getProfile(session.user.id)
          if (profile) set({ user: profile, isAuthenticated: true })
        }
        set({ loading: false })

        supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
          if (session?.user) {
            const profile = await getProfile(session.user.id)
            if (profile) set({ user: profile, isAuthenticated: true, loading: false })
          } else {
            set({ user: null, isAuthenticated: false, loading: false })
          }
        })
      },

      login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error || !data.user) return false
        const profile = await getProfile(data.user.id)
        if (!profile) return false
        set({ user: profile, isAuthenticated: true })
        return true
      },

      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, isAuthenticated: false })
      },

      toggleDarkMode: () =>
        set((s) => {
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
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
)
