import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useAppStore } from '../../store/appStore'
import Sidebar from './Sidebar'
import Header from './Header'

function AppLoadingBar() {
  return (
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-duodi-gradient animate-pulse z-50" />
  )
}

export default function Layout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const appLoading      = useAppStore((s) => s.loading)
  const appReady        = useAppStore((s) => s.initialized)

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="flex h-screen overflow-hidden bg-brand-dark relative">
      {(appLoading && !appReady) && <AppLoadingBar />}
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
