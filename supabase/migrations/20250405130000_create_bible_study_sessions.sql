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
