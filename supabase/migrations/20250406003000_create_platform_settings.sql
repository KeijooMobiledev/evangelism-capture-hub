CREATE TABLE public.platform_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key text UNIQUE NOT NULL,
  value text,
  description text,
  updated_at timestamptz DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.platform_settings;
