/**
 * Audit Service
 * Provides compliance-grade logging for all admin actions, video versioning,
 * and authentication activity tracking.
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// ─── Types ──────────────────────────────────────────────────────────────────

export type AuditActionType =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'archived'
  | 'restored'
  | 'assigned'
  | 'unassigned'
  | 'login'
  | 'logout';

export type AuditResourceType =
  | 'training'
  | 'employee'
  | 'assignment'
  | 'quiz'
  | 'quiz_version';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user_id: string | null;
  user_email: string | null;
  action_type: AuditActionType;
  resource_type: AuditResourceType;
  resource_id: string | null;
  resource_title: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
}

export interface VideoVersion {
  id: string;
  video_id: string;
  version: number;
  title: string;
  description: string | null;
  video_url: string | null;
  video_file_name: string | null;
  thumbnail_url: string | null;
  content_type: string | null;
  duration_seconds: number | null;
  changed_by: string | null;
  changed_by_email: string | null;
  change_reason: string | null;
  created_at: string;
}

// ─── Client metadata helpers ────────────────────────────────────────────────

function getClientMetadata() {
  return {
    ip_address: null as string | null, // IP resolved server-side if needed
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  };
}

// ─── Audit Log Operations ───────────────────────────────────────────────────

export const auditLogOperations = {
  /**
   * Write an audit log entry via server-side RPC
   */
  async log(
    actionType: AuditActionType,
    resourceType: AuditResourceType,
    options: {
      resourceId?: string;
      resourceTitle?: string;
      oldValues?: Record<string, unknown>;
      newValues?: Record<string, unknown>;
    } = {}
  ): Promise<void> {
    try {
      const meta = getClientMetadata();

      await supabase.rpc('write_audit_log', {
        p_action_type: actionType,
        p_resource_type: resourceType,
        p_resource_id: options.resourceId || null,
        p_resource_title: options.resourceTitle || null,
        p_old_values: options.oldValues ? JSON.parse(JSON.stringify(options.oldValues)) : null,
        p_new_values: options.newValues ? JSON.parse(JSON.stringify(options.newValues)) : null,
        p_ip_address: meta.ip_address,
        p_user_agent: meta.user_agent,
      });
    } catch (error) {
      // Audit logging should never break the main flow
      logger.error('Failed to write audit log', error as Error, {
        actionType,
        resourceType,
        resourceId: options.resourceId,
      });
    }
  },

  /**
   * Fetch audit logs (admin only) with optional filters
   */
  async getAll(filters?: {
    resourceType?: AuditResourceType;
    resourceId?: string;
    actionType?: AuditActionType;
    limit?: number;
  }): Promise<AuditLogEntry[]> {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(filters?.limit || 100);

      if (filters?.resourceType) {
        query = query.eq('resource_type', filters.resourceType);
      }
      if (filters?.resourceId) {
        query = query.eq('resource_id', filters.resourceId);
      }
      if (filters?.actionType) {
        query = query.eq('action_type', filters.actionType);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Failed to fetch audit logs', undefined, { supabaseError: error.message });
        return [];
      }

      return (data || []) as AuditLogEntry[];
    } catch (error) {
      logger.error('Unexpected error fetching audit logs', error as Error);
      return [];
    }
  },
};

// ─── Video Version Operations ───────────────────────────────────────────────

export const videoVersionOperations = {
  /**
   * Snapshot the current video state before applying edits.
   * Returns the new version number.
   */
  async snapshotBeforeUpdate(
    videoId: string,
    changeReason?: string
  ): Promise<number | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        logger.error('Cannot snapshot video version: not authenticated');
        return null;
      }

      const { data, error } = await supabase.rpc('snapshot_video_version', {
        p_video_id: videoId,
        p_changed_by: user.id,
        p_changed_by_email: user.email || '',
        p_change_reason: changeReason || null,
      });

      if (error) {
        logger.error('Failed to snapshot video version', undefined, {
          videoId,
          supabaseError: error.message,
        });
        return null;
      }

      return data as number;
    } catch (error) {
      logger.error('Unexpected error snapshotting video version', error as Error, { videoId });
      return null;
    }
  },

  /**
   * Get all version history for a video (admin only)
   */
  async getHistory(videoId: string): Promise<VideoVersion[]> {
    try {
      const { data, error } = await supabase
        .from('video_versions')
        .select('*')
        .eq('video_id', videoId)
        .order('version', { ascending: false });

      if (error) {
        logger.error('Failed to fetch video version history', undefined, {
          videoId,
          supabaseError: error.message,
        });
        return [];
      }

      return (data || []) as VideoVersion[];
    } catch (error) {
      logger.error('Unexpected error fetching video versions', error as Error, { videoId });
      return [];
    }
  },
};

// ─── Auth Activity Operations ───────────────────────────────────────────────

export const authActivityOperations = {
  /**
   * Log a login event
   */
  async logLogin(provider?: string): Promise<void> {
    try {
      const meta = getClientMetadata();

      await supabase.rpc('log_auth_activity', {
        p_event_type: 'login',
        p_provider: provider || null,
        p_ip_address: meta.ip_address,
        p_user_agent: meta.user_agent,
      });
    } catch (error) {
      logger.error('Failed to log login activity', error as Error);
    }
  },

  /**
   * Log a logout event
   */
  async logLogout(): Promise<void> {
    try {
      const meta = getClientMetadata();

      await supabase.rpc('log_auth_activity', {
        p_event_type: 'logout',
        p_provider: null,
        p_ip_address: meta.ip_address,
        p_user_agent: meta.user_agent,
      });
    } catch (error) {
      logger.error('Failed to log logout activity', error as Error);
    }
  },
};
