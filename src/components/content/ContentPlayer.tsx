import React from 'react';
import { TrainingContent } from '@/types';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { PresentationViewer } from '@/components/presentation/PresentationViewer';

interface ContentPlayerProps {
  content: TrainingContent;
  onProgressUpdate?: (progress: number) => void;
  onComplete?: () => void;
}

export const ContentPlayer: React.FC<ContentPlayerProps> = ({
  content,
  onProgressUpdate,
  onComplete,
}) => {
  // Default to video if content_type is not specified (backward compatibility)
  const contentType = content.content_type || 'video';

  if (contentType === 'presentation') {
    return (
      <PresentationViewer
        content={content}
        onProgressUpdate={onProgressUpdate}
        onComplete={onComplete}
      />
    );
  }

  // Cast back to Video interface for VideoPlayer (it expects Video, not TrainingContent)
  return (
    <VideoPlayer
      video={content}
      loading={false}
      progress={0}
      onProgressUpdate={onProgressUpdate || (() => {})}
      onVideoEnded={onComplete || (() => {})}
      updateProgressToDatabase={async () => {}}
    />
  );
};