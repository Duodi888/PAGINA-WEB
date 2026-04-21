import { useState } from 'react'
import { Search, Upload, Download, ExternalLink, Grid, List, BookOpen, FileText, Image, Film, Palette } from 'lucide-react'
import { CLIENTS, RESOURCES } from '../data/mockData'
import type { ResourceType } from '../types'
import clsx from 'clsx'
import toast from 'react-hot-toast'

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
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | ResourceType>('all')
  const [filterClient, setFilterClient] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filtered = RESOURCES.filter((r) => {
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
          {CLIENTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex rounded-lg border border-brand-border overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={clsx('p-2 transition-colors', viewMode === 'grid' ? 'bg-duodi-600 text-white' : 'text-gray-400 hover:bg-brand-card')}>
            <Grid size={14} />
          </button>
          <button onClick={() => setViewMode('list')} className={clsx('p-2 transition-colors', viewMode === 'list' ? 'bg-duodi-600 text-white' : 'text-gray-400 hover:bg-brand-card')}>
            <List size={14} />
          </button>
        </div>
        <button className="btn-primary flex items-center gap-1.5 text-sm py-2" onClick={() => toast.success('Funcionalidad de subida próximamente')}>
          <Upload size={15} /> Subir
        </button>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterType('all')} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filterType === 'all' ? 'bg-duodi-600 text-white' : 'bg-brand-card border border-brand-border text-gray-400 hover:text-gray-200')}>
          Todos ({RESOURCES.length})
        </button>
        {RESOURCE_TYPES.map((type) => {
          const count = RESOURCES.filter((r) => r.type === type).length
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
            const client = CLIENTS.find((c) => c.id === r.clientId)
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
                  <button onClick={() => toast.success('Descargando...')} className="flex-1 py-1.5 rounded-lg bg-brand-surface border border-brand-border text-gray-400 hover:text-white text-xs flex items-center justify-center gap-1 transition-colors">
                    <Download size={11} /> Descargar
                  </button>
                  <button onClick={() => toast.success('Abriendo...')} className="p-1.5 rounded-lg bg-brand-surface border border-brand-border text-gray-400 hover:text-white transition-colors">
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
                const client = CLIENTS.find((c) => c.id === r.clientId)
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
                        <button onClick={() => toast.success('Descargando...')} className="p-1.5 rounded hover:bg-brand-card text-gray-400 hover:text-white transition-colors"><Download size={14} /></button>
                        <button onClick={() => toast.success('Vista previa...')} className="p-1.5 rounded hover:bg-brand-card text-gray-400 hover:text-white transition-colors"><ExternalLink size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
