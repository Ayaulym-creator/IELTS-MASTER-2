import { Request, Response, NextFunction } from 'express';
import { db } from '../db.js';
import { User } from '../../src/types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

// In-memory or token map for sessions
export const SESSION_TOKENS: Record<string, { userId: string; expiresAt: number }> = {};

export function createSessionToken(userId: string): string {
  const token = `tok_${Date.now()}_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
  SESSION_TOKENS[token] = {
    userId,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  };
  return token;
}

export function revokeSessionToken(token: string) {
  delete SESSION_TOKENS[token];
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  const session = SESSION_TOKENS[token];

  if (!session || session.expiresAt < Date.now()) {
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  const user = db.findUserById(session.userId);
  if (!user) {
    return res.status(401).json({ error: 'User account not found.' });
  }

  const { passwordHash, ...sanitized } = user;
  req.user = sanitized;
  next();
}

export function requireApprovedStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  // Admins and Super Admins always pass
  if (req.user.role === 'SUPER_ADMIN' || req.user.role === 'ADMIN') {
    return next();
  }

  // Students must be APPROVED
  if (req.user.role === 'STUDENT') {
    if (req.user.status === 'PENDING_APPROVAL') {
      return res.status(403).json({
        error: 'PENDING_APPROVAL',
        message: 'Your account is currently pending approval by the Super Admin. You cannot access learning materials yet.'
      });
    }

    if (req.user.status !== 'APPROVED') {
      return res.status(403).json({
        error: 'ACCOUNT_INACTIVE',
        message: `Your account status is ${req.user.status}. Please contact platform administrators.`
      });
    }
  }

  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }

  next();
}

export function requireSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Access denied. Super Admin privileges required.' });
  }

  next();
}
