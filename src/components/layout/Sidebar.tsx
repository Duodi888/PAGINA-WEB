import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FolderKanban, Video, CheckSquare,
  CalendarDays, Library, BarChart3, Users, MessageSquare,
  ChevronLeft, ChevronRight, Settings, LogOut
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useAppStore } from '../../store/appStore'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/projects',  icon: FolderKanban,    label: 'Proyectos'  },
  { to: '/content',   icon: Video,           label: 'Contenido'  },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tareas'     },
  { to: '/calendar',  icon: CalendarDays,    label: 'Calendario' },
  { to: '/resources', icon: Library,         label: 'Recursos'   },
  { to: '/reports',   icon: BarChart3,       label: 'Reportes'   },
  { to: '/clients',   icon: Users,           label: 'Clientes'   },
  { to: '/chat',      icon: MessageSquare,   label: 'Chat'       },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { sidebarCollapsed, setSidebarCollapsed, notifications } = useAppStore()
  const location    = useLocation()
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <aside
      className={clsx(
        'flex flex-col h-full bg-sidebar-gradient border-r border-brand-border transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={clsx('flex items-center h-16 px-4 border-b border-brand-border shrink-0', sidebarCollapsed ? 'justify-center' : 'gap-3')}>
        <div className="w-8 h-8 rounded-xl bg-duodi-gradient shadow-duodi-sm flex items-center justify-center shrink-0 overflow-hidden">
          <img src="/PAGINA-WEB/brand/rocket-sticker.png" alt="DUODI" className="w-full h-full object-cover scale-125" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p className="font-display text-sm text-gradient leading-none tracking-tight">DUODI</p>
            <p className="text-[10px] text-brand-muted leading-none mt-0.5 font-medium">Brand Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive        = location.pathname.startsWith(to)
          const isChatWithBadge = to === '/chat' && unreadCount > 0
          return (
            <NavLink
              key={to}
              to={to}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group',
                isActive
                  ? 'bg-duodi-gradient-soft text-duodi-300 border border-duodi-600/30'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-brand-surface/80'
              )}
            >
              <Icon size={18} className="shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{label}</span>}
              {isChatWithBadge && (
                <span className={clsx(
                  'bg-duodi-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center',
                  sidebarCollapsed ? 'absolute top-1.5 right-1.5 w-4 h-4' : 'ml-auto w-5 h-5'
                )}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-brand-card border border-brand-border rounded-xl text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-card">
                  {label}
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Brand mascot */}
      {!sidebarCollapsed && (
        <div className="px-4 pb-2 flex justify-center">
          <img
            src="/PAGINA-WEB/brand/alien-fist-sticker.png"
            alt="DUODI mascot"
            className="w-14 opacity-55 hover:opacity-85 transition-opacity hover:scale-105 transform duration-200 select-none"
          />
        </div>
      )}

      {/* Bottom */}
      <div className="border-t border-brand-border p-2 space-y-0.5 shrink-0">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-100 hover:bg-brand-surface/80 transition-all duration-200 group relative"
        >
          <Settings size={18} className="shrink-0" />
          {!sidebarCollapsed && <span>Configuración</span>}
          {sidebarCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-brand-card border border-brand-border rounded-xl text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-card">
              Configuración
            </div>
          )}
        </NavLink>

        {user && (
          <div className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl', sidebarCollapsed ? 'justify-center' : '')}>
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-7 h-7 rounded-full shrink-0 border border-brand-border"
            />
            {!sidebarCollapsed && (
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-semibold text-gray-200 truncate">{user.name}</p>
                <p className="text-[10px] text-brand-muted truncate capitalize">{user.role}</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button onClick={logout} className="text-brand-muted hover:text-red-400 transition-colors" title="Cerrar sesión">
                <LogOut size={15} />
              </button>
            )}
          </div>
        )}

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-brand-muted hover:text-gray-300 hover:bg-brand-surface/80 transition-all duration-200 text-xs font-medium"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Colapsar</span></>}
        </button>
      </div>
    </aside>
  )
}
