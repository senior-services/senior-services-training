-- Fix existing Google Presentation URLs that are incorrectly stored as video content type
UPDATE videos 
SET content_type = 'presentation' 
WHERE video_url LIKE '%docs.google.com/presentation%' 
  OR video_url LIKE '%drive.google.com/file/d/%/presentation%'
  OR video_url LIKE '%docs.google.com/presentation/d/%';