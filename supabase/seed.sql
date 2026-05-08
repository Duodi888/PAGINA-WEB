-- ============================================================
-- DUODI Brand Platform — Seed con datos reales de arranque
-- ============================================================

-- ── CLIENTS primero (el trigger de auth.users los necesita) ──
INSERT INTO public.clients
  (id, name, industry, contact_name, contact_email, contact_phone, website,
   social_instagram, social_facebook, social_tiktok, social_linkedin,
   brand_colors, brand_fonts, objectives, join_date, plan, monthly_budget, status)
VALUES
  ('b1111111-0000-0000-0000-000000000001','Clínica Smile','Salud & Odontología',
   'Luis Herrera','luis@clinicasmile.com','+57 300 123 4567','https://clinicasmile.com',
   '@clinicasmile','Clínica Smile','@clinicasmile_co',null,
   ARRAY['#0077B6','#00B4D8','#FFFFFF'],ARRAY['Montserrat','Open Sans'],
   ARRAY['Aumentar citas agendadas en un 30%','Posicionarse como referente en odontología estética','Crecer 2K seguidores mensuales en Instagram'],
   '2024-01-15','Premium',5000000,'active'),
  ('b1111111-0000-0000-0000-000000000002','Restaurante Bello','Gastronomía',
   'Ana Martínez','ana@restaurantebello.com','+57 311 987 6543',null,
   '@restaurantebello','Restaurante Bello',null,null,
   ARRAY['#8B1A1A','#D4A017','#F5F0E8'],ARRAY['Playfair Display','Lato'],
   ARRAY['Aumentar reservas en un 25%','Posicionar el brunch de los domingos','Generar comunidad local fidelizada'],
   '2024-03-01','Estándar',3000000,'active'),
  ('b1111111-0000-0000-0000-000000000003','FitLife Gym','Fitness & Bienestar',
   'Jorge Ruiz','jorge@fitlifegym.com','+57 315 456 7890',null,
   '@fitlifegym',null,'@fitlifegym',null,
   ARRAY['#FF6B35','#1A1A2E','#FFFFFF'],ARRAY['Bebas Neue','Roboto'],
   ARRAY['Aumentar membresías nuevas','Posicionar clases grupales','Viral en TikTok con challenges'],
   '2024-06-01','Premium',4500000,'active'),
  ('b1111111-0000-0000-0000-000000000004','Inmobiliaria Luna','Bienes Raíces',
   'Patricia Luna','patricia@inmoluna.com','+57 320 234 5678',null,
   '@inmobiliarialuna','Inmobiliaria Luna',null,'Inmobiliaria Luna',
   ARRAY['#2C3E50','#ECF0F1','#F39C12'],ARRAY['Raleway','Roboto'],
   ARRAY['Generar leads calificados de propiedades','Posicionar proyectos nuevos','Aumentar confianza y credibilidad'],
   '2024-08-01','Estándar',3500000,'active');

-- ── AUTH USERS (trigger crea perfiles automáticamente) ────────
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, is_sso_user
) VALUES
  ('a1111111-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000',
   'authenticated','authenticated','admin@duodi.com',
   crypt('duodi2025', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"name":"Diego Rodríguez","role":"admin","position":"CEO & Estratega","avatar_url":"https://api.dicebear.com/7.x/avataaars/svg?seed=Diego&backgroundColor=b6e3f4"}'::jsonb,
   false, false),
  ('a1111111-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000',
   'authenticated','authenticated','valen@duodi.com',
   crypt('duodi2025', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"name":"Valentina Torres","role":"collaborator","position":"Diseñadora Visual","avatar_url":"https://api.dicebear.com/7.x/avataaars/svg?seed=Valentina&backgroundColor=ffd5dc"}'::jsonb,
   false, false),
  ('a1111111-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000',
   'authenticated','authenticated','mateo@duodi.com',
   crypt('duodi2025', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"name":"Mateo Gómez","role":"collaborator","position":"Editor de Video","avatar_url":"https://api.dicebear.com/7.x/avataaars/svg?seed=Mateo&backgroundColor=c0aede"}'::jsonb,
   false, false),
  ('a1111111-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000',
   'authenticated','authenticated','camila@duodi.com',
   crypt('duodi2025', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"name":"Camila Vargas","role":"collaborator","position":"Community Manager","avatar_url":"https://api.dicebear.com/7.x/avataaars/svg?seed=Camila&backgroundColor=d1f4d1"}'::jsonb,
   false, false),
  ('a1111111-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000',
   'authenticated','authenticated','luis@clinicasmile.com',
   crypt('cliente2025', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"name":"Luis Herrera","role":"client","position":"Director - Clínica Smile","avatar_url":"https://api.dicebear.com/7.x/avataaars/svg?seed=Luis&backgroundColor=ffdfbf","client_id":"b1111111-0000-0000-0000-000000000001"}'::jsonb,
   false, false),
  ('a1111111-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000',
   'authenticated','authenticated','ana@restaurantebello.com',
   crypt('cliente2025', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"name":"Ana Martínez","role":"client","position":"Dueña - Restaurante Bello","avatar_url":"https://api.dicebear.com/7.x/avataaars/svg?seed=Ana&backgroundColor=ffd5dc","client_id":"b1111111-0000-0000-0000-000000000002"}'::jsonb,
   false, false);

-- ── AUTH IDENTITIES ───────────────────────────────────────────
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES
  (gen_random_uuid(),'a1111111-0000-0000-0000-000000000001','admin@duodi.com',
   '{"sub":"a1111111-0000-0000-0000-000000000001","email":"admin@duodi.com"}'::jsonb,'email',now(),now(),now()),
  (gen_random_uuid(),'a1111111-0000-0000-0000-000000000002','valen@duodi.com',
   '{"sub":"a1111111-0000-0000-0000-000000000002","email":"valen@duodi.com"}'::jsonb,'email',now(),now(),now()),
  (gen_random_uuid(),'a1111111-0000-0000-0000-000000000003','mateo@duodi.com',
   '{"sub":"a1111111-0000-0000-0000-000000000003","email":"mateo@duodi.com"}'::jsonb,'email',now(),now(),now()),
  (gen_random_uuid(),'a1111111-0000-0000-0000-000000000004','camila@duodi.com',
   '{"sub":"a1111111-0000-0000-0000-000000000004","email":"camila@duodi.com"}'::jsonb,'email',now(),now(),now()),
  (gen_random_uuid(),'a1111111-0000-0000-0000-000000000005','luis@clinicasmile.com',
   '{"sub":"a1111111-0000-0000-0000-000000000005","email":"luis@clinicasmile.com"}'::jsonb,'email',now(),now(),now()),
  (gen_random_uuid(),'a1111111-0000-0000-0000-000000000006','ana@restaurantebello.com',
   '{"sub":"a1111111-0000-0000-0000-000000000006","email":"ana@restaurantebello.com"}'::jsonb,'email',now(),now(),now());

-- ── PROFILES upsert (corrige/completa lo que creó el trigger) ──
INSERT INTO public.profiles (id, name, email, role, position, avatar_url, client_id)
VALUES
  ('a1111111-0000-0000-0000-000000000001','Diego Rodríguez','admin@duodi.com','admin','CEO & Estratega',
   'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego&backgroundColor=b6e3f4',null),
  ('a1111111-0000-0000-0000-000000000002','Valentina Torres','valen@duodi.com','collaborator','Diseñadora Visual',
   'https://api.dicebear.com/7.x/avataaars/svg?seed=Valentina&backgroundColor=ffd5dc',null),
  ('a1111111-0000-0000-0000-000000000003','Mateo Gómez','mateo@duodi.com','collaborator','Editor de Video',
   'https://api.dicebear.com/7.x/avataaars/svg?seed=Mateo&backgroundColor=c0aede',null),
  ('a1111111-0000-0000-0000-000000000004','Camila Vargas','camila@duodi.com','collaborator','Community Manager',
   'https://api.dicebear.com/7.x/avataaars/svg?seed=Camila&backgroundColor=d1f4d1',null),
  ('a1111111-0000-0000-0000-000000000005','Luis Herrera','luis@clinicasmile.com','client','Director - Clínica Smile',
   'https://api.dicebear.com/7.x/avataaars/svg?seed=Luis&backgroundColor=ffdfbf',
   'b1111111-0000-0000-0000-000000000001'),
  ('a1111111-0000-0000-0000-000000000006','Ana Martínez','ana@restaurantebello.com','client','Dueña - Restaurante Bello',
   'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana&backgroundColor=ffd5dc',
   'b1111111-0000-0000-0000-000000000002')
ON CONFLICT (id) DO UPDATE
  SET name=EXCLUDED.name, role=EXCLUDED.role,
      position=EXCLUDED.position, avatar_url=EXCLUDED.avatar_url,
      client_id=EXCLUDED.client_id;

-- ── BUYER PERSONAS ────────────────────────────────────────────
INSERT INTO public.buyer_personas (client_id, name, age_range, job, pain_points, goals) VALUES
  ('b1111111-0000-0000-0000-000000000001',
   'María, 32 años','28-38','Profesional independiente',
   ARRAY['Inseguridad con su sonrisa','No sabe qué tratamiento necesita'],
   ARRAY['Sonrisa perfecta','Proceso sin dolor','Resultados visibles']),
  ('b1111111-0000-0000-0000-000000000002',
   'Carlos, 40 años','35-50','Ejecutivo / Familia',
   ARRAY['Busca experiencias gastronómicas únicas','Tiempo limitado para salir'],
   ARRAY['Experiencia memorable','Buen servicio','Ambiente especial']),
  ('b1111111-0000-0000-0000-000000000003',
   'Juliana, 26 años','22-35','Estudiante / Profesional joven',
   ARRAY['Sin motivación para ejercitarse','Busca comunidad fit'],
   ARRAY['Cambio físico','Sentirse bien','Encontrar amigos']);

-- ── PROJECTS ──────────────────────────────────────────────────
INSERT INTO public.projects
  (id, name, client_id, description, status, stage, progress, start_date, end_date, budget, spent, tags, color)
VALUES
  ('c1111111-0000-0000-0000-000000000001','Campaña Q2 - Blanqueamiento Dental',
   'b1111111-0000-0000-0000-000000000001',
   'Campaña integral para posicionar el servicio de blanqueamiento dental.',
   'active','implementation',68,'2025-04-01','2025-06-30',5000000,3400000,
   ARRAY['Video','Instagram','TikTok','Testimonios'],'#0077B6'),
  ('c1111111-0000-0000-0000-000000000002','Brunch Dominguero - Content Series',
   'b1111111-0000-0000-0000-000000000002',
   'Serie de contenido gastronómico para posicionar el brunch dominical.',
   'active','strategy',42,'2025-04-15','2025-07-15',3000000,1260000,
   ARRAY['Fotografía','Reels','Stories','Gastronomía'],'#8B1A1A'),
  ('c1111111-0000-0000-0000-000000000003','FitLife - Challenge Viral TikTok',
   'b1111111-0000-0000-0000-000000000003',
   'Creación y lanzamiento de challenge viral en TikTok.',
   'active','implementation',75,'2025-03-01','2025-05-31',4500000,3375000,
   ARRAY['TikTok','Influencers','Challenge','Viral'],'#FF6B35'),
  ('c1111111-0000-0000-0000-000000000004','Inmoluna - Torres del Río',
   'b1111111-0000-0000-0000-000000000004',
   'Lanzamiento de nuevo proyecto inmobiliario con tours virtuales.',
   'active','research',20,'2025-05-01','2025-08-31',3500000,700000,
   ARRAY['Lanzamiento','Tour Virtual','LinkedIn','Premium'],'#2C3E50'),
  ('c1111111-0000-0000-0000-000000000005','Clínica Smile - Rebranding Digital',
   'b1111111-0000-0000-0000-000000000001',
   'Actualización de identidad visual digital y plantillas para redes.',
   'completed','monitoring',100,'2025-01-01','2025-03-31',2000000,1980000,
   ARRAY['Branding','Diseño','Plantillas'],'#0077B6');

-- ── PROJECT MEMBERS ───────────────────────────────────────────
INSERT INTO public.project_members (project_id, user_id) VALUES
  ('c1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000001'),
  ('c1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000002'),
  ('c1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000003'),
  ('c1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000004'),
  ('c1111111-0000-0000-0000-000000000002','a1111111-0000-0000-0000-000000000001'),
  ('c1111111-0000-0000-0000-000000000002','a1111111-0000-0000-0000-000000000002'),
  ('c1111111-0000-0000-0000-000000000002','a1111111-0000-0000-0000-000000000004'),
  ('c1111111-0000-0000-0000-000000000003','a1111111-0000-0000-0000-000000000001'),
  ('c1111111-0000-0000-0000-000000000003','a1111111-0000-0000-0000-000000000003'),
  ('c1111111-0000-0000-0000-000000000003','a1111111-0000-0000-0000-000000000004'),
  ('c1111111-0000-0000-0000-000000000004','a1111111-0000-0000-0000-000000000001'),
  ('c1111111-0000-0000-0000-000000000004','a1111111-0000-0000-0000-000000000002'),
  ('c1111111-0000-0000-0000-000000000005','a1111111-0000-0000-0000-000000000001'),
  ('c1111111-0000-0000-0000-000000000005','a1111111-0000-0000-0000-000000000002');

-- ── TASKS ─────────────────────────────────────────────────────
INSERT INTO public.tasks
  (id, title, description, project_id, assignee_id, status, priority, category, due_date, tags, attachments_count, comments_count, created_at)
VALUES
  ('d1111111-0000-0000-0000-000000000001','Grabar testimonios pacientes blanqueamiento',
   'Coordinar y grabar 4 testimonios reales de pacientes.',
   'c1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000003',
   'in_progress','high','recording','2025-05-10',ARRAY['Testimonios','Video'],2,3,'2025-04-20T00:00:00Z'),
  ('d1111111-0000-0000-0000-000000000002','Diseñar pack de Stories Q2 Smile',
   'Crear 20 plantillas de Stories para la campaña Q2.',
   'c1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000002',
   'review','high','design','2025-05-05',ARRAY['Diseño','Stories','Templates'],5,7,'2025-04-18T00:00:00Z'),
  ('d1111111-0000-0000-0000-000000000003','Estrategia de pauta Facebook Ads - Smile',
   'Definir estructura de campañas, audiencias y presupuesto.',
   'c1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000001',
   'done','urgent','pauta','2025-04-25',ARRAY['Pauta','Facebook Ads'],1,4,'2025-04-10T00:00:00Z'),
  ('d1111111-0000-0000-0000-000000000004','Fotografía producto - Brunch Domingo',
   'Sesión fotográfica de los platos estrella del brunch.',
   'c1111111-0000-0000-0000-000000000002','a1111111-0000-0000-0000-000000000002',
   'todo','medium','recording','2025-05-18',ARRAY['Fotografía','Gastronomía'],0,1,'2025-04-22T00:00:00Z'),
  ('d1111111-0000-0000-0000-000000000005','Editar Reel FitLife Challenge #1',
   'Editar el primer video del challenge viral.',
   'c1111111-0000-0000-0000-000000000003','a1111111-0000-0000-0000-000000000003',
   'in_progress','urgent','editing','2025-05-02',ARRAY['TikTok','Reel','Edición'],3,5,'2025-04-19T00:00:00Z'),
  ('d1111111-0000-0000-0000-000000000006','Copywriting posts semana 18 - FitLife',
   'Redactar captions para los 5 posts con hashtags.',
   'c1111111-0000-0000-0000-000000000003','a1111111-0000-0000-0000-000000000004',
   'todo','medium','copywriting','2025-05-07',ARRAY['Copy','Hashtags'],0,0,'2025-04-21T00:00:00Z'),
  ('d1111111-0000-0000-0000-000000000007','Investigación mercado inmobiliario',
   'Análisis de competencia digital y benchmarking.',
   'c1111111-0000-0000-0000-000000000004','a1111111-0000-0000-0000-000000000001',
   'in_progress','high','strategy','2025-05-15',ARRAY['Research','Estrategia'],4,2,'2025-05-01T00:00:00Z'),
  ('d1111111-0000-0000-0000-000000000008','Reporte de métricas Abril',
   'Consolidar métricas de todos los clientes.',
   'c1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000004',
   'todo','high','analytics','2025-05-05',ARRAY['Analytics','Reporte'],0,1,'2025-04-30T00:00:00Z');

-- ── SUBTASKS ──────────────────────────────────────────────────
INSERT INTO public.subtasks (id, task_id, title, done, position) VALUES
  (gen_random_uuid(),'d1111111-0000-0000-0000-000000000001','Contactar pacientes',true,1),
  (gen_random_uuid(),'d1111111-0000-0000-0000-000000000001','Preparar set de grabación',true,2),
  (gen_random_uuid(),'d1111111-0000-0000-0000-000000000001','Grabar testimonios',false,3),
  (gen_random_uuid(),'d1111111-0000-0000-0000-000000000001','Post-producción',false,4),
  (gen_random_uuid(),'d1111111-0000-0000-0000-000000000005','Seleccionar clips',true,1),
  (gen_random_uuid(),'d1111111-0000-0000-0000-000000000005','Edición básica',true,2),
  (gen_random_uuid(),'d1111111-0000-0000-0000-000000000005','Agregar música y efectos',false,3),
  (gen_random_uuid(),'d1111111-0000-0000-0000-000000000005','Revisión final',false,4);

-- ── CONTENT ITEMS ─────────────────────────────────────────────
INSERT INTO public.content_items
  (id, title, type, project_id, client_id, status, thumbnail_url, duration, description, version, uploaded_at, published_at, platforms, tags)
VALUES
  ('e1111111-0000-0000-0000-000000000001',
   'Testimonio - María Fernanda - Blanqueamiento','video',
   'c1111111-0000-0000-0000-000000000001','b1111111-0000-0000-0000-000000000001',
   'review','https://images.unsplash.com/photo-1588776814546-1ffbb172d936?w=400&h=225&fit=crop',
   62,'Testimonio real de paciente sobre blanqueamiento dental.',2,'2025-04-19T16:00:00Z',null,
   ARRAY['Instagram','TikTok'],ARRAY['Testimonio','Blanqueamiento']),
  ('e1111111-0000-0000-0000-000000000002',
   'Reel - Proceso Blanqueamiento Paso a Paso','reel',
   'c1111111-0000-0000-0000-000000000001','b1111111-0000-0000-0000-000000000001',
   'approved','https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=225&fit=crop',
   30,'Reel del proceso completo en 30 segundos.',3,'2025-04-15T11:00:00Z','2025-04-18T09:00:00Z',
   ARRAY['Instagram','TikTok','Facebook'],ARRAY['Reel','Educativo']),
  ('e1111111-0000-0000-0000-000000000003',
   'Reel Challenge - FitLife #MovimientoFit','reel',
   'c1111111-0000-0000-0000-000000000003','b1111111-0000-0000-0000-000000000003',
   'draft','https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=225&fit=crop',
   15,'Primer video del challenge viral.',1,'2025-04-21T08:00:00Z',null,
   ARRAY['TikTok'],ARRAY['Challenge','Viral']),
  ('e1111111-0000-0000-0000-000000000004',
   'Fotografías Brunch - Pack 12 fotos','image',
   'c1111111-0000-0000-0000-000000000002','b1111111-0000-0000-0000-000000000002',
   'review','https://images.unsplash.com/photo-1533920379810-6bedac9abb5c?w=400&h=225&fit=crop',
   null,'Pack de 12 fotografías del brunch.',1,'2025-04-22T12:00:00Z',null,
   ARRAY['Instagram','Facebook'],ARRAY['Fotografía','Brunch']),
  ('e1111111-0000-0000-0000-000000000005',
   'Video Corporativo - Inmoluna Intro','video',
   'c1111111-0000-0000-0000-000000000004','b1111111-0000-0000-0000-000000000004',
   'draft','https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=225&fit=crop',
   90,'Video de presentación corporativa para LinkedIn.',1,'2025-05-01T10:00:00Z',null,
   ARRAY['LinkedIn','YouTube'],ARRAY['Corporativo','Inmobiliaria']);

-- ── CONTENT COMMENTS ──────────────────────────────────────────
INSERT INTO public.content_comments (id, content_id, user_id, text, timestamp_seconds, created_at) VALUES
  (gen_random_uuid(),'e1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000001',
   'Excelente toma inicial, necesitamos recortar el intro.',5,'2025-04-20T10:30:00Z'),
  (gen_random_uuid(),'e1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000002',
   'Podríamos agregar el logo en el minuto 0:45',45,'2025-04-20T14:15:00Z'),
  (gen_random_uuid(),'e1111111-0000-0000-0000-000000000003','a1111111-0000-0000-0000-000000000003',
   'Subiendo la edición v2 con la música nueva.',null,'2025-04-21T09:00:00Z'),
  (gen_random_uuid(),'e1111111-0000-0000-0000-000000000004','a1111111-0000-0000-0000-000000000001',
   'Las fotos de los pancakes están perfectas, aprobadas.',null,'2025-04-22T15:00:00Z'),
  (gen_random_uuid(),'e1111111-0000-0000-0000-000000000004','a1111111-0000-0000-0000-000000000002',
   'Necesitamos retocar el color en las fotos #7 y #9.',null,'2025-04-22T16:30:00Z');

-- ── CALENDAR POSTS ────────────────────────────────────────────
INSERT INTO public.calendar_posts (id, title, client_id, project_id, platforms, category, scheduled_date, scheduled_time, status, color) VALUES
  (gen_random_uuid(),'Tip dental del lunes','b1111111-0000-0000-0000-000000000001','c1111111-0000-0000-0000-000000000001',ARRAY['Instagram'],'presentation','2025-05-05','10:00:00','scheduled','#0077B6'),
  (gen_random_uuid(),'Testimonio María F.','b1111111-0000-0000-0000-000000000001','c1111111-0000-0000-0000-000000000001',ARRAY['Instagram','TikTok'],'testimonials','2025-05-07','18:00:00','scheduled','#0077B6'),
  (gen_random_uuid(),'Brunch especial domingo','b1111111-0000-0000-0000-000000000002','c1111111-0000-0000-0000-000000000002',ARRAY['Instagram'],'human','2025-05-04','08:00:00','scheduled','#8B1A1A'),
  (gen_random_uuid(),'Challenge #MovimientoFit','b1111111-0000-0000-0000-000000000003','c1111111-0000-0000-0000-000000000003',ARRAY['TikTok'],'human','2025-05-06','19:00:00','scheduled','#FF6B35'),
  (gen_random_uuid(),'Oferta membresía mayo','b1111111-0000-0000-0000-000000000003','c1111111-0000-0000-0000-000000000003',ARRAY['Instagram','Facebook'],'promotion','2025-05-08','12:00:00','scheduled','#FF6B35'),
  (gen_random_uuid(),'Proceso blanqueamiento reel','b1111111-0000-0000-0000-000000000001','c1111111-0000-0000-0000-000000000001',ARRAY['Instagram','TikTok'],'presentation','2025-05-12','17:00:00','scheduled','#0077B6'),
  (gen_random_uuid(),'Behind the scenes cocina','b1111111-0000-0000-0000-000000000002','c1111111-0000-0000-0000-000000000002',ARRAY['Instagram','Facebook'],'human','2025-05-13','19:00:00','scheduled','#8B1A1A'),
  (gen_random_uuid(),'Transformación fitness 30 días','b1111111-0000-0000-0000-000000000003','c1111111-0000-0000-0000-000000000003',ARRAY['TikTok','Instagram'],'testimonials','2025-05-14','20:00:00','scheduled','#FF6B35'),
  (gen_random_uuid(),'2x1 tratamiento blanqueamiento','b1111111-0000-0000-0000-000000000001','c1111111-0000-0000-0000-000000000001',ARRAY['Instagram','Facebook'],'promotion','2025-05-15','10:00:00','scheduled','#0077B6'),
  (gen_random_uuid(),'Nuevo proyecto Torres del Río','b1111111-0000-0000-0000-000000000004','c1111111-0000-0000-0000-000000000004',ARRAY['LinkedIn','Instagram'],'presentation','2025-05-19','09:00:00','scheduled','#2C3E50'),
  (gen_random_uuid(),'Clase grupal mañana gratis','b1111111-0000-0000-0000-000000000003','c1111111-0000-0000-0000-000000000003',ARRAY['Instagram','Facebook'],'promotion','2025-05-20','07:00:00','scheduled','#FF6B35'),
  (gen_random_uuid(),'Testimonio familia en el restaurante','b1111111-0000-0000-0000-000000000002','c1111111-0000-0000-0000-000000000002',ARRAY['Instagram'],'testimonials','2025-05-21','12:00:00','scheduled','#8B1A1A');

-- ── RESOURCES ─────────────────────────────────────────────────
INSERT INTO public.resources (id, name, type, client_id, size_label, file_url, thumbnail_url, uploaded_at, uploaded_by, tags) VALUES
  (gen_random_uuid(),'Brandbook Clínica Smile 2024','brandbook','b1111111-0000-0000-0000-000000000001','4.2 MB','#','https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=150&fit=crop','2024-01-20T00:00:00Z','a1111111-0000-0000-0000-000000000001',ARRAY['Marca','Identidad']),
  (gen_random_uuid(),'Logo Clínica Smile - Pack completo','logo','b1111111-0000-0000-0000-000000000001','8.1 MB','#',null,'2024-01-20T00:00:00Z','a1111111-0000-0000-0000-000000000002',ARRAY['Logo','SVG','PNG']),
  (gen_random_uuid(),'Brandbook Restaurante Bello','brandbook','b1111111-0000-0000-0000-000000000002','6.8 MB','#','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=150&fit=crop','2024-03-05T00:00:00Z','a1111111-0000-0000-0000-000000000001',ARRAY['Marca','Gastronomía']),
  (gen_random_uuid(),'Plantillas Stories Instagram - Smile','template','b1111111-0000-0000-0000-000000000001','12.5 MB','#','https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=150&fit=crop','2025-04-01T00:00:00Z','a1111111-0000-0000-0000-000000000002',ARRAY['Templates','Stories']),
  (gen_random_uuid(),'Plantillas Posts Feed - FitLife','template','b1111111-0000-0000-0000-000000000003','18.3 MB','#','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=150&fit=crop','2025-03-10T00:00:00Z','a1111111-0000-0000-0000-000000000002',ARRAY['Templates','Feed']),
  (gen_random_uuid(),'Guía de Contenido DUODI 2025','guide',null,'2.1 MB','#',null,'2025-01-01T00:00:00Z','a1111111-0000-0000-0000-000000000001',ARRAY['Guía','Contenido']),
  (gen_random_uuid(),'Pack Stickers DUODI Brand','image',null,'5.4 MB','#',null,'2025-02-01T00:00:00Z','a1111111-0000-0000-0000-000000000002',ARRAY['Stickers','Branding']),
  (gen_random_uuid(),'Logo FitLife - Variaciones','logo','b1111111-0000-0000-0000-000000000003','3.7 MB','#',null,'2025-03-01T00:00:00Z','a1111111-0000-0000-0000-000000000002',ARRAY['Logo','FitLife']);

-- ── CLIENT METRICS ────────────────────────────────────────────
INSERT INTO public.client_metrics
  (client_id, month_label, sort_order, followers_instagram, followers_facebook, followers_tiktok, engagement_rate, reach, impressions, conversions, posts_count) VALUES
  ('b1111111-0000-0000-0000-000000000001','Nov',1,8200,5000,2100,3.2,25000,65000,42,16),
  ('b1111111-0000-0000-0000-000000000001','Dic',2,9100,5200,2400,3.8,30000,78000,51,14),
  ('b1111111-0000-0000-0000-000000000001','Ene',3,9800,5400,2700,4.0,33000,88000,62,18),
  ('b1111111-0000-0000-0000-000000000001','Feb',4,10600,5600,2900,4.2,37000,99000,70,20),
  ('b1111111-0000-0000-0000-000000000001','Mar',5,11500,5700,3050,4.5,42000,110000,79,22),
  ('b1111111-0000-0000-0000-000000000001','Abr',6,12400,5800,3200,4.7,45000,120000,87,24),
  ('b1111111-0000-0000-0000-000000000002','Nov',1,6000,3800,0,4.0,18000,48000,28,12),
  ('b1111111-0000-0000-0000-000000000002','Dic',2,6500,3900,0,4.3,20000,53000,33,10),
  ('b1111111-0000-0000-0000-000000000002','Ene',3,7000,4000,0,4.5,22000,58000,38,14),
  ('b1111111-0000-0000-0000-000000000002','Feb',4,7400,4050,0,4.8,24000,63000,44,16),
  ('b1111111-0000-0000-0000-000000000002','Mar',5,8000,4100,0,5.0,26000,69000,49,18),
  ('b1111111-0000-0000-0000-000000000002','Abr',6,8600,4200,0,5.2,28000,75000,54,20),
  ('b1111111-0000-0000-0000-000000000003','Nov',1,10000,2800,12000,4.5,45000,130000,78,20),
  ('b1111111-0000-0000-0000-000000000003','Dic',2,11200,2900,14000,5.0,52000,152000,92,18),
  ('b1111111-0000-0000-0000-000000000003','Ene',3,13000,3000,16500,5.5,62000,178000,106,24),
  ('b1111111-0000-0000-0000-000000000003','Feb',4,14800,3050,18500,6.0,72000,208000,118,26),
  ('b1111111-0000-0000-0000-000000000003','Mar',5,16500,3100,20500,6.4,84000,244000,130,28),
  ('b1111111-0000-0000-0000-000000000003','Abr',6,18500,3200,22400,6.8,95000,280000,143,32);

-- ── MESSAGES ──────────────────────────────────────────────────
INSERT INTO public.messages (id, project_id, sender_id, text, mentions, created_at) VALUES
  (gen_random_uuid(),'c1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000001',
   'Buenos días equipo! Necesitamos acelerar los testimonios esta semana.',ARRAY[]::uuid[],'2025-04-21T08:30:00Z'),
  (gen_random_uuid(),'c1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000003',
   '@Diego ya tengo los primeros dos testimonios grabados, @Valentina me falta el intro.',
   ARRAY['a1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000002']::uuid[],'2025-04-21T09:15:00Z'),
  (gen_random_uuid(),'c1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000002',
   'Listo @Mateo, te mando el intro a las 11am. Subí las Stories para revisión.',
   ARRAY['a1111111-0000-0000-0000-000000000003']::uuid[],'2025-04-21T09:45:00Z'),
  (gen_random_uuid(),'c1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000004',
   'Perfecto! Ya programé los posts. Falta confirmar el caption del jueves @Diego',
   ARRAY['a1111111-0000-0000-0000-000000000001']::uuid[],'2025-04-21T10:00:00Z'),
  (gen_random_uuid(),'c1111111-0000-0000-0000-000000000003','a1111111-0000-0000-0000-000000000003',
   'El reel del challenge quedó brutal! Lo subí para revisión.',ARRAY[]::uuid[],'2025-04-21T11:30:00Z'),
  (gen_random_uuid(),'c1111111-0000-0000-0000-000000000003','a1111111-0000-0000-0000-000000000001',
   'Excelente @Mateo! @Camila revisa que el hashtag esté correcto antes de publicar.',
   ARRAY['a1111111-0000-0000-0000-000000000003','a1111111-0000-0000-0000-000000000004']::uuid[],'2025-04-21T11:45:00Z'),
  (gen_random_uuid(),'c1111111-0000-0000-0000-000000000002','a1111111-0000-0000-0000-000000000002',
   'Las fotos del brunch están listas para revisión. Muy buena luz natural!',ARRAY[]::uuid[],'2025-04-22T14:00:00Z');

-- ── NOTIFICATIONS ─────────────────────────────────────────────
INSERT INTO public.notifications (id, type, title, message, read, user_id, created_at) VALUES
  (gen_random_uuid(),'task','Tarea pendiente','El reporte de métricas de Abril vence mañana',false,'a1111111-0000-0000-0000-000000000001','2025-05-04T08:00:00Z'),
  (gen_random_uuid(),'comment','Nuevo comentario','Valentina comentó en "Testimonio María F."',false,'a1111111-0000-0000-0000-000000000001','2025-04-21T14:15:00Z'),
  (gen_random_uuid(),'approval','Contenido para aprobar','Pack Stories Q2 Smile está listo para revisión',false,'a1111111-0000-0000-0000-000000000001','2025-04-21T09:45:00Z'),
  (gen_random_uuid(),'mention','Te mencionaron','Camila te mencionó en el chat de FitLife',true,'a1111111-0000-0000-0000-000000000001','2025-04-21T10:00:00Z'),
  (gen_random_uuid(),'deadline','Fecha límite próxima','Diseño pack Stories vence en 3 días',true,'a1111111-0000-0000-0000-000000000002','2025-04-20T07:00:00Z');
