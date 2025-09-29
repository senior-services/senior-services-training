-- Add content_type enum and update videos table
CREATE TYPE content_type AS ENUM ('video', 'presentation');

-- Add content_type column to videos table with default value for existing records
ALTER TABLE public.videos 
ADD COLUMN content_type content_type DEFAULT 'video'::content_type NOT NULL;

-- Create index for better performance when filtering by content type
CREATE INDEX idx_videos_content_type ON public.videos (content_type);