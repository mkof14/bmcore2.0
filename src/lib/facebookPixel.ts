declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export interface FacebookPixelConfig {
  pixelId: string;
  enabled: boolean;
}

class FacebookPixelService {
  private pixelId: string | null = null;
  private initialized: boolean = false;

  init(config: FacebookPixelConfig): void {
    if (!config.enabled || !config.pixelId) return;

    this.pixelId = config.pixelId;

    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${config.pixelId}');
      fbq('track', 'PageView');
    `;

    document.head.appendChild(script);

    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=${config.pixelId}&ev=PageView&noscript=1"/>
    `;
    document.body.appendChild(noscript);

    this.initialized = true;
  }

  pageView(): void {
    if (!this.initialized || !window.fbq) return;
    window.fbq('track', 'PageView');
  }

  trackEvent(eventName: string, parameters?: Record<string, any>): void {
    if (!this.initialized || !window.fbq) return;
    window.fbq('track', eventName, parameters);
  }

  trackCustomEvent(eventName: string, parameters?: Record<string, any>): void {
    if (!this.initialized || !window.fbq) return;
    window.fbq('trackCustom', eventName, parameters);
  }

  trackViewContent(contentName: string, contentCategory?: string, value?: number): void {
    this.trackEvent('ViewContent', {
      content_name: contentName,
      content_category: contentCategory,
      value: value,
      currency: 'USD'
    });
  }

  trackSearch(searchQuery: string): void {
    this.trackEvent('Search', {
      search_string: searchQuery
    });
  }

  trackAddToCart(contentName: string, value: number): void {
    this.trackEvent('AddToCart', {
      content_name: contentName,
      value: value,
      currency: 'USD'
    });
  }

  trackInitiateCheckout(value: number): void {
    this.trackEvent('InitiateCheckout', {
      value: value,
      currency: 'USD'
    });
  }

  trackPurchase(value: number, transactionId?: string): void {
    this.trackEvent('Purchase', {
      value: value,
      currency: 'USD',
      transaction_id: transactionId
    });
  }

  trackLead(contentName?: string): void {
    this.trackEvent('Lead', {
      content_name: contentName
    });
  }

  trackCompleteRegistration(status: string = 'completed'): void {
    this.trackEvent('CompleteRegistration', {
      status: status
    });
  }

  trackSubscribe(value: number, planName: string): void {
    this.trackEvent('Subscribe', {
      value: value,
      currency: 'USD',
      predicted_ltv: value * 12,
      subscription_name: planName
    });
  }

  trackStartTrial(planName: string): void {
    this.trackEvent('StartTrial', {
      subscription_name: planName
    });
  }
}

export const facebookPixel = new FacebookPixelService();

export function initFacebookPixel(pixelId: string, enabled: boolean = true): void {
  facebookPixel.init({ pixelId, enabled });
}

export function trackFBPageView(): void {
  facebookPixel.pageView();
}

export function trackFBEvent(eventName: string, parameters?: Record<string, any>): void {
  facebookPixel.trackEvent(eventName, parameters);
}

export function trackFBPurchase(value: number, transactionId?: string): void {
  facebookPixel.trackPurchase(value, transactionId);
}

export function trackFBLead(contentName?: string): void {
  facebookPixel.trackLead(contentName);
}
