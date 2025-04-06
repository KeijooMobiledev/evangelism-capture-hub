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
