import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import webpush from 'web-push';
import { Post, PostType } from '../src/types';

export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface PushSubscriptionItem {
  id: string;
  endpoint: string;
  keys: PushSubscriptionKeys;
  categories: string[]; // ['all', 'job', 'admit_card', 'result', 'answer_key', 'sarkari_yojana', 'admission']
  subscribedAt: string;
  userAgent?: string;
  lastActive?: string;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  url: string;
  tag?: string;
  type?: PostType | 'general' | 'announcement';
  postId?: string;
  slug?: string;
  actions?: Array<{ action: string; title: string }>;
}

export interface PushNotificationLog {
  id: string;
  title: string;
  body: string;
  url: string;
  type: string;
  sentAt: string;
  successCount: number;
  failureCount: number;
  totalSubscribers: number;
  recipientCategory?: string;
}

interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'push_subscriptions.json');
const LOGS_FILE = path.join(DATA_DIR, 'push_logs.json');
const VAPID_FILE = path.join(DATA_DIR, 'vapid_keys.json');

let subscriptionsCache: PushSubscriptionItem[] = [];
let logsCache: PushNotificationLog[] = [];
let vapidKeysCache: VapidKeys | null = null;

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadVapidKeys(): VapidKeys {
  ensureDataDirectory();
  
  // 1. Check if configured in environment variables
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    vapidKeysCache = {
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY,
    };
    return vapidKeysCache;
  }

  // 2. Check if saved in file
  if (fs.existsSync(VAPID_FILE)) {
    try {
      const raw = fs.readFileSync(VAPID_FILE, 'utf-8');
      vapidKeysCache = JSON.parse(raw);
      if (vapidKeysCache?.publicKey && vapidKeysCache?.privateKey) {
        return vapidKeysCache;
      }
    } catch (e) {
      console.warn('Could not read vapid_keys.json, generating new pair...');
    }
  }

  // 3. Generate new VAPID keys pair and persist
  const newKeys = webpush.generateVAPIDKeys();
  vapidKeysCache = {
    publicKey: newKeys.publicKey,
    privateKey: newKeys.privateKey,
  };

  try {
    fs.writeFileSync(VAPID_FILE, JSON.stringify(vapidKeysCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist vapid keys to disk:', err);
  }

  return vapidKeysCache;
}

function loadSubscriptions(): PushSubscriptionItem[] {
  ensureDataDirectory();
  if (fs.existsSync(SUBSCRIPTIONS_FILE)) {
    try {
      const raw = fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf-8');
      subscriptionsCache = JSON.parse(raw);
      return subscriptionsCache;
    } catch (err) {
      console.error('Failed to load push subscriptions:', err);
    }
  }
  subscriptionsCache = [];
  return subscriptionsCache;
}

function saveSubscriptionsToDisk() {
  ensureDataDirectory();
  const tempFile = `${SUBSCRIPTIONS_FILE}.tmp.${Date.now()}`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(subscriptionsCache, null, 2), 'utf-8');
    fs.renameSync(tempFile, SUBSCRIPTIONS_FILE);
  } catch (err) {
    if (fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch {}
    }
    console.error('Error writing push subscriptions to disk:', err);
  }
}

function loadLogs(): PushNotificationLog[] {
  ensureDataDirectory();
  if (fs.existsSync(LOGS_FILE)) {
    try {
      const raw = fs.readFileSync(LOGS_FILE, 'utf-8');
      logsCache = JSON.parse(raw);
      return logsCache;
    } catch (err) {
      console.error('Failed to load push logs:', err);
    }
  }
  logsCache = [];
  return logsCache;
}

function saveLogsToDisk() {
  ensureDataDirectory();
  const tempFile = `${LOGS_FILE}.tmp.${Date.now()}`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(logsCache.slice(0, 100), null, 2), 'utf-8');
    fs.renameSync(tempFile, LOGS_FILE);
  } catch (err) {
    if (fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch {}
    }
    console.error('Error writing push logs to disk:', err);
  }
}

export function initPushService() {
  const keys = loadVapidKeys();
  loadSubscriptions();
  loadLogs();

  const contactEmail = process.env.VAPID_EMAIL || 'mailto:admin@shahnawazcomputer.com';
  try {
    webpush.setVapidDetails(contactEmail, keys.publicKey, keys.privateKey);
    console.log('✅ Web Push Service initialized with VAPID credentials.');
  } catch (err) {
    console.error('Failed to set VAPID details for Web Push:', err);
  }
}

export function getVapidPublicKey(): string {
  if (!vapidKeysCache) {
    loadVapidKeys();
  }
  return vapidKeysCache?.publicKey || '';
}

export function savePushSubscription(data: {
  endpoint: string;
  keys: PushSubscriptionKeys;
  categories?: string[];
  userAgent?: string;
}): PushSubscriptionItem {
  loadSubscriptions();

  const existingIdx = subscriptionsCache.findIndex((s) => s.endpoint === data.endpoint);
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    subscriptionsCache[existingIdx] = {
      ...subscriptionsCache[existingIdx],
      keys: data.keys,
      categories: data.categories || subscriptionsCache[existingIdx].categories || ['all'],
      lastActive: now,
      userAgent: data.userAgent || subscriptionsCache[existingIdx].userAgent,
    };
    saveSubscriptionsToDisk();
    return subscriptionsCache[existingIdx];
  }

  const newItem: PushSubscriptionItem = {
    id: `sub_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    endpoint: data.endpoint,
    keys: data.keys,
    categories: data.categories && data.categories.length > 0 ? data.categories : ['all'],
    subscribedAt: now,
    lastActive: now,
    userAgent: data.userAgent || '',
  };

  subscriptionsCache.push(newItem);
  saveSubscriptionsToDisk();
  return newItem;
}

export function removePushSubscription(endpoint: string): boolean {
  loadSubscriptions();
  const initialLength = subscriptionsCache.length;
  subscriptionsCache = subscriptionsCache.filter((s) => s.endpoint !== endpoint);
  if (subscriptionsCache.length !== initialLength) {
    saveSubscriptionsToDisk();
    return true;
  }
  return false;
}

export function getSubscriptionsCount(): number {
  return subscriptionsCache.length;
}

export function getPushSubscriptionsList(): PushSubscriptionItem[] {
  return subscriptionsCache;
}

export function getPushLogsList(): PushNotificationLog[] {
  return logsCache;
}

/**
 * Send a push notification to a specific subscription
 */
export async function sendPushToSubscription(
  subscription: PushSubscriptionItem,
  payload: PushNotificationPayload
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  try {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    };

    const payloadString = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/favicon.ico',
      badge: payload.badge || '/favicon.ico',
      image: payload.image || undefined,
      url: payload.url || '/',
      tag: payload.tag || `sarkari-alert-${Date.now()}`,
      type: payload.type || 'general',
      postId: payload.postId,
      slug: payload.slug,
      actions: payload.actions || [
        { action: 'open_url', title: 'Open & View' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    });

    const response = await webpush.sendNotification(pushSubscription, payloadString, {
      TTL: 60 * 60 * 24, // 24 hours in seconds
      urgency: 'high',
    });

    return { success: true, statusCode: response.statusCode };
  } catch (err: any) {
    const statusCode = err?.statusCode || 500;
    // 404 Not Found or 410 Gone means the subscription is no longer valid
    if (statusCode === 404 || statusCode === 410) {
      console.log(`[Push] Removing expired subscription (${statusCode}): ${subscription.endpoint.substring(0, 40)}...`);
      removePushSubscription(subscription.endpoint);
    }
    return { success: false, statusCode, error: err?.message || 'Delivery error' };
  }
}

/**
 * Broadcast a push notification to all subscribed users (or matching category)
 */
export async function broadcastPushNotification(
  payload: PushNotificationPayload,
  targetCategory?: string
): Promise<{
  successCount: number;
  failureCount: number;
  totalSubscribers: number;
  logId: string;
}> {
  loadSubscriptions();
  loadLogs();

  const targetCategoryClean = (targetCategory || payload.type || 'all').toLowerCase();

  // Filter subscribers who want this category
  const targetSubscribers = subscriptionsCache.filter((sub) => {
    if (!sub.categories || sub.categories.includes('all')) return true;
    return sub.categories.some((c) => c.toLowerCase() === targetCategoryClean);
  });

  let successCount = 0;
  let failureCount = 0;

  // Send in parallel with a concurrency pool
  const results = await Promise.allSettled(
    targetSubscribers.map((sub) => sendPushToSubscription(sub, payload))
  );

  results.forEach((res) => {
    if (res.status === 'fulfilled' && res.value.success) {
      successCount++;
    } else {
      failureCount++;
    }
  });

  const logEntry: PushNotificationLog = {
    id: `push_log_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    title: payload.title,
    body: payload.body,
    url: payload.url,
    type: payload.type || 'general',
    sentAt: new Date().toISOString(),
    successCount,
    failureCount,
    totalSubscribers: targetSubscribers.length,
    recipientCategory: targetCategoryClean,
  };

  logsCache.unshift(logEntry);
  saveLogsToDisk();

  console.log(`📢 [Push Broadcast] "${payload.title}" -> ${successCount} delivered, ${failureCount} failed out of ${targetSubscribers.length} total.`);

  return {
    successCount,
    failureCount,
    totalSubscribers: targetSubscribers.length,
    logId: logEntry.id,
  };
}

/**
 * Helper to auto-generate and broadcast when a new post is published or updated
 */
export async function notifyNewPostPublished(post: Post, isUpdate: boolean = false) {
  try {
    let typeLabel = 'Government Job';
    switch (post.type) {
      case 'job':
      case 'online_form':
        typeLabel = 'New Vacancy';
        break;
      case 'admit_card':
      case 'exam_date':
      case 'exam_city':
        typeLabel = 'Admit Card Released';
        break;
      case 'result':
        typeLabel = 'Result Declared';
        break;
      case 'answer_key':
        typeLabel = 'Answer Key Available';
        break;
      case 'syllabus':
        typeLabel = 'Syllabus Published';
        break;
      case 'sarkari_yojana':
        typeLabel = 'Government Scheme';
        break;
      case 'admission':
        typeLabel = 'Admission Open';
        break;
      case 'scholarship':
        typeLabel = 'Scholarship Alert';
        break;
    }

    const titlePrefix = isUpdate ? `[Updated] ${typeLabel}` : `🚨 [New Alert] ${typeLabel}`;
    const cleanTitle = `${titlePrefix}: ${post.title}`;
    const cleanBody = post.department
      ? `${post.department}${post.totalVacancy ? ` • ${post.totalVacancy} Posts` : ''}. Last Date: ${post.lastDate || 'Check Notification'}`
      : `Click here to check full notification details, application links, and official updates.`;

    const targetUrl = `/post/${post.slug || post.id}`;

    await broadcastPushNotification(
      {
        title: cleanTitle,
        body: cleanBody,
        url: targetUrl,
        type: post.type,
        postId: post.id,
        slug: post.slug,
        tag: `post-${post.id}`,
      },
      post.type
    );
  } catch (err) {
    console.warn('⚠️ Push notification dispatch warning for post:', post.title, err);
  }
}
