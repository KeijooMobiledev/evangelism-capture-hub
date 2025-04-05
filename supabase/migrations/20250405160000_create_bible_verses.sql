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
