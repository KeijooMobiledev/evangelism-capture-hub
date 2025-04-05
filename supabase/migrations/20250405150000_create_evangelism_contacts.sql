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
