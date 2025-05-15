-- Add symptoms column to pregnancy_entries table
ALTER TABLE pregnancy_entries
ADD COLUMN symptoms TEXT[] DEFAULT '{}';
 
-- Add comment to the column
COMMENT ON COLUMN pregnancy_entries.symptoms IS 'Array of pregnancy symptoms experienced by the user'; 