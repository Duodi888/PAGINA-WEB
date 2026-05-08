import { useNavigate } from 'react-router-dom'
import { TrendingUp, Users, CheckSquare, Video, ArrowUpRight, Clock, AlertCircle, Rocket, Target } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useAuthStore } from '../store/authStore'
import { useAppStore } from '../store/appStore'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import clsx from 'clsx'

const STAGE_LABELS: Record<string, string> = {
  research: 'Investigación', strategy: 'Estrategia', implementation: 'Implementación', monitoring: 'Monitoreo',
}
const STAGE_COLORS: Record<string, string> = {
  research: 'bg-cosmic-400', strategy: 'bg-cosmic-500', implementation: 'bg-duodi-500', monitoring: 'bg-green-500',
}
const STATUS_COLORS: Record<string, string> = {
  active: 'badge-green', paused: 'badge-yellow', completed: 'badge-purple', draft: 'badge-gray',
}
const STATUS_LABELS: Record<string, string> = {
  active: 'Activo', paused: 'Pausado', completed: 'Completado', draft: 'Borrador',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { projects, tasks, contentItems, notifications, clients, clientMetrics } = useAppStore()

  const activeProjects = projects.filter((p) => p.status === 'active')
  const pendingTasks   = tasks.filter((t) => t.status !== 'done')
  const pendingContent = contentItems.filter((c) => c.status === 'review')
  const unreadNotifs   = notifications.filter((n) => !n.read)

  const chartData = clientMetrics.length >= 3
    ? clientMetrics[0].monthlyData.map((d, i) => ({
        month:   d.month,
        smile:   clientMetrics[0].monthlyData[i].followers,
        bello:   clientMetrics[1].monthlyData[i].followers,
        fitlife: clientMetrics[2].monthlyData[i].followers,
      }))
    : []

  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').slice(0, 3)
  const greetHour   = new Date().getHours()
  const greet       = greetHour < 12 ? 'Buenos días' : greetHour < 18 ? 'Buenas tardes' : 'Buenas noches'
  const firstName   = user?.name.split(' ')[0]

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {greet}, <span className="text-gradient">{firstName}</span> 🚀
          </h2>
          <p className="text-brand-muted text-sm mt-1 font-medium">
            {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>
        <button onClick={() => navigate('/projects')} className="btn-primary flex items-center gap-2">
          <Rocket size={15} /> Nuevo Proyecto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Proyectos Activos', value: activeProjects.length,   icon: Target,    color: 'text-duodi-400',  bg: 'bg-duodi-900/40',   change: '+2 este mes' },
          { label: 'Clientes',          value: clients.filter(c => c.status === 'active').length, icon: Users, color: 'text-cosmic-400', bg: 'bg-cosmic-800/40', change: '+1 este mes' },
          { label: 'Tareas Pendientes', value: pendingTasks.length,     icon: CheckSquare, color: 'text-yellow-400', bg: 'bg-yellow-900/30', change: `${tasks.filter(t=>t.status==='done').length} completadas` },
          { label: 'Contenido en Revisión', value: pendingContent.length, icon: Video,   color: 'text-green-400',  bg: 'bg-green-900/30',   change: 'Para aprobar' },
        ].map(({ label, value, icon: Icon, color, bg, change }) => (
          <div key={label} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-brand-muted font-semibold">{label}</p>
                <p className="text-3xl font-black text-white mt-1">{value}</p>
                <p className="text-xs text-brand-muted mt-1 font-medium">{change}</p>
              </div>
              <div className={clsx('p-2.5 rounded-xl', bg)}>
                <Icon size={20} className={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white tracking-tight">Crecimiento de Seguidores</h3>
              <p className="text-xs text-brand-muted font-medium">Últimos 6 meses por cliente</p>
            </div>
            <button onClick={() => navigate('/reports')} className="text-xs text-duodi-400 hover:text-duodi-300 flex items-center gap-1 font-semibold">
              Ver reportes <ArrowUpRight size={12} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="smile"   x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor="#7FADC6" stopOpacity={0.35}/><stop offset="95%" stopColor="#7FADC6" stopOpacity={0}/></linearGradient>
                <linearGradient id="bello"   x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor="#7B52C8" stopOpacity={0.35}/><stop offset="95%" stopColor="#7B52C8" stopOpacity={0}/></linearGradient>
                <linearGradient id="fitlife" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor="#006494" stopOpacity={0.35}/><stop offset="95%" stopColor="#006494" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E2558" />
              <XAxis dataKey="month" tick={{ fill: '#6B6890', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B6890', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: '#1C1638', border: '1px solid #2E2558', borderRadius: '12px', fontSize: 12, fontFamily: 'Montserrat, Inter, sans-serif' }}
                labelStyle={{ color: '#6B6890' }}
                formatter={(v: number, name: string) => [`${v.toLocaleString()}`, name==='smile'?'Clínica Smile':name==='bello'?'Rest. Bello':'FitLife']}
              />
              <Area type="monotone" dataKey="smile"   stroke="#7FADC6" strokeWidth={2} fill="url(#smile)"   />
              <Area type="monotone" dataKey="bello"   stroke="#7B52C8" strokeWidth={2} fill="url(#bello)"   />
              <Area type="monotone" dataKey="fitlife" stroke="#006494" strokeWidth={2} fill="url(#fitlife)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            {[{ color:'#7FADC6', label:'Clínica Smile' },{ color:'#7B52C8', label:'Rest. Bello' },{ color:'#006494', label:'FitLife' }].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-brand-muted font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white tracking-tight">Urgente</h3>
            <button onClick={() => navigate('/tasks')} className="text-xs text-duodi-400 hover:text-duodi-300 flex items-center gap-1 font-semibold">
              Ver tareas <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {urgentTasks.length === 0 ? (
              <p className="text-sm text-brand-muted text-center py-4 font-medium">¡Todo al día! Sin urgentes.</p>
            ) : urgentTasks.map((task) => {
              const project = projects.find((p) => p.id === task.projectId)
              const client  = clients.find((c) => c.id === project?.clientId)
              return (
                <button key={task.id} onClick={() => navigate('/tasks')} className="w-full text-left p-3 rounded-xl bg-brand-surface border border-red-900/30 hover:border-red-700/50 transition-colors">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{task.title}</p>
                      <p className="text-[10px] text-brand-muted mt-0.5">{client?.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={10} className="text-brand-muted" />
                        <span className="text-[10px] text-brand-muted">{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-brand-border">
            <p className="text-xs text-brand-muted mb-3 font-semibold">Notificaciones sin leer</p>
            {unreadNotifs.length === 0 ? (
              <p className="text-xs text-brand-muted font-medium">Sin notificaciones</p>
            ) : (
              <div className="space-y-2">
                {unreadNotifs.slice(0, 3).map((n) => (
                  <p key={n.id} className="text-xs text-gray-400 truncate font-medium">{n.message}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white tracking-tight">Proyectos Activos</h3>
          <button onClick={() => navigate('/projects')} className="text-xs text-duodi-400 hover:text-duodi-300 flex items-center gap-1 font-semibold">
            Ver todos <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {activeProjects.map((project) => {
            const client = clients.find((c) => c.id === project.clientId)
            return (
              <button key={project.id} onClick={() => navigate('/projects')} className="card-hover text-left">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: project.color }} />
                  <span className={STATUS_COLORS[project.status] + ' text-[10px]'}>{STATUS_LABELS[project.status]}</span>
                </div>
                <p className="font-semibold text-sm text-white leading-snug mb-1 line-clamp-2 tracking-tight">{project.name}</p>
                <p className="text-xs text-brand-muted mb-3 font-medium">{client?.name}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className={clsx('w-2 h-2 rounded-full', STAGE_COLORS[project.stage])} />
                  <span className="text-[10px] text-brand-muted font-medium">{STAGE_LABELS[project.stage]}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-brand-muted">
                    <span className="font-medium">Progreso</span>
                    <span className="text-white font-bold">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-brand-border rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-duodi-gradient transition-all" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-border">
                  <div className="flex -space-x-1.5">
                    {project.team.slice(0, 3).map((uid, i) => {
                      const member = [{ id:'u1',name:'Diego' },{ id:'u2',name:'Valentina' },{ id:'u3',name:'Mateo' },{ id:'u4',name:'Camila' }].find(u=>u.id===uid)
                      return <img key={uid} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member?.name}&backgroundColor=b6e3f4`} className="w-5 h-5 rounded-full border border-brand-card" style={{ zIndex: 3-i }} alt="" />
                    })}
                    {project.team.length > 3 && (
                      <div className="w-5 h-5 rounded-full bg-brand-border border border-brand-card flex items-center justify-center">
                        <span className="text-[8px] text-brand-muted">+{project.team.length-3}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-brand-muted font-medium">
                    <TrendingUp size={10} />
                    <span>${(project.spent/1000000).toFixed(1)}M / ${(project.budget/1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
