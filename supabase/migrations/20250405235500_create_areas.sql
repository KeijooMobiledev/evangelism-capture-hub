CREATE TABLE public.areas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT NOW()
);

ALTER TABLE evangelism_contacts
ADD COLUMN area_id uuid REFERENCES areas(id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.areas;
