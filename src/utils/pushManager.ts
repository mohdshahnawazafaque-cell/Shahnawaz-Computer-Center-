/**
 * Client-Side Web Push Notification Manager
 * Handles Service Worker Push Subscription, VAPID key conversion, and backend synchronization.
 */

// Helper to convert base64 URL-safe string to Uint8Array for applicationServerKey
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

export function isPushNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export function getNotificationPermissionState(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Check if the current browser already has an active push subscription
 */
export async function getExistingPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushNotificationSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (err) {
    console.warn('Error checking push subscription:', err);
    return null;
  }
}

/**
 * Fetch VAPID public key from backend API
 */
export async function fetchVapidPublicKey(): Promise<string | null> {
  try {
    const res = await fetch('/api/push/vapid-public-key');
    if (!res.ok) throw new Error('Failed to fetch VAPID public key');
    const data = await res.json();
    return data.publicKey || null;
  } catch (err) {
    console.error('Failed to get VAPID public key:', err);
    return null;
  }
}

/**
 * Subscribe the user's browser to Push Notifications
 */
export async function subscribeUserToPush(
  categories: string[] = ['all']
): Promise<{ success: boolean; subscription?: PushSubscription; error?: string }> {
  if (!isPushNotificationSupported()) {
    return { success: false, error: 'Push notifications are not supported by your browser.' };
  }

  try {
    // 1. Request user permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        success: false,
        error: permission === 'denied' 
          ? 'Notification permission was blocked. Please enable notifications in your browser site settings.'
          : 'Notification permission was not granted.',
      };
    }

    // 2. Fetch VAPID Public Key from server
    const vapidPublicKey = await fetchVapidPublicKey();
    if (!vapidPublicKey) {
      return { success: false, error: 'Server push notification key could not be retrieved.' };
    }

    // 3. Register or get Service Worker
    const registration = await navigator.serviceWorker.ready;

    // 4. Subscribe to Push Manager
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as any,
    });

    const subscriptionJson = subscription.toJSON();

    // 5. Send subscription payload to backend
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: subscriptionJson.endpoint,
        keys: subscriptionJson.keys,
        categories: categories && categories.length > 0 ? categories : ['all'],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to store push subscription on server.');
    }

    // Store in localStorage for quick client sync
    try {
      localStorage.setItem('sarkari_push_subscribed', 'true');
      localStorage.setItem('sarkari_push_categories', JSON.stringify(categories));
    } catch {}

    return { success: true, subscription };
  } catch (err: any) {
    console.error('Error subscribing to push notifications:', err);
    return { success: false, error: err?.message || 'Failed to complete subscription' };
  }
}

/**
 * Unsubscribe user from Push Notifications
 */
export async function unsubscribeUserFromPush(): Promise<{ success: boolean; error?: string }> {
  if (!isPushNotificationSupported()) {
    return { success: false, error: 'Push notifications not supported.' };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const endpoint = subscription.endpoint;
      
      // Unsubscribe from browser
      await subscription.unsubscribe();

      // Inform server
      try {
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint }),
        });
      } catch (e) {
        console.warn('Could not notify server of unsubscription:', e);
      }
    }

    try {
      localStorage.removeItem('sarkari_push_subscribed');
    } catch {}

    return { success: true };
  } catch (err: any) {
    console.error('Error unsubscribing from push notifications:', err);
    return { success: false, error: err?.message || 'Failed to unsubscribe' };
  }
}

/**
 * Send a quick test push notification to verify delivery on this device
 */
export async function triggerTestPushNotification(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const sub = await getExistingPushSubscription();
    const payload = sub ? { endpoint: sub.endpoint, keys: sub.toJSON().keys } : {};

    const res = await fetch('/api/push/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('Test notification request failed');
    }

    const data = await res.json();
    return { success: true, message: 'Test alert dispatched! You should receive a notification shortly.' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to dispatch test notification' };
  }
}
