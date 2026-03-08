import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

type UserRole = 'admin' | 'employee' | null;

export function useUserRole(user: User | null) {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!user) {
      setRole(null);
      // Don't set loading=false here — keep it true so that when user
      // transitions from null to non-null, the App loading guard stays
      // active until the role is actually fetched. The App.tsx loading
      // check (isAuthenticated && roleLoading) ensures this only blocks
      // when a user is authenticated, so unauthenticated flows are unaffected.
      return;
    }

    // Reset loading to true when user changes and we need to fetch role
    setLoading(true);

    const fetchUserRole = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (!mounted) return;

        if (error) {
          logger.error('Error fetching user roles', error as Error);
          setRole('employee'); // Default to employee role on error
        } else {
          const roles = (data ?? []).map((r: any) => (typeof r.role === 'string' ? r.role : String(r.role)));
          setRole(roles.includes('admin') ? 'admin' : 'employee');
        }
      } catch (error) {
        if (!mounted) return;
        logger.error('Error fetching user role', error as Error);
        setRole('employee'); // Default to employee role on error
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUserRole();

    // Set up real-time subscription with error handling
    let channel: any = null;
    try {
      channel = supabase
        .channel('user_roles_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_roles', filter: `user_id=eq.${user.id}` },
          () => {
            if (!mounted) return;
            fetchUserRole();
          }
        )
        .subscribe();
    } catch (error) {
      // Silently fail if WebSockets aren't available (e.g., in insecure contexts)
      logger.error('Failed to set up real-time subscription for user roles', error as Error);
    }

    return () => {
      mounted = false;
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          // Silently fail on cleanup
          logger.error('Failed to remove channel', error as Error);
        }
      }
    };
  }, [user?.id]); // Only depend on user.id to avoid unnecessary re-renders

  return { role, loading };
}