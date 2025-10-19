-- Create the screening records table
CREATE TABLE IF NOT EXISTS screening_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  screening_number VARCHAR(50) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  vaccination BOOLEAN NOT NULL,
  mammography VARCHAR(20) NOT NULL,
  gyneco_consultation BOOLEAN NOT NULL,
  fcu BOOLEAN DEFAULT FALSE,
  hpv BOOLEAN DEFAULT FALSE,
  mammary_ultrasound BOOLEAN DEFAULT FALSE,
  thermo_ablation BOOLEAN DEFAULT FALSE,
  anapath BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE screening_records ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations on screening_records" 
ON screening_records 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_screening_date ON screening_records(date);
CREATE INDEX IF NOT EXISTS idx_screening_created_at ON screening_records(created_at);
