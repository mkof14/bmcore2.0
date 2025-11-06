declare global {
  interface Window {
    gtag: any;
    dataLayer: any[];
  }
}

export interface GoogleAnalyticsConfig {
  measurementId: string;
  enabled: boolean;
  debug?: boolean;
}

class GoogleAnalyticsService {
  private measurementId: string | null = null;
  private initialized: boolean = false;
  private debug: boolean = false;

  init(config: GoogleAnalyticsConfig): void {
    if (!config.enabled || !config.measurementId) return;

    this.measurementId = config.measurementId;
    this.debug = config.debug || false;

    if (typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];

    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${config.measurementId}', {
        'debug_mode': ${this.debug},
        'send_page_view': false
      });
    `;
    document.head.appendChild(script2);

    this.initialized = true;

    if (this.debug) {
      console.log('Google Analytics initialized:', config.measurementId);
    }
  }

  pageView(path: string, title?: string): void {
    if (!this.initialized || !window.gtag) return;

    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href
    });

    if (this.debug) {
      console.log('GA Page View:', { path, title });
    }
  }

  event(eventName: string, parameters?: Record<string, any>): void {
    if (!this.initialized || !window.gtag) return;

    window.gtag('event', eventName, parameters);

    if (this.debug) {
      console.log('GA Event:', eventName, parameters);
    }
  }

  setUserProperties(properties: Record<string, any>): void {
    if (!this.initialized || !window.gtag) return;

    window.gtag('set', 'user_properties', properties);

    if (this.debug) {
      console.log('GA User Properties:', properties);
    }
  }

  setUserId(userId: string): void {
    if (!this.initialized || !window.gtag) return;

    window.gtag('set', { user_id: userId });

    if (this.debug) {
      console.log('GA User ID:', userId);
    }
  }

  trackPurchase(params: {
    transactionId: string;
    value: number;
    currency?: string;
    items?: any[];
    tax?: number;
    shipping?: number;
  }): void {
    this.event('purchase', {
      transaction_id: params.transactionId,
      value: params.value,
      currency: params.currency || 'USD',
      items: params.items || [],
      tax: params.tax || 0,
      shipping: params.shipping || 0
    });
  }

  trackSignUp(method: string = 'email'): void {
    this.event('sign_up', {
      method: method
    });
  }

  trackLogin(method: string = 'email'): void {
    this.event('login', {
      method: method
    });
  }

  trackSearch(searchTerm: string): void {
    this.event('search', {
      search_term: searchTerm
    });
  }

  trackViewItem(itemId: string, itemName: string, price?: number): void {
    this.event('view_item', {
      items: [{
        item_id: itemId,
        item_name: itemName,
        price: price
      }]
    });
  }

  trackAddToCart(itemId: string, itemName: string, price: number, quantity: number = 1): void {
    this.event('add_to_cart', {
      items: [{
        item_id: itemId,
        item_name: itemName,
        price: price,
        quantity: quantity
      }],
      value: price * quantity,
      currency: 'USD'
    });
  }

  trackBeginCheckout(value: number, items?: any[]): void {
    this.event('begin_checkout', {
      value: value,
      currency: 'USD',
      items: items || []
    });
  }

  trackShare(method: string, contentType: string, itemId: string): void {
    this.event('share', {
      method: method,
      content_type: contentType,
      item_id: itemId
    });
  }

  trackVideoProgress(videoTitle: string, percentage: number): void {
    this.event('video_progress', {
      video_title: videoTitle,
      video_percent: percentage
    });
  }

  trackFormSubmit(formName: string, formId?: string): void {
    this.event('form_submit', {
      form_name: formName,
      form_id: formId
    });
  }

  trackError(errorMessage: string, errorCode?: string, fatal: boolean = false): void {
    this.event('exception', {
      description: errorMessage,
      error_code: errorCode,
      fatal: fatal
    });
  }

  trackEngagement(engagementType: string, duration?: number): void {
    this.event('engagement', {
      engagement_type: engagementType,
      duration: duration
    });
  }
}

export const googleAnalytics = new GoogleAnalyticsService();

export function initGA(measurementId: string, enabled: boolean = true, debug: boolean = false): void {
  googleAnalytics.init({ measurementId, enabled, debug });
}

export function trackGAPageView(path: string, title?: string): void {
  googleAnalytics.pageView(path, title);
}

export function trackGAEvent(eventName: string, parameters?: Record<string, any>): void {
  googleAnalytics.event(eventName, parameters);
}

export function setGAUserId(userId: string): void {
  googleAnalytics.setUserId(userId);
}

export function trackGAPurchase(params: {
  transactionId: string;
  value: number;
  currency?: string;
  items?: any[];
}): void {
  googleAnalytics.trackPurchase(params);
}
