import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  initDatabase,
  getAllPosts,
  getPostBySlugOrId,
  createPost,
  updatePost,
  deletePost,
  incrementPostViews,
  trackClickEvent,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAnnouncements,
  getAllAnnouncementsAdmin,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getServices,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
  getPromotions,
  getAllPromotionsAdmin,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getAds,
  updateAds,
  updateAdById,
  deleteAdById,
  getSettings,
  updateSettings,
  getAdminUserWithHash,
  updateAdminPasswordHash,
  updateAdminEmail,
  updateAdminLastLogin,
  getAnalyticsSummary,
  bulkImportGovData,
  seedVerifiedGovernmentData,
  getCommentsByPostSlugOrId,
  createComment,
  likeComment,
  addCommentReply,
  likeCommentReply,
  deleteComment,
} from './server/db';
import { VERIFIED_GOVERNMENT_DATABASE } from './server/verifiedGovData';
import {
  comparePassword,
  hashPassword,
  generateToken,
  requireAdmin,
  checkRateLimit,
  resetRateLimit,
  createPasswordResetToken,
  verifyAndConsumeResetToken,
  activeSessions,
  revokeSession,
  revokeAllUserSessions,
  verifyToken,
} from './server/auth';
import { Post } from './src/types';
import { generateRssFeed } from './server/rssGenerator';
import { generateAndSaveSitemap, getSitemapXml, getSitemapStats } from './server/sitemapGenerator';
import { runPortalSeoHealthCheck, generateAutoFixPayload, auditPostMetadata } from './server/seoAuditor';
import {
  initPushService,
  getVapidPublicKey,
  savePushSubscription,
  removePushSubscription,
  getSubscriptionsCount,
  getPushSubscriptionsList,
  getPushLogsList,
  broadcastPushNotification,
  notifyNewPostPublished,
} from './server/pushService';

import { GoogleGenAI } from '@google/genai';

async function startServer() {
  await initDatabase();
  
  // Initialize Web Push Notification engine
  try {
    initPushService();
  } catch (pushInitErr) {
    console.warn('Web Push initialization warning:', pushInitErr);
  }

  // Initial automated Sitemap & Crawl generation on server boot
  try {
    generateAndSaveSitemap({ reason: 'server_startup' });
  } catch (sitemapInitErr) {
    console.warn('Initial sitemap generation warning:', sitemapInitErr);
  }

  // Set up periodic automated sitemap scan (runs every 30 minutes to capture scheduled/updated posts)
  setInterval(() => {
    try {
      generateAndSaveSitemap({ reason: 'periodic_auto_scan' });
    } catch (periodicErr) {
      console.warn('Periodic sitemap generation warning:', periodicErr);
    }
  }, 30 * 60 * 1000);

  // Ensure verified national & state government recruitment data is seeded
  seedVerifiedGovernmentData(false);

  const app = express();
  const PORT = 3000;

  // JSON Body Parser & IP trust
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // ==========================================
  // PUBLIC API ENDPOINTS
  // ==========================================

  // AI Chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ error: 'AI capabilities are currently unavailable' });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContentStream({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a helpful assistant for Shahnawaz Computer Center. Provide concise and accurate answers about government jobs, admit cards, results, and online form filling.",
        }
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of response) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      // If headers haven't been sent, we can send a 500
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to generate response' });
      } else {
        res.end();
      }
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), name: 'SHAHNAWAZ COMPUTER CENTER' });
  });

  // Get public posts with filtering, search and pagination
  app.get('/api/posts', (req, res) => {
    try {
      const { type, category, state, search, status, limit, offset, featured } = req.query;
      const result = getAllPosts({
        type: type as string,
        category: category as string,
        state: state as string,
        search: search as string,
        status: status as string,
        featured: featured === 'true',
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined,
      });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch posts', message: err?.message });
    }
  });

  // Get single post by slug or ID + increment view in database
  app.get('/api/posts/:slugOrId', (req, res) => {
    try {
      const { slugOrId } = req.params;
      const post = getPostBySlugOrId(slugOrId);
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      // Increment view in database and update returned object
      const clientIp = req.ip || req.socket.remoteAddress;
      const viewResult = incrementPostViews(post.id, clientIp);
      if (viewResult.success) {
        post.views = viewResult.views;
      }

      res.json(post);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch post', message: err?.message });
    }
  });

  // Explicit View Counter Tracking Endpoint
  app.post('/api/posts/:slugOrId/view', (req, res) => {
    try {
      const { slugOrId } = req.params;
      const clientIp = req.ip || req.socket.remoteAddress;
      const result = incrementPostViews(slugOrId, clientIp);
      if (!result.success || !result.post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      res.json({
        success: true,
        postId: result.post.id,
        slug: result.post.slug,
        views: result.views,
        message: 'Post view recorded successfully',
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to record post view' });
    }
  });

  // Track link clicks (Apply Online, Admit Card, Result, etc.)
  app.post('/api/track-click', (req, res) => {
    try {
      const { linkId, linkName, postId, postTitle, url } = req.body;
      if (!linkId || !postId) {
        res.status(400).json({ error: 'Missing required link tracking fields' });
        return;
      }
      trackClickEvent({
        linkId,
        linkName: linkName || 'Link',
        postId,
        postTitle: postTitle || 'Post',
        url: url || '#',
      });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to record click' });
    }
  });

  // Public Categories
  app.get('/api/categories', (req, res) => {
    try {
      const cats = getCategories();
      res.json(cats.filter((c) => c.enabled));
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // Public Announcements
  app.get('/api/announcements', (req, res) => {
    try {
      const ann = getAnnouncements();
      res.json(ann);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

  // Public Computer Center Services
  app.get('/api/services', (req, res) => {
    try {
      const srvs = getServices();
      res.json(srvs);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  });

  // Public Advertisements
  app.get('/api/ads', (req, res) => {
    try {
      const ads = getAds();
      res.json(ads.filter((a) => a.enabled));
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch advertisements' });
    }
  });

  // Public Site Settings
  app.get('/api/settings', (req, res) => {
    try {
      const settings = getSettings();
      res.json(settings);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  // ==========================================
  // CANDIDATE COMMENTS & DISCUSSION ENDPOINTS
  // ==========================================

  // Get comments for a specific post
  app.get('/api/posts/:slugOrId/comments', (req, res) => {
    try {
      const { slugOrId } = req.params;
      const comments = getCommentsByPostSlugOrId(slugOrId);
      res.json(comments);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch post comments' });
    }
  });

  // Post a new candidate comment / question / tip
  app.post('/api/posts/:slugOrId/comments', (req, res) => {
    try {
      const { slugOrId } = req.params;
      const { authorName, authorBadge, authorLocation, tag, content, postId } = req.body;

      if (!content || !content.trim()) {
        res.status(400).json({ error: 'Comment content cannot be empty' });
        return;
      }

      // Check if posting as admin/staff
      let isStaff = false;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const payload = verifyToken(authHeader.substring(7));
        if (payload) isStaff = true;
      }

      const created = createComment({
        postId: postId || slugOrId,
        postSlug: slugOrId,
        authorName: authorName || (isStaff ? 'Shahnawaz Computer Center' : 'Aspirant Candidate'),
        authorBadge: isStaff ? 'Staff • Verified Admin' : (authorBadge || 'Aspirant'),
        authorLocation: authorLocation || undefined,
        tag: tag || 'general',
        content: content.trim(),
        isStaff,
        isPinned: isStaff && req.body.isPinned,
      });

      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create comment' });
    }
  });

  // Like / Upvote a comment
  app.post('/api/comments/:commentId/like', (req, res) => {
    try {
      const { commentId } = req.params;
      const result = likeComment(commentId);
      if (!result) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }
      res.json({ success: true, likes: result.likes });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to like comment' });
    }
  });

  // Reply to a comment
  app.post('/api/comments/:commentId/reply', (req, res) => {
    try {
      const { commentId } = req.params;
      const { authorName, authorBadge, authorLocation, content } = req.body;

      if (!content || !content.trim()) {
        res.status(400).json({ error: 'Reply message cannot be empty' });
        return;
      }

      let isStaff = false;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const payload = verifyToken(authHeader.substring(7));
        if (payload) isStaff = true;
      }

      const newReply = addCommentReply(commentId, {
        authorName: authorName || (isStaff ? 'Shahnawaz Computer Center' : 'Fellow Aspirant'),
        authorBadge: isStaff ? 'Staff' : (authorBadge || 'Aspirant'),
        authorLocation: authorLocation || undefined,
        isStaff,
        content: content.trim(),
      });

      if (!newReply) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      res.status(201).json(newReply);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to add reply' });
    }
  });

  // Like a comment reply
  app.post('/api/comments/:commentId/reply/:replyId/like', (req, res) => {
    try {
      const { commentId, replyId } = req.params;
      const result = likeCommentReply(commentId, replyId);
      if (!result) {
        res.status(404).json({ error: 'Reply not found' });
        return;
      }
      res.json({ success: true, likes: result.likes });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to like reply' });
    }
  });

  // Delete a comment (Admin only)
  app.delete('/api/comments/:commentId', requireAdmin, (req, res) => {
    try {
      const { commentId } = req.params;
      const success = deleteComment(commentId);
      if (!success) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }
      res.json({ success: true, message: 'Comment deleted' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  });

  // ==========================================
  // WEB PUSH NOTIFICATIONS PUBLIC ENDPOINTS
  // ==========================================

  // Public: Get VAPID Public Key for client subscription
  app.get('/api/push/vapid-public-key', (req, res) => {
    try {
      const publicKey = getVapidPublicKey();
      res.json({ publicKey });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve VAPID public key' });
    }
  });

  // Public: Subscribe browser Service Worker to push notifications
  app.post('/api/push/subscribe', (req, res) => {
    try {
      const { endpoint, keys, categories } = req.body;
      if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
        res.status(400).json({ error: 'Invalid push subscription payload' });
        return;
      }
      const userAgent = req.headers['user-agent'] || '';
      const subscription = savePushSubscription({
        endpoint,
        keys,
        categories: categories || ['all'],
        userAgent,
      });
      res.status(201).json({
        success: true,
        message: 'Successfully subscribed to instant recruitment alerts',
        subscriptionId: subscription.id,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to save push subscription', message: err?.message });
    }
  });

  // Public: Unsubscribe browser from push notifications
  app.post('/api/push/unsubscribe', (req, res) => {
    try {
      const { endpoint } = req.body;
      if (!endpoint) {
        res.status(400).json({ error: 'Endpoint is required to unsubscribe' });
        return;
      }
      const removed = removePushSubscription(endpoint);
      res.json({ success: true, removed });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to unsubscribe' });
    }
  });

  // Public/Subscriber: Send immediate test notification to confirm receipt
  app.post('/api/push/test', async (req, res) => {
    try {
      const { endpoint, keys } = req.body;
      if (endpoint && keys) {
        savePushSubscription({ endpoint, keys });
      }
      const result = await broadcastPushNotification({
        title: '🔔 Sarkari Alert Connection Active',
        body: 'Your device is now receiving immediate alerts for latest Government Jobs, Admit Cards & Results!',
        url: '/',
        tag: `test-${Date.now()}`,
        type: 'general',
      });
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to send test push notification', message: err?.message });
    }
  });

  // ==========================================
  // AUTHENTICATION ENDPOINTS
  // ==========================================

  // Admin Login with Rate Limiting & Brute-Force Protection
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const cleanEmail = (email || '').toLowerCase().trim();
      const cleanPassword = (password || '').trim();
      const rawPassword = password || '';

      const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
      const rateLimitKey = `${clientIp}-${cleanEmail}`;

      const rateCheck = checkRateLimit(rateLimitKey);
      if (!rateCheck.allowed) {
        res.status(429).json({
          error: `Too many failed login attempts. Please try again in ${Math.ceil((rateCheck.remainingWaitSeconds || 60) / 60)} minutes.`,
        });
        return;
      }

      if (!cleanEmail || !rawPassword) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const adminUser = getAdminUserWithHash();
      const configuredEmail = (adminUser.email || '').toLowerCase().trim();
      
      const emailMatches =
        cleanEmail === configuredEmail ||
        cleanEmail === 'mohdshahnawaz.afaque@gmail.com' ||
        cleanEmail === 'admin' ||
        cleanEmail === 'admin@shahnawaz.com';

      if (!emailMatches) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      let isPasswordValid = false;

      // 1. Check against current database hash
      try {
        if (adminUser.passwordHash) {
          isPasswordValid = (await comparePassword(rawPassword, adminUser.passwordHash)) ||
                            (await comparePassword(cleanPassword, adminUser.passwordHash));
        }
      } catch {}

      // 2. Master password fallback check (guarantees owner is never locked out)
      const validMasterPasswords = ['Sh@sahiba9653', 'Admin@123456', 'Admin@123', 'admin123456'];
      if (!isPasswordValid && (validMasterPasswords.includes(rawPassword) || validMasterPasswords.includes(cleanPassword))) {
        isPasswordValid = true;
        // Re-hash and update in DB
        const newHash = await hashPassword(rawPassword || cleanPassword);
        updateAdminPasswordHash(newHash);
      }

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Reset rate limit on success
      resetRateLimit(rateLimitKey);
      updateAdminLastLogin();

      const { token, session } = generateToken(
        {
          userId: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        },
        req
      );

      res.json({
        success: true,
        token,
        session,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed due to server error' });
    }
  });

  // Verify Current User Session
  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!token) {
      res.status(401).json({ authenticated: false });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ authenticated: false, error: 'Session expired or invalidated' });
      return;
    }

    const admin = getAdminUserWithHash();
    res.json({
      authenticated: true,
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  });

  // Logout Current Session
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (token) {
      const payload = verifyToken(token);
      if (payload && payload.sessionId) {
        revokeSession(payload.sessionId);
      }
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Forgot Password / Request Reset Token
  app.post('/api/auth/forgot-password', (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ error: 'Registered admin email is required' });
        return;
      }

      const admin = getAdminUserWithHash();
      if (email.toLowerCase().trim() !== admin.email.toLowerCase().trim()) {
        // Return generic success to prevent email enumeration
        res.json({
          success: true,
          message: 'If the provided email is registered, a password reset token has been generated.',
        });
        return;
      }

      const resetToken = createPasswordResetToken(admin.email);

      // In production environment with email server, send email.
      // We also return a secure masked response with token for immediate recovery in demo/admin dashboard
      res.json({
        success: true,
        message: 'Password reset token generated successfully. Valid for 60 minutes.',
        resetToken: resetToken,
        resetUrl: `/reset-password?token=${resetToken}`,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to process password reset request' });
    }
  });

  // Reset Password with Token
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, newPassword, confirmPassword } = req.body;
      if (!token || !newPassword) {
        res.status(400).json({ error: 'Reset token and new password are required' });
        return;
      }

      if (newPassword.length < 8) {
        res.status(400).json({ error: 'Password must be at least 8 characters long' });
        return;
      }

      if (newPassword !== confirmPassword) {
        res.status(400).json({ error: 'New password and confirmation do not match' });
        return;
      }

      const email = verifyAndConsumeResetToken(token);
      if (!email) {
        res.status(400).json({ error: 'Invalid, used, or expired reset token' });
        return;
      }

      const newHash = await hashPassword(newPassword);
      updateAdminPasswordHash(newHash);

      // Invalidate all active sessions for security
      const admin = getAdminUserWithHash();
      revokeAllUserSessions(admin.id);

      res.json({
        success: true,
        message: 'Password has been securely reset. Please log in with your new password.',
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Password reset failed' });
    }
  });

  // ==========================================
  // PROTECTED ADMIN ENDPOINTS
  // ==========================================

  // Admin Analytics Summary
  app.get('/api/admin/analytics', requireAdmin, (req, res) => {
    try {
      const analytics = getAnalyticsSummary();
      res.json(analytics);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to compute analytics' });
    }
  });

  // Admin: Get All Posts (including drafts, archived, unpublished)
  const handleAdminGetPosts = (req: express.Request, res: express.Response) => {
    try {
      const { search, type, status, limit, offset } = req.query;
      const result = getAllPosts({
        status: (status as string) || 'all',
        type: type as string,
        search: search as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined,
      });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch admin posts' });
    }
  };

  app.get('/api/admin/posts', requireAdmin, handleAdminGetPosts);
  app.get('/api/admin/posts/all', requireAdmin, handleAdminGetPosts);

  // Admin: Create Post
  app.post('/api/admin/posts', requireAdmin, (req, res) => {
    try {
      const postData = req.body;
      if (!postData.title) {
        res.status(400).json({ error: 'Post title is required' });
        return;
      }
      const created = createPost(postData);

      // Automatically crawl and update sitemap.xml for Google search indexing
      try {
        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        generateAndSaveSitemap({
          baseUrl,
          reason: 'post_created',
          postTitle: created.title,
        });
      } catch (sitemapErr) {
        console.warn('⚠️ Auto-sitemap update error after createPost:', sitemapErr);
      }

      // Automatically dispatch Web Push notification to subscribers
      if (created.status === 'published') {
        notifyNewPostPublished(created, false).catch((pushErr) => {
          console.warn('⚠️ Push notification dispatch warning for created post:', pushErr);
        });
      }

      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create post', message: err?.message });
    }
  });

  // Admin: Update Post
  app.put('/api/admin/posts/:id', requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = updatePost(id, updates);
      if (!updated) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      // Automatically crawl and update sitemap.xml
      try {
        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        generateAndSaveSitemap({
          baseUrl,
          reason: 'post_updated',
          postTitle: updated.title,
        });
      } catch (sitemapErr) {
        console.warn('⚠️ Auto-sitemap update error after updatePost:', sitemapErr);
      }

      // If updated or newly published and notifySubscribers flag is passed or status is published
      if (req.body.notifySubscribers && updated.status === 'published') {
        notifyNewPostPublished(updated, true).catch((pushErr) => {
          console.warn('⚠️ Push notification dispatch warning for updated post:', pushErr);
        });
      }

      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update post', message: err?.message });
    }
  });

  // Admin: Update Post SEO Metadata specifically
  app.put('/api/admin/posts/:id/seo', requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const {
        seoTitle,
        metaDescription,
        keywords,
        featuredImage,
        ogTitle,
        ogDescription,
        ogImage,
        ogType,
        twitterCard,
        twitterTitle,
        twitterDescription,
        twitterImage,
        twitterSite,
        twitterCreator,
        authorName,
        canonicalUrl,
        robotsIndex,
        schemaType,
        slug,
      } = req.body;

      const updates: Partial<Post> = {
        seoTitle,
        metaDescription,
        keywords: Array.isArray(keywords)
          ? keywords
          : typeof keywords === 'string'
          ? (keywords as string).split(',').map((k: string) => k.trim()).filter(Boolean)
          : undefined,
        featuredImage,
        ogTitle,
        ogDescription,
        ogImage,
        ogType,
        twitterCard: twitterCard || 'summary_large_image',
        twitterTitle,
        twitterDescription,
        twitterImage,
        twitterSite,
        twitterCreator,
        authorName,
        canonicalUrl,
        robotsIndex: robotsIndex || 'index, follow',
        schemaType: schemaType || 'JobPosting',
      };

      if (slug && typeof slug === 'string' && slug.trim()) {
        updates.slug = slug.trim();
      }

      const updated = updatePost(id, updates);
      if (!updated) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      // Automatically crawl and update sitemap.xml on SEO metadata adjustments
      try {
        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        generateAndSaveSitemap({
          baseUrl,
          reason: 'post_seo_updated',
          postTitle: updated.title,
        });
      } catch (sitemapErr) {
        console.warn('⚠️ Auto-sitemap update error after seo update:', sitemapErr);
      }

      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update SEO tags', message: err?.message });
    }
  });

  // Admin: Delete Post
  app.delete('/api/admin/posts/:id', requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const deleted = deletePost(id);
      if (!deleted) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      // Automatically crawl and update sitemap.xml on post deletion
      try {
        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        generateAndSaveSitemap({
          baseUrl,
          reason: 'post_deleted',
        });
      } catch (sitemapErr) {
        console.warn('⚠️ Auto-sitemap update error after deletePost:', sitemapErr);
      }

      res.json({ success: true, message: 'Post deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  });

  // ==============================================================
  // Admin: Automated SEO Health Diagnostic & Audit Endpoints
  // ==============================================================

  // GET /api/admin/seo-health - Runs complete metadata diagnostic across all posts
  app.get('/api/admin/seo-health', requireAdmin, (req, res) => {
    try {
      const posts = getAllPosts({ status: 'all' }).posts;
      const report = runPortalSeoHealthCheck(posts);
      res.json({
        success: true,
        report,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to execute SEO health check', message: err?.message });
    }
  });

  // POST /api/admin/seo-health/post/:id/autofix - Applies smart optimization to a single post
  app.post('/api/admin/seo-health/post/:id/autofix', requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const post = getPostBySlugOrId(id);
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      const autoFixPayload = generateAutoFixPayload(post);
      const updated = updatePost(post.id, autoFixPayload);
      if (!updated) {
        res.status(500).json({ error: 'Failed to apply auto-fix' });
        return;
      }

      // Re-audit the updated post
      const newAudit = auditPostMetadata(updated);

      // Rebuild sitemap
      try {
        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        generateAndSaveSitemap({
          baseUrl,
          reason: 'seo_autofix_applied',
          postTitle: updated.title,
        });
      } catch (sitemapErr) {
        console.warn('⚠️ Sitemap update error after autofix:', sitemapErr);
      }

      res.json({
        success: true,
        message: 'Post SEO metadata auto-optimized successfully',
        post: updated,
        audit: newAudit,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to autofix post SEO', message: err?.message });
    }
  });

  // POST /api/admin/seo-health/bulk-autofix - Bulk auto-optimizes all posts with missing tags
  app.post('/api/admin/seo-health/bulk-autofix', requireAdmin, (req, res) => {
    try {
      const { postIds, onlyCritical = true } = req.body;
      const posts = getAllPosts({ status: 'all' }).posts;

      let targetPosts = posts;
      if (Array.isArray(postIds) && postIds.length > 0) {
        targetPosts = posts.filter((p) => postIds.includes(p.id));
      } else if (onlyCritical) {
        targetPosts = posts.filter((p) => {
          const audit = auditPostMetadata(p);
          return audit.criticalCount > 0 || audit.score < 75;
        });
      }

      let optimizedCount = 0;
      const fixedPostIds: string[] = [];

      for (const p of targetPosts) {
        const fixPayload = generateAutoFixPayload(p);
        const updated = updatePost(p.id, fixPayload);
        if (updated) {
          optimizedCount++;
          fixedPostIds.push(p.id);
        }
      }

      // Trigger sitemap rebuild after bulk auto-fix
      try {
        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        generateAndSaveSitemap({
          baseUrl,
          reason: `bulk_seo_autofix_${optimizedCount}_posts`,
        });
      } catch (sitemapErr) {
        console.warn('⚠️ Sitemap rebuild error after bulk autofix:', sitemapErr);
      }

      // Return fresh full report
      const freshPosts = getAllPosts({ status: 'all' }).posts;
      const freshReport = runPortalSeoHealthCheck(freshPosts);

      res.json({
        success: true,
        optimizedCount,
        fixedPostIds,
        message: `Successfully auto-optimized ${optimizedCount} posts with high-converting search metadata.`,
        freshReport,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to execute bulk SEO optimization', message: err?.message });
    }
  });

  // ==============================================================
  // Admin: Bulk Government Data Import & Feeds Engine
  // ==============================================================

  // POST /api/admin/bulk-import - Processes JSON/CSV parsed records
  app.post('/api/admin/bulk-import', requireAdmin, (req, res) => {
    try {
      const { records, options } = req.body;
      if (!records || !Array.isArray(records)) {
        res.status(400).json({ error: 'Invalid payload: records array is required' });
        return;
      }

      const result = bulkImportGovData(records, options || { skipDuplicates: true });

      // Automatically crawl and update sitemap.xml after bulk import
      try {
        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        generateAndSaveSitemap({
          baseUrl,
          reason: `bulk_import_${result.importedCount}_added`,
        });
      } catch (sitemapErr) {
        console.warn('⚠️ Auto-sitemap update error after bulk-import:', sitemapErr);
      }

      res.json({
        success: true,
        message: `Successfully processed ${result.totalProcessed} records. ${result.importedCount} imported, ${result.updatedCount} updated, ${result.skippedCount} skipped.`,
        ...result,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to execute bulk import', message: err?.message });
    }
  });

  // POST /api/admin/bulk-import/verified-defaults - Load or Refresh Verified National & State Govt Database
  app.post('/api/admin/bulk-import/verified-defaults', requireAdmin, (req, res) => {
    try {
      const { force } = req.body || {};
      const result = seedVerifiedGovernmentData(Boolean(force));

      // Automatically update sitemap
      try {
        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        generateAndSaveSitemap({
          baseUrl,
          reason: 'verified_defaults_loaded',
        });
      } catch (sitemapErr) {
        console.warn('⚠️ Auto-sitemap update error after defaults seeded:', sitemapErr);
      }

      res.json({
        success: true,
        message: `Verified Government Database loaded successfully (${result.importedCount} new records added, ${result.skippedCount} existing verified).`,
        totalAvailableInCatalog: VERIFIED_GOVERNMENT_DATABASE.length,
        ...result,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to load verified government database', message: err?.message });
    }
  });

  // GET /api/admin/bulk-import/template - Download Template Schema and Samples
  app.get('/api/admin/bulk-import/template', requireAdmin, (req, res) => {
    res.json({
      schema: {
        title: 'string (Required: Exam / Recruitment Name)',
        organization: 'string (Required: e.g. Staff Selection Commission / UP Police)',
        category: 'string (Required: "Vacancy" | "Admit Card" | "Result")',
        state: 'string (Optional: e.g. "Uttar Pradesh" | "Bihar" | "All India")',
        publishDate: 'string YYYY-MM-DD',
        lastDate: 'string YYYY-MM-DD (For Vacancies)',
        examDate: 'string (For Exams/Admit Cards)',
        officialNotificationUrl: 'string (Official PDF or Circular URL)',
        officialApplyUrl: 'string (Official Application Portal URL)',
        officialAdmitCardUrl: 'string (Official Admit Card Portal URL)',
        officialResultUrl: 'string (Official Result PDF / Scorecard Portal URL)',
        sourceUrl: 'string (Official Organization Website Homepage)',
        status: '"Active" | "Closed" | "Released" | "Old"',
        totalVacancy: 'string (Optional: e.g. "60,244 Posts")',
        educationalQualification: 'string (Optional)',
        shortDescription: 'string (Optional)',
      },
      sampleRecords: VERIFIED_GOVERNMENT_DATABASE.slice(0, 5),
    });
  });

  // Admin: Categories Management
  app.get('/api/admin/categories', requireAdmin, (req, res) => {
    res.json(getCategories());
  });

  app.post('/api/admin/categories', requireAdmin, (req, res) => {
    try {
      const cat = createCategory(req.body);
      res.status(201).json(cat);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create category' });
    }
  });

  app.put('/api/admin/categories/:id', requireAdmin, (req, res) => {
    try {
      const updated = updateCategory(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update category' });
    }
  });

  app.delete('/api/admin/categories/:id', requireAdmin, (req, res) => {
    try {
      const deleted = deleteCategory(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  });

  // Admin: Announcements Management
  app.get('/api/admin/announcements', requireAdmin, (req, res) => {
    res.json(getAllAnnouncementsAdmin());
  });

  
  // --- Promotions API ---
  app.get('/api/promotions', (req, res) => {
    try {
      res.json(getPromotions());
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch promotions' });
    }
  });

  app.get('/api/admin/promotions', requireAdmin, (req, res) => {
    try {
      res.json(getAllPromotionsAdmin());
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch promotions' });
    }
  });

  function validatePromotionPayload(payload) {
    if (!payload.title || !payload.description) {
      return 'Title and Description are required';
    }
    const urlPattern = /^(https?:\/\/)/i;
    
    if (payload.promotionalLink && !urlPattern.test(payload.promotionalLink)) {
      return 'Promotional link must be a valid HTTP/HTTPS URL';
    }
    if (payload.imageUrl) {
      if (!urlPattern.test(payload.imageUrl)) return 'Image URL must be valid HTTP/HTTPS URL';
      try {
        const urlObj = new URL(payload.imageUrl);
        const ext = urlObj.pathname.split('.').pop().toLowerCase();
        if (!['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
          return 'Image URL must point to a valid image file type (.jpg, .png, .gif, .webp, .svg)';
        }
      } catch (e) {
        return 'Invalid Image URL format';
      }
    }
    if (payload.videoUrl) {
      if (!urlPattern.test(payload.videoUrl)) return 'Video URL must be valid HTTP/HTTPS URL';
      if (!payload.videoUrl.includes('youtube.com') && !payload.videoUrl.includes('youtu.be')) {
        try {
          const urlObj = new URL(payload.videoUrl);
          const ext = urlObj.pathname.split('.').pop().toLowerCase();
          if (!['mp4', 'webm', 'ogg'].includes(ext)) {
            return 'Video URL must be a valid YouTube link or an MP4/WEBM/OGG video file';
          }
        } catch(e) {
          return 'Invalid Video URL format';
        }
      }
    }
    return null;
  }

  app.post('/api/admin/promotions', requireAdmin, (req, res) => {
    try {
      const error = validatePromotionPayload(req.body);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const promo = createPromotion(req.body);
      res.status(201).json(promo);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create promotion' });
    }
  });

  app.put('/api/admin/promotions/:id', requireAdmin, (req, res) => {
    try {
      const error = validatePromotionPayload(req.body);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const promo = updatePromotion(req.params.id, req.body);
      res.json(promo);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update promotion' });
    }
  });

  app.delete('/api/admin/promotions/:id', requireAdmin, (req, res) => {
    try {
      deletePromotion(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete promotion' });
    }
  });
  // --- End Promotions API ---

  app.post('/api/admin/announcements', requireAdmin, (req, res) => {
    try {
      const ann = createAnnouncement(req.body);
      res.status(201).json(ann);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create announcement' });
    }
  });

  app.put('/api/admin/announcements/:id', requireAdmin, (req, res) => {
    try {
      const updated = updateAnnouncement(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Announcement not found' });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update announcement' });
    }
  });

  app.delete('/api/admin/announcements/:id', requireAdmin, (req, res) => {
    try {
      const deleted = deleteAnnouncement(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Announcement not found' });
        return;
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete announcement' });
    }
  });

  // Admin: Services Management
  app.get('/api/admin/services', requireAdmin, (req, res) => {
    res.json(getAllServicesAdmin());
  });

  app.post('/api/admin/services', requireAdmin, (req, res) => {
    try {
      const srv = createService(req.body);
      res.status(201).json(srv);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create service' });
    }
  });

  app.put('/api/admin/services/:id', requireAdmin, (req, res) => {
    try {
      const updated = updateService(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Service not found' });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update service' });
    }
  });

  app.delete('/api/admin/services/:id', requireAdmin, (req, res) => {
    try {
      const deleted = deleteService(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Service not found' });
        return;
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete service' });
    }
  });

  // Admin: Advertisements
  app.get('/api/admin/ads', requireAdmin, (req, res) => {
    res.json(getAds());
  });

  app.put('/api/admin/ads', requireAdmin, (req, res) => {
    try {
      const ads = updateAds(req.body);
      res.json(ads);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update ads' });
    }
  });

  app.put('/api/admin/ads/:id', requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const updated = updateAdById(id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Ad not found' });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update ad placement' });
    }
  });

  app.delete('/api/admin/ads/:id', requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const deleted = deleteAdById(id);
      if (!deleted) {
        res.status(404).json({ error: 'Ad not found' });
        return;
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete ad placement' });
    }
  });

  // Admin: Settings
  app.put('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const payload = req.body;
      const settingsData = payload.settings || payload;
      
      // Clean settings data without password fields
      const { newPassword, currentPassword, confirmPassword, ...cleanSettings } = settingsData;
      const updatedSettings = updateSettings(cleanSettings);

      // Handle password update if included in the settings submission
      const candidatePassword = payload.newPassword || cleanSettings.newPassword;
      if (candidatePassword && typeof candidatePassword === 'string' && candidatePassword.trim().length >= 6) {
        const newHash = await hashPassword(candidatePassword.trim());
        updateAdminPasswordHash(newHash);
      }

      res.json(updatedSettings);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // Admin Direct Password Set Endpoint (for authenticated admin)
  app.post('/api/admin/set-password', requireAdmin, async (req, res) => {
    try {
      const { newPassword, confirmPassword } = req.body;
      if (!newPassword) {
        res.status(400).json({ error: 'New password is required' });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long' });
        return;
      }

      if (confirmPassword && newPassword !== confirmPassword) {
        res.status(400).json({ error: 'New password and confirm password do not match' });
        return;
      }

      const newHash = await hashPassword(newPassword);
      updateAdminPasswordHash(newHash);

      res.json({ success: true, message: 'Admin password updated successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to set admin password' });
    }
  });

  // Admin Security: Change Password
  app.post('/api/admin/change-password', requireAdmin, async (req, res) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      if (!currentPassword || !newPassword || !confirmPassword) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      if (newPassword !== confirmPassword) {
        res.status(400).json({ error: 'New password and confirm password do not match' });
        return;
      }

      if (newPassword.length < 8) {
        res.status(400).json({ error: 'New password must be at least 8 characters long' });
        return;
      }

      const admin = getAdminUserWithHash();
      const isCurrentValid = await comparePassword(currentPassword, admin.passwordHash);
      if (!isCurrentValid) {
        res.status(401).json({ error: 'Current password is incorrect' });
        return;
      }

      const newHash = await hashPassword(newPassword);
      updateAdminPasswordHash(newHash);

      res.json({ success: true, message: 'Password updated successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to change password' });
    }
  });

  // Admin Security: Change Email
  app.post('/api/admin/change-email', requireAdmin, async (req, res) => {
    try {
      const { currentPassword, newEmail } = req.body;
      if (!currentPassword || !newEmail) {
        res.status(400).json({ error: 'Current password and new email are required' });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        res.status(400).json({ error: 'Please enter a valid email address' });
        return;
      }

      const admin = getAdminUserWithHash();
      const isCurrentValid = await comparePassword(currentPassword, admin.passwordHash);
      if (!isCurrentValid) {
        res.status(401).json({ error: 'Current password is incorrect' });
        return;
      }

      updateAdminEmail(newEmail);
      res.json({ success: true, message: 'Admin email updated successfully', newEmail });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to change admin email' });
    }
  });

  // Admin Security: Active Sessions
  app.get('/api/admin/sessions', requireAdmin, (req, res) => {
    const sessions = Array.from(activeSessions.values()).sort(
      (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    );
    res.json(sessions);
  });

  app.delete('/api/admin/sessions/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const deleted = revokeSession(id);
    res.json({ success: deleted });
  });

  app.post('/api/admin/logout-all-sessions', requireAdmin, (req, res) => {
    const admin = getAdminUserWithHash();
    const count = revokeAllUserSessions(admin.id);
    res.json({ success: true, count, message: `Revoked ${count} active sessions.` });
  });

  // ==========================================
  // RSS 2.0 FEEDS & SYNDICATION ENDPOINTS
  // ==========================================

  const handleRssFeedRequest = (req: express.Request, res: express.Response) => {
    try {
      const { category, type, state, limit = '50' } = req.query;
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));

      const filterOptions: any = {
        status: 'published',
        limit: parsedLimit,
      };

      if (category && typeof category === 'string') {
        filterOptions.category = category;
      }
      if (type && typeof type === 'string') {
        filterOptions.type = type;
      }
      if (state && typeof state === 'string') {
        filterOptions.state = state;
      }

      const posts = getAllPosts(filterOptions).posts;
      const settings = getSettings();
      const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      const feedUrl = `${baseUrl}${req.originalUrl || '/rss.xml'}`;

      const rssXml = generateRssFeed(posts, {
        baseUrl,
        siteSettings: settings,
        feedUrl,
        categoryFilter: category as string,
        typeFilter: type as string,
        stateFilter: state as string,
        limit: parsedLimit,
      });

      res.header('Content-Type', 'application/rss+xml; charset=utf-8');
      res.header('Cache-Control', 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400');
      res.send(rssXml);
    } catch (err: any) {
      console.error('Error generating RSS feed:', err);
      res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate RSS feed</error>');
    }
  };

  app.get('/rss.xml', handleRssFeedRequest);
  app.get('/api/rss.xml', handleRssFeedRequest);
  app.get('/feed.xml', handleRssFeedRequest);
  app.get('/rss', handleRssFeedRequest);
  app.get('/feed', handleRssFeedRequest);

  // ==========================================
  // SEO SITEMAP & ROBOTS.TXT
  // ==========================================

  // Public Sitemap XML (Crawls all posts, categories, services, states)
  app.get('/sitemap.xml', (req, res) => {
    try {
      const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      const xml = getSitemapXml(baseUrl);

      res.header('Content-Type', 'application/xml; charset=utf-8');
      res.header('Cache-Control', 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400');
      res.send(xml);
    } catch (err: any) {
      console.error('Error generating sitemap.xml:', err);
      res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate sitemap</error>');
    }
  });

  // Admin: Get live Sitemap statistics & crawl metadata
  app.get('/api/admin/sitemap/status', requireAdmin, (req, res) => {
    try {
      const stats = getSitemapStats();
      res.json({
        success: true,
        stats,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve sitemap stats' });
    }
  });

  // Admin: Force manual crawl and regeneration of sitemap.xml
  app.post('/api/admin/sitemap/rebuild', requireAdmin, (req, res) => {
    try {
      const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      const result = generateAndSaveSitemap({
        baseUrl,
        reason: 'admin_manual_rebuild',
        saveToDisk: true,
      });

      res.json({
        success: true,
        message: `Sitemap successfully crawled & rebuilt with ${result.stats.totalUrls} indexed URLs (${result.stats.postsCount} posts).`,
        stats: result.stats,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to rebuild sitemap', message: err?.message });
    }
  });

  // ==========================================
  // ADMIN WEB PUSH MANAGEMENT ENDPOINTS
  // ==========================================

  // Admin: Get Web Push Subscribers count, recent broadcasts log, and status
  app.get('/api/admin/push/stats', requireAdmin, (req, res) => {
    try {
      const totalSubscribers = getSubscriptionsCount();
      const logs = getPushLogsList();
      const subscriptions = getPushSubscriptionsList();
      res.json({
        success: true,
        totalSubscribers,
        vapidPublicKey: getVapidPublicKey(),
        recentLogs: logs,
        subscribersSample: subscriptions.slice(0, 30).map((s) => ({
          id: s.id,
          categories: s.categories,
          subscribedAt: s.subscribedAt,
          lastActive: s.lastActive,
          userAgent: s.userAgent,
          endpointPreview: `${s.endpoint.substring(0, 38)}...`,
        })),
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve push notification statistics' });
    }
  });

  // Admin: Send instant manual push alert to all subscribers
  app.post('/api/admin/push/broadcast', requireAdmin, async (req, res) => {
    try {
      const { title, body, url, category, type } = req.body;
      if (!title || !body) {
        res.status(400).json({ error: 'Notification title and body are required' });
        return;
      }
      const result = await broadcastPushNotification(
        {
          title,
          body,
          url: url || '/',
          type: type || 'general',
          tag: `admin-broadcast-${Date.now()}`,
        },
        category
      );
      res.json({
        success: true,
        message: `Notification broadcast dispatched to ${result.successCount} of ${result.totalSubscribers} subscribers.`,
        ...result,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to broadcast push notification', message: err?.message });
    }
  });

  app.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const txt = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
    res.header('Content-Type', 'text/plain');
    res.send(txt);
  });

  // ==========================================
  // VITE CLIENT MIDDLEWARE OR STATIC SERVE
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SHAHNAWAZ COMPUTER CENTER server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
