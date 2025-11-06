import { trackEvent } from './analytics';

interface SessionEvent {
  type: 'click' | 'scroll' | 'input' | 'navigation' | 'resize';
  timestamp: number;
  data: any;
}

interface HeatmapPoint {
  x: number;
  y: number;
  timestamp: number;
  type: 'click' | 'move';
}

class SessionRecorder {
  private events: SessionEvent[] = [];
  private heatmapPoints: HeatmapPoint[] = [];
  private sessionId: string;
  private isRecording: boolean = false;
  private startTime: number = 0;
  private maxEvents: number = 1000;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  start(): void {
    if (this.isRecording) return;

    this.isRecording = true;
    this.startTime = Date.now();
    this.setupListeners();

    trackEvent('session_recording_started', {
      sessionId: this.sessionId,
      url: window.location.href
    });
  }

  stop(): void {
    if (!this.isRecording) return;

    this.isRecording = false;
    this.removeListeners();
    this.saveSession();

    trackEvent('session_recording_stopped', {
      sessionId: this.sessionId,
      duration: Date.now() - this.startTime,
      eventCount: this.events.length
    });
  }

  private setupListeners(): void {
    document.addEventListener('click', this.handleClick);
    document.addEventListener('scroll', this.handleScroll, { passive: true });
    document.addEventListener('input', this.handleInput);
    document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('popstate', this.handleNavigation);
  }

  private removeListeners(): void {
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('input', this.handleInput);
    document.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('popstate', this.handleNavigation);
  }

  private handleClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    const event: SessionEvent = {
      type: 'click',
      timestamp: Date.now() - this.startTime,
      data: {
        x: e.clientX,
        y: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        target: this.getElementPath(target),
        tagName: target.tagName,
        id: target.id,
        className: target.className
      }
    };

    this.addEvent(event);

    this.heatmapPoints.push({
      x: e.pageX,
      y: e.pageY,
      timestamp: Date.now(),
      type: 'click'
    });
  };

  private handleScroll = (): void => {
    const event: SessionEvent = {
      type: 'scroll',
      timestamp: Date.now() - this.startTime,
      data: {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight
      }
    };

    this.addEvent(event);
  };

  private handleInput = (e: Event): void => {
    const target = e.target as HTMLInputElement;

    if (target.type === 'password' || target.autocomplete === 'cc-number') {
      return;
    }

    const event: SessionEvent = {
      type: 'input',
      timestamp: Date.now() - this.startTime,
      data: {
        target: this.getElementPath(target),
        tagName: target.tagName,
        type: target.type,
        name: target.name,
        valueLength: target.value?.length || 0
      }
    };

    this.addEvent(event);
  };

  private handleMouseMove = (e: MouseEvent): void => {
    if (Math.random() > 0.1) return;

    this.heatmapPoints.push({
      x: e.pageX,
      y: e.pageY,
      timestamp: Date.now(),
      type: 'move'
    });

    if (this.heatmapPoints.length > 5000) {
      this.heatmapPoints = this.heatmapPoints.slice(-4000);
    }
  };

  private handleResize = (): void => {
    const event: SessionEvent = {
      type: 'resize',
      timestamp: Date.now() - this.startTime,
      data: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    this.addEvent(event);
  };

  private handleNavigation = (): void => {
    const event: SessionEvent = {
      type: 'navigation',
      timestamp: Date.now() - this.startTime,
      data: {
        url: window.location.href,
        path: window.location.pathname
      }
    };

    this.addEvent(event);
  };

  private getElementPath(element: HTMLElement): string {
    const path: string[] = [];
    let current: HTMLElement | null = element;

    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();

      if (current.id) {
        selector += `#${current.id}`;
      } else if (current.className) {
        const classes = current.className.split(' ').filter(c => c);
        if (classes.length > 0) {
          selector += `.${classes[0]}`;
        }
      }

      path.unshift(selector);
      current = current.parentElement;
    }

    return path.join(' > ');
  }

  private addEvent(event: SessionEvent): void {
    this.events.push(event);

    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-800);
    }
  }

  private async saveSession(): Promise<void> {
    try {
      const sessionData = {
        session_id: this.sessionId,
        start_time: new Date(this.startTime).toISOString(),
        end_time: new Date().toISOString(),
        duration: Date.now() - this.startTime,
        events: this.events,
        heatmap_points: this.heatmapPoints,
        url: window.location.href,
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`
      };

      const compressed = this.compressData(sessionData);

      await fetch('/api/sessions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compressed)
      });
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  private compressData(data: any): any {
    return {
      ...data,
      events: data.events.map((e: SessionEvent) => ({
        t: e.type[0],
        ts: e.timestamp,
        d: e.data
      }))
    };
  }

  getHeatmapData(): HeatmapPoint[] {
    return this.heatmapPoints;
  }

  getEvents(): SessionEvent[] {
    return this.events;
  }
}

export const sessionRecorder = new SessionRecorder();

export function startSessionRecording(): void {
  if (typeof window === 'undefined') return;

  if (Math.random() < 0.1) {
    sessionRecorder.start();

    window.addEventListener('beforeunload', () => {
      sessionRecorder.stop();
    });
  }
}

export function getHeatmapData(): HeatmapPoint[] {
  return sessionRecorder.getHeatmapData();
}
