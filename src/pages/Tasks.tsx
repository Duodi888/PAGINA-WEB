import { useState } from 'react'
import { Plus, Search, Calendar, Paperclip, MessageSquare, AlertCircle } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { CLIENTS, USERS } from '../data/mockData'
import clsx from 'clsx'
import type { Task, TaskStatus } from '../types'
import toast from 'react-hot-toast'

const COLUMNS: { id: TaskStatus; label: string; color: string; bg: string }[] = [
  { id: 'todo', label: 'Por Hacer', color: 'text-gray-400', bg: 'bg-gray-800/30 border-gray-700/30' },
  { id: 'in_progress', label: 'En Progreso', color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-700/20' },
  { id: 'review', label: 'En Revisión', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700/20' },
  { id: 'done', label: 'Completado', color: 'text-green-400', bg: 'bg-green-900/20 border-green-700/20' },
]

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-blue-400 bg-blue-900/30 border-blue-700/30',
  medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-700/30',
  high: 'text-orange-400 bg-orange-900/30 border-orange-700/30',
  urgent: 'text-red-400 bg-red-900/30 border-red-700/30',
}
const PRIORITY_LABELS: Record<string, string> = { low: 'Baja', medium: 'Media', high: 'Alta', urgent: 'Urgente' }

const CATEGORY_COLORS: Record<string, string> = {
  recording: 'bg-red-900/40 text-red-300',
  editing: 'bg-purple-900/40 text-purple-300',
  design: 'bg-pink-900/40 text-pink-300',
  strategy: 'bg-blue-900/40 text-blue-300',
  pauta: 'bg-orange-900/40 text-orange-300',
  copywriting: 'bg-teal-900/40 text-teal-300',
  analytics: 'bg-green-900/40 text-green-300',
}
const CATEGORY_LABELS: Record<string, string> = {
  recording: '🎬 Grabación', editing: '✂️ Edición', design: '🎨 Diseño',
  strategy: '🧭 Estrategia', pauta: '📢 Pauta', copywriting: '✍️ Copy', analytics: '📊 Analytics'
}

export default function Tasks() {
  const { tasks, updateTask, projects } = useAppStore()
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [selected, setSelected] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null)

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority
    return matchSearch && matchPriority
  })

  const byStatus = (status: TaskStatus) => filtered.filter((t) => t.status === status)

  const handleDragStart = (id: string) => setDragId(id)
  const handleDrop = (status: TaskStatus) => {
    if (dragId) {
      updateTask(dragId, { status })
      toast.success(`Tarea movida a "${COLUMNS.find(c => c.id === status)?.label}"`)
      setDragId(null)
      setDragOver(null)
    }
  }

  const task = selected ? tasks.find((t) => t.id === selected) : null
  const taskProject = task ? projects.find((p) => p.id === task.projectId) : null
  const taskClient = taskProject ? CLIENTS.find((c) => c.id === taskProject.clientId) : null
  const assignee = task ? USERS.find((u) => u.id === task.assigneeId) : null

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 py-2 text-sm" placeholder="Buscar tareas..." />
        </div>
        <div className="flex rounded-lg border border-brand-border overflow-hidden">
          {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={clsx('px-3 py-1.5 text-[11px] font-medium transition-colors', filterPriority === p ? 'bg-duodi-600 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-brand-card')}
            >
              {p === 'all' ? 'Todas' : PRIORITY_LABELS[p]}
            </button>
          ))}
        </div>
        <button className="btn-primary flex items-center gap-1.5 text-sm py-2">
          <Plus size={15} /> Nueva Tarea
        </button>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 flex-1 overflow-x-auto pb-2">
        {COLUMNS.map((col) => {
          const colTasks = byStatus(col.id)
          return (
            <div
              key={col.id}
              className={clsx(
                'flex flex-col rounded-xl border p-3 min-w-64 w-64 shrink-0 transition-all duration-200',
                col.bg,
                dragOver === col.id ? 'ring-2 ring-duodi-500/60' : ''
              )}
              onDragOver={(e) => { e.preventDefault(); setDragOver(col.id) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDrop(col.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={clsx('text-sm font-semibold', col.color)}>{col.label}</span>
                  <span className="text-xs font-bold bg-brand-border rounded-full w-5 h-5 flex items-center justify-center text-gray-300">
                    {colTasks.length}
                  </span>
                </div>
                <button className="text-gray-500 hover:text-gray-300">
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                {colTasks.map((task) => {
                  const proj = projects.find((p) => p.id === task.projectId)
                  const client = CLIENTS.find((c) => c.id === proj?.clientId)
                  const user = USERS.find((u) => u.id === task.assigneeId)
                  const subtasksDone = task.subtasks?.filter((s) => s.done).length ?? 0
                  const subtasksTotal = task.subtasks?.length ?? 0
                  const isSelected = selected === task.id

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      onClick={() => setSelected(isSelected ? null : task.id)}
                      className={clsx(
                        'p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none',
                        isSelected
                          ? 'border-duodi-500/60 bg-duodi-900/30'
                          : 'border-brand-border bg-brand-card hover:border-duodi-500/30 hover:bg-brand-surface',
                        dragId === task.id && 'opacity-50'
                      )}
                    >
                      {/* Priority */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={clsx('text-[9px] font-semibold px-1.5 py-0.5 rounded border', PRIORITY_COLORS[task.priority])}>
                          {task.priority === 'urgent' && <AlertCircle size={8} className="inline mr-0.5" />}
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                        <span className={clsx('text-[9px] px-1.5 py-0.5 rounded-full font-medium', CATEGORY_COLORS[task.category])}>
                          {CATEGORY_LABELS[task.category].split(' ')[0]}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-white leading-snug mb-2">{task.title}</p>

                      {client && (
                        <p className="text-[10px] text-gray-500 mb-2">{client.name}</p>
                      )}

                      {/* Subtasks progress */}
                      {subtasksTotal > 0 && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                            <span>Subtareas</span>
                            <span>{subtasksDone}/{subtasksTotal}</span>
                          </div>
                          <div className="w-full bg-brand-border rounded-full h-1">
                            <div className="h-1 rounded-full bg-duodi-500" style={{ width: `${subtasksTotal ? (subtasksDone / subtasksTotal) * 100 : 0}%` }} />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          {task.attachments > 0 && (
                            <span className="flex items-center gap-0.5"><Paperclip size={9} />{task.attachments}</span>
                          )}
                          {task.comments > 0 && (
                            <span className="flex items-center gap-0.5"><MessageSquare size={9} />{task.comments}</span>
                          )}
                          <span className="flex items-center gap-0.5"><Calendar size={9} />{task.dueDate.slice(5)}</span>
                        </div>
                        {user && (
                          <img
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                            className="w-5 h-5 rounded-full border border-brand-border"
                            title={user.name}
                            alt=""
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Task detail overlay */}
      {task && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-lg p-6 animate-slide-in overflow-y-auto max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={clsx('text-[10px] px-2 py-0.5 rounded-full border font-semibold', PRIORITY_COLORS[task.priority])}>
                    {PRIORITY_LABELS[task.priority]}
                  </span>
                  <span className={clsx('text-[10px] px-2 py-0.5 rounded-full font-medium', CATEGORY_COLORS[task.category])}>
                    {CATEGORY_LABELS[task.category]}
                  </span>
                </div>
                <h2 className="font-bold text-white">{task.title}</h2>
                <p className="text-sm text-gray-400 mt-1">{taskClient?.name} · {taskProject?.name}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-200 p-1">✕</button>
            </div>

            <p className="text-sm text-gray-300 mb-4">{task.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-brand-surface rounded-lg p-3">
                <p className="text-[10px] text-gray-400">Asignado a</p>
                {assignee && (
                  <div className="flex items-center gap-2 mt-1">
                    <img src={assignee.avatar} className="w-5 h-5 rounded-full" alt="" />
                    <span className="text-xs text-white">{assignee.name}</span>
                  </div>
                )}
              </div>
              <div className="bg-brand-surface rounded-lg p-3">
                <p className="text-[10px] text-gray-400">Fecha límite</p>
                <p className="text-xs font-semibold text-white mt-1 flex items-center gap-1">
                  <Calendar size={12} /> {task.dueDate}
                </p>
              </div>
            </div>

            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-300 mb-2">Subtareas ({task.subtasks.filter(s => s.done).length}/{task.subtasks.length})</p>
                <div className="space-y-1.5">
                  {task.subtasks.map((sub) => (
                    <div key={sub.id} className={clsx('flex items-center gap-2 text-sm', sub.done ? 'text-gray-500 line-through' : 'text-gray-200')}>
                      <div className={clsx('w-4 h-4 rounded border flex items-center justify-center shrink-0', sub.done ? 'bg-green-600 border-green-600' : 'border-brand-border')}>
                        {sub.done && <span className="text-white text-[10px]">✓</span>}
                      </div>
                      {sub.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {task.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {task.tags.map((tag) => <span key={tag} className="badge-purple text-[10px]">{tag}</span>)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
