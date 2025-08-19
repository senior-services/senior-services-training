-- Add due_date column to video_assignments table
ALTER TABLE video_assignments 
ADD COLUMN due_date DATE;

-- Add index for better performance when querying by due dates
CREATE INDEX idx_video_assignments_due_date ON video_assignments(due_date) WHERE due_date IS NOT NULL;