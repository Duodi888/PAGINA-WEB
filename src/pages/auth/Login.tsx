import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff, Rocket } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/authStore'

const STARS = [
  { top: '8%',  left: '12%', size: 2,   delay: '0s'   },
  { top: '15%', left: '78%', size: 1.5, delay: '0.8s' },
  { top: '22%', left: '45%', size: 1,   delay: '1.5s' },
  { top: '35%', left: '88%', size: 2,   delay: '0.4s' },
  { top: '50%', left: '6%',  size: 1.5, delay: '2.1s' },
  { top: '62%', left: '92%', size: 1,   delay: '1.2s' },
  { top: '72%', left: '55%', size: 2,   delay: '0.6s' },
  { top: '80%', left: '20%', size: 1.5, delay: '1.8s' },
  { top: '90%', left: '68%', size: 1,   delay: '0.3s' },
  { top: '5%',  left: '60%', size: 1,   delay: '2.4s' },
  { top: '42%', left: '33%', size: 1.5, delay: '0.9s' },
  { top: '68%', left: '75%', size: 2,   delay: '1.6s' },
]

export default function Login() {
  const { login, isAuthenticated } = useAuthStore()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (!ok) toast.error('Credenciales incorrectas. Intenta de nuevo.')
  }

  const fillDemo = (role: 'admin' | 'collaborator' | 'client') => {
    if (role === 'admin')        { setEmail('admin@duodi.com');       setPassword('duodi2025')   }
    if (role === 'collaborator') { setEmail('valen@duodi.com');       setPassword('duodi2025')   }
    if (role === 'client')       { setEmail('luis@clinicasmile.com'); setPassword('cliente2025') }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">

      {/* Space background */}
      <div className="absolute inset-0 bg-space-gradient" />

      {/* Nebula glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full
                      bg-duodi-600/25 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45vw] h-[45vw] rounded-full
                      bg-cosmic-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[60vw] h-[60vw] rounded-full bg-duodi-600/8 blur-[80px] pointer-events-none" />

      {/* Stars */}
      {STARS.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}

      {/* Floating brand illustrations */}
      <img
        src="/PAGINA-WEB/brand/rocket-sticker.png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-[8%] right-[6%] w-36 md:w-44 opacity-80
                   animate-float pointer-events-none select-none drop-shadow-2xl"
        style={{ animationDelay: '0s' }}
      />
      <img
        src="/PAGINA-WEB/brand/alien-fist-sticker.png"
        alt=""
        aria-hidden="true"
        className="absolute top-[6%] right-[8%] w-28 md:w-36 opacity-75
                   animate-float-slow pointer-events-none select-none drop-shadow-2xl"
        style={{ animationDelay: '3.5s' }}
      />
      <img
        src="/PAGINA-WEB/brand/astronaut-sticker.png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-[10%] left-[4%] w-32 md:w-40 opacity-70
                   animate-float pointer-events-none select-none drop-shadow-2xl hidden lg:block"
        style={{ animationDelay: '1.8s' }}
      />

      {/* Login card */}
      <div className="w-full max-w-md relative z-10 animate-fade-in">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                          bg-duodi-gradient shadow-duodi mb-4">
            <Rocket size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl text-gradient mb-1 tracking-tight">
            DUODI Brand
          </h1>
          <p className="text-brand-muted text-sm font-medium">
            Plataforma de Gestión de Marketing
          </p>
        </div>

        <div className="card border-brand-border/60 shadow-duodi">
          <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Correo electrónico</label>
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
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Contraseña</label>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
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
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verificando...</>
              ) : (
                <><Rocket size={16} />Despegar</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-brand-border">
            <p className="text-xs text-brand-muted mb-3 text-center font-medium">Acceso rápido demo</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => fillDemo('admin')}
                className="text-xs py-2 px-2 rounded-xl bg-duodi-900/50 border border-duodi-700/40
                           text-duodi-300 hover:bg-duodi-900/80 transition-colors font-semibold">
                👑 Admin
              </button>
              <button onClick={() => fillDemo('collaborator')}
                className="text-xs py-2 px-2 rounded-xl bg-green-900/30 border border-green-700/30
                           text-green-300 hover:bg-green-900/50 transition-colors font-semibold">
                🎨 Collab
              </button>
              <button onClick={() => fillDemo('client')}
                className="text-xs py-2 px-2 rounded-xl bg-cosmic-600/20 border border-cosmic-600/30
                           text-cosmic-400 hover:bg-cosmic-600/35 transition-colors font-semibold">
                🏢 Cliente
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-brand-muted/60 mt-4 font-medium">
          © 2025 DUODI Brand Platform · Colombia
        </p>
      </div>
    </div>
  )
}
