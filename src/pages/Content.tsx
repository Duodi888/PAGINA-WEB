import { useState } from 'react'
import { Search, Plus, ThumbsUp, ThumbsDown, MessageSquare, Eye, Clock, Film, Image, Play } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { CLIENTS, USERS } from '../data/mockData'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const STATUS_COLORS: Record<string, string> = {
  draft: 'badge-gray',
  review: 'badge-yellow',
  approved: 'badge-green',
  rejected: 'badge-red',
  published: 'badge-blue',
}
const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  review: 'En Revisión',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  published: 'Publicado',
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  video: <Film size={14} />,
  reel: <Play size={14} />,
  image: <Image size={14} />,
  story: <Eye size={14} />,
  carousel: <Image size={14} />,
}

function formatDuration(seconds?: number) {
  if (!seconds) return ''
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Content() {
  const { contentItems, approveContent, rejectContent } = useAppStore()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterClient, setFilterClient] = useState('all')
  const [selected, setSelected] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')

  const filtered = contentItems.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    const matchClient = filterClient === 'all' || c.clientId === filterClient
    return matchSearch && matchStatus && matchClient
  })

  const item = selected ? contentItems.find((c) => c.id === selected) : null
  const itemClient = item ? CLIENTS.find((c) => c.id === item.clientId) : null

  const handleApprove = (id: string) => {
    approveContent(id)
    toast.success('Contenido aprobado')
    setSelected(null)
  }

  const handleReject = (id: string) => {
    rejectContent(id)
    toast.error('Contenido rechazado')
    setSelected(null)
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Left */}
      <div className={clsx('flex flex-col gap-4', selected ? 'w-1/2' : 'w-full')}>
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-40">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 py-2 text-sm" placeholder="Buscar contenido..." />
          </div>
          <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)} className="input py-2 text-sm w-auto">
            <option value="all">Todos los clientes</option>
            {CLIENTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex rounded-lg border border-brand-border overflow-hidden">
            {['all', 'draft', 'review', 'approved', 'rejected', 'published'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={clsx('px-3 py-1.5 text-[11px] font-medium transition-colors', filterStatus === s ? 'bg-duodi-600 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-brand-card')}
              >
                {s === 'all' ? 'Todo' : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <button className="btn-primary flex items-center gap-1.5 text-sm py-2">
            <Plus size={15} /> Subir
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const client = CLIENTS.find((c) => c.id === item.clientId)
            const isSelected = selected === item.id
            return (
              <button
                key={item.id}
                onClick={() => setSelected(isSelected ? null : item.id)}
                className={clsx(
                  'rounded-xl border overflow-hidden text-left transition-all duration-200',
                  isSelected ? 'border-duodi-500/70 shadow-duodi-sm' : 'border-brand-border hover:border-duodi-500/40'
                )}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-brand-surface">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Eye size={20} className="text-white" />
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className={clsx(STATUS_COLORS[item.status], 'text-[10px]')}>{STATUS_LABELS[item.status]}</span>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded-md px-1.5 py-0.5">
                    <span className="text-white">{TYPE_ICONS[item.type]}</span>
                    {item.duration && <span className="text-[10px] text-white">{formatDuration(item.duration)}</span>}
                  </div>
                  {item.version > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 rounded-md px-1.5 py-0.5">
                      <span className="text-[10px] text-white">v{item.version}</span>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-3 bg-brand-card">
                  <p className="font-medium text-xs text-white line-clamp-2 leading-snug">{item.title}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{client?.name}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <MessageSquare size={10} />
                      {item.comments.length}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {item.platform.slice(0, 2).map((p) => (
                        <span key={p} className="text-[9px] bg-brand-border rounded px-1 py-0.5 text-gray-400">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail panel */}
      {item && (
        <div className="w-1/2 card overflow-y-auto animate-slide-in sticky top-0 self-start space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-white text-sm">{item.title}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{itemClient?.name} · v{item.version}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-200 p-1">✕</button>
          </div>

          {/* Preview */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-brand-surface">
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
                <Play size={20} className="text-white ml-1" />
              </div>
            </div>
            {item.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-0.5 text-xs text-white">
                {formatDuration(item.duration)}
              </div>
            )}
          </div>

          {/* Status & info */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={clsx(STATUS_COLORS[item.status])}>{STATUS_LABELS[item.status]}</span>
            <div className="flex gap-1">
              {item.platform.map((p) => <span key={p} className="badge-gray text-[10px]">{p}</span>)}
            </div>
            <div className="flex gap-1">
              {item.tags.map((t) => <span key={t} className="badge-purple text-[10px]">{t}</span>)}
            </div>
          </div>

          <p className="text-xs text-gray-400">{item.description}</p>

          {/* Approve / Reject buttons */}
          {item.status === 'review' && (
            <div className="flex gap-3">
              <button onClick={() => handleApprove(item.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-900/30 border border-green-700/40 text-green-300 text-sm font-medium hover:bg-green-900/50 transition-colors">
                <ThumbsUp size={15} /> Aprobar
              </button>
              <button onClick={() => handleReject(item.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-900/30 border border-red-700/40 text-red-300 text-sm font-medium hover:bg-red-900/50 transition-colors">
                <ThumbsDown size={15} /> Rechazar
              </button>
            </div>
          )}

          {/* Comments */}
          <div>
            <p className="text-xs font-semibold text-gray-300 mb-3">Comentarios ({item.comments.length})</p>
            <div className="space-y-3">
              {item.comments.map((c) => {
                const author = USERS.find((u) => u.id === c.userId)
                return (
                  <div key={c.id} className="flex gap-2">
                    <img src={author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author?.name}`} className="w-6 h-6 rounded-full shrink-0" alt="" />
                    <div className="bg-brand-surface rounded-lg p-2.5 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-white">{author?.name}</span>
                        {c.timestamp !== undefined && (
                          <span className="flex items-center gap-0.5 text-[10px] text-duodi-400">
                            <Clock size={9} /> {formatDuration(c.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-300">{c.text}</p>
                    </div>
                  </div>
                )
              })}
              {item.comments.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-2">Sin comentarios aún</p>
              )}
            </div>

            {/* Add comment */}
            <div className="mt-3 flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="input text-xs py-2 flex-1"
                placeholder="Agregar comentario..."
              />
              <button
                onClick={() => { if (commentText.trim()) { toast.success('Comentario agregado'); setCommentText('') } }}
                className="btn-primary py-2 px-4 text-sm"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
