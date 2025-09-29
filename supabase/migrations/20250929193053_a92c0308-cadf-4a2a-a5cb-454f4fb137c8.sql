-- Fix existing presentations that are incorrectly classified as videos
-- This will correct "presentation 2" and any other Google Presentation URLs
-- that have content_type = 'video'

UPDATE videos 
SET content_type = 'presentation',
    updated_at = now()
WHERE video_url LIKE '%docs.google.com/presentation%' 
  AND content_type = 'video';