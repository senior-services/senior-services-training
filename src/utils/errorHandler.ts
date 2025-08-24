/**
 * Centralized error handling utilities for the Senior Services Training Portal
 * Provides consistent error handling, user-friendly messages, and proper logging
 * 
 * @author Senior Services Training Portal Team
 * @version 1.0.0
 */

import { logger } from './logger';
import type { ValidationResult } from '@/types';

/**
 * Standard error types used throughout the application
 */
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  VIDEO_PLAYBACK_ERROR = 'VIDEO_PLAYBACK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Interface for application errors with additional context
 */
export interface AppError extends Error {
  type: ErrorType;
  code?: string;
  userMessage?: string;
  context?: Record<string, unknown>;
  originalError?: Error;
}

/**
 * Creates a standardized application error
 */
export class ApplicationError extends Error implements AppError {
  public type: ErrorType;
  public code?: string;
  public userMessage?: string;
  public context?: Record<string, unknown>;
  public originalError?: Error;

  constructor(
    type: ErrorType,
    message: string,
    options?: {
      code?: string;
      userMessage?: string;
      context?: Record<string, unknown>;
      originalError?: Error;
    }
  ) {
    super(message);
    this.name = 'ApplicationError';
    this.type = type;
    this.code = options?.code;
    this.userMessage = options?.userMessage;
    this.context = options?.context;
    this.originalError = options?.originalError;

    // Log the error immediately
    logger.error(message, this.originalError || this, this.context);
  }
}

/**
 * User-friendly error messages for different error types
 */
const USER_ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ErrorType.NETWORK_ERROR]: 'Unable to connect to the server. Please check your internet connection and try again.',
  [ErrorType.AUTHENTICATION_ERROR]: 'Please log in to continue.',
  [ErrorType.AUTHORIZATION_ERROR]: 'You do not have permission to perform this action.',
  [ErrorType.DATABASE_ERROR]: 'There was a problem saving your data. Please try again.',
  [ErrorType.FILE_UPLOAD_ERROR]: 'Failed to upload the file. Please check the file size and format.',
  [ErrorType.VIDEO_PLAYBACK_ERROR]: 'Unable to play the video. Please try refreshing the page.',
  [ErrorType.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
};

/**
 * Determines the error type based on the error object or message
 */
export function categorizeError(error: Error | unknown): ErrorType {
  if (error instanceof ApplicationError) {
    return error.type;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Network-related errors
    if (message.includes('network') || 
        message.includes('fetch') || 
        message.includes('connection') ||
        message.includes('timeout')) {
      return ErrorType.NETWORK_ERROR;
    }

    // Authentication errors
    if (message.includes('unauthorized') || 
        message.includes('authentication') ||
        message.includes('login') ||
        message.includes('auth')) {
      return ErrorType.AUTHENTICATION_ERROR;
    }

    // Authorization errors
    if (message.includes('forbidden') || 
        message.includes('permission') ||
        message.includes('access denied')) {
      return ErrorType.AUTHORIZATION_ERROR;
    }

    // Database errors
    if (message.includes('database') || 
        message.includes('sql') ||
        message.includes('supabase')) {
      return ErrorType.DATABASE_ERROR;
    }

    // File upload errors
    if (message.includes('upload') || 
        message.includes('file size') ||
        message.includes('file format')) {
      return ErrorType.FILE_UPLOAD_ERROR;
    }

    // Video playback errors
    if (message.includes('video') || 
        message.includes('playback') ||
        message.includes('media')) {
      return ErrorType.VIDEO_PLAYBACK_ERROR;
    }
  }

  return ErrorType.UNKNOWN_ERROR;
}

/**
 * Converts any error to a user-friendly message
 */
export function getErrorMessage(error: Error | unknown): string {
  if (error instanceof ApplicationError && error.userMessage) {
    return error.userMessage;
  }

  const errorType = categorizeError(error);
  return USER_ERROR_MESSAGES[errorType];
}

/**
 * Handles errors consistently throughout the application
 */
export function handleError(
  error: Error | unknown,
  context?: Record<string, unknown>,
  customUserMessage?: string
): {
  type: ErrorType;
  message: string;
  userMessage: string;
} {
  const errorType = categorizeError(error);
  const message = error instanceof Error ? error.message : String(error);
  const userMessage = customUserMessage || getErrorMessage(error);

  // Log the error with context
  logger.error(`${errorType}: ${message}`, error instanceof Error ? error : undefined, context);

  return {
    type: errorType,
    message,
    userMessage,
  };
}

/**
 * Async wrapper that handles errors and provides consistent error handling
 */
export async function withErrorHandler<T>(
  operation: () => Promise<T>,
  context?: Record<string, unknown>,
  customErrorMessage?: string
): Promise<{ success: true; data: T } | { success: false; error: ReturnType<typeof handleError> }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const handledError = handleError(error, context, customErrorMessage);
    return { success: false, error: handledError };
  }
}

/**
 * Validation error helper
 */
export function createValidationError(
  field: string,
  message: string,
  value?: unknown
): ApplicationError {
  return new ApplicationError(
    ErrorType.VALIDATION_ERROR,
    `Validation failed for ${field}: ${message}`,
    {
      userMessage: message,
      context: { field, value },
    }
  );
}

/**
 * Network error helper
 */
export function createNetworkError(
  operation: string,
  originalError?: Error
): ApplicationError {
  return new ApplicationError(
    ErrorType.NETWORK_ERROR,
    `Network error during ${operation}`,
    {
      userMessage: 'Unable to connect to the server. Please check your internet connection and try again.',
      context: { operation },
      originalError,
    }
  );
}

/**
 * Database error helper
 */
export function createDatabaseError(
  operation: string,
  table?: string,
  originalError?: Error
): ApplicationError {
  return new ApplicationError(
    ErrorType.DATABASE_ERROR,
    `Database error during ${operation}${table ? ` on ${table}` : ''}`,
    {
      userMessage: 'There was a problem saving your data. Please try again.',
      context: { operation, table },
      originalError,
    }
  );
}

/**
 * Video playback error helper
 */
export function createVideoError(
  videoId: string,
  message: string,
  originalError?: Error
): ApplicationError {
  return new ApplicationError(
    ErrorType.VIDEO_PLAYBACK_ERROR,
    message,
    {
      userMessage: 'Unable to play the video. Please try refreshing the page or contact support.',
      context: { videoId },
      originalError,
    }
  );
}

/**
 * Retry mechanism for operations that might fail temporarily
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000,
  backoffMultiplier = 2
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retrying with exponential backoff
      const waitTime = delay * Math.pow(backoffMultiplier, attempt - 1);
      logger.warn(`Operation failed, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`, {
        error: lastError.message,
        attempt,
        waitTime,
      });
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}