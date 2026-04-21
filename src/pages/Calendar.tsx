import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { CLIENTS } from '../data/mockData'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isSameMonth, getDay, addMonths, subMonths
} from 'date-fns'
import { es } from 'date-fns/locale'
import clsx from 'clsx'

const CATEGORY_STYLES: Record<string, { label: string; color: string }> = {
  presentation: { label: 'Presentación', color: 'bg-duodi-700/70 border-duodi-500/50 text-duodi-200' },
  testimonials: { label: 'Testimonios', color: 'bg-green-900/70 border-green-600/50 text-green-200' },
  human: { label: 'Contenido Humano', color: 'bg-orange-900/70 border-orange-600/50 text-orange-200' },
  promotion: { label: 'Promociones', color: 'bg-pink-900/70 border-pink-600/50 text-pink-200' },
}

const PLATFORM_ICONS: Record<string, string> = {
  Instagram: '📸',
  Facebook: '👤',
  TikTok: '🎵',
  LinkedIn: '💼',
  YouTube: '▶️',
}

// Content mix reference
const CONTENT_MIX = [
  { label: 'Presentación', pct: 40, color: 'bg-duodi-600' },
  { label: 'Testimonios', pct: 25, color: 'bg-green-600' },
  { label: 'Contenido Humano', pct: 25, color: 'bg-orange-600' },
  { label: 'Promociones', pct: 10, color: 'bg-pink-600' },
]

export default function CalendarPage() {
  const { calendarPosts } = useAppStore()
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 1)) // May 2025
  const [filterClient, setFilterClient] = useState('all')
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const filtered = calendarPosts.filter((p) => filterClient === 'all' || p.clientId === filterClient)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPad = getDay(monthStart)

  const getPostsForDay = (day: Date) => filtered.filter((p) => isSameDay(new Date(p.scheduledDate + 'T00:00:00'), day))

  const selectedPosts = selectedDay ? getPostsForDay(selectedDay) : []

  // Count by category for the mix indicator
  const categoryCounts: Record<string, number> = { presentation: 0, testimonials: 0, human: 0, promotion: 0 }
  filtered.forEach((p) => { categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1 })
  const total = Object.values(categoryCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="flex gap-6">
      {/* Main calendar */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-lg hover:bg-brand-card text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-xl font-bold text-white capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-lg hover:bg-brand-card text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={18} />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="btn-ghost text-xs py-1.5 px-3">Hoy</button>
          </div>
          <div className="flex items-center gap-3">
            <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)} className="input py-2 text-sm w-auto">
              <option value="all">Todos los clientes</option>
              {CLIENTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button className="btn-primary flex items-center gap-1.5 text-sm py-2">
              <Plus size={15} /> Publicación
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Padding for start of month */}
          {Array.from({ length: startPad }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}

          {days.map((day) => {
            const posts = getPostsForDay(day)
            const isToday = isSameDay(day, new Date())
            const isSelected = selectedDay && isSameDay(day, selectedDay)
            const isCurrentMonth = isSameMonth(day, currentDate)

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={clsx(
                  'min-h-20 p-1.5 rounded-lg border text-left transition-all duration-200 flex flex-col',
                  isSelected
                    ? 'border-duodi-500 bg-duodi-900/30'
                    : posts.length > 0
                      ? 'border-brand-border bg-brand-card hover:border-duodi-500/40'
                      : 'border-transparent hover:border-brand-border hover:bg-brand-surface'
                )}
              >
                <span className={clsx(
                  'text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full',
                  isToday ? 'bg-duodi-gradient text-white' : isCurrentMonth ? 'text-gray-300' : 'text-gray-600'
                )}>
                  {format(day, 'd')}
                </span>
                <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                  {posts.slice(0, 2).map((post) => {
                    const catStyle = CATEGORY_STYLES[post.category]
                    return (
                      <div
                        key={post.id}
                        className={clsx('text-[9px] px-1 py-0.5 rounded border truncate leading-tight', catStyle.color)}
                      >
                        {post.platform.map((p) => PLATFORM_ICONS[p] || '').join('')} {post.title}
                      </div>
                    )
                  })}
                  {posts.length > 2 && (
                    <div className="text-[9px] text-gray-400 px-1">+{posts.length - 2} más</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-72 flex flex-col gap-4">
        {/* Content mix */}
        <div className="card">
          <h3 className="font-semibold text-sm text-white mb-3">Matriz de Contenido</h3>
          <div className="space-y-2.5">
            {CONTENT_MIX.map(({ label, pct, color }) => {
              const catKey = label === 'Presentación' ? 'presentation' : label === 'Testimonios' ? 'testimonials' : label === 'Contenido Humano' ? 'human' : 'promotion'
              const actual = total ? Math.round((categoryCounts[catKey] || 0) / total * 100) : 0
              return (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-300">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Meta: {pct}%</span>
                      <span className="font-semibold text-white">{actual}%</span>
                    </div>
                  </div>
                  <div className="flex gap-1 h-2">
                    <div className={clsx('rounded-full', color)} style={{ width: `${actual}%`, minWidth: actual > 0 ? '4px' : '0', transition: 'width 0.3s' }} />
                    <div className="flex-1 bg-brand-border rounded-full" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="card">
          <h3 className="font-semibold text-sm text-white mb-3">Leyenda</h3>
          <div className="space-y-2">
            {Object.entries(CATEGORY_STYLES).map(([key, style]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={clsx('w-3 h-3 rounded border', style.color.split(' ')[0], style.color.split(' ')[1])} />
                <span className="text-xs text-gray-300">{style.label}</span>
                <span className="ml-auto text-xs text-gray-500">{categoryCounts[key] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected day detail */}
        {selectedDay && (
          <div className="card animate-slide-in">
            <h3 className="font-semibold text-sm text-white mb-1">
              {format(selectedDay, "d 'de' MMMM", { locale: es })}
            </h3>
            <p className="text-xs text-gray-400 mb-3">{selectedPosts.length} publicaciones</p>
            {selectedPosts.length === 0 ? (
              <p className="text-xs text-gray-500">Sin publicaciones programadas.</p>
            ) : (
              <div className="space-y-2">
                {selectedPosts.map((post) => {
                  const client = CLIENTS.find((c) => c.id === post.clientId)
                  const catStyle = CATEGORY_STYLES[post.category]
                  return (
                    <div key={post.id} className={clsx('p-2.5 rounded-lg border text-xs', catStyle.color)}>
                      <p className="font-semibold truncate">{post.title}</p>
                      <p className="mt-0.5 opacity-80">{client?.name}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span>{post.platform.map((p) => PLATFORM_ICONS[p] || p).join(' ')}</span>
                        <span className="opacity-60">{post.scheduledTime}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
