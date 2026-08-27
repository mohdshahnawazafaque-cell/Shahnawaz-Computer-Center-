import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.AUTH_SECRET || 'shahnawaz-computer-center-secret-key-2026-production';
const JWT_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'superadmin' | 'admin';
  sessionId: string;
}

export interface SessionInfo {
  id: string;
  userId: string;
  email: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  lastActive: string;
}

// In-memory active sessions and reset tokens
export const activeSessions: Map<string, SessionInfo> = new Map();
export const resetTokens: Map<string, { token: string; email: string; expiresAt: number; used: boolean }> = new Map();

// Rate limiting for login
const loginAttempts: Map<string, { count: number; blockedUntil?: number }> = new Map();

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

export function generateToken(payload: Omit<TokenPayload, 'sessionId'>, req: Request): { token: string; session: SessionInfo } {
  const sessionId = crypto.randomUUID();
  const session: SessionInfo = {
    id: sessionId,
    userId: payload.userId,
    email: payload.email,
    ip: req.ip || req.socket.remoteAddress || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Unknown Browser',
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };

  activeSessions.set(sessionId, session);

  const fullPayload: TokenPayload = {
    ...payload,
    sessionId,
  };

  const token = jwt.sign(fullPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { token, session };
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    if (decoded && decoded.sessionId) {
      if (!activeSessions.has(decoded.sessionId)) {
        return null; // Session was revoked
      }
      // Update lastActive
      const s = activeSessions.get(decoded.sessionId);
      if (s) {
        s.lastActive = new Date().toISOString();
      }
    }
    return decoded;
  } catch {
    return null;
  }
}

export function revokeSession(sessionId: string): boolean {
  return activeSessions.delete(sessionId);
}

export function revokeAllUserSessions(userId: string): number {
  let count = 0;
  for (const [sid, session] of activeSessions.entries()) {
    if (session.userId === userId) {
      activeSessions.delete(sid);
      count++;
    }
  }
  return count;
}

export function checkRateLimit(identifier: string): { allowed: boolean; remainingWaitSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record) {
    loginAttempts.set(identifier, { count: 1 });
    return { allowed: true };
  }

  if (record.blockedUntil && record.blockedUntil > now) {
    const remaining = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remainingWaitSeconds: remaining };
  }

  if (record.blockedUntil && record.blockedUntil <= now) {
    // Reset after block expires
    loginAttempts.set(identifier, { count: 1 });
    return { allowed: true };
  }

  record.count += 1;
  if (record.count >= 25) {
    record.blockedUntil = now + 5 * 60 * 1000; // 5 minutes block after 25 failed attempts
    return { allowed: false, remainingWaitSeconds: 5 * 60 };
  }

  return { allowed: true };
}

export function resetRateLimit(identifier: string) {
  loginAttempts.delete(identifier);
}

export function clearAllRateLimits() {
  loginAttempts.clear();
}

export function createPasswordResetToken(email: string): string {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  
  resetTokens.set(hashedToken, {
    token: rawToken,
    email: email.toLowerCase().trim(),
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour validity
    used: false,
  });

  return rawToken;
}

export function verifyAndConsumeResetToken(rawToken: string): string | null {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const record = resetTokens.get(hashedToken);

  if (!record) return null;
  if (record.used) return null;
  if (Date.now() > record.expiresAt) {
    resetTokens.delete(hashedToken);
    return null;
  }

  // Mark token as used
  record.used = true;
  return record.email;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Authentication required. No token provided.' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    return;
  }

  (req as any).user = payload;
  next();
}
