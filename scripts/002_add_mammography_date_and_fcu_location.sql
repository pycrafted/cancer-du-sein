-- Add mammography_date, fcu_location, and gyneco_date columns to screening_records table
ALTER TABLE screening_records 
ADD COLUMN IF NOT EXISTS mammography_date DATE,
ADD COLUMN IF NOT EXISTS fcu_location VARCHAR(50),
ADD COLUMN IF NOT EXISTS gyneco_date DATE;
