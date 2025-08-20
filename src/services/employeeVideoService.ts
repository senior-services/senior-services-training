import { supabase } from '@/integrations/supabase/client';

export interface AssignedVideo {
  assignment_id: string;
  video_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  due_date: string | null;
  created_at: string;
}

export const employeeVideoService = {
  // Get assigned videos for the current authenticated user
  async getAssignedVideos(): Promise<{ success: boolean; data: AssignedVideo[] | null; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('video_assignments')
        .select(`
          id,
          video_id,
          due_date,
          created_at,
          videos (
            id,
            title,
            description,
            video_url,
            thumbnail_url
          )
        `)
        .eq('employee_id', await this.getEmployeeIdByEmail(user.email!));

      if (error) {
        console.error('Error fetching assigned videos:', error);
        return { success: false, data: null, error: error.message };
      }

      // Transform the data to match our interface
      const transformedData: AssignedVideo[] = data.map((assignment: any) => ({
        assignment_id: assignment.id,
        video_id: assignment.video_id,
        title: assignment.videos.title,
        description: assignment.videos.description,
        video_url: assignment.videos.video_url,
        thumbnail_url: assignment.videos.thumbnail_url,
        due_date: assignment.due_date,
        created_at: assignment.created_at
      }));

      return { success: true, data: transformedData };
    } catch (error) {
      console.error('Error in getAssignedVideos:', error);
      return { success: false, data: null, error: 'Failed to fetch assigned videos' };
    }
  },

  // Helper method to get employee ID by email
  async getEmployeeIdByEmail(email: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('employees')
      .select('id')
      .eq('email', email)
      .single();

    if (error || !data) {
      console.error('Error fetching employee ID:', error);
      return null;
    }

    return data.id;
  }
};