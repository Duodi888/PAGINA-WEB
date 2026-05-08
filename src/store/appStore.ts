import { create } from 'zustand'
import type { Project, Task, ContentItem, CalendarPost, Message, Notification, Client, User, Resource, ClientMetrics } from '../types'
import {
  getProjects, getTasks, createTask as apiCreateTask, updateTask as apiUpdateTask,
  getContentItems, updateContentStatus,
  getCalendarPosts, createCalendarPost as apiCreateCalendarPost,
  getMessages, sendMessage as apiSendMessage,
  getNotifications, markNotificationRead as apiMarkRead, markAllNotificationsRead as apiMarkAllRead,
  getClients, getUsers, getResources, getClientMetrics,
} from '../lib/api'

interface AppState {
  projects: Project[]
  tasks: Task[]
  contentItems: ContentItem[]
  calendarPosts: CalendarPost[]
  messages: Message[]
  notifications: Notification[]
  clients: Client[]
  users: User[]
  resources: Resource[]
  clientMetrics: ClientMetrics[]
  sidebarCollapsed: boolean
  loading: boolean
  initialized: boolean
  error: string | null

  setSidebarCollapsed: (v: boolean) => void
  initialize: (userId?: string) => Promise<void>
  refresh: (userId?: string) => Promise<void>
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'subtasks' | 'attachments' | 'comments'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  markNotificationRead: (id: string) => Promise<void>
  markAllNotificationsRead: (userId: string) => Promise<void>
  addMessage: (msg: Omit<Message, 'id' | 'createdAt'>) => Promise<void>
  approveContent: (id: string) => Promise<void>
  rejectContent: (id: string) => Promise<void>
  addCalendarPost: (post: Omit<CalendarPost, 'id'>) => Promise<void>
}

async function fetchAll(userId?: string) {
  const [
    projects, tasks, contentItems, calendarPosts,
    messages, clients, users, resources, clientMetrics,
  ] = await Promise.all([
    getProjects(), getTasks(), getContentItems(), getCalendarPosts(),
    getMessages(), getClients(), getUsers(), getResources(), getClientMetrics(),
  ])

  const notifications = userId ? await getNotifications(userId) : []

  return { projects, tasks, contentItems, calendarPosts, messages, notifications, clients, users, resources, clientMetrics }
}

export const useAppStore = create<AppState>((set, get) => ({
  projects: [],
  tasks: [],
  contentItems: [],
  calendarPosts: [],
  messages: [],
  notifications: [],
  clients: [],
  users: [],
  resources: [],
  clientMetrics: [],
  sidebarCollapsed: false,
  loading: false,
  initialized: false,
  error: null,

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

  initialize: async (userId?: string) => {
    if (get().initialized) return
    set({ loading: true, error: null })
    try {
      const data = await fetchAll(userId)
      set({ ...data, loading: false, initialized: true })
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : 'Error loading data' })
    }
  },

  refresh: async (userId?: string) => {
    set({ loading: true, error: null })
    try {
      const data = await fetchAll(userId)
      set({ ...data, loading: false })
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : 'Error refreshing data' })
    }
  },

  addTask: async (taskData) => {
    const created = await apiCreateTask(taskData)
    if (created) set((s) => ({ tasks: [...s.tasks, created] }))
  },

  updateTask: async (id, updates) => {
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }))
    await apiUpdateTask(id, updates)
  },

  markNotificationRead: async (id) => {
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }))
    await apiMarkRead(id)
  },

  markAllNotificationsRead: async (userId) => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }))
    await apiMarkAllRead(userId)
  },

  addMessage: async (msgData) => {
    const created = await apiSendMessage(msgData)
    if (created) set((s) => ({ messages: [...s.messages, created] }))
  },

  approveContent: async (id) => {
    set((s) => ({
      contentItems: s.contentItems.map((c) => (c.id === id ? { ...c, status: 'approved' as const } : c)),
    }))
    await updateContentStatus(id, 'approved')
  },

  rejectContent: async (id) => {
    set((s) => ({
      contentItems: s.contentItems.map((c) => (c.id === id ? { ...c, status: 'rejected' as const } : c)),
    }))
    await updateContentStatus(id, 'rejected')
  },

  addCalendarPost: async (postData) => {
    const created = await apiCreateCalendarPost(postData)
    if (created) set((s) => ({ calendarPosts: [...s.calendarPosts, created] }))
  },
}))
