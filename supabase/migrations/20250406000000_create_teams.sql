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
