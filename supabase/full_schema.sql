-- Create table for bible study sessions
CREATE TABLE public.bible_study_sessions (
  room_name TEXT PRIMARY KEY,
  current_passage TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.bible_study_sessions;

-- Create RPC function to get bible passages
CREATE OR REPLACE FUNCTION public.get_bible_passage(passage_ref TEXT)
RETURNS TEXT AS $$
BEGIN
  -- This should query your bible data table
  -- For now just returning the reference as placeholder
  RETURN passage_ref;
END;
$$ LANGUAGE plpgsql;
-- Create evangelism contacts table
CREATE TABLE public.evangelism_contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  last_contact timestamptz DEFAULT NOW(),
  status text NOT NULL CHECK (status IN ('new', 'followup', 'believer')) DEFAULT 'new',
  notes text,
  created_at timestamptz DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.evangelism_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own contacts" 
ON public.evangelism_contacts
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_evangelism_contacts_user_id ON public.evangelism_contacts(user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.evangelism_contacts;
CREATE TABLE public.bible_verses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference text NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT NOW()
);

INSERT INTO public.bible_verses (reference, text) VALUES
('Jean 3:16', 'Car Dieu a tant aimé le monde qu''il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu''il ait la vie éternelle.'),
('Romains 10:9', 'Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l''a ressuscité des morts, tu seras sauvé.');

CREATE INDEX idx_bible_verses_reference ON public.bible_verses(reference);
CREATE TABLE public.social_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users,
  theme text,
  verse text,
  generated_text text,
  image_url text,
  created_at timestamptz DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.social_posts;

CREATE INDEX idx_social_posts_user_id ON public.social_posts(user_id);
CREATE TABLE public.scheduled_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users,
  post_id uuid REFERENCES social_posts,
  platforms text[], -- ex: ['facebook', 'whatsapp']
  scheduled_at timestamptz NOT NULL,
  status text DEFAULT 'pending', -- pending, sent, failed
  created_at timestamptz DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.scheduled_posts;

CREATE INDEX idx_scheduled_posts_user_id ON public.scheduled_posts(user_id);
CREATE INDEX idx_scheduled_posts_status ON public.scheduled_posts(status);
ALTER TABLE evangelism_contacts
ADD COLUMN interest_score INTEGER DEFAULT 0,
ADD COLUMN last_interaction TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN next_followup TIMESTAMPTZ,
ADD COLUMN followup_notes TEXT;

CREATE TABLE contact_interactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id uuid REFERENCES evangelism_contacts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users,
  interaction_type TEXT, -- call, message, visit, prayer
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE contact_interactions;
CREATE TABLE public.areas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT NOW()
);

ALTER TABLE evangelism_contacts
ADD COLUMN area_id uuid REFERENCES areas(id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.areas;
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT NOW()
);

CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users,
  role text DEFAULT 'member', -- member, leader, admin
  joined_at timestamptz DEFAULT NOW()
);

ALTER TABLE evangelism_contacts
ADD COLUMN assigned_to uuid REFERENCES auth.users,
ADD COLUMN team_id uuid REFERENCES teams(id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_members;
CREATE TABLE public.platform_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key text UNIQUE NOT NULL,
  value text,
  description text,
  updated_at timestamptz DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.platform_settings;
