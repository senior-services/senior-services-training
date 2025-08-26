import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  isPending?: boolean;
}

export class AdminService {
  /**
   * Get all admin users including pending admins
   */
  static async getAdmins(): Promise<AdminUser[]> {
    // Get actual admins
    const { data: adminRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (rolesError) {
      console.error('Error fetching admin roles:', rolesError);
      throw rolesError;
    }

    let actualAdmins: AdminUser[] = [];
    
    if (adminRoles && adminRoles.length > 0) {
      const adminUserIds = adminRoles.map(role => role.user_id);

      // Get profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name, created_at')
        .in('user_id', adminUserIds)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching admin profiles:', profilesError);
        throw profilesError;
      }

      actualAdmins = (profiles || []).map(profile => ({
        id: profile.user_id,
        email: profile.email,
        full_name: profile.full_name,
        created_at: profile.created_at,
        isPending: false
      }));
    }

    // Get pending admins
    const { data: pendingAdmins, error: pendingError } = await (supabase as any)
      .from('pending_admins')
      .select('id, email, created_at')
      .order('created_at', { ascending: false });

    if (pendingError) {
      console.error('Error fetching pending admins:', pendingError);
      // Don't throw error, just continue without pending admins
    }

    const pendingAdminUsers: AdminUser[] = (pendingAdmins || []).map(pending => ({
      id: pending.id,
      email: pending.email,
      full_name: undefined,
      created_at: pending.created_at,
      isPending: true
    }));

    // Combine and sort by created_at
    const allAdmins = [...actualAdmins, ...pendingAdminUsers];
    return allAdmins.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * Add admin email to pre-approved list (creates a pending admin entry)
   */
  static async addPendingAdminByEmail(email: string): Promise<void> {
    // If the email already belongs to an existing admin, block
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', email)
      .maybeSingle();

    if (profile) {
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('role', 'admin')
        .maybeSingle();

      if (existingRole) {
        throw new Error('User is already an admin.');
      }
    }

    // Create or update pending admin entry (cast to any until types refresh)
    const { error: upsertError } = await (supabase as any)
      .from('pending_admins')
      .upsert({ email: email.toLowerCase() }, { onConflict: 'email' });

    if (upsertError) {
      console.error('Error adding pending admin:', upsertError);
      throw upsertError;
    }
  }

  /**
   * Check if email is pre-approved for admin access
   */
  static async isPendingAdmin(email: string): Promise<boolean> {
    const { data, error } = await (supabase as any)
      .from('pending_admins')
      .select('email')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('Error checking pending admin:', error);
      return false;
    }

    return !!data;
  }

  /**
   * Remove pending admin entry (called after user signs up)
   */
  static async removePendingAdmin(email: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('pending_admins')
      .delete()
      .eq('email', email.toLowerCase());

    if (error) {
      console.error('Error removing pending admin:', error);
    }
  }

  /**
   * Add admin role to existing user
   */
  static async addAdminByEmail(email: string): Promise<void> {
    // First, check if user exists in profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', email)
      .maybeSingle();

    if (profileError || !profile) {
      // If user doesn't exist, add to pending admins
      await this.addPendingAdminByEmail(email);
      return;
    }

    // Check if user already has admin role
    const { data: existingRole, error: roleCheckError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', profile.user_id)
      .eq('role', 'admin')
      .maybeSingle();

    if (existingRole) {
      throw new Error('User is already an admin.');
    }

    // Add admin role
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: profile.user_id,
        role: 'admin'
      });

    if (insertError) {
      console.error('Error adding admin role:', insertError);
      throw insertError;
    }
  }

  /**
   * Grant admin role to a specific user id (used after OAuth callback)
   */
  static async grantAdminToUserId(userId: string): Promise<void> {
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (existingRole) return;

    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'admin' });

    if (error) {
      console.error('Error granting admin role:', error);
      throw error;
    }
  }

  /**
   * Remove admin role from a user or delete pending admin
   */
  static async removeAdminRole(userId: string, isPending: boolean = false): Promise<void> {
    if (isPending) {
      // Remove from pending admins
      const { error } = await (supabase as any)
        .from('pending_admins')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error removing pending admin:', error);
        throw error;
      }
      return;
    }

    // Check if this is the last admin
    const { data: adminCount, error: countError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('role', 'admin');

    if (countError) {
      console.error('Error checking admin count:', countError);
      throw countError;
    }

    if (adminCount && adminCount.length <= 1) {
      throw new Error('Cannot remove the last admin. There must be at least one admin.');
    }

    // Remove admin role
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', 'admin');

    if (error) {
      console.error('Error removing admin role:', error);
      throw error;
    }
  }
}