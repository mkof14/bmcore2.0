import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analytics, identifyUser, trackEvent } from '../analytics';

describe('Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('identifyUser', () => {
    it('should identify user with correct properties', () => {
      const userId = 'test-user-123';
      const traits = { email: 'test@example.com', name: 'Test User' };

      identifyUser(userId, traits);

      expect(analytics.identify).toHaveBeenCalledWith(userId, traits);
    });

    it('should handle empty traits', () => {
      const userId = 'test-user-123';

      identifyUser(userId);

      expect(analytics.identify).toHaveBeenCalledWith(userId, undefined);
    });
  });

  describe('trackEvent', () => {
    it('should track event with properties', () => {
      const eventName = 'button_clicked';
      const properties = { button_id: 'submit', page: 'home' };

      trackEvent(eventName, properties);

      expect(analytics.track).toHaveBeenCalledWith(eventName, properties);
    });

    it('should track event without properties', () => {
      const eventName = 'page_view';

      trackEvent(eventName);

      expect(analytics.track).toHaveBeenCalledWith(eventName, undefined);
    });
  });
});
