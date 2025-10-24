-- Add due_date column to sales table
ALTER TABLE sales ADD COLUMN IF NOT EXISTS due_date DATE;