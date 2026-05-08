'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/src/store/authStore'
import { useAppStore } from '@/src/store/appStore'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, initialize } = useAuthStore()
  const { initialize: initApp } = useAppStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    initialize().then(() => {
      const state = useAuthStore.getState()
      if (state.isAuthenticated && state.user) {
        initApp(state.user.id)
      }
    })
  }, [])

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [mounted, loading, isAuthenticated, router])

  if (!mounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-dark">
        <div className="w-8 h-8 border-2 border-duodi-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen overflow-hidden bg-brand-dark">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  )
}
