import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, Sun, Moon, X, Check } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useAppStore } from '../../store/appStore'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import clsx from 'clsx'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Proyectos',
  '/content': 'Contenido & Videos',
  '/tasks': 'Tareas',
  '/calendar': 'Calendario Editorial',
  '/resources': 'Biblioteca de Recursos',
  '/reports': 'Reportes & KPIs',
  '/clients': 'Clientes',
  '/chat': 'Chat',
  '/settings': 'Configuración',
}

const NOTIFICATION_ICONS: Record<string, string> = {
  task: '✅',
  comment: '💬',
  mention: '@',
  approval: '👁️',
  deadline: '⏰',
}

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isDarkMode, toggleDarkMode } = useAuthStore()
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const notifsRef = useRef<HTMLDivElement>(null)

  const title = Object.entries(PAGE_TITLES).find(([path]) => location.pathname.startsWith(path))?.[1] ?? 'DUODI Brand'
  const unread = notifications.filter((n) => !n.read)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setShowNotifs(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="h-16 bg-brand-surface border-b border-brand-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-white">{title}</h1>
        {user?.role === 'admin' && (
          <span className="badge-purple text-[10px]">Admin</span>
        )}
        {user?.role === 'client' && (
          <span className="badge-blue text-[10px]">Cliente</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        {showSearch ? (
          <div className="flex items-center gap-2 bg-brand-card border border-brand-border rounded-lg px-3 py-1.5 w-64 animate-slide-in">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar proyectos, tareas..."
              className="bg-transparent text-sm text-gray-100 placeholder-gray-500 outline-none flex-1"
            />
            <button onClick={() => { setShowSearch(false); setSearchQuery('') }} className="text-gray-400 hover:text-gray-200">
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-brand-card transition-colors"
          >
            <Search size={18} />
          </button>
        )}

        {/* Dark mode */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-brand-card transition-colors"
          title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifsRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-brand-card transition-colors"
          >
            <Bell size={18} />
            {unread.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-duodi-500 rounded-full" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-brand-card border border-brand-border rounded-xl shadow-card z-50 overflow-hidden animate-slide-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
                <h3 className="font-semibold text-sm text-white">Notificaciones</h3>
                {unread.length > 0 && (
                  <button onClick={markAllNotificationsRead} className="text-xs text-duodi-400 hover:text-duodi-300 flex items-center gap-1">
                    <Check size={12} /> Marcar todas
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm py-6">Sin notificaciones</p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={clsx(
                        'w-full text-left px-4 py-3 border-b border-brand-border/50 hover:bg-brand-surface transition-colors flex gap-3 items-start',
                        !n.read && 'bg-duodi-900/20'
                      )}
                    >
                      <span className="text-lg leading-none mt-0.5">{NOTIFICATION_ICONS[n.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className={clsx('text-xs font-medium truncate', !n.read ? 'text-white' : 'text-gray-300')}>{n.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-gray-600 mt-1">
                          {formatDistanceToNow(new Date(n.createdAt), { locale: es, addSuffix: true })}
                        </p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-duodi-500 shrink-0 mt-1.5" />}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        {user && (
          <button onClick={() => navigate('/settings')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-brand-border"
            />
          </button>
        )}
      </div>
    </header>
  )
}
