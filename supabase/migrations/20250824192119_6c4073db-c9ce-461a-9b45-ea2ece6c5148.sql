-- Enable realtime for video_progress table
ALTER TABLE public.video_progress REPLICA IDENTITY FULL;

-- Add video_progress table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.video_progress;