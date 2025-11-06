export interface PerformanceMetrics {
  name: string;
  duration: number;
  startTime: number;
  type: 'navigation' | 'resource' | 'measure' | 'paint';
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initObservers();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initObservers() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime,
            type: 'navigation'
          });
        }
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navigationObserver);
    } catch (e) {
      console.warn('Navigation observer not supported');
    }

    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            name: entry.name,
            duration: entry.startTime,
            startTime: entry.startTime,
            type: 'paint'
          });
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);
    } catch (e) {
      console.warn('Paint observer not supported');
    }

    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 1000) {
            this.recordMetric({
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
              type: 'resource'
            });
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (e) {
      console.warn('Resource observer not supported');
    }
  }

  private recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);

    if (this.metrics.length > 100) {
      this.metrics.shift();
    }

    if (import.meta.env.DEV) {
      console.log(`[Performance] ${metric.name}: ${metric.duration.toFixed(2)}ms`);
    }
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    return fn().finally(() => {
      const duration = performance.now() - startTime;
      this.recordMetric({
        name,
        duration,
        startTime,
        type: 'measure'
      });
    });
  }

  measureSync<T>(name: string, fn: () => T): T {
    const startTime = performance.now();
    try {
      return fn();
    } finally {
      const duration = performance.now() - startTime;
      this.recordMetric({
        name,
        duration,
        startTime,
        type: 'measure'
      });
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getCoreWebVitals() {
    if (typeof window === 'undefined') return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      FCP: paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,
      LCP: this.getLargestContentfulPaint(),
      FID: this.getFirstInputDelay(),
      CLS: this.getCumulativeLayoutShift(),
      TTFB: navigation?.responseStart - navigation?.requestStart || 0,
      domLoad: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
      windowLoad: navigation?.loadEventEnd - navigation?.loadEventStart || 0
    };
  }

  private getLargestContentfulPaint(): number {
    const entries = performance.getEntriesByType('largest-contentful-paint');
    return entries.length > 0 ? entries[entries.length - 1].startTime : 0;
  }

  private getFirstInputDelay(): number {
    const entries = performance.getEntriesByType('first-input');
    return entries.length > 0 ? (entries[0] as any).processingStart - entries[0].startTime : 0;
  }

  private getCumulativeLayoutShift(): number {
    const entries = performance.getEntriesByType('layout-shift');
    return entries.reduce((sum, entry: any) => {
      if (!entry.hadRecentInput) {
        return sum + entry.value;
      }
      return sum;
    }, 0);
  }

  clear() {
    this.metrics = [];
  }

  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

export function usePerformanceMonitor() {
  return performanceMonitor;
}

export function reportWebVitals() {
  if (typeof window === 'undefined') return;

  const vitals = performanceMonitor.getCoreWebVitals();

  if (vitals) {
    console.log('Core Web Vitals:', {
      'First Contentful Paint (FCP)': `${vitals.FCP.toFixed(2)}ms`,
      'Largest Contentful Paint (LCP)': `${vitals.LCP.toFixed(2)}ms`,
      'First Input Delay (FID)': `${vitals.FID.toFixed(2)}ms`,
      'Cumulative Layout Shift (CLS)': vitals.CLS.toFixed(3),
      'Time to First Byte (TTFB)': `${vitals.TTFB.toFixed(2)}ms`,
      'DOM Load': `${vitals.domLoad.toFixed(2)}ms`,
      'Window Load': `${vitals.windowLoad.toFixed(2)}ms`
    });
  }
}
