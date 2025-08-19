-- Update videos with working sample video URLs
UPDATE videos 
SET video_url = CASE 
  WHEN title LIKE '%Workplace Safety%' THEN 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4'
  WHEN title LIKE '%Anti-Harassment%' THEN 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4'  
  WHEN title LIKE '%Data Privacy%' THEN 'https://sample-videos.com/zip/10/mp4/SampleVideo_480x360_1mb.mp4'
  WHEN title LIKE '%Employee Code%' THEN 'https://sample-videos.com/zip/10/mp4/SampleVideo_720x480_1mb.mp4'
  ELSE 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4'
END
WHERE video_url IS NULL OR video_url = '' OR video_url NOT LIKE 'https://sample-videos.com%';