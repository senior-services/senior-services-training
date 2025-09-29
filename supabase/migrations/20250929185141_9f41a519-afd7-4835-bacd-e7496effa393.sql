-- Fix Google Slides URLs that were incorrectly classified as 'video'
UPDATE videos 
SET content_type = 'presentation',
    updated_at = now()
WHERE video_url LIKE '%docs.google.com/presentation%' 
  AND content_type = 'video';