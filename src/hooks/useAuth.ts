import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { logger } from '@/utils/logger';
import { clearUserRoleCache } from '@/services/quizService';
import { APP_CONFIG } from '@/constants';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

// Helper function to detect company email restriction errors
function isCompanyEmailError(error: any): boolean {
  if (!error || !error.message) return false;
  
  const message = error.message.toLowerCase();
  return message.includes('company email') || 
         message.includes('domain') || 
         message.includes('southsoundseniors.org') ||
         message.includes('organization email');
}

// Helper function to get user-friendly error message
function getAuthErrorMessage(error: any): string {
  if (isCompanyEmailError(error)) {
    return `Only @southsoundseniors.org email addresses are allowed. Need access? Contact ${APP_CONFIG.supportEmail}`;
  }
  
  // Handle other common auth errors
  if (error.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (error.message?.includes('Email not confirmed')) {
    return 'Please check your email and click the confirmation link to verify your account.';
  }
  
  return error.message || 'Authentication failed. Please try again.';
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;
    let initialSessionHandled = false;

    // Check for existing session first
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!mounted) return;
        
        if (error) {
          logger.error('Error getting session', error as Error);
        }
        
        setState({
          session,
          user: session?.user ?? null,
          loading: false,
        });
        
        initialSessionHandled = true;
      } catch (error) {
        logger.error('Error getting initial session', error as Error);
        if (mounted) {
          setState({
            session: null,
            user: null,
            loading: false,
          });
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        // Skip INITIAL_SESSION if we already handled it
        if (event === 'INITIAL_SESSION' && initialSessionHandled) {
          return;
        }
        
        setState({
          session,
          user: session?.user ?? null,
          loading: false,
        });

      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        const userMessage = getAuthErrorMessage(error);
        logger.error('Google sign in error', error as Error);
        toast.error(userMessage);
      }
    } catch (error) {
      logger.error('Google sign in error', error as Error);
      toast.error('Failed to sign in with Google');
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        const userMessage = getAuthErrorMessage(error);
        logger.error('Sign up error', error as Error);
        toast.error(userMessage);
        return { error };
      }

      toast.success('Check your email for confirmation link');
      return { error: null };
    } catch (error) {
      logger.error('Sign up error', error as Error);
      toast.error('Failed to sign up');
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const userMessage = getAuthErrorMessage(error);
        logger.error('Sign in error', error as Error);
        toast.error(userMessage);
        return { error };
      }

      return { error: null };
    } catch (error) {
      logger.error('Sign in error', error as Error);
      toast.error('Failed to sign in');
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      // If there's a session_not_found error, we should still consider it a successful logout
      // because the user is effectively logged out already
      const isSessionError = error && (
        error.message?.includes('session_not_found') || 
        error.message?.includes('Session not found') ||
        error.message?.includes('Session from session_id claim in JWT does not exist') ||
        (error as any).__isAuthError
      );
      
      if (error && !isSessionError) {
        logger.error('Sign out error', error as Error);
        toast.error('Failed to sign out');
        return;
      }
      
      // Clear local state immediately for better UX
      setState({
        session: null,
        user: null,
        loading: false,
      });
      
      // Clear role cache on sign out
      clearUserRoleCache();
      
      toast.success('Successfully signed out');
      
    } catch (error: any) {
      logger.error('Sign out error', error as Error);
      
      // Check if it's a session-related error (AuthSessionMissingError, etc.)
      const isSessionError = 
        error.name === 'AuthSessionMissingError' ||
        error.message?.includes('Auth session missing') ||
        error.message?.includes('session_not_found') ||
        error.message?.includes('Session not found') ||
        error.message?.includes('Session from session_id claim in JWT does not exist');
      
      // Clear local state regardless - user should appear logged out
      setState({
        session: null,
        user: null,
        loading: false,
      });
      
      // Clear role cache on sign out
      clearUserRoleCache();
      
      if (isSessionError) {
        toast.success('Successfully signed out');
      } else {
        toast.error('Failed to sign out');
      }
    }
  };

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    signInWithGoogle,
    signUp,
    signIn,
    signOut,
  };
}