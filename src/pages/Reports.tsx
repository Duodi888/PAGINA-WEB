import { useState } from 'react'
import { TrendingUp, TrendingDown, Users, Heart, Eye, Target, Download, ChevronRight } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts'
import { CLIENT_METRICS, CLIENTS } from '../data/mockData'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  tiktok: '#000000',
}

export default function Reports() {
  const [selectedClient, setSelectedClient] = useState('c1')

  const clientData = CLIENT_METRICS.find((m) => m.clientId === selectedClient)
  const client = CLIENTS.find((c) => c.id === selectedClient)

  if (!clientData || !client) return null

  const totalFollowers = clientData.followers.instagram + clientData.followers.facebook + clientData.followers.tiktok

  const prevMonth = clientData.monthlyData[clientData.monthlyData.length - 2]
  const currMonth = clientData.monthlyData[clientData.monthlyData.length - 1]
  const followersGrowth = currMonth.followers - prevMonth.followers
  const followersGrowthPct = ((followersGrowth / prevMonth.followers) * 100).toFixed(1)

  const platformData = [
    { name: 'Instagram', value: clientData.followers.instagram, color: '#E1306C' },
    { name: 'Facebook', value: clientData.followers.facebook, color: '#1877F2' },
    ...(clientData.followers.tiktok > 0 ? [{ name: 'TikTok', value: clientData.followers.tiktok, color: '#9333EA' }] : []),
  ]

  const stats = [
    {
      label: 'Seguidores Totales',
      value: totalFollowers.toLocaleString(),
      icon: Users,
      change: `+${followersGrowth.toLocaleString()} este mes`,
      positive: true,
      color: 'text-blue-400',
      bg: 'bg-blue-900/30',
    },
    {
      label: 'Engagement Rate',
      value: `${clientData.engagement}%`,
      icon: Heart,
      change: `+${(clientData.engagement - 4.0).toFixed(1)}% vs 4 meses`,
      positive: true,
      color: 'text-pink-400',
      bg: 'bg-pink-900/30',
    },
    {
      label: 'Alcance Mensual',
      value: clientData.reach.toLocaleString(),
      icon: Eye,
      change: '+8.5% vs mes anterior',
      positive: true,
      color: 'text-green-400',
      bg: 'bg-green-900/30',
    },
    {
      label: 'Conversiones',
      value: clientData.conversions.toString(),
      icon: Target,
      change: '+12 vs mes anterior',
      positive: true,
      color: 'text-yellow-400',
      bg: 'bg-yellow-900/30',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Client selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {CLIENTS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClient(c.id)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                selectedClient === c.id
                  ? 'bg-duodi-gradient text-white border-transparent shadow-duodi-sm'
                  : 'bg-brand-card border-brand-border text-gray-400 hover:text-gray-200 hover:border-duodi-500/40'
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
        <button
          onClick={() => toast.success('Generando PDF... (demo)')}
          className="btn-secondary flex items-center gap-2"
        >
          <Download size={15} /> Exportar PDF
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, change, positive, color, bg }) => (
          <div key={label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className={clsx('p-2.5 rounded-xl', bg)}>
                <Icon size={20} className={color} />
              </div>
              <div className={clsx('flex items-center gap-1 text-xs font-medium', positive ? 'text-green-400' : 'text-red-400')}>
                {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              </div>
            </div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            <p className="text-[10px] text-gray-500 mt-1">{change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Followers growth chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white">Crecimiento de Seguidores</h3>
              <p className="text-xs text-gray-400">Últimos 6 meses · {client.name}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-400 font-semibold">
              <TrendingUp size={14} />
              +{followersGrowthPct}%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={clientData.monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A4A" />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: '#1A1A35', border: '1px solid #2A2A4A', borderRadius: '8px', fontSize: 12 }} labelStyle={{ color: '#9CA3AF' }} formatter={(v: number) => [v.toLocaleString(), 'Seguidores']} />
              <Bar dataKey="followers" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4338ca" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Platform distribution */}
        <div className="card">
          <h3 className="font-bold text-white mb-1">Distribución por Plataforma</h3>
          <p className="text-xs text-gray-400 mb-4">Seguidores totales: {totalFollowers.toLocaleString()}</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={platformData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                {platformData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1A1A35', border: '1px solid #2A2A4A', borderRadius: '8px', fontSize: 12 }} formatter={(v: number) => [v.toLocaleString(), '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {platformData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-gray-300">{name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">{value.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-500">{((value / totalFollowers) * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement trend */}
        <div className="card">
          <h3 className="font-bold text-white mb-4">Engagement Rate</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={clientData.monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A4A" />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ background: '#1A1A35', border: '1px solid #2A2A4A', borderRadius: '8px', fontSize: 12 }} labelStyle={{ color: '#9CA3AF' }} formatter={(v: number) => [`${v}%`, 'Engagement']} />
              <Line type="monotone" dataKey="engagement" stroke="#EC4899" strokeWidth={2.5} dot={{ fill: '#EC4899', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly posts & reach */}
        <div className="card">
          <h3 className="font-bold text-white mb-4">Posts vs Alcance</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={clientData.monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A4A" />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1A1A35', border: '1px solid #2A2A4A', borderRadius: '8px', fontSize: 12 }} labelStyle={{ color: '#9CA3AF' }} />
              <Bar yAxisId="left" dataKey="reach" name="Alcance" fill="#10B981" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Bar yAxisId="right" dataKey="posts" name="Posts" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-full bg-green-500" /><span className="text-xs text-gray-400">Alcance</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-full bg-duodi-500" /><span className="text-xs text-gray-400">Posts</span></div>
          </div>
        </div>
      </div>

      {/* All clients summary */}
      <div className="card">
        <h3 className="font-bold text-white mb-4">Resumen de Todos los Clientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                {['Cliente', 'Total Seguidores', 'Instagram', 'TikTok', 'Engagement', 'Alcance', 'Conversiones'].map((h) => (
                  <th key={h} className="text-xs font-semibold text-gray-400 text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CLIENT_METRICS.map((m) => {
                const c = CLIENTS.find((cl) => cl.id === m.clientId)
                const total = m.followers.instagram + m.followers.facebook + m.followers.tiktok
                return (
                  <tr key={m.clientId} className="border-b border-brand-border/50 hover:bg-brand-surface transition-colors cursor-pointer" onClick={() => setSelectedClient(m.clientId)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-white">{c?.name}</span>
                        {m.clientId === selectedClient && <span className="text-[10px] bg-duodi-600 text-white px-1.5 py-0.5 rounded">Activo</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-sm text-white">{total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{m.followers.instagram.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{m.followers.tiktok > 0 ? m.followers.tiktok.toLocaleString() : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={clsx('text-sm font-semibold', m.engagement >= 5 ? 'text-green-400' : m.engagement >= 3.5 ? 'text-yellow-400' : 'text-red-400')}>
                        {m.engagement}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{m.reach.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{m.conversions}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
