import { supabase } from './supabase'
import type {
  User, Client, Project, Task, ContentItem, Comment,
  CalendarPost, Resource, ClientMetrics, Message, Notification,
  BuyerPersona,
} from '../types'

// ─── Mappers ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProfile(r: any): User {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    avatar: r.avatar_url ?? undefined,
    position: r.position ?? undefined,
    clientId: r.client_id ?? undefined,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapClient(r: any): Client {
  return {
    id: r.id,
    name: r.name,
    logo: r.logo_url ?? undefined,
    industry: r.industry,
    contactName: r.contact_name,
    contactEmail: r.contact_email,
    contactPhone: r.contact_phone,
    website: r.website ?? undefined,
    socialMedia: {
      instagram: r.social_instagram ?? undefined,
      facebook: r.social_facebook ?? undefined,
      tiktok: r.social_tiktok ?? undefined,
      linkedin: r.social_linkedin ?? undefined,
    },
    brandColors: r.brand_colors ?? [],
    brandFonts: r.brand_fonts ?? [],
    objectives: r.objectives ?? [],
    buyerPersonas: (r.buyer_personas ?? []).map(mapBuyerPersona),
    joinDate: r.join_date,
    plan: r.plan,
    monthlyBudget: r.monthly_budget,
    status: r.status,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBuyerPersona(r: any): BuyerPersona {
  return {
    id: r.id,
    name: r.name,
    age: r.age_range ?? r.age ?? '',
    job: r.job,
    painPoints: r.pain_points ?? [],
    goals: r.goals ?? [],
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProject(r: any): Project {
  return {
    id: r.id,
    name: r.name,
    clientId: r.client_id,
    description: r.description ?? '',
    status: r.status,
    stage: r.stage,
    progress: r.progress ?? 0,
    startDate: r.start_date,
    endDate: r.end_date,
    team: (r.project_members ?? []).map((m: any) => m.user_id),
    budget: r.budget ?? 0,
    spent: r.spent ?? 0,
    tags: r.tags ?? [],
    color: r.color ?? '#6366f1',
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTask(r: any): Task {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? '',
    projectId: r.project_id,
    assigneeId: r.assignee_id,
    status: r.status,
    priority: r.priority,
    category: r.category,
    dueDate: r.due_date,
    createdAt: r.created_at,
    tags: r.tags ?? [],
    attachments: r.attachments_count ?? 0,
    comments: r.comments_count ?? 0,
    subtasks: (r.subtasks ?? []).map((s: any) => ({ id: s.id, title: s.title, done: s.done })),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapComment(r: any): Comment {
  return {
    id: r.id,
    userId: r.user_id,
    text: r.text,
    timestamp: r.timestamp_seconds ?? undefined,
    createdAt: r.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapContent(r: any): ContentItem {
  return {
    id: r.id,
    title: r.title,
    type: r.type,
    projectId: r.project_id,
    clientId: r.client_id,
    status: r.status,
    thumbnail: r.thumbnail_url ?? '',
    url: r.file_url ?? undefined,
    duration: r.duration ?? undefined,
    description: r.description ?? '',
    comments: (r.content_comments ?? []).map(mapComment),
    version: r.version ?? 1,
    uploadedAt: r.uploaded_at,
    publishedAt: r.published_at ?? undefined,
    platform: r.platforms ?? [],
    tags: r.tags ?? [],
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCalendarPost(r: any): CalendarPost {
  return {
    id: r.id,
    title: r.title,
    clientId: r.client_id,
    projectId: r.project_id,
    platform: r.platforms ?? [],
    category: r.category,
    scheduledDate: r.scheduled_date,
    scheduledTime: r.scheduled_time,
    status: r.status,
    contentId: r.content_id ?? undefined,
    caption: r.caption ?? undefined,
    color: r.color ?? '#6366f1',
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapResource(r: any): Resource {
  return {
    id: r.id,
    name: r.name,
    type: r.type,
    clientId: r.client_id ?? undefined,
    size: r.size_label ?? '',
    url: r.file_url ?? '',
    thumbnail: r.thumbnail_url ?? undefined,
    uploadedAt: r.uploaded_at,
    uploadedBy: r.uploaded_by,
    tags: r.tags ?? [],
    description: r.description ?? undefined,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMessage(r: any): Message {
  return {
    id: r.id,
    projectId: r.project_id,
    senderId: r.sender_id,
    text: r.text,
    createdAt: r.created_at,
    mentions: r.mentions ?? [],
    attachments: r.attachments ?? undefined,
    reactions: r.reactions ?? undefined,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapNotification(r: any): Notification {
  return {
    id: r.id,
    type: r.type,
    title: r.title,
    message: r.message,
    read: r.read,
    createdAt: r.created_at,
    userId: r.user_id,
    link: r.link ?? undefined,
  }
}

// ─── API functions ───────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error || !data) return null
  return mapProfile(data)
}

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('profiles').select('*')
  if (error || !data) return []
  return data.map(mapProfile)
}

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*, buyer_personas(*)')
  if (error || !data) return []
  return data.map(mapClient)
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_members(user_id)')
  if (error || !data) return []
  return data.map(mapProject)
}

export async function createProject(
  project: Omit<Project, 'id' | 'team' | 'spent' | 'progress'>
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: project.name,
      client_id: project.clientId,
      description: project.description,
      status: project.status,
      stage: project.stage,
      start_date: project.startDate || null,
      end_date: project.endDate || null,
      budget: project.budget,
      tags: project.tags,
      color: project.color,
    })
    .select('*, project_members(user_id)')
    .single()
  if (error || !data) return null
  return mapProject(data)
}

export async function createClient(
  client: Omit<Client, 'id' | 'buyerPersonas'>
): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .insert({
      name: client.name,
      logo_url: client.logo ?? null,
      industry: client.industry,
      contact_name: client.contactName,
      contact_email: client.contactEmail,
      contact_phone: client.contactPhone || null,
      website: client.website ?? null,
      social_instagram: client.socialMedia.instagram ?? null,
      social_facebook: client.socialMedia.facebook ?? null,
      social_tiktok: client.socialMedia.tiktok ?? null,
      social_linkedin: client.socialMedia.linkedin ?? null,
      brand_colors: client.brandColors,
      brand_fonts: client.brandFonts,
      objectives: client.objectives,
      join_date: client.joinDate,
      plan: client.plan,
      monthly_budget: client.monthlyBudget,
      status: client.status,
    })
    .select('*, buyer_personas(*)')
    .single()
  if (error || !data) return null
  return mapClient(data)
}

export async function createContentItem(
  item: Omit<ContentItem, 'id' | 'comments' | 'uploadedAt' | 'version'>
): Promise<ContentItem | null> {
  const { data, error } = await supabase
    .from('content_items')
    .insert({
      title: item.title,
      type: item.type,
      project_id: item.projectId,
      client_id: item.clientId,
      status: item.status,
      thumbnail_url: item.thumbnail || null,
      file_url: item.url ?? null,
      duration: item.duration ?? null,
      description: item.description,
      platforms: item.platform,
      tags: item.tags,
    })
    .select('*, content_comments(*)')
    .single()
  if (error || !data) return null
  return mapContent(data)
}

export async function createResource(
  resource: Omit<Resource, 'id' | 'uploadedAt'>
): Promise<Resource | null> {
  const { data, error } = await supabase
    .from('resources')
    .insert({
      name: resource.name,
      type: resource.type,
      client_id: resource.clientId ?? null,
      size_label: resource.size,
      file_url: resource.url,
      thumbnail_url: resource.thumbnail ?? null,
      uploaded_by: resource.uploadedBy,
      tags: resource.tags,
      description: resource.description ?? null,
    })
    .select()
    .single()
  if (error || !data) return null
  return mapResource(data)
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, subtasks(*)')
  if (error || !data) return []
  return data.map(mapTask)
}

export async function createTask(
  task: Omit<Task, 'id' | 'createdAt' | 'subtasks' | 'attachments' | 'comments'>
): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: task.title,
      description: task.description,
      project_id: task.projectId,
      assignee_id: task.assigneeId,
      status: task.status,
      priority: task.priority,
      category: task.category,
      due_date: task.dueDate,
      tags: task.tags,
    })
    .select('*, subtasks(*)')
    .single()
  if (error || !data) return null
  return mapTask(data)
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbUpdates: any = {}
  if (updates.title !== undefined) dbUpdates.title = updates.title
  if (updates.description !== undefined) dbUpdates.description = updates.description
  if (updates.status !== undefined) dbUpdates.status = updates.status
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority
  if (updates.assigneeId !== undefined) dbUpdates.assignee_id = updates.assigneeId
  if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate
  if (updates.tags !== undefined) dbUpdates.tags = updates.tags
  await supabase.from('tasks').update(dbUpdates).eq('id', id)
}

export async function getContentItems(): Promise<ContentItem[]> {
  const { data, error } = await supabase
    .from('content_items')
    .select('*, content_comments(*)')
  if (error || !data) return []
  return data.map(mapContent)
}

export async function updateContentStatus(
  id: string,
  status: 'approved' | 'rejected'
): Promise<void> {
  await supabase.from('content_items').update({ status }).eq('id', id)
}

export async function getCalendarPosts(): Promise<CalendarPost[]> {
  const { data, error } = await supabase.from('calendar_posts').select('*')
  if (error || !data) return []
  return data.map(mapCalendarPost)
}

export async function createCalendarPost(
  post: Omit<CalendarPost, 'id'>
): Promise<CalendarPost | null> {
  const { data, error } = await supabase
    .from('calendar_posts')
    .insert({
      title: post.title,
      client_id: post.clientId,
      project_id: post.projectId,
      platforms: post.platform,
      category: post.category,
      scheduled_date: post.scheduledDate,
      scheduled_time: post.scheduledTime,
      status: post.status,
      content_id: post.contentId ?? null,
      caption: post.caption ?? null,
      color: post.color,
    })
    .select()
    .single()
  if (error || !data) return null
  return mapCalendarPost(data)
}

export async function getResources(): Promise<Resource[]> {
  const { data, error } = await supabase.from('resources').select('*')
  if (error || !data) return []
  return data.map(mapResource)
}

export async function getClientMetrics(): Promise<ClientMetrics[]> {
  const { data, error } = await supabase
    .from('client_metrics')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error || !data) return []

  const map = new Map<string, ClientMetrics>()
  const monthlyMap = new Map<string, ClientMetrics['monthlyData']>()

  for (const r of data) {
    const cid: string = r.client_id
    if (!map.has(cid)) {
      map.set(cid, {
        clientId: cid,
        followers: {
          instagram: r.followers_instagram ?? 0,
          facebook: r.followers_facebook ?? 0,
          tiktok: r.followers_tiktok ?? 0,
        },
        engagement: r.engagement_rate ?? 0,
        reach: r.reach ?? 0,
        impressions: r.impressions ?? 0,
        conversions: r.conversions ?? 0,
        monthlyData: [],
      })
      monthlyMap.set(cid, [])
    }
    monthlyMap.get(cid)!.push({
      month: r.month_label ?? r.created_at?.substring(0, 7),
      followers: (r.followers_instagram ?? 0) + (r.followers_facebook ?? 0) + (r.followers_tiktok ?? 0),
      engagement: r.engagement_rate ?? 0,
      reach: r.reach ?? 0,
      posts: r.posts_count ?? 0,
    })
  }

  for (const [cid, metrics] of map.entries()) {
    metrics.monthlyData = monthlyMap.get(cid) ?? []
  }

  return Array.from(map.values())
}

export async function getMessages(projectId?: string): Promise<Message[]> {
  let query = supabase.from('messages').select('*').order('created_at')
  if (projectId) query = query.eq('project_id', projectId)
  const { data, error } = await query
  if (error || !data) return []
  return data.map(mapMessage)
}

export async function sendMessage(
  msg: Omit<Message, 'id' | 'createdAt'>
): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      project_id: msg.projectId,
      sender_id: msg.senderId,
      text: msg.text,
      mentions: msg.mentions,
      attachments: msg.attachments ?? null,
      reactions: msg.reactions ?? null,
    })
    .select()
    .single()
  if (error || !data) return null
  return mapMessage(data)
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data.map(mapNotification)
}

export async function markNotificationRead(id: string): Promise<void> {
  await supabase.from('notifications').update({ read: true }).eq('id', id)
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
}
