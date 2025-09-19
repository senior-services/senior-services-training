-- Add archived_at column to videos table for soft archiving
ALTER TABLE public.videos 
ADD COLUMN archived_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add index for better performance on archived vs active video queries
CREATE INDEX idx_videos_archived_at ON public.videos(archived_at) WHERE archived_at IS NOT NULL;