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
