import { Post, Category, Announcement, ComputerService, Advertisement, SiteSettings, AdminUser, PostComment, CommentReply } from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SERVICES,
  INITIAL_POSTS,
  INITIAL_SETTINGS,
  INITIAL_ADS,
  INITIAL_COMMENTS,
} from '../../server/seedData';

const STORAGE_KEYS = {
  POSTS: 'scc_offline_posts',
  CATEGORIES: 'scc_offline_categories',
  ANNOUNCEMENTS: 'scc_offline_announcements',
  SERVICES: 'scc_offline_services',
  SETTINGS: 'scc_offline_settings',
  ADS: 'scc_offline_ads',
  COMMENTS: 'scc_offline_comments',
  ADMIN_USER: 'scc_offline_admin_user',
  CUSTOM_PASSWORD: 'scc_offline_custom_password',
};

const MASTER_PASSWORDS = ['Sh@sahiba9653', 'Admin@123456', 'Admin@123', 'admin123456'];
const MASTER_EMAILS = [
  'mohdshahnawaz.afaque@gmail.com',
  'admin@shahnawaz.com',
  'admin',
  'admin@scc.com',
];

export function validateClientMasterAuth(email: string, pass: string): { success: boolean; token?: string; user?: AdminUser; error?: string } {
  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanPass = (pass || '').trim();

  const customPass = localStorage.getItem(STORAGE_KEYS.CUSTOM_PASSWORD);
  const isValidEmail = MASTER_EMAILS.includes(cleanEmail) || cleanEmail.includes('shahnawaz');
  const isValidPass =
    MASTER_PASSWORDS.includes(cleanPass) ||
    MASTER_PASSWORDS.includes(pass) ||
    (customPass && (customPass === pass || customPass === cleanPass));

  if (isValidEmail && isValidPass) {
    const user: AdminUser = {
      id: 'admin-primary-1',
      email: 'mohdshahnawaz.afaque@gmail.com',
      role: 'superadmin',
      createdAt: '2026-01-01T00:00:00.000Z',
    };
    const token = `scc_static_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return { success: true, token, user };
  }

  return { success: false, error: 'Invalid email or password' };
}

export function getClientPosts(): Post[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_POSTS;
}

export function saveClientPosts(posts: Post[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  } catch {}
}

export function getClientPostBySlug(slug: string): Post | undefined {
  const posts = getClientPosts();
  return posts.find((p) => p.slug === slug || p.id === slug || p.slug.toLowerCase() === slug.toLowerCase() || p.id.toLowerCase() === slug.toLowerCase());
}

export function incrementClientPostViews(slugOrId: string): number {
  const posts = getClientPosts();
  const index = posts.findIndex((p) => p.slug === slugOrId || p.id === slugOrId || p.slug.toLowerCase() === slugOrId.toLowerCase() || p.id.toLowerCase() === slugOrId.toLowerCase());
  if (index !== -1) {
    posts[index].views = (posts[index].views || 0) + 1;
    saveClientPosts(posts);
    return posts[index].views;
  }
  return 0;
}

export function getClientCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_CATEGORIES;
}

export function saveClientCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch {}
}

export function getClientAnnouncements(): Announcement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_ANNOUNCEMENTS;
}

export function saveClientAnnouncements(announcements: Announcement[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  } catch {}
}

export function getClientServices(): ComputerService[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_SERVICES;
}

export function saveClientServices(services: ComputerService[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  } catch {}
}

export function getClientSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_SETTINGS;
}

export function saveClientSettings(settings: SiteSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}
}

export function getClientAds(): Advertisement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_ADS;
}

export function saveClientAds(ads: Advertisement[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
  } catch {}
}

export function setClientCustomPassword(password: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PASSWORD, password);
  } catch {}
}

export function getAllClientComments(): PostComment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_COMMENTS;
}

export function saveAllClientComments(comments: PostComment[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  } catch {}
}

export function getClientCommentsBySlug(slugOrId: string): PostComment[] {
  const all = getAllClientComments();
  const normalized = (slugOrId || '').toLowerCase().trim();
  const filtered = all.filter(
    (c) =>
      c.postSlug?.toLowerCase() === normalized ||
      c.postId?.toLowerCase() === normalized ||
      c.postSlug?.toLowerCase().replace(/-/g, '') === normalized.replace(/-/g, '')
  );

  return [...filtered].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function saveClientComment(comment: PostComment): PostComment[] {
  const all = getAllClientComments();
  const existingIdx = all.findIndex((c) => c.id === comment.id);
  if (existingIdx !== -1) {
    all[existingIdx] = comment;
  } else {
    all.unshift(comment);
  }
  saveAllClientComments(all);
  return getClientCommentsBySlug(comment.postSlug);
}

export function likeClientComment(commentId: string): number {
  const all = getAllClientComments();
  const c = all.find((item) => item.id === commentId);
  if (c) {
    c.likes = (c.likes || 0) + 1;
    saveAllClientComments(all);
    return c.likes;
  }
  return 0;
}

export function addClientCommentReply(commentId: string, reply: CommentReply): CommentReply | null {
  const all = getAllClientComments();
  const c = all.find((item) => item.id === commentId);
  if (c) {
    if (!c.replies) c.replies = [];
    c.replies.push(reply);
    saveAllClientComments(all);
    return reply;
  }
  return null;
}

export function likeClientCommentReply(commentId: string, replyId: string): number {
  const all = getAllClientComments();
  const c = all.find((item) => item.id === commentId);
  if (c && c.replies) {
    const r = c.replies.find((rep) => rep.id === replyId);
    if (r) {
      r.likes = (r.likes || 0) + 1;
      saveAllClientComments(all);
      return r.likes;
    }
  }
  return 0;
}
import { Promotion } from '../types';
import { INITIAL_PROMOTIONS } from '../../server/seedData';

const PROMOTIONS_KEY = 'scc_offline_promotions';

export function getClientPromotions(): Promotion[] {
  try {
    const raw = localStorage.getItem(PROMOTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_PROMOTIONS;
}

export function saveClientPromotions(promotions: Promotion[]): void {
  try {
    localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(promotions));
  } catch {}
}

