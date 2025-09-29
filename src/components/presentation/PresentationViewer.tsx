import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2, Presentation } from 'lucide-react';
import { TrainingContent } from '@/types';
import { getGooglePresentationEmbedUrl } from '@/utils/videoUtils';

interface PresentationViewerProps {
  content: TrainingContent;
  onProgressUpdate?: (progress: number) => void;
  onComplete?: () => void;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  content,
  onProgressUpdate,
  onComplete,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const embedUrl = content.video_url ? getGooglePresentationEmbedUrl(content.video_url) : null;

  useEffect(() => {
    // Calculate progress based on slide position
    const progress = totalSlides > 0 ? (currentSlide / totalSlides) * 100 : 0;
    onProgressUpdate?.(progress);

    // Mark as complete when reaching the last slide
    if (currentSlide === totalSlides && totalSlides > 1) {
      onComplete?.();
    }
  }, [currentSlide, totalSlides, onProgressUpdate, onComplete]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          handlePreviousSlide();
          break;
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          handleNextSlide();
          break;
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, totalSlides, isFullscreen]);

  const handlePreviousSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleIframeError = () => {
    setHasError(true);
  };

  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <Presentation className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Unable to load presentation</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <Presentation className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Failed to load presentation</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => window.open(content.video_url, '_blank')}
          >
            Open in Google Slides
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Presentation iframe */}
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          onError={handleIframeError}
          title={`Presentation: ${content.title}`}
          aria-label={`Presentation viewer for ${content.title}`}
        />
      </div>

      {/* Controls overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousSlide}
          disabled={currentSlide <= 1}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm font-medium px-2" role="status" aria-live="polite">
          {currentSlide} / {totalSlides}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextSlide}
          disabled={currentSlide >= totalSlides}
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="outline"
          size="sm"
          onClick={handleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(currentSlide / Math.max(totalSlides, 1)) * 100}%` }}
          role="progressbar"
          aria-valuenow={currentSlide}
          aria-valuemin={1}
          aria-valuemax={totalSlides}
          aria-label={`Presentation progress: slide ${currentSlide} of ${totalSlides}`}
        />
      </div>
    </div>
  );
};