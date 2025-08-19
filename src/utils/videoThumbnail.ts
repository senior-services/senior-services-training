/**
 * Utility functions for generating video thumbnails
 */

/**
 * Generates a thumbnail from a video file
 * @param videoFile - The video file to generate thumbnail from
 * @param seekTo - Time in seconds to seek to for thumbnail (default: 1 second)
 * @returns Promise<string> - Base64 encoded thumbnail image
 */
export const generateVideoThumbnail = (
  videoFile: File,
  seekTo: number = 1
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create video element
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    video.addEventListener('loadedmetadata', () => {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Seek to the desired time
      video.currentTime = Math.min(seekTo, video.duration);
    });

    video.addEventListener('seeked', () => {
      try {
        // Draw the video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to base64 image
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        
        // Clean up
        video.removeAttribute('src');
        video.load();
        
        resolve(thumbnail);
      } catch (error) {
        reject(error);
      }
    });

    video.addEventListener('error', (e) => {
      reject(new Error('Error loading video for thumbnail generation'));
    });

    // Load the video file
    video.src = URL.createObjectURL(videoFile);
    video.load();
  });
};

/**
 * Uploads a thumbnail image to Supabase storage
 * @param thumbnailBase64 - Base64 encoded thumbnail
 * @param filename - Filename for the thumbnail
 * @returns Promise<string | null> - Public URL of uploaded thumbnail or null if failed
 */
export const uploadThumbnail = async (
  thumbnailBase64: string,
  filename: string
): Promise<string | null> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Convert base64 to blob
    const response = await fetch(thumbnailBase64);
    const blob = await response.blob();
    
    // Upload to storage
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(`thumbnails/${filename}`, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Error uploading thumbnail:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(`thumbnails/${filename}`);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadThumbnail:', error);
    return null;
  }
};