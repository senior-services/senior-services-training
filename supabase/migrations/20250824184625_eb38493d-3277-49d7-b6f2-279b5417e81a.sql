-- Update all videos that are assigned to employees to be marked as "Required"
-- This ensures consistency: if a video is assigned, it's required training

UPDATE videos 
SET type = 'Required', updated_at = now()
WHERE id IN (
  SELECT DISTINCT video_id 
  FROM video_assignments
);

-- Also update any unassigned videos to be "Optional" for clarity
UPDATE videos 
SET type = 'Optional', updated_at = now()
WHERE id NOT IN (
  SELECT DISTINCT video_id 
  FROM video_assignments
) AND type = 'Required';