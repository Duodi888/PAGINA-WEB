import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/authStore'

export default function Login() {
  const { login, isAuthenticated } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (!ok) toast.error('Credenciales incorrectas. Intenta de nuevo.')
  }

  const fillDemo = (role: 'admin' | 'collaborator' | 'client') => {
    if (role === 'admin') { setEmail('admin@duodi.com'); setPassword('duodi2025') }
    if (role === 'collaborator') { setEmail('valen@duodi.com'); setPassword('duodi2025') }
    if (role === 'client') { setEmail('luis@clinicasmile.com'); setPassword('cliente2025') }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-duodi-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-duodi-gradient shadow-duodi mb-4">
            <span className="text-white font-black text-2xl">D</span>
          </div>
          <h1 className="text-3xl font-black text-gradient mb-1">DUODI Brand</h1>
          <p className="text-gray-400 text-sm">Plataforma de Gestión de Marketing</p>
        </div>

        {/* Form */}
        <div className="card border-brand-border/60">
          <h2 className="text-xl font-bold text-white mb-6">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="tu@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Ingresar
                </>
              )}
            </button>
          </form>

          {/* Demo access */}
          <div className="mt-6 pt-5 border-t border-brand-border">
            <p className="text-xs text-gray-500 mb-3 text-center">Acceso rápido demo</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => fillDemo('admin')} className="text-xs py-2 px-2 rounded-lg bg-duodi-900/40 border border-duodi-700/40 text-duodi-300 hover:bg-duodi-900/70 transition-colors">
                👑 Admin
              </button>
              <button onClick={() => fillDemo('collaborator')} className="text-xs py-2 px-2 rounded-lg bg-green-900/30 border border-green-700/30 text-green-300 hover:bg-green-900/50 transition-colors">
                🎨 Collab
              </button>
              <button onClick={() => fillDemo('client')} className="text-xs py-2 px-2 rounded-lg bg-blue-900/30 border border-blue-700/30 text-blue-300 hover:bg-blue-900/50 transition-colors">
                🏢 Cliente
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          © 2025 DUODI Brand Platform. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
