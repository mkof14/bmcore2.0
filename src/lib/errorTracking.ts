import { supabase } from './supabase';
import { trackError } from './analytics';

export interface ErrorReport {
  message: string;
  stack?: string;
  component?: string;
  userId?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

class ErrorTracker {
  private userId: string | null = null;
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 50;

  constructor() {
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        type: 'uncaught_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          type: 'unhandled_promise_rejection'
        }
      );
    });

    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const errorMessage = args.map((arg) =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');

      this.captureError(new Error(errorMessage), {
        type: 'console_error',
        severity: 'low'
      });

      originalConsoleError.apply(console, args);
    };
  }

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  captureError(error: Error | string, context?: Record<string, any>) {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;

    const errorReport: ErrorReport = {
      message: errorMessage,
      stack: errorStack,
      userId: this.userId || undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      timestamp: new Date().toISOString(),
      severity: this.determineSeverity(errorMessage),
      context: {
        ...context,
        route: typeof window !== 'undefined' ? window.location.pathname : undefined,
        timestamp: new Date().toISOString()
      }
    };

    this.queueError(errorReport);
    trackError(error, context);

    if (errorReport.severity === 'critical') {
      this.reportImmediately(errorReport);
    }
  }

  private determineSeverity(message: string): 'low' | 'medium' | 'high' | 'critical' {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('critical') ||
      lowerMessage.includes('fatal') ||
      lowerMessage.includes('security') ||
      lowerMessage.includes('auth') ||
      lowerMessage.includes('payment') ||
      lowerMessage.includes('database')
    ) {
      return 'critical';
    }

    if (
      lowerMessage.includes('error') ||
      lowerMessage.includes('fail') ||
      lowerMessage.includes('exception')
    ) {
      return 'high';
    }

    if (lowerMessage.includes('warn')) {
      return 'medium';
    }

    return 'low';
  }

  private queueError(error: ErrorReport) {
    this.errorQueue.push(error);

    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    if (this.errorQueue.length >= 5) {
      this.flushQueue();
    }
  }

  private async flushQueue() {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await this.sendErrors(errors);
    } catch (e) {
      console.warn('Failed to send error reports:', e);
      this.errorQueue = [...errors, ...this.errorQueue];
    }
  }

  private async sendErrors(errors: ErrorReport[]) {
    try {
      const { error } = await supabase.from('error_logs').insert(
        errors.map((err) => ({
          message: err.message,
          stack: err.stack,
          component: err.component,
          user_id: err.userId,
          url: err.url,
          user_agent: err.userAgent,
          severity: err.severity,
          context: err.context || {},
          created_at: err.timestamp
        }))
      );

      if (error) {
        console.error('Failed to log errors:', error);
      }
    } catch (e) {
      console.error('Error sending error reports:', e);
    }
  }

  private async reportImmediately(error: ErrorReport) {
    await this.sendErrors([error]);
  }

  captureException(error: Error, component?: string, context?: Record<string, any>) {
    this.captureError(error, {
      component,
      ...context
    });
  }

  captureMessage(message: string, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium', context?: Record<string, any>) {
    const error: ErrorReport = {
      message,
      userId: this.userId || undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      timestamp: new Date().toISOString(),
      severity,
      context
    };

    this.queueError(error);
  }

  async getRecentErrors(limit: number = 10): Promise<ErrorReport[]> {
    try {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((err) => ({
        message: err.message,
        stack: err.stack,
        component: err.component,
        userId: err.user_id,
        url: err.url,
        userAgent: err.user_agent,
        timestamp: err.created_at,
        severity: err.severity,
        context: err.context
      }));
    } catch (e) {
      console.error('Failed to fetch error logs:', e);
      return [];
    }
  }
}

export const errorTracker = new ErrorTracker();

export function captureError(error: Error | string, context?: Record<string, any>) {
  errorTracker.captureError(error, context);
}

export function captureException(error: Error, component?: string, context?: Record<string, any>) {
  errorTracker.captureException(error, component, context);
}

export function captureMessage(message: string, severity?: 'low' | 'medium' | 'high' | 'critical', context?: Record<string, any>) {
  errorTracker.captureMessage(message, severity, context);
}
