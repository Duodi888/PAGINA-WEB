import { useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Rocket } from 'lucide-react'
import Layout from './components/layout/Layout'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Content from './pages/Content'
import Tasks from './pages/Tasks'
import Calendar from './pages/Calendar'
import Resources from './pages/Resources'
import Reports from './pages/Reports'
import Clients from './pages/Clients'
import Chat from './pages/Chat'
import Settings from './pages/Settings'
import { useAuthStore } from './store/authStore'
import { useAppStore } from './store/appStore'

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-duodi-gradient shadow-duodi flex items-center justify-center">
          <Rocket size={24} className="text-white" />
        </div>
        <div className="w-6 h-6 border-2 border-duodi-500/30 border-t-duodi-400 rounded-full animate-spin" />
      </div>
    </div>
  )
}

export default function App() {
  const initialize  = useAuthStore((s) => s.initialize)
  const authLoading = useAuthStore((s) => s.loading)
  const user        = useAuthStore((s) => s.user)
  const initApp     = useAppStore((s) => s.initialize)
  const appReady    = useAppStore((s) => s.initialized)

  useEffect(() => { initialize() }, [initialize])

  useEffect(() => {
    if (user && !appReady) initApp(user.id)
  }, [user, appReady, initApp])

  if (authLoading) return <LoadingScreen />

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard"  element={<Dashboard />}  />
          <Route path="/projects"   element={<Projects />}   />
          <Route path="/content"    element={<Content />}    />
          <Route path="/tasks"      element={<Tasks />}      />
          <Route path="/calendar"   element={<Calendar />}   />
          <Route path="/resources"  element={<Resources />}  />
          <Route path="/reports"    element={<Reports />}    />
          <Route path="/clients"    element={<Clients />}    />
          <Route path="/chat"       element={<Chat />}       />
          <Route path="/settings"   element={<Settings />}   />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  )
}
