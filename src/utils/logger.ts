/**
 * Centralized logging utility for the Senior Services Training Portal
 * Provides structured logging with different levels and proper error handling
 * 
 * @author Senior Services Training Portal Team
 * @version 1.0.0
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Enhanced logging system that replaces console.log statements
 * Provides structured logging with context and error handling
 */
class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 100;

  /**
   * Creates a structured log entry with timestamp and context
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (context && Object.keys(context).length > 0) {
      entry.context = context;
    }

    if (error) {
      entry.error = error;
    }

    return entry;
  }

  /**
   * Adds log entry to history and manages size limit
   */
  private addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  /**
   * Formats log entry for console output in development
   */
  private formatForConsole(entry: LogEntry): void {
    if (!this.isDevelopment) return;

    const prefix = `[${entry.timestamp}] ${entry.level.toUpperCase()}:`;
    const message = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case 'debug':
        console.log(`%c${message}`, 'color: #6B7280');
        break;
      case 'info':
        console.info(`%c${message}`, 'color: #3B82F6');
        break;
      case 'warn':
        console.warn(`%c${message}`, 'color: #F59E0B');
        break;
      case 'error':
        console.error(`%c${message}`, 'color: #EF4444');
        break;
    }

    if (entry.context) {
      console.group(`${prefix} Context`);
      console.table(entry.context);
      console.groupEnd();
    }

    if (entry.error) {
      console.group(`${prefix} Error Details`);
      console.error(entry.error);
      console.groupEnd();
    }
  }

  /**
   * Debug level logging - for detailed debugging information
   * Only shown in development mode
   */
  debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('debug', message, context);
    this.addToHistory(entry);
    this.formatForConsole(entry);
  }

  /**
   * Info level logging - for general information
   * Useful for tracking application flow and user actions
   */
  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('info', message, context);
    this.addToHistory(entry);
    this.formatForConsole(entry);
  }

  /**
   * Warning level logging - for potential issues that don't break functionality
   */
  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('warn', message, context);
    this.addToHistory(entry);
    this.formatForConsole(entry);
  }

  /**
   * Error level logging - for errors and exceptions
   * Always shown regardless of environment
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('error', message, context, error);
    this.addToHistory(entry);
    this.formatForConsole(entry);

    // In production, you might want to send errors to a logging service
    if (!this.isDevelopment && error) {
      this.reportErrorToService(entry);
    }
  }

  /**
   * Logs video player events with consistent formatting
   */
  videoEvent(
    event: string, 
    videoId: string, 
    additionalData?: Record<string, unknown>
  ): void {
    this.info(`Video ${event}`, {
      videoId,
      event,
      ...additionalData,
    });
  }

  /**
   * Logs authentication events
   */
  authEvent(event: string, userId?: string, email?: string): void {
    this.info(`Auth ${event}`, {
      event,
      userId: userId || 'unknown',
      email: email || 'unknown',
    });
  }

  /**
   * Logs database operations
   */
  dbOperation(
    operation: string,
    table: string,
    success: boolean,
    details?: Record<string, unknown>
  ): void {
    const message = `Database ${operation} on ${table} ${success ? 'succeeded' : 'failed'}`;
    const context = { operation, table, success, ...details };
    
    if (success) {
      this.info(message, context);
    } else {
      this.error(message, undefined, context);
    }
  }

  /**
   * Performance logging for monitoring slow operations
   */
  performance(operation: string, duration: number, threshold = 1000): void {
    const context = { operation, duration: `${duration}ms` };
    
    if (duration > threshold) {
      this.warn(`Slow operation detected: ${operation}`, context);
    } else {
      this.debug(`Performance: ${operation}`, context);
    }
  }

  /**
   * Gets recent log history for debugging
   */
  getLogHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  /**
   * Clears log history
   */
  clearHistory(): void {
    this.logHistory = [];
  }

  /**
   * Reports errors to external service (placeholder for future implementation)
   */
  private reportErrorToService(entry: LogEntry): void {
    // Placeholder for error reporting service integration
    // Could integrate with services like Sentry, LogRocket, etc.
    console.warn('Error reporting service not configured:', entry);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export types for use in components
export type { LogLevel, LogEntry };

/**
 * Performance measurement utility
 */
export class PerformanceTracker {
  private startTimes = new Map<string, number>();

  /**
   * Starts timing an operation
   */
  start(operationName: string): void {
    this.startTimes.set(operationName, performance.now());
  }

  /**
   * Ends timing and logs the result
   */
  end(operationName: string, threshold?: number): number {
    const startTime = this.startTimes.get(operationName);
    if (!startTime) {
      logger.warn(`Performance tracking not started for: ${operationName}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    logger.performance(operationName, duration, threshold);
    this.startTimes.delete(operationName);
    
    return duration;
  }

  /**
   * Wraps a function with performance tracking
   */
  track<T extends (...args: any[]) => any>(
    operationName: string,
    fn: T,
    threshold?: number
  ): T {
    return ((...args: Parameters<T>) => {
      this.start(operationName);
      try {
        const result = fn(...args);
        
        // Handle async functions
        if (result instanceof Promise) {
          return result.finally(() => this.end(operationName, threshold));
        }
        
        this.end(operationName, threshold);
        return result;
      } catch (error) {
        this.end(operationName, threshold);
        throw error;
      }
    }) as T;
  }
}

export const performanceTracker = new PerformanceTracker();