import { Dialog, DialogContent, DialogHeader, DialogScrollArea, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Users } from "lucide-react";
import { logger } from "@/utils/logger";
import { ContentPlayer } from "@/components/content/ContentPlayer";
import { TrainingContent, VideoType } from "@/types";
interface VideoPlayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: {
    id: string;
    title: string;
    description?: string | null;
    type: string;
    video_url?: string | null;
    video_file_name?: string | null;
    thumbnail_url?: string | null;
    content_type?: 'video' | 'presentation';
  } | null;
}
export const VideoPlayerModal = ({
  open,
  onOpenChange,
  video
}: VideoPlayerModalProps) => {
  // Only log when actually opening with video data
  if (open && video) {
    logger.info('VideoPlayerModal opened', {
      videoTitle: video.title
    });
  }

  // Handle modal close and cleanup
  const handleClose = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };
  if (!video) {
    return <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-4xl">
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No video selected</p>
          </div>
        </DialogContent>
      </Dialog>;
  }
  // Convert to TrainingContent format for ContentPlayer
  const trainingContent: TrainingContent = {
    id: video.id,
    title: video.title,
    description: video.description || null,
    type: (video.type as VideoType) || 'Optional',
    video_url: video.video_url || null,
    video_file_name: video.video_file_name || null,
    thumbnail_url: video.thumbnail_url || null,
    content_type: video.content_type || 'video', // Default to video for backward compatibility
    completion_rate: 0,
    duration_seconds: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    archived_at: null
  };
  return <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{video.title}</DialogTitle>
        </DialogHeader>
        
        <DialogScrollArea className="space-y-4">
          {/* Content Player Area */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <ContentPlayer
              content={trainingContent}
              onProgressUpdate={() => {}}
              onComplete={() => {}}
            />
          </div>

        </DialogScrollArea>
      </DialogContent>
    </Dialog>;
};