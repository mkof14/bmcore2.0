type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface LogContext {
  requestId?: string;
  userId?: string;
  action?: string;
  duration?: number;
  [key: string]: any;
}

class Logger {
  private level: LogLevel;
  private isDevelopment: boolean;
  private maskPatterns = [
    /Bearer\s+[A-Za-z0-9\-._~+/]+=*/g,
    /sk_[a-z]+_[A-Za-z0-9]{24,}/g,
    /whsec_[A-Za-z0-9]{32,}/g,
  ];
  private sensitiveKeys = ["password", "token", "secret", "apiKey", "api_key"];

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.level = this.isDevelopment ? 'debug' : 'error';
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'silent'];
    const currentIndex = levels.indexOf(this.level);
    const requestedIndex = levels.indexOf(level);

    return requestedIndex >= currentIndex;
  }

  private maskSensitiveData(data: any): any {
    if (typeof data === "string") {
      let masked = data;
      for (const pattern of this.maskPatterns) {
        masked = masked.replace(pattern, "[REDACTED]");
      }
      return masked;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.maskSensitiveData(item));
    }

    if (typeof data === "object" && data !== null) {
      const masked: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (this.sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))) {
          masked[key] = "[REDACTED]";
        } else {
          masked[key] = this.maskSensitiveData(value);
        }
      }
      return masked;
    }

    return data;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const maskedContext = context ? this.maskSensitiveData(context) : {};
    return `[BMC] level=${level} msg="${message}" ${JSON.stringify(maskedContext)} ts=${timestamp}`;
  }

  debug(...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug('[DEBUG]', ...args);
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info('[INFO]', ...args);
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', ...args);
    }
  }

  structured(level: LogLevel, message: string, context?: LogContext): void {
    if (this.shouldLog(level)) {
      const formatted = this.formatMessage(level, message, context);
      console[level === 'debug' ? 'debug' : level === 'info' ? 'info' : level === 'warn' ? 'warn' : 'error'](formatted);
    }
  }

  apiRequest(method: string, path: string, statusCode: number, duration: number, context?: LogContext): void {
    this.structured('info', 'API Request', { method, path, statusCode, duration, ...context });
  }

  apiError(method: string, path: string, statusCode: number, error: Error | unknown, context?: LogContext): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.structured('error', 'API Error', { method, path, statusCode, error: errorMessage, ...context });
  }

  performance(operation: string, duration: number, context?: LogContext): void {
    if (duration > 1000) {
      this.structured('warn', 'Slow operation', { operation, duration, ...context });
    } else {
      this.structured('debug', 'Performance', { operation, duration, ...context });
    }
  }

  group(label: string): void {
    if (this.isDevelopment) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  table(data: any): void {
    if (this.isDevelopment) {
      console.table(data);
    }
  }

  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
  }
}

export const logger = new Logger();

export default logger;
