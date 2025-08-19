-- Add sample video URLs to existing videos for testing
UPDATE videos 
SET video_url = CASE 
  WHEN title LIKE '%Workplace Safety%' THEN 'https://www.w3schools.com/html/mov_bbb.mp4'
  WHEN title LIKE '%Customer Service%' OR title LIKE '%Conduct%' THEN 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'  
  WHEN title LIKE '%Data Privacy%' THEN 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4'
  ELSE video_url 
END
WHERE video_url IS NULL AND title IS NOT NULL;