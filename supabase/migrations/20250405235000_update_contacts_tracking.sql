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
