import { trackEvent } from './analytics';

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

export function reportWebVitals(onPerfEntry?: (metric: WebVitalsMetric) => void) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      });
    }
  }
}

export function measurePerformance() {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return;
  }

  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    trackEvent('performance', {
      pageLoadTime,
      connectTime,
      renderTime,
      url: window.location.href
    });

    if ('memory' in performance) {
      const memory = (performance as any).memory;
      trackEvent('memory_usage', {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      });
    }
  });
}

export function measureCLS() {
  let clsValue = 0;
  let clsEntries: PerformanceEntry[] = [];

  const observer = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
        clsEntries.push(entry);
      }
    }
  });

  try {
    observer.observe({ type: 'layout-shift', buffered: true });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        trackEvent('cls_score', {
          value: clsValue,
          rating: getCLSRating(clsValue),
          entries: clsEntries.length
        });
        observer.disconnect();
      }
    });
  } catch (e) {
    console.error('CLS measurement not supported');
  }
}

export function measureLCP() {
  const observer = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    const lcp = (lastEntry as any).renderTime || (lastEntry as any).loadTime;

    trackEvent('lcp_score', {
      value: lcp,
      rating: getLCPRating(lcp),
      element: (lastEntry as any).element?.tagName
    });
  });

  try {
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.error('LCP measurement not supported');
  }
}

export function measureFID() {
  const observer = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      const fid = (entry as any).processingStart - entry.startTime;

      trackEvent('fid_score', {
        value: fid,
        rating: getFIDRating(fid),
        eventType: (entry as any).name
      });
    }
  });

  try {
    observer.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    console.error('FID measurement not supported');
  }
}

export function measureFCP() {
  const observer = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        trackEvent('fcp_score', {
          value: entry.startTime,
          rating: getFCPRating(entry.startTime)
        });
      }
    }
  });

  try {
    observer.observe({ type: 'paint', buffered: true });
  } catch (e) {
    console.error('FCP measurement not supported');
  }
}

export function measureTTFB() {
  const perfData = window.performance.timing;
  const ttfb = perfData.responseStart - perfData.navigationStart;

  trackEvent('ttfb_score', {
    value: ttfb,
    rating: getTTFBRating(ttfb)
  });
}

function getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
  if (value <= 0.1) return 'good';
  if (value <= 0.25) return 'needs-improvement';
  return 'poor';
}

function getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
  if (value <= 2500) return 'good';
  if (value <= 4000) return 'needs-improvement';
  return 'poor';
}

function getFIDRating(value: number): 'good' | 'needs-improvement' | 'poor' {
  if (value <= 100) return 'good';
  if (value <= 300) return 'needs-improvement';
  return 'poor';
}

function getFCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
  if (value <= 1800) return 'good';
  if (value <= 3000) return 'needs-improvement';
  return 'poor';
}

function getTTFBRating(value: number): 'good' | 'needs-improvement' | 'poor' {
  if (value <= 800) return 'good';
  if (value <= 1800) return 'needs-improvement';
  return 'poor';
}

export function initWebVitals() {
  if (typeof window === 'undefined') return;

  measurePerformance();
  measureCLS();
  measureLCP();
  measureFID();
  measureFCP();
  measureTTFB();

  reportWebVitals((metric) => {
    trackEvent('web_vital', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id
    });
  });
}
