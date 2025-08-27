import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'employee' | null;

export function useUserRole(user: User | null) {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!user) {
      setRole(null);
      setLoading(false);
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
          console.error('Error fetching user roles:', error);
          setRole('employee'); // Default to employee role on error
        } else {
          const roles = (data ?? []).map((r: any) => (typeof r.role === 'string' ? r.role : String(r.role)));
          setRole(roles.includes('admin') ? 'admin' : 'employee');
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error fetching user role:', error);
        setRole('employee'); // Default to employee role on error
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUserRole();

    return () => {
      mounted = false;
    };
  }, [user?.id]); // Only depend on user.id to avoid unnecessary re-renders

  return { role, loading };
}