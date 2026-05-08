-- ============================================================
-- DUODI Brand Platform — Schema inicial con RLS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── CLIENTS ──────────────────────────────────────────────────
CREATE TABLE public.clients (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name            text        NOT NULL,
  logo_url        text,
  industry        text        NOT NULL,
  contact_name    text        NOT NULL,
  contact_email   text        NOT NULL,
  contact_phone   text,
  website         text,
  social_instagram text,
  social_facebook  text,
  social_tiktok    text,
  social_linkedin  text,
  brand_colors    text[]      DEFAULT '{}',
  brand_fonts     text[]      DEFAULT '{}',
  objectives      text[]      DEFAULT '{}',
  join_date       date        NOT NULL,
  plan            text        NOT NULL,
  monthly_budget  numeric     NOT NULL DEFAULT 0,
  status          text        NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at      timestamptz DEFAULT now()
);

-- ── PROFILES (extiende auth.users) ────────────────────────────
CREATE TABLE public.profiles (
  id          uuid        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name        text        NOT NULL,
  email       text        NOT NULL,
  role        text        NOT NULL CHECK (role IN ('admin','collaborator','client')),
  position    text,
  avatar_url  text,
  client_id   uuid        REFERENCES public.clients(id) ON DELETE SET NULL,
  dark_mode   boolean     DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- ── BUYER PERSONAS ────────────────────────────────────────────
CREATE TABLE public.buyer_personas (
  id          uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id   uuid    NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name        text    NOT NULL,
  age_range   text,
  job         text,
  pain_points text[]  DEFAULT '{}',
  goals       text[]  DEFAULT '{}'
);

-- ── PROJECTS ──────────────────────────────────────────────────
CREATE TABLE public.projects (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text        NOT NULL,
  client_id   uuid        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  description text,
  status      text        NOT NULL DEFAULT 'draft'
              CHECK (status IN ('active','paused','completed','draft')),
  stage       text        NOT NULL DEFAULT 'research'
              CHECK (stage IN ('research','strategy','implementation','monitoring')),
  progress    integer     NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  start_date  date,
  end_date    date,
  budget      numeric     DEFAULT 0,
  spent       numeric     DEFAULT 0,
  tags        text[]      DEFAULT '{}',
  color       text        DEFAULT '#6366f1',
  created_at  timestamptz DEFAULT now()
);

-- ── PROJECT MEMBERS ───────────────────────────────────────────
CREATE TABLE public.project_members (
  project_id  uuid  NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id     uuid  NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, user_id)
);

-- ── TASKS ─────────────────────────────────────────────────────
CREATE TABLE public.tasks (
  id                uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title             text        NOT NULL,
  description       text,
  project_id        uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  assignee_id       uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  status            text        NOT NULL DEFAULT 'todo'
                    CHECK (status IN ('todo','in_progress','review','done')),
  priority          text        NOT NULL DEFAULT 'medium'
                    CHECK (priority IN ('low','medium','high','urgent')),
  category          text        NOT NULL
                    CHECK (category IN ('recording','editing','design','strategy','pauta','copywriting','analytics')),
  due_date          date,
  tags              text[]      DEFAULT '{}',
  attachments_count integer     DEFAULT 0,
  comments_count    integer     DEFAULT 0,
  created_at        timestamptz DEFAULT now()
);

-- ── SUBTASKS ──────────────────────────────────────────────────
CREATE TABLE public.subtasks (
  id        uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id   uuid    NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  title     text    NOT NULL,
  done      boolean DEFAULT false,
  position  integer DEFAULT 0
);

-- ── CONTENT ITEMS ─────────────────────────────────────────────
CREATE TABLE public.content_items (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title         text        NOT NULL,
  type          text        NOT NULL CHECK (type IN ('video','image','reel','story','carousel')),
  project_id    uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id     uuid        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  status        text        NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','review','approved','rejected','published')),
  thumbnail_url text,
  file_url      text,
  duration      integer,
  description   text,
  version       integer     DEFAULT 1,
  uploaded_at   timestamptz DEFAULT now(),
  published_at  timestamptz,
  platforms     text[]      DEFAULT '{}',
  tags          text[]      DEFAULT '{}'
);

-- ── CONTENT COMMENTS ──────────────────────────────────────────
CREATE TABLE public.content_comments (
  id                uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id        uuid        NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  user_id           uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text              text        NOT NULL,
  timestamp_seconds integer,
  created_at        timestamptz DEFAULT now()
);

-- ── CALENDAR POSTS ────────────────────────────────────────────
CREATE TABLE public.calendar_posts (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title          text        NOT NULL,
  client_id      uuid        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id     uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  platforms      text[]      DEFAULT '{}',
  category       text        NOT NULL CHECK (category IN ('presentation','testimonials','human','promotion')),
  scheduled_date date        NOT NULL,
  scheduled_time time,
  status         text        NOT NULL DEFAULT 'scheduled'
                 CHECK (status IN ('scheduled','published','draft','cancelled')),
  content_id     uuid        REFERENCES public.content_items(id) ON DELETE SET NULL,
  caption        text,
  color          text        DEFAULT '#6366f1',
  created_at     timestamptz DEFAULT now()
);

-- ── RESOURCES ─────────────────────────────────────────────────
CREATE TABLE public.resources (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text        NOT NULL,
  type          text        NOT NULL
                CHECK (type IN ('brandbook','guide','template','logo','palette','font','image','video')),
  client_id     uuid        REFERENCES public.clients(id) ON DELETE SET NULL,
  size_label    text,
  file_url      text,
  thumbnail_url text,
  uploaded_at   timestamptz DEFAULT now(),
  uploaded_by   uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  tags          text[]      DEFAULT '{}',
  description   text
);

-- ── CLIENT METRICS ────────────────────────────────────────────
CREATE TABLE public.client_metrics (
  id                  uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id           uuid    NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  month_label         text    NOT NULL,
  sort_order          integer NOT NULL,
  followers_instagram integer DEFAULT 0,
  followers_facebook  integer DEFAULT 0,
  followers_tiktok    integer DEFAULT 0,
  engagement_rate     numeric(5,2) DEFAULT 0,
  reach               integer DEFAULT 0,
  impressions         integer DEFAULT 0,
  conversions         integer DEFAULT 0,
  posts_count         integer DEFAULT 0,
  created_at          timestamptz DEFAULT now(),
  UNIQUE (client_id, month_label)
);

-- ── MESSAGES ──────────────────────────────────────────────────
CREATE TABLE public.messages (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id  uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sender_id   uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text        text        NOT NULL,
  mentions    uuid[]      DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);

-- ── NOTIFICATIONS ─────────────────────────────────────────────
CREATE TABLE public.notifications (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  type        text        NOT NULL CHECK (type IN ('task','comment','mention','approval','deadline')),
  title       text        NOT NULL,
  message     text        NOT NULL,
  read        boolean     DEFAULT false,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  link        text,
  created_at  timestamptz DEFAULT now()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_profiles_client_id    ON public.profiles(client_id);
CREATE INDEX idx_projects_client_id    ON public.projects(client_id);
CREATE INDEX idx_project_members_proj  ON public.project_members(project_id);
CREATE INDEX idx_project_members_user  ON public.project_members(user_id);
CREATE INDEX idx_tasks_project_id      ON public.tasks(project_id);
CREATE INDEX idx_tasks_assignee_id     ON public.tasks(assignee_id);
CREATE INDEX idx_subtasks_task_id      ON public.subtasks(task_id);
CREATE INDEX idx_content_project_id    ON public.content_items(project_id);
CREATE INDEX idx_content_client_id     ON public.content_items(client_id);
CREATE INDEX idx_comments_content_id   ON public.content_comments(content_id);
CREATE INDEX idx_calendar_client_id    ON public.calendar_posts(client_id);
CREATE INDEX idx_calendar_date         ON public.calendar_posts(scheduled_date);
CREATE INDEX idx_resources_client_id   ON public.resources(client_id);
CREATE INDEX idx_metrics_client_sort   ON public.client_metrics(client_id, sort_order);
CREATE INDEX idx_messages_project_id   ON public.messages(project_id);
CREATE INDEX idx_notifications_user    ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread  ON public.notifications(user_id, read);

-- ============================================================
-- TRIGGER: auto-crear profile al registrarse
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, position, avatar_url, client_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'collaborator'),
    NEW.raw_user_meta_data->>'position',
    NEW.raw_user_meta_data->>'avatar_url',
    CASE
      WHEN NEW.raw_user_meta_data->>'client_id' IS NOT NULL
      THEN (NEW.raw_user_meta_data->>'client_id')::uuid
      ELSE NULL
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- FUNCIONES HELPER PARA RLS
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.get_my_client_id()
RETURNS uuid LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT client_id FROM public.profiles WHERE id = auth.uid()
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self"         ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_team_read"    ON public.profiles FOR SELECT USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "profiles_self_update"  ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profiles_admin_update" ON public.profiles FOR UPDATE USING (get_my_role() = 'admin');
CREATE POLICY "profiles_insert"       ON public.profiles FOR INSERT WITH CHECK (true);

-- clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients_team_read"   ON public.clients FOR SELECT USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "clients_own_read"    ON public.clients FOR SELECT USING (id = get_my_client_id());
CREATE POLICY "clients_admin_write" ON public.clients FOR ALL   USING (get_my_role() = 'admin');

-- buyer_personas
ALTER TABLE public.buyer_personas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bp_team_read"   ON public.buyer_personas FOR SELECT USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "bp_client_read" ON public.buyer_personas FOR SELECT USING (client_id = get_my_client_id());
CREATE POLICY "bp_admin_write" ON public.buyer_personas FOR ALL   USING (get_my_role() = 'admin');

-- projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "proj_team_read"   ON public.projects FOR SELECT USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "proj_client_read" ON public.projects FOR SELECT USING (client_id = get_my_client_id());
CREATE POLICY "proj_team_write"  ON public.projects FOR INSERT WITH CHECK (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "proj_team_update" ON public.projects FOR UPDATE USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "proj_admin_del"   ON public.projects FOR DELETE USING (get_my_role() = 'admin');

-- project_members
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pm_team_read"   ON public.project_members FOR SELECT USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "pm_client_read" ON public.project_members FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE client_id = get_my_client_id())
);
CREATE POLICY "pm_admin_write" ON public.project_members FOR ALL USING (get_my_role() = 'admin');

-- tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_team_read"   ON public.tasks FOR SELECT USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "tasks_client_read" ON public.tasks FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE client_id = get_my_client_id())
);
CREATE POLICY "tasks_team_write"  ON public.tasks FOR INSERT WITH CHECK (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "tasks_team_update" ON public.tasks FOR UPDATE USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "tasks_admin_del"   ON public.tasks FOR DELETE USING (get_my_role() = 'admin');

-- subtasks
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "st_team_read"  ON public.subtasks FOR SELECT USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "st_team_write" ON public.subtasks FOR ALL   USING (get_my_role() IN ('admin','collaborator'));

-- content_items
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ci_team_read"   ON public.content_items FOR SELECT USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "ci_client_read" ON public.content_items FOR SELECT USING (client_id = get_my_client_id());
CREATE POLICY "ci_team_write"  ON public.content_items FOR INSERT WITH CHECK (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "ci_team_update" ON public.content_items FOR UPDATE USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "ci_admin_del"   ON public.content_items FOR DELETE USING (get_my_role() = 'admin');

-- content_comments
ALTER TABLE public.content_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cc_team_read"   ON public.content_comments FOR SELECT USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "cc_client_read" ON public.content_comments FOR SELECT USING (
  content_id IN (SELECT id FROM public.content_items WHERE client_id = get_my_client_id())
);
CREATE POLICY "cc_auth_insert" ON public.content_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "cc_own_update"  ON public.content_comments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "cc_own_delete"  ON public.content_comments FOR DELETE USING (user_id = auth.uid() OR get_my_role() = 'admin');

-- calendar_posts
ALTER TABLE public.calendar_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cal_team_read"   ON public.calendar_posts FOR SELECT USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "cal_client_read" ON public.calendar_posts FOR SELECT USING (client_id = get_my_client_id());
CREATE POLICY "cal_team_write"  ON public.calendar_posts FOR ALL   USING (get_my_role() IN ('admin','collaborator'));

-- resources
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "res_team_read"   ON public.resources FOR SELECT USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "res_client_read" ON public.resources FOR SELECT USING (client_id = get_my_client_id() OR client_id IS NULL);
CREATE POLICY "res_team_write"  ON public.resources FOR ALL   USING (get_my_role() IN ('admin','collaborator'));

-- client_metrics
ALTER TABLE public.client_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "met_team_read"   ON public.client_metrics FOR SELECT USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "met_client_read" ON public.client_metrics FOR SELECT USING (client_id = get_my_client_id());
CREATE POLICY "met_admin_write" ON public.client_metrics FOR ALL   USING (get_my_role() = 'admin');

-- messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "msg_team_read"   ON public.messages FOR SELECT USING (get_my_role() IN ('admin','collaborator'));
CREATE POLICY "msg_client_read" ON public.messages FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE client_id = get_my_client_id())
);
CREATE POLICY "msg_auth_insert" ON public.messages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND sender_id = auth.uid());
CREATE POLICY "msg_own_update"  ON public.messages FOR UPDATE USING (sender_id = auth.uid());
CREATE POLICY "msg_admin_del"   ON public.messages FOR DELETE USING (get_my_role() = 'admin');

-- notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_own_read"    ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notif_own_update"  ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "notif_admin_write" ON public.notifications FOR INSERT WITH CHECK (get_my_role() = 'admin');
CREATE POLICY "notif_own_delete"  ON public.notifications FOR DELETE USING (user_id = auth.uid());
