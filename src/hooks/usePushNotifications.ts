import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission;
  subscription: PushSubscription | null;
}

export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window,
    isSubscribed: false,
    permission: 'default' as NotificationPermission,
    subscription: null,
  });

  useEffect(() => {
    if (!state.isSupported) return;

    setState((prev) => ({
      ...prev,
      permission: Notification.permission,
    }));

    checkSubscription();
  }, [state.isSupported]);

  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      setState((prev) => ({
        ...prev,
        isSubscribed: !!subscription,
        subscription,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('StackBlitz') || errorMessage.includes('WebContainer')) {
        return;
      }
      console.error('Error checking push subscription:', error);
    }
  }

  async function requestPermission(): Promise<boolean> {
    if (!state.isSupported) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();

      setState((prev) => ({
        ...prev,
        permission,
      }));

      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async function subscribe(): Promise<boolean> {
    if (!state.isSupported || state.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          endpoint: subscription.endpoint,
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
          auth: arrayBufferToBase64(subscription.getKey('auth')),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setState((prev) => ({
        ...prev,
        isSubscribed: true,
        subscription,
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('StackBlitz') || errorMessage.includes('WebContainer')) {
        return false;
      }
      console.error('Error subscribing to push notifications:', error);
      return false;
    }
  }

  async function unsubscribe(): Promise<boolean> {
    if (!state.subscription) return false;

    try {
      await state.subscription.unsubscribe();

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', user.id);
      }

      setState((prev) => ({
        ...prev,
        isSubscribed: false,
        subscription: null,
      }));

      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }

  async function sendTestNotification() {
    if (!state.isSupported || state.permission !== 'granted') {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('BioMath Core', {
        body: 'Push notifications are working!',
        icon: '/biomathcore_emblem_1024.png',
        badge: '/biomathcore_emblem_1024.png',
        tag: 'test-notification',
        vibrate: [200, 100, 200],
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('StackBlitz') || errorMessage.includes('WebContainer')) {
        return false;
      }
      console.error('Error sending test notification:', error);
      return false;
    }
  }

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
  };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
