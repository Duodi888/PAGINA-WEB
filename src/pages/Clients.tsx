import { useState } from 'react'
import { Search, Plus, Instagram, Phone, Mail, Globe, Target, Users, Palette, ChevronRight } from 'lucide-react'
import { CLIENTS, CLIENT_METRICS } from '../data/mockData'
import { useAppStore } from '../store/appStore'
import clsx from 'clsx'

export default function Clients() {
  const { projects } = useAppStore()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = CLIENTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  )

  const client = selected ? CLIENTS.find((c) => c.id === selected) : null
  const clientMetrics = client ? CLIENT_METRICS.find((m) => m.clientId === client.id) : null
  const clientProjects = client ? projects.filter((p) => p.clientId === client.id) : []

  return (
    <div className="flex gap-6">
      {/* Client list */}
      <div className={clsx('flex flex-col gap-4', selected ? 'w-2/5' : 'w-full')}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 py-2 text-sm" placeholder="Buscar clientes..." />
          </div>
          <button className="btn-primary flex items-center gap-1.5 text-sm py-2">
            <Plus size={15} /> Nuevo Cliente
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filtered.map((c) => {
            const metrics = CLIENT_METRICS.find((m) => m.clientId === c.id)
            const clientProjs = projects.filter((p) => p.clientId === c.id && p.status === 'active')
            const isSelected = selected === c.id
            const totalFollowers = metrics ? metrics.followers.instagram + metrics.followers.facebook + metrics.followers.tiktok : 0

            return (
              <button
                key={c.id}
                onClick={() => setSelected(isSelected ? null : c.id)}
                className={clsx(
                  'w-full text-left p-4 rounded-xl border transition-all duration-200',
                  isSelected ? 'border-duodi-500/60 bg-duodi-900/20' : 'border-brand-border bg-brand-card hover:border-duodi-500/40 hover:bg-brand-surface'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Color dot / initials */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ background: `linear-gradient(135deg, ${c.brandColors[0]}, ${c.brandColors[1] || c.brandColors[0]})` }}
                    >
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-white truncate">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full border', c.status === 'active' ? 'badge-green' : 'badge-gray')}>
                      {c.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                    <ChevronRight size={14} className={clsx('text-gray-400 transition-transform', isSelected && 'rotate-90')} />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Users size={12} />
                    <span>{totalFollowers.toLocaleString()} seguidores</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Target size={12} />
                    <span>{clientProjs.length} proyectos activos</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span>${(c.monthlyBudget / 1000000).toFixed(1)}M/mes</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Client detail */}
      {client && (
        <div className="flex-1 space-y-4 animate-slide-in overflow-y-auto">
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl"
                  style={{ background: `linear-gradient(135deg, ${client.brandColors[0]}, ${client.brandColors[1] || client.brandColors[0]})` }}
                >
                  {client.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg">{client.name}</h2>
                  <p className="text-gray-400 text-sm">{client.industry}</p>
                  <span className={clsx('text-[10px] mt-1', client.status === 'active' ? 'badge-green' : 'badge-gray')}>
                    {client.status === 'active' ? 'Cliente Activo' : 'Inactivo'} · Plan {client.plan}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-200 p-1">✕</button>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Mail size={14} className="text-gray-500" />
                <span className="truncate">{client.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Phone size={14} className="text-gray-500" />
                {client.contactPhone}
              </div>
              {client.website && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Globe size={14} className="text-gray-500" />
                  <span className="truncate">{client.website}</span>
                </div>
              )}
              {client.socialMedia.instagram && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Instagram size={14} className="text-gray-500" />
                  {client.socialMedia.instagram}
                </div>
              )}
            </div>
          </div>

          {/* Brand colors */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Palette size={14} className="text-gray-400" />
              <h3 className="font-semibold text-sm text-white">Identidad de Marca</h3>
            </div>
            <div className="flex gap-2 mb-3">
              {client.brandColors.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-lg border border-brand-border" style={{ backgroundColor: color }} />
                  <span className="text-[9px] text-gray-500">{color}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {client.brandFonts.map((font) => (
                <span key={font} className="badge-gray text-xs">{font}</span>
              ))}
            </div>
          </div>

          {/* Objectives */}
          <div className="card">
            <h3 className="font-semibold text-sm text-white mb-3">Objetivos de Campaña</h3>
            <div className="space-y-2">
              {client.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-duodi-900/50 border border-duodi-700/40 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] text-duodi-400 font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-300">{obj}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Buyer personas */}
          {client.buyerPersonas.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-sm text-white mb-3">Buyer Personas</h3>
              <div className="space-y-4">
                {client.buyerPersonas.map((persona) => (
                  <div key={persona.id} className="bg-brand-surface rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-duodi-gradient flex items-center justify-center text-white font-bold text-xs">
                        {persona.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-white">{persona.name}</p>
                        <p className="text-xs text-gray-400">{persona.age} años · {persona.job}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-gray-500 mb-1 font-semibold">PAIN POINTS</p>
                        {persona.painPoints.map((p, i) => (
                          <p key={i} className="text-xs text-gray-400 flex items-start gap-1 mb-0.5">
                            <span className="text-red-400 mt-0.5">•</span> {p}
                          </p>
                        ))}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 mb-1 font-semibold">OBJETIVOS</p>
                        {persona.goals.map((g, i) => (
                          <p key={i} className="text-xs text-gray-400 flex items-start gap-1 mb-0.5">
                            <span className="text-green-400 mt-0.5">•</span> {g}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {clientProjects.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-sm text-white mb-3">Proyectos ({clientProjects.length})</h3>
              <div className="space-y-2">
                {clientProjects.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-brand-surface rounded-lg">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{p.name}</p>
                      <div className="w-full bg-brand-border rounded-full h-1 mt-1">
                        <div className="h-1 rounded-full bg-duodi-gradient" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white shrink-0">{p.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics summary */}
          {clientMetrics && (
            <div className="card">
              <h3 className="font-semibold text-sm text-white mb-3">Métricas Actuales</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-brand-surface rounded-lg p-3">
                  <p className="text-[10px] text-gray-400">Engagement</p>
                  <p className="text-lg font-black text-white">{clientMetrics.engagement}%</p>
                </div>
                <div className="bg-brand-surface rounded-lg p-3">
                  <p className="text-[10px] text-gray-400">Alcance</p>
                  <p className="text-lg font-black text-white">{clientMetrics.reach.toLocaleString()}</p>
                </div>
                <div className="bg-brand-surface rounded-lg p-3">
                  <p className="text-[10px] text-gray-400">Impresiones</p>
                  <p className="text-lg font-black text-white">{clientMetrics.impressions.toLocaleString()}</p>
                </div>
                <div className="bg-brand-surface rounded-lg p-3">
                  <p className="text-[10px] text-gray-400">Conversiones</p>
                  <p className="text-lg font-black text-white">{clientMetrics.conversions}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
