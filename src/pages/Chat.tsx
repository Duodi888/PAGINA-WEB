import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Smile, Hash, Search } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { useAuthStore } from '../store/authStore'
import { CLIENTS, USERS } from '../data/mockData'
import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'
import clsx from 'clsx'
import type { Message } from '../types'

function parseTextWithMentions(text: string, allUsers: typeof USERS) {
  const parts = text.split(/(@\w+)/g)
  return parts.map((part, i) => {
    if (part.startsWith('@')) {
      const name = part.slice(1).toLowerCase()
      const found = allUsers.find((u) => u.name.split(' ')[0].toLowerCase() === name)
      if (found) {
        return <span key={i} className="text-duodi-300 font-semibold">{part}</span>
      }
    }
    return <span key={i}>{part}</span>
  })
}

export default function Chat() {
  const { messages, addMessage, projects } = useAppStore()
  const { user } = useAuthStore()
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || '')
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeProjects = projects.filter((p) => p.status === 'active')

  const projectMessages = messages.filter((m) => m.projectId === selectedProject)
  const currentProject = projects.find((p) => p.id === selectedProject)
  const currentClient = currentProject ? CLIENTS.find((c) => c.id === currentProject.clientId) : null

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [projectMessages.length])

  const handleSend = () => {
    if (!text.trim() || !user) return
    const mentions: string[] = []
    const mentionRegex = /@(\w+)/g
    let match: RegExpExecArray | null
    while ((match = mentionRegex.exec(text)) !== null) {
      const found = USERS.find((u) => u.name.split(' ')[0].toLowerCase() === match![1].toLowerCase())
      if (found) mentions.push(found.id)
    }
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      projectId: selectedProject,
      senderId: user.id,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      mentions,
    }
    addMessage(newMsg)
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Group messages by date
  type GroupedMessages = { date: string; messages: Message[] }[]
  const groupedMessages = projectMessages.reduce<GroupedMessages>((groups, msg) => {
    const date = format(new Date(msg.createdAt), 'd MMMM yyyy', { locale: es })
    const lastGroup = groups[groups.length - 1]
    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(msg)
    } else {
      groups.push({ date, messages: [msg] })
    }
    return groups
  }, [])

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 rounded-2xl overflow-hidden border border-brand-border">
      {/* Sidebar: project list */}
      <div className="w-64 bg-brand-surface border-r border-brand-border flex flex-col shrink-0">
        <div className="p-3 border-b border-brand-border">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-8 py-1.5 text-xs" placeholder="Buscar..." />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <p className="text-[10px] font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">Proyectos</p>
          {activeProjects
            .filter((p) => {
              const client = CLIENTS.find((c) => c.id === p.clientId)
              return !search || p.name.toLowerCase().includes(search.toLowerCase()) || client?.name.toLowerCase().includes(search.toLowerCase())
            })
            .map((p) => {
              const client = CLIENTS.find((c) => c.id === p.clientId)
              const unreadMsgs = messages.filter((m) => m.projectId === p.id).length
              const isActive = selectedProject === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p.id)}
                  className={clsx(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors text-left',
                    isActive ? 'bg-duodi-900/40 border-r-2 border-duodi-500' : 'hover:bg-brand-card'
                  )}
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-xs font-medium truncate', isActive ? 'text-duodi-200' : 'text-gray-300')}>{p.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{client?.name}</p>
                  </div>
                  {unreadMsgs > 0 && (
                    <span className="text-[9px] bg-duodi-600 text-white rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                      {unreadMsgs > 9 ? '9+' : unreadMsgs}
                    </span>
                  )}
                </button>
              )
            })}
        </div>

        {/* Active users */}
        <div className="border-t border-brand-border p-3">
          <p className="text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">En línea</p>
          <div className="flex gap-1">
            {USERS.filter((u) => u.role !== 'client').map((u) => (
              <div key={u.id} className="relative" title={u.name}>
                <img src={u.avatar} className="w-7 h-7 rounded-full border border-brand-border" alt="" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-brand-surface" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main chat */}
      <div className="flex-1 flex flex-col bg-brand-dark">
        {/* Header */}
        <div className="h-14 border-b border-brand-border px-4 flex items-center justify-between shrink-0 bg-brand-surface">
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-gray-400" />
            <span className="font-semibold text-sm text-white">{currentProject?.name}</span>
            {currentClient && <span className="text-xs text-gray-400">· {currentClient.name}</span>}
          </div>
          <div className="flex items-center gap-1">
            {currentProject?.team.map((uid) => {
              const u = USERS.find((us) => us.id === uid)
              return u ? (
                <img key={uid} src={u.avatar} className="w-6 h-6 rounded-full border border-brand-border" title={u.name} alt="" />
              ) : null
            })}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {groupedMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-center mx-auto mb-3">
                  <Hash size={24} className="text-gray-500" />
                </div>
                <p className="text-gray-400 font-medium">Comienza la conversación</p>
                <p className="text-gray-600 text-sm mt-1">Este es el inicio del canal de este proyecto.</p>
              </div>
            </div>
          ) : (
            groupedMessages.map(({ date, messages: dayMsgs }) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-brand-border" />
                  <span className="text-[10px] text-gray-500 font-medium">{date}</span>
                  <div className="flex-1 h-px bg-brand-border" />
                </div>
                <div className="space-y-3">
                  {dayMsgs.map((msg) => {
                    const sender = USERS.find((u) => u.id === msg.senderId)
                    const isOwnMessage = msg.senderId === user?.id
                    return (
                      <div key={msg.id} className={clsx('flex gap-3', isOwnMessage && 'flex-row-reverse')}>
                        <img
                          src={sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.name}`}
                          className="w-8 h-8 rounded-full border border-brand-border shrink-0"
                          alt=""
                        />
                        <div className={clsx('max-w-xs lg:max-w-md', isOwnMessage && 'items-end flex flex-col')}>
                          <div className="flex items-center gap-2 mb-1">
                            {!isOwnMessage && <span className="text-xs font-semibold text-white">{sender?.name}</span>}
                            <span className="text-[10px] text-gray-500">
                              {formatDistanceToNow(new Date(msg.createdAt), { locale: es, addSuffix: true })}
                            </span>
                          </div>
                          <div className={clsx(
                            'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                            isOwnMessage
                              ? 'bg-duodi-600 text-white rounded-tr-sm'
                              : 'bg-brand-card border border-brand-border text-gray-200 rounded-tl-sm'
                          )}>
                            {parseTextWithMentions(msg.text, USERS)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-brand-border p-4 bg-brand-surface shrink-0">
          <div className="flex items-end gap-2">
            <button className="p-2.5 text-gray-400 hover:text-gray-200 transition-colors">
              <Paperclip size={18} />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Mensaje en #${currentProject?.name || 'canal'}... (Enter para enviar)`}
                className="input resize-none py-2.5 pr-10 text-sm min-h-[44px] max-h-32 overflow-y-auto"
                rows={1}
              />
              <button className="absolute right-2.5 bottom-2.5 text-gray-400 hover:text-gray-200 transition-colors">
                <Smile size={16} />
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className={clsx(
                'p-2.5 rounded-lg transition-all',
                text.trim()
                  ? 'bg-duodi-gradient text-white hover:opacity-90'
                  : 'bg-brand-card text-gray-500 cursor-not-allowed'
              )}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-gray-600 mt-1.5 ml-10">Usa @ para mencionar a alguien</p>
        </div>
      </div>
    </div>
  )
}
