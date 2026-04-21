import { useState } from 'react'
import { User, Bell, Shield, Palette, Moon, Sun, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { USERS } from '../data/mockData'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user, logout, isDarkMode, toggleDarkMode } = useAuthStore()
  const [notifSettings, setNotifSettings] = useState({
    tasks: true, comments: true, mentions: true, approvals: true, deadlines: true,
  })

  const handleSave = () => toast.success('Configuración guardada')

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-duodi-400" />
          <h3 className="font-bold text-white">Perfil</h3>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            className="w-16 h-16 rounded-2xl border-2 border-brand-border"
            alt=""
          />
          <div>
            <p className="font-bold text-white">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <span className="badge-purple text-[10px] mt-1 capitalize">{user?.role}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Nombre</label>
            <input defaultValue={user?.name} className="input text-sm py-2" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Cargo</label>
            <input defaultValue={user?.position} className="input text-sm py-2" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
            <input defaultValue={user?.email} className="input text-sm py-2" type="email" />
          </div>
        </div>
        <button onClick={handleSave} className="btn-primary mt-4 py-2 px-6 text-sm">Guardar Cambios</button>
      </div>

      {/* Appearance */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={16} className="text-duodi-400" />
          <h3 className="font-bold text-white">Apariencia</h3>
        </div>
        <div className="flex items-center justify-between p-3 bg-brand-surface rounded-lg">
          <div className="flex items-center gap-3">
            {isDarkMode ? <Moon size={18} className="text-duodi-400" /> : <Sun size={18} className="text-yellow-400" />}
            <div>
              <p className="text-sm font-medium text-white">Modo {isDarkMode ? 'Oscuro' : 'Claro'}</p>
              <p className="text-xs text-gray-400">Cambia la apariencia de la plataforma</p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-all ${isDarkMode ? 'bg-duodi-600' : 'bg-gray-600'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-duodi-400" />
          <h3 className="font-bold text-white">Notificaciones</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: 'tasks', label: 'Tareas asignadas', desc: 'Cuando te asignen una nueva tarea' },
            { key: 'comments', label: 'Comentarios en contenido', desc: 'Nuevos comentarios en videos o diseños' },
            { key: 'mentions', label: 'Menciones', desc: 'Cuando alguien te mencione en el chat' },
            { key: 'approvals', label: 'Aprobaciones pendientes', desc: 'Contenido listo para tu revisión' },
            { key: 'deadlines', label: 'Fechas límite', desc: 'Recordatorios de tareas por vencer' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-brand-surface rounded-lg">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <button
                onClick={() => setNotifSettings((s) => ({ ...s, [key]: !s[key as keyof typeof s] }))}
                className={`relative w-10 h-5 rounded-full transition-all ${notifSettings[key as keyof typeof notifSettings] ? 'bg-duodi-600' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${notifSettings[key as keyof typeof notifSettings] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-duodi-400" />
          <h3 className="font-bold text-white">Seguridad</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Contraseña actual</label>
            <input type="password" className="input text-sm py-2" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Nueva contraseña</label>
            <input type="password" className="input text-sm py-2" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirmar contraseña</label>
            <input type="password" className="input text-sm py-2" placeholder="••••••••" />
          </div>
          <button onClick={() => toast.success('Contraseña actualizada')} className="btn-primary py-2 px-6 text-sm">Cambiar Contraseña</button>
        </div>
      </div>

      {/* Team (admin only) */}
      {user?.role === 'admin' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User size={16} className="text-duodi-400" />
              <h3 className="font-bold text-white">Equipo DUODI</h3>
            </div>
          </div>
          <div className="space-y-2">
            {USERS.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 bg-brand-surface rounded-lg">
                <img src={u.avatar} className="w-8 h-8 rounded-full" alt="" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <span className={`text-[10px] ${u.role === 'admin' ? 'badge-purple' : u.role === 'client' ? 'badge-blue' : 'badge-green'}`}>
                  {u.role === 'admin' ? 'Admin' : u.role === 'client' ? 'Cliente' : 'Colaborador'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={() => { logout(); toast.success('Sesión cerrada') }}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-900/40 text-red-400 hover:bg-red-900/20 transition-colors text-sm font-medium"
      >
        <LogOut size={16} />
        Cerrar Sesión
      </button>
    </div>
  )
}
