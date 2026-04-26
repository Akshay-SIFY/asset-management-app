
-- SQL Schema for Asset Management iTest Content Team
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id TEXT UNIQUE NOT NULL,
  asset_name TEXT NOT NULL,
  type TEXT,
  category TEXT,
  ref_no TEXT,
  model TEXT,
  serial_number TEXT UNIQUE,
  host_name TEXT,
  assigned_to TEXT,
  use_by TEXT,
  location TEXT,
  submission_status TEXT,
  verification_status TEXT,
  asset_mapped TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security) - Relaxed for "No Auth" requirement as requested
-- WARNING: In a production app with sensitive data, you SHOULD use Authentication.
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON assets FOR SELECT USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert" ON assets FOR INSERT WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Allow public update" ON assets FOR UPDATE USING (true);

-- Allow public delete access
CREATE POLICY "Allow public delete" ON assets FOR DELETE USING (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
