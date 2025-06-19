-- Script de migration complet pour le nouveau projet Supabase
-- 1. Création des extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Création des tables avec leurs schémas exacts
CREATE TABLE IF NOT EXISTS public.bible_study_sessions (
  room_name TEXT PRIMARY KEY,
  current_passage TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.evangelism_contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  last_contact timestamptz DEFAULT NOW(),
  status text NOT NULL CHECK (status IN ('new', 'followup', 'believer')) DEFAULT 'new',
  notes text,
  created_at timestamptz DEFAULT NOW(),
  interest_score INTEGER DEFAULT 0,
  last_interaction TIMESTAMPTZ DEFAULT NOW(),
  next_followup TIMESTAMPTZ,
  followup_notes TEXT,
  area_id uuid,
  assigned_to uuid REFERENCES auth.users,
  team_id uuid
);

CREATE TABLE IF NOT EXISTS public.bible_verses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference text NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.social_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users,
  theme text,
  verse text,
  generated_text text,
  image_url text,
  created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users,
  post_id uuid REFERENCES social_posts,
  platforms text[],
  scheduled_at timestamptz NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_interactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id uuid REFERENCES evangelism_contacts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users,
  interaction_type TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.areas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.teams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users,
  role text DEFAULT 'member',
  joined_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.platform_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key text UNIQUE NOT NULL,
  value text,
  description text,
  updated_at timestamptz DEFAULT NOW()
);

-- 3. Ajout des contraintes après création des tables
ALTER TABLE public.evangelism_contacts 
ADD CONSTRAINT fk_area FOREIGN KEY (area_id) REFERENCES public.areas(id),
ADD CONSTRAINT fk_team FOREIGN KEY (team_id) REFERENCES public.teams(id);

-- 4. Activation de la réplication en temps réel
ALTER PUBLICATION supabase_realtime ADD TABLE public.bible_study_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.evangelism_contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.social_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scheduled_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_interactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.areas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.platform_settings;

-- 5. Création des index pour les performances
CREATE INDEX IF NOT EXISTS idx_evangelism_contacts_user_id ON public.evangelism_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_bible_verses_reference ON public.bible_verses(reference);
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON public.social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user_id ON public.scheduled_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON public.scheduled_posts(status);

-- 6. Activation du Row Level Security
ALTER TABLE public.evangelism_contacts ENABLE ROW LEVEL SECURITY;

-- 7. Insertion des données de base
INSERT INTO public.bible_verses (reference, text) VALUES
('Jean 3:16', 'Car Dieu a tant aimé le monde qu''il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu''il ait la vie éternelle.'),
('Romains 10:9', 'Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l''a ressuscité des morts, tu seras sauvé.');

-- 8. Politiques de sécurité
CREATE POLICY "Users can manage their own contacts" 
ON public.evangelism_contacts
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Note: Pour migrer les données existantes, exécuter séparément:
-- INSERT INTO nouvelle_table SELECT * FROM ancienne_table;
-- Après avoir établi une connexion entre les deux bases
