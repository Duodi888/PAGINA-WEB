// Auth & Users
export type UserRole = 'admin' | 'collaborator' | 'client'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  position?: string
  clientId?: string
}

// Projects
export type ProjectStage = 'research' | 'strategy' | 'implementation' | 'monitoring'
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'draft'

export interface ProjectStageItem {
  id: ProjectStage
  label: string
  progress: number
  completed: boolean
}

export interface Project {
  id: string
  name: string
  clientId: string
  description: string
  status: ProjectStatus
  stage: ProjectStage
  progress: number
  startDate: string
  endDate: string
  team: string[]
  budget: number
  spent: number
  tags: string[]
  color: string
}

// Clients
export interface BuyerPersona {
  id: string
  name: string
  age: string
  job: string
  painPoints: string[]
  goals: string[]
}

export interface Client {
  id: string
  name: string
  logo?: string
  industry: string
  contactName: string
  contactEmail: string
  contactPhone: string
  website?: string
  socialMedia: {
    instagram?: string
    facebook?: string
    tiktok?: string
    linkedin?: string
  }
  brandColors: string[]
  brandFonts: string[]
  objectives: string[]
  buyerPersonas: BuyerPersona[]
  joinDate: string
  plan: string
  monthlyBudget: number
  status: 'active' | 'inactive'
}

// Tasks
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskCategory = 'recording' | 'editing' | 'design' | 'strategy' | 'pauta' | 'copywriting' | 'analytics'

export interface Task {
  id: string
  title: string
  description: string
  projectId: string
  assigneeId: string
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  dueDate: string
  createdAt: string
  tags: string[]
  attachments: number
  comments: number
  subtasks?: { id: string; title: string; done: boolean }[]
}

// Content / Videos
export type ContentType = 'video' | 'image' | 'reel' | 'story' | 'carousel'
export type ContentStatus = 'draft' | 'review' | 'approved' | 'rejected' | 'published'

export interface Comment {
  id: string
  userId: string
  text: string
  timestamp?: number
  createdAt: string
}

export interface ContentItem {
  id: string
  title: string
  type: ContentType
  projectId: string
  clientId: string
  status: ContentStatus
  thumbnail: string
  url?: string
  duration?: number
  description: string
  comments: Comment[]
  version: number
  uploadedAt: string
  publishedAt?: string
  platform: string[]
  tags: string[]
}

// Calendar
export type ContentCategory = 'presentation' | 'testimonials' | 'human' | 'promotion'

export interface CalendarPost {
  id: string
  title: string
  clientId: string
  projectId: string
  platform: string[]
  category: ContentCategory
  scheduledDate: string
  scheduledTime: string
  status: 'scheduled' | 'published' | 'draft' | 'cancelled'
  contentId?: string
  caption?: string
  color: string
}

// Resources
export type ResourceType = 'brandbook' | 'guide' | 'template' | 'logo' | 'palette' | 'font' | 'image' | 'video'

export interface Resource {
  id: string
  name: string
  type: ResourceType
  clientId?: string
  size: string
  url: string
  thumbnail?: string
  uploadedAt: string
  uploadedBy: string
  tags: string[]
  description?: string
}

// KPIs & Reports
export interface MetricDataPoint {
  date: string
  value: number
}

export interface ClientMetrics {
  clientId: string
  followers: { instagram: number; facebook: number; tiktok: number }
  engagement: number
  reach: number
  impressions: number
  conversions: number
  monthlyData: {
    month: string
    followers: number
    engagement: number
    reach: number
    posts: number
  }[]
}

// Messages
export interface Message {
  id: string
  projectId: string
  senderId: string
  text: string
  createdAt: string
  mentions: string[]
  attachments?: { name: string; url: string }[]
  reactions?: { emoji: string; users: string[] }[]
}

// Notifications
export interface Notification {
  id: string
  type: 'task' | 'comment' | 'mention' | 'approval' | 'deadline'
  title: string
  message: string
  read: boolean
  createdAt: string
  userId: string
  link?: string
}
