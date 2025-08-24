import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoadingSkeleton } from "@/components/ui/loading-spinner";
import { Play, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EmployeeService } from "@/services/employeeService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Video } from "@/types";
import { isYouTubeUrl, getYouTubeVideoId, isGoogleDriveUrl, getGoogleDriveEmbedUrl } from "@/utils/videoUtils";
interface VideoPlayerFullscreenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string | null;
  onProgressUpdate?: (progress: number) => void;
}

// Fullscreen video modal that fetches video details by ID
export const VideoPlayerFullscreen: React.FC<VideoPlayerFullscreenProps> = ({
  open,
  onOpenChange,
  videoId,
  onProgressUpdate
}) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressUpdateTimeoutRef = useRef<NodeJS.Timeout>();
  const { user } = useAuth();
  const { toast } = useToast();
  useEffect(() => {
    const load = async () => {
      if (!open || !videoId) {
        setProgress(0);
        setIsCompleted(false);
        return;
      }
      setLoading(true);
      try {
        const v = await EmployeeService.getVideoById(videoId);
        setVideo(v);
        setProgress(0);
        setIsCompleted(false);
      } catch (e) {
        console.error('Failed to load video for modal:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, videoId]);

  // Debounced progress update to database
  const updateProgressToDatabase = useCallback(async (progressPercent: number) => {
    if (!user?.email || !videoId) return;

    try {
      const completedAt = progressPercent >= 100 ? new Date() : undefined;
      await EmployeeService.updateVideoProgressByEmail(
        user.email,
        videoId,
        progressPercent,
        completedAt
      );

      if (progressPercent >= 100 && !isCompleted) {
        setIsCompleted(true);
        toast({
          title: "Video Completed! 🎉",
          description: "You've successfully completed this training video.",
        });
      }
    } catch (error) {
      console.error('Failed to update video progress:', error);
    }
  }, [user?.email, videoId, isCompleted, toast]);

  // Handle video progress updates
  const handleVideoProgress = useCallback((event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (!video.duration) return;

    const progressPercent = Math.round((video.currentTime / video.duration) * 100);
    setProgress(progressPercent);
    onProgressUpdate?.(progressPercent);

    // Debounce database updates
    if (progressUpdateTimeoutRef.current) {
      clearTimeout(progressUpdateTimeoutRef.current);
    }

    progressUpdateTimeoutRef.current = setTimeout(() => {
      updateProgressToDatabase(progressPercent);
    }, 2000); // Update database every 2 seconds

  }, [updateProgressToDatabase, onProgressUpdate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (progressUpdateTimeoutRef.current) {
        clearTimeout(progressUpdateTimeoutRef.current);
      }
    };
  }, []);
  const content = useMemo(() => {
    if (!video) return null;
    const videoUrl = video.video_url;
    const fileName = video.video_file_name;
    if (!videoUrl && !fileName) {
      return <div className="w-full h-full flex items-center justify-center bg-muted">
          <p className="text-muted-foreground">Video not available</p>
        </div>;
    }
    if (videoUrl && isYouTubeUrl(videoUrl)) {
      const id = getYouTubeVideoId(videoUrl);
      if (id) {
        return (
          <iframe 
            src={`https://www.youtube.com/embed/${id}`} 
            title={video.title} 
            className="w-full h-full" 
            allowFullScreen 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          />
        );
      }
    }
    if (videoUrl && isGoogleDriveUrl(videoUrl)) {
      const embedUrl = getGoogleDriveEmbedUrl(videoUrl);
      if (embedUrl) {
        return (
          <iframe 
            src={embedUrl} 
            title={video.title} 
            className="w-full h-full" 
            allowFullScreen 
          />
        );
      }
    }
    const src = videoUrl || (fileName ? `https://wicbqqoudkaulltsjsvp.supabase.co/storage/v1/object/public/videos/${fileName}` : undefined);
    return <video 
        ref={videoRef}
        className="w-full h-full object-fill" 
        controls 
        preload="metadata"
        onTimeUpdate={handleVideoProgress}
      >
        {src && <source src={src} type="video/mp4" />}
        Your browser does not support the video tag.
      </video>;
  }, [video]);
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-6 overflow-hidden shadow-2xl">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <Play className="w-5 h-5 text-primary" />
              {video?.title || 'Training Video'}
            </DialogTitle>
            {isCompleted && (
              <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-1" />
                Completed
              </Badge>
            )}
          </div>
          {progress > 0 && (
            <div className="mt-3">
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </DialogHeader>
        <div className="w-full h-[calc(90vh-8rem)] bg-black rounded-lg overflow-hidden shadow-inner">
          {loading ? <div className="w-full h-full flex items-center justify-center">
              <LoadingSkeleton lines={1} className="w-32 h-32" />
            </div> : <div className="w-full h-full flex items-center justify-center">{content}</div>}
        </div>
      </DialogContent>
    </Dialog>;
};