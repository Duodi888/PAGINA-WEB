import { useState } from 'react'
import {
  Search, Filter, Plus, ChevronRight, Calendar,
  Users, DollarSign, TrendingUp, Clock
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { CLIENTS } from '../data/mockData'
import clsx from 'clsx'

const STAGES = [
  { id: 'research', label: 'Investigación', color: 'bg-yellow-500', textColor: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-900/20' },
  { id: 'strategy', label: 'Estrategia', color: 'bg-blue-500', textColor: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-900/20' },
  { id: 'implementation', label: 'Implementación', color: 'bg-duodi-500', textColor: 'text-duodi-400', border: 'border-duodi-500/30', bg: 'bg-duodi-900/20' },
  { id: 'monitoring', label: 'Monitoreo', color: 'bg-green-500', textColor: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-900/20' },
]

const STATUS_LABELS: Record<string, string> = { active: 'Activo', paused: 'Pausado', completed: 'Completado', draft: 'Borrador' }
const STATUS_BADGE: Record<string, string> = { active: 'badge-green', paused: 'badge-yellow', completed: 'badge-purple', draft: 'badge-gray' }
const CAT_LABELS: Record<string, string> = {
  recording: 'Grabación', editing: 'Edición', design: 'Diseño',
  strategy: 'Estrategia', pauta: 'Pauta', copywriting: 'Copy', analytics: 'Analytics'
}

const TEAM_NAMES: Record<string, string> = { u1: 'Diego', u2: 'Valentina', u3: 'Mateo', u4: 'Camila' }

export default function Projects() {
  const { projects, tasks } = useAppStore()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [view, setView] = useState<'grid' | 'timeline'>('grid')

  const filtered = projects.filter((p) => {
    const client = CLIENTS.find((c) => c.id === p.clientId)
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      client?.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const project = selectedProject ? projects.find((p) => p.id === selectedProject) : null
  const projectClient = project ? CLIENTS.find((c) => c.id === project.clientId) : null
  const projectTasks = project ? tasks.filter((t) => t.projectId === project.id) : []

  return (
    <div className="flex gap-6 h-full">
      {/* Left panel */}
      <div className={clsx('flex flex-col gap-4', selectedProject ? 'w-1/2' : 'w-full')}>
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 py-2 text-sm" placeholder="Buscar proyectos..." />
          </div>
          <div className="flex rounded-lg border border-brand-border overflow-hidden">
            {['all', 'active', 'paused', 'completed'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={clsx('px-3 py-1.5 text-xs font-medium transition-colors', filterStatus === s ? 'bg-duodi-600 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-brand-card')}
              >
                {s === 'all' ? 'Todos' : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <button className="btn-primary flex items-center gap-1.5 text-sm py-2">
            <Plus size={15} /> Nuevo
          </button>
        </div>

        {/* Stage pipeline */}
        <div className="grid grid-cols-4 gap-3">
          {STAGES.map((stage) => {
            const count = projects.filter((p) => p.stage === stage.id && p.status === 'active').length
            return (
              <div key={stage.id} className={clsx('p-3 rounded-lg border', stage.border, stage.bg)}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={clsx('w-2 h-2 rounded-full', stage.color)} />
                  <span className={clsx('text-xs font-medium', stage.textColor)}>{stage.label}</span>
                </div>
                <p className="text-2xl font-black text-white">{count}</p>
                <p className="text-[10px] text-gray-500">proyectos</p>
              </div>
            )
          })}
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((p) => {
            const client = CLIENTS.find((c) => c.id === p.clientId)
            const stage = STAGES.find((s) => s.id === p.stage)
            const pTasks = tasks.filter((t) => t.projectId === p.id)
            const doneTasks = pTasks.filter((t) => t.status === 'done').length
            const isSelected = selectedProject === p.id

            return (
              <button
                key={p.id}
                onClick={() => setSelectedProject(isSelected ? null : p.id)}
                className={clsx(
                  'w-full text-left p-4 rounded-xl border transition-all duration-200',
                  isSelected
                    ? 'border-duodi-500/60 bg-duodi-900/20 shadow-duodi-sm'
                    : 'border-brand-border bg-brand-card hover:border-duodi-500/40 hover:bg-brand-surface'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: p.color }} />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-white truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{client?.name} · {client?.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={clsx(STATUS_BADGE[p.status], 'text-[10px]')}>{STATUS_LABELS[p.status]}</span>
                    <ChevronRight size={14} className={clsx('text-gray-400 transition-transform', isSelected && 'rotate-90')} />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className={clsx('w-1.5 h-1.5 rounded-full', stage?.color)} />
                    <span className="text-[10px] text-gray-400">{stage?.label}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <CheckSquareIcon />
                    <span>{doneTasks}/{pTasks.length} tareas</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Users size={10} />
                    <span>{p.team.length} miembros</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Calendar size={10} />
                    <span>{p.endDate}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 bg-brand-border rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-duodi-gradient" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-xs font-bold text-white shrink-0">{p.progress}%</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Project detail panel */}
      {project && projectClient && (
        <div className="w-1/2 card overflow-y-auto animate-slide-in sticky top-0 self-start">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full mt-1" style={{ backgroundColor: project.color }} />
              <div>
                <h2 className="font-bold text-white text-base leading-snug">{project.name}</h2>
                <p className="text-sm text-gray-400">{projectClient.name}</p>
              </div>
            </div>
            <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-gray-200 p-1">✕</button>
          </div>

          <p className="text-sm text-gray-400 mb-4">{project.description}</p>

          {/* Stage timeline */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-300 mb-3">Etapas del Proyecto</p>
            <div className="relative">
              <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-brand-border" />
              <div className="flex justify-between relative z-10">
                {STAGES.map((stage, i) => {
                  const stageOrder = ['research', 'strategy', 'implementation', 'monitoring']
                  const currentIdx = stageOrder.indexOf(project.stage)
                  const isCompleted = i < currentIdx
                  const isCurrent = i === currentIdx
                  return (
                    <div key={stage.id} className="flex flex-col items-center gap-2">
                      <div className={clsx(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                        isCompleted ? 'bg-green-500 border-green-500 text-white' :
                          isCurrent ? `border-current ${stage.color} text-white` :
                            'bg-brand-surface border-brand-border text-gray-500'
                      )}>
                        {isCompleted ? '✓' : i + 1}
                      </div>
                      <span className={clsx('text-[9px] text-center font-medium', isCurrent ? stage.textColor : 'text-gray-500')}>{stage.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-brand-surface rounded-lg p-3">
              <p className="text-[10px] text-gray-400">Presupuesto</p>
              <p className="font-bold text-sm text-white">${(project.budget / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-brand-surface rounded-lg p-3">
              <p className="text-[10px] text-gray-400">Invertido</p>
              <p className="font-bold text-sm text-white">${(project.spent / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-brand-surface rounded-lg p-3">
              <p className="text-[10px] text-gray-400">Progreso</p>
              <p className="font-bold text-sm text-white">{project.progress}%</p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar size={12} />
              <span>Inicio: <strong className="text-white">{project.startDate}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock size={12} />
              <span>Fin: <strong className="text-white">{project.endDate}</strong></span>
            </div>
          </div>

          {/* Team */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-300 mb-2">Equipo ({project.team.length})</p>
            <div className="flex gap-2 flex-wrap">
              {project.team.map((uid) => {
                const name = TEAM_NAMES[uid] || 'Usuario'
                return (
                  <div key={uid} className="flex items-center gap-1.5 bg-brand-surface rounded-full px-2.5 py-1">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4`} className="w-4 h-4 rounded-full" alt="" />
                    <span className="text-xs text-gray-300">{name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-300 mb-2">Etiquetas</p>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="badge-purple text-[10px]">{tag}</span>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div>
            <p className="text-xs font-semibold text-gray-300 mb-2">Tareas ({projectTasks.length})</p>
            <div className="space-y-2">
              {projectTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-2 p-2.5 bg-brand-surface rounded-lg">
                  <div className={clsx(
                    'w-2 h-2 rounded-full shrink-0',
                    task.status === 'done' ? 'bg-green-500' :
                      task.status === 'in_progress' ? 'bg-duodi-500' :
                        task.status === 'review' ? 'bg-yellow-500' : 'bg-gray-500'
                  )} />
                  <span className="text-xs text-gray-300 flex-1 truncate">{task.title}</span>
                  <span className="text-[10px] text-gray-500">{CAT_LABELS[task.category]}</span>
                </div>
              ))}
              {projectTasks.length > 5 && (
                <p className="text-xs text-gray-500 text-center">+{projectTasks.length - 5} tareas más</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CheckSquareIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}
