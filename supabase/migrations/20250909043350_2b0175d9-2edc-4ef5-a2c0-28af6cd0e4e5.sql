-- Create visitors table and necessary policies for public kiosk usage
-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create visitors table
CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  mobile TEXT,
  company TEXT,
  person_to_meet TEXT,
  department TEXT,
  purpose TEXT,
  check_in_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  check_out_time TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'checked-in',
  photo_url TEXT,
  badge_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT visitors_status_valid CHECK (status IN ('checked-in', 'checked-out'))
);

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trg_visitors_updated_at ON public.visitors;
CREATE TRIGGER trg_visitors_updated_at
BEFORE UPDATE ON public.visitors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_visitors_check_in_time ON public.visitors (check_in_time DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_status ON public.visitors (status);

-- Enable RLS
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Policies: public kiosk (no auth) - allow read/insert/update for all
DROP POLICY IF EXISTS "Anyone can view visitors" ON public.visitors;
CREATE POLICY "Anyone can view visitors"
ON public.visitors FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Anyone can create visitors" ON public.visitors;
CREATE POLICY "Anyone can create visitors"
ON public.visitors FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update visitors" ON public.visitors;
CREATE POLICY "Anyone can update visitors"
ON public.visitors FOR UPDATE
USING (true)
WITH CHECK (true);
