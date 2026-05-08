import { useState } from 'react'
import { Search, Upload, Download, ExternalLink, Grid, List, BookOpen, FileText, Image, Film, Palette } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { useAuthStore } from '../store/authStore'
import type { ResourceType } from '../types'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import Modal from '../components/ui/Modal'

const TYPE_ICONS: Record<ResourceType, React.ReactNode> = {
  brandbook: <BookOpen size={20} />,
  guide: <FileText size={20} />,
  template: <Grid size={20} />,
  logo: <Image size={20} />,
  palette: <Palette size={20} />,
  font: <FileText size={20} />,
  image: <Image size={20} />,
  video: <Film size={20} />,
}

const TYPE_COLORS: Record<ResourceType, string> = {
  brandbook: 'bg-purple-900/40 text-purple-300 border-purple-700/30',
  guide: 'bg-blue-900/40 text-blue-300 border-blue-700/30',
  template: 'bg-green-900/40 text-green-300 border-green-700/30',
  logo: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/30',
  palette: 'bg-pink-900/40 text-pink-300 border-pink-700/30',
  font: 'bg-orange-900/40 text-orange-300 border-orange-700/30',
  image: 'bg-teal-900/40 text-teal-300 border-teal-700/30',
  video: 'bg-red-900/40 text-red-300 border-red-700/30',
}

const TYPE_LABELS: Record<ResourceType, string> = {
  brandbook: 'Brandbook', guide: 'Guía', template: 'Plantilla',
  logo: 'Logo', palette: 'Paleta', font: 'Tipografía', image: 'Imagen', video: 'Video',
}

const RESOURCE_TYPES: ResourceType[] = ['brandbook', 'guide', 'template', 'logo', 'palette', 'font', 'image', 'video']

export default function Resources() {
  const { clients, resources, addResource } = useAppStore()
  const { user } = useAuthStore()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | ResourceType>('all')
  const [filterClient, setFilterClient] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showNewModal, setShowNewModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'guide' as ResourceType,
    clientId: '',
    url: '',
    thumbnail: '',
    size: '',
    description: '',
    tags: '',
  })

  const openNewModal = () => {
    setForm({
      name: '', type: 'guide', clientId: '',
      url: '', thumbnail: '', size: '',
      description: '', tags: '',
    })
    setShowNewModal(true)
  }

  const handleCreate = async () => {
    if (!form.name.trim() || !form.url.trim()) {
      toast.error('Nombre y URL son obligatorios')
      return
    }
    if (!user) {
      toast.error('Sesión inválida')
      return
    }
    setCreating(true)
    try {
      const created = await addResource({
        name: form.name.trim(),
        type: form.type,
        clientId: form.clientId || undefined,
        size: form.size.trim() || '—',
        url: form.url.trim(),
        thumbnail: form.thumbnail.trim() || undefined,
        uploadedBy: user.id,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        description: form.description.trim() || undefined,
      })
      if (created) {
        toast.success('Recurso subido')
        setShowNewModal(false)
      } else {
        toast.error('No se pudo subir el recurso')
      }
    } finally {
      setCreating(false)
    }
  }

  const handleDownload = (url: string, name: string) => {
    if (!url) {
      toast.error('Sin URL disponible')
      return
    }
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success(`Descargando ${name}`)
  }

  const handleOpen = (url: string) => {
    if (!url) {
      toast.error('Sin URL disponible')
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const filtered = resources.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchType = filterType === 'all' || r.type === filterType
    const matchClient = filterClient === 'all' || r.clientId === filterClient || (!r.clientId && filterClient === 'internal')
    return matchSearch && matchType && matchClient
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-40">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 py-2 text-sm" placeholder="Buscar recursos..." />
        </div>
        <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)} className="input py-2 text-sm w-auto">
          <option value="all">Todos</option>
          <option value="internal">Interno DUODI</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex rounded-lg border border-brand-border overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={clsx('p-2 transition-colors', viewMode === 'grid' ? 'bg-duodi-600 text-white' : 'text-gray-400 hover:bg-brand-card')}>
            <Grid size={14} />
          </button>
          <button onClick={() => setViewMode('list')} className={clsx('p-2 transition-colors', viewMode === 'list' ? 'bg-duodi-600 text-white' : 'text-gray-400 hover:bg-brand-card')}>
            <List size={14} />
          </button>
        </div>
        <button className="btn-primary flex items-center gap-1.5 text-sm py-2" onClick={openNewModal}>
          <Upload size={15} /> Subir
        </button>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterType('all')} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filterType === 'all' ? 'bg-duodi-600 text-white' : 'bg-brand-card border border-brand-border text-gray-400 hover:text-gray-200')}>
          Todos ({resources.length})
        </button>
        {RESOURCE_TYPES.map((type) => {
          const count = resources.filter((r) => r.type === type).length
          if (count === 0) return null
          return (
            <button key={type} onClick={() => setFilterType(type)} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5', filterType === type ? 'bg-duodi-600 text-white' : 'bg-brand-card border border-brand-border text-gray-400 hover:text-gray-200')}>
              {TYPE_ICONS[type]} {TYPE_LABELS[type]} ({count})
            </button>
          )
        })}
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((r) => {
            const client = clients.find((c) => c.id === r.clientId)
            return (
              <div key={r.id} className="card-hover group flex flex-col">
                <div className="aspect-video bg-brand-surface rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                  {r.thumbnail ? (
                    <img src={r.thumbnail} alt={r.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className={clsx('p-4 rounded-lg border', TYPE_COLORS[r.type])}>
                      {TYPE_ICONS[r.type]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-white truncate">{r.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{client?.name || 'Interno DUODI'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={clsx('text-[9px] px-1.5 py-0.5 rounded border', TYPE_COLORS[r.type])}>{TYPE_LABELS[r.type]}</span>
                    <span className="text-[9px] text-gray-500">{r.size}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {r.tags.slice(0, 2).map((tag) => <span key={tag} className="text-[9px] text-gray-500 bg-brand-border rounded px-1">{tag}</span>)}
                  </div>
                </div>
                <div className="flex gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDownload(r.url, r.name)} className="flex-1 py-1.5 rounded-lg bg-brand-surface border border-brand-border text-gray-400 hover:text-white text-xs flex items-center justify-center gap-1 transition-colors">
                    <Download size={11} /> Descargar
                  </button>
                  <button onClick={() => handleOpen(r.url)} className="p-1.5 rounded-lg bg-brand-surface border border-brand-border text-gray-400 hover:text-white transition-colors">
                    <ExternalLink size={11} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                {['Nombre', 'Tipo', 'Cliente', 'Tamaño', 'Subido', 'Acciones'].map((h) => (
                  <th key={h} className="text-xs font-semibold text-gray-400 text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const client = clients.find((c) => c.id === r.clientId)
                return (
                  <tr key={r.id} className="border-b border-brand-border/50 hover:bg-brand-surface transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={clsx('p-1.5 rounded border', TYPE_COLORS[r.type])}>{TYPE_ICONS[r.type]}</div>
                        <span className="text-sm text-white">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={clsx('text-[10px] px-2 py-0.5 rounded border', TYPE_COLORS[r.type])}>{TYPE_LABELS[r.type]}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-400">{client?.name || 'Interno'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{r.size}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.uploadedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleDownload(r.url, r.name)} className="p-1.5 rounded hover:bg-brand-card text-gray-400 hover:text-white transition-colors"><Download size={14} /></button>
                        <button onClick={() => handleOpen(r.url)} className="p-1.5 rounded hover:bg-brand-card text-gray-400 hover:text-white transition-colors"><ExternalLink size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showNewModal} title="Subir recurso" onClose={() => setShowNewModal(false)} size="lg">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Nombre *</label>
            <input
              autoFocus
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="input text-sm py-2"
              placeholder="Ej. Brandbook 2026"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">URL del archivo *</label>
            <input
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              className="input text-sm py-2"
              placeholder="https://drive.google.com/…"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Tipo</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ResourceType }))}
                className="input text-sm py-2"
              >
                {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Cliente</label>
              <select
                value={form.clientId}
                onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}
                className="input text-sm py-2"
              >
                <option value="">Interno DUODI</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Tamaño</label>
              <input
                value={form.size}
                onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                className="input text-sm py-2"
                placeholder="Ej. 12 MB"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Thumbnail (URL)</label>
              <input
                value={form.thumbnail}
                onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
                className="input text-sm py-2"
                placeholder="Opcional"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="input text-sm py-2 resize-none"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Etiquetas (separadas por coma)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              className="input text-sm py-2"
              placeholder="brand, manual, v2"
            />
          </div>
          <div className="flex gap-2 pt-3">
            <button onClick={() => setShowNewModal(false)} disabled={creating} className="btn-ghost flex-1 py-2 text-sm">
              Cancelar
            </button>
            <button onClick={handleCreate} disabled={creating} className="btn-primary flex-1 py-2 text-sm">
              {creating ? 'Subiendo…' : 'Subir recurso'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
