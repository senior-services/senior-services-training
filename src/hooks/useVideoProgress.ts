import { useState, useCallback, useRef } from 'react';
import { progressOperations } from '@/services/api';
import { logger } from '@/utils/logger';
import { withErrorHandler } from '@/utils/errorHandler';

interface UseVideoProgressProps {
  videoId: string | null;
  userEmail: string | null;
  onProgressUpdate?: (progress: number) => void;
  hasQuiz?: boolean;
}

export function useVideoProgress({ videoId, userEmail, onProgressUpdate, hasQuiz }: UseVideoProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wasEverCompleted, setWasEverCompleted] = useState(false);
  const progressUpdateTimeoutRef = useRef<NodeJS.Timeout>();
  const completionGuardRef = useRef<boolean>(false);

  const updateProgressToDatabase = useCallback(async (progressPercent: number, forceComplete?: boolean) => {
    if (!userEmail || !videoId) {
      logger.warn('Cannot update progress: missing user email or video ID', {
        hasUser: !!userEmail,
        hasVideoId: !!videoId
      });
      return { success: false };
    }

    // Prevent progress regression if video was already completed
    if ((wasEverCompleted || completionGuardRef.current) && progressPercent < 100 && !forceComplete) {
      logger.info('Preventing progress regression on completed video', {
        videoId,
        currentProgress: progress,
        attemptedProgress: progressPercent,
        completionGuardActive: completionGuardRef.current
      });
      return { success: true };
    }

    const updateResult = await withErrorHandler(
      async () => {
        // Only set completedAt if progress is 100% AND (no quiz exists OR forceComplete is true)
        const shouldComplete = progressPercent >= 100 && (!hasQuiz || forceComplete);
        const completedAt = shouldComplete ? new Date() : undefined;
        
        await progressOperations.updateByEmail(
          userEmail,
          videoId,
          progressPercent,
          completedAt
        );

        logger.dbOperation('update', 'video_progress', true, {
          videoId,
          userEmail,
          progress: progressPercent,
          completed: progressPercent >= 100
        });

        // Handle completion state change - only mark as completed if should complete
        if (shouldComplete && !wasEverCompleted) {
          setIsCompleted(true);
          setWasEverCompleted(true);
          
          logger.videoEvent('video_completed', videoId, {
            userEmail,
            completionTime: new Date().toISOString()
          });
        }
      },
      { videoId, userEmail, progress: progressPercent },
      'Failed to save your progress'
    );

    return updateResult;
  }, [userEmail, videoId, wasEverCompleted, hasQuiz]);

  const updateProgress = useCallback((progressPercent: number) => {
    // Block any progress updates if completion guard is active
    if (completionGuardRef.current && progressPercent < 100) {
      logger.info('Blocking progress update due to completion guard', {
        videoId,
        attemptedProgress: progressPercent
      });
      return;
    }
    
    // Cap progress at 99% if quiz exists and hasn't been completed
    const cappedProgress = hasQuiz && progressPercent >= 100 && !wasEverCompleted ? 99 : progressPercent;
    
    // Prevent progress regression - only update if new progress is higher
    setProgress(currentProgress => Math.max(currentProgress, cappedProgress));
    onProgressUpdate?.(cappedProgress);

    // Debounce database updates
    if (progressUpdateTimeoutRef.current) {
      clearTimeout(progressUpdateTimeoutRef.current);
    }
    progressUpdateTimeoutRef.current = setTimeout(() => {
      updateProgressToDatabase(cappedProgress);
    }, 1000);
  }, [updateProgressToDatabase, onProgressUpdate, hasQuiz, wasEverCompleted, videoId]);

  const markComplete = useCallback(async () => {
    // Clear any pending debounced progress updates to prevent regression
    if (progressUpdateTimeoutRef.current) {
      clearTimeout(progressUpdateTimeoutRef.current);
      progressUpdateTimeoutRef.current = undefined;
    }

    // Activate completion guard to prevent any future sub-100% updates
    completionGuardRef.current = true;
    
    setProgress(100);
    setIsCompleted(true);
    setWasEverCompleted(true);
    onProgressUpdate?.(100);
    
    // Force completion even if quiz exists (this is called after quiz submission)
    return await updateProgressToDatabase(100, true);
  }, [updateProgressToDatabase, onProgressUpdate]);

  const resetProgress = useCallback(() => {
    completionGuardRef.current = false;
    setProgress(0);
    setIsCompleted(false);
    setWasEverCompleted(false);
    if (progressUpdateTimeoutRef.current) {
      clearTimeout(progressUpdateTimeoutRef.current);
    }
  }, []);

  const loadExistingProgress = useCallback(async () => {
    if (!userEmail || !videoId) return;

    try {
      const progressResult = await progressOperations.getByEmailAndVideo(userEmail, videoId);
      
      if (progressResult.success && progressResult.data) {
        const progressData = progressResult.data;
        const progressPercent = progressData.progress_percent;
        
        setProgress(progressPercent);
        const isVideoCompleted = progressPercent >= 100 || !!progressData.completed_at;
        setIsCompleted(isVideoCompleted);
        setWasEverCompleted(isVideoCompleted);
        
        // Set completion guard if video is completed
        if (isVideoCompleted) {
          completionGuardRef.current = true;
        }
        
        logger.videoEvent('progress_restored', videoId, {
          progress: progressPercent,
          completed: isVideoCompleted
        });
      } else {
        resetProgress();
      }
    } catch (error) {
      logger.error('Failed to load existing progress', error);
      resetProgress();
    }
  }, [userEmail, videoId, resetProgress]);

  return {
    progress,
    isCompleted,
    wasEverCompleted,
    updateProgress,
    markComplete,
    resetProgress,
    loadExistingProgress
  };
}