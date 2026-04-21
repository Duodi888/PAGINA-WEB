import { create } from 'zustand'
import type { Project, Task, ContentItem, CalendarPost, Message, Notification } from '../types'
import { PROJECTS, TASKS, CONTENT_ITEMS, CALENDAR_POSTS, MESSAGES, NOTIFICATIONS } from '../data/mockData'

interface AppState {
  projects: Project[]
  tasks: Task[]
  contentItems: ContentItem[]
  calendarPosts: CalendarPost[]
  messages: Message[]
  notifications: Notification[]
  sidebarCollapsed: boolean

  // Actions
  setSidebarCollapsed: (v: boolean) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  addMessage: (msg: Message) => void
  approveContent: (id: string) => void
  rejectContent: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  projects: PROJECTS,
  tasks: TASKS,
  contentItems: CONTENT_ITEMS,
  calendarPosts: CALENDAR_POSTS,
  messages: MESSAGES,
  notifications: NOTIFICATIONS,
  sidebarCollapsed: false,

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),

  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

  approveContent: (id) =>
    set((s) => ({
      contentItems: s.contentItems.map((c) => (c.id === id ? { ...c, status: 'approved' as const } : c)),
    })),

  rejectContent: (id) =>
    set((s) => ({
      contentItems: s.contentItems.map((c) => (c.id === id ? { ...c, status: 'rejected' as const } : c)),
    })),
}))
