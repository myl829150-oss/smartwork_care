import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db } from './db';
import { Role, User } from '../src/types';

interface SessionInfo {
  userId: string;
  username: string;
  role: Role;
  expiresAt: number;
}

const sessions = new Map<string, SessionInfo>();

export function createSession(user: User): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  sessions.set(token, {
    userId: user.id,
    username: user.username,
    role: user.role,
    expiresAt,
  });
  return token;
}

export function removeSession(token: string): void {
  sessions.delete(token);
}

export function getSession(token: string): SessionInfo | null {
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return session;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || req.headers['x-session-token'];
  let token = '';

  if (typeof authHeader === 'string') {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else {
      token = authHeader.trim();
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Sesi tidak valid atau telah berakhir. Silakan masuk kembali.' });
    return;
  }

  const session = getSession(token);
  if (!session) {
    res.status(401).json({ error: 'Sesi telah kedaluwarsa. Silakan masuk kembali.' });
    return;
  }

  const user = db.findUserById(session.userId);
  if (!user || !user.isActive) {
    res.status(403).json({ error: 'Akun tidak aktif atau tidak ditemukan. Silakan hubungi administrator.' });
    return;
  }

  req.user = user;
  next();
}

export function requireRole(role: Role) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Otorisasi diperlukan.' });
      return;
    }
    if (req.user.role !== role) {
      res.status(403).json({ error: 'Akses ditolak. Anda tidak memiliki izin untuk membuka halaman ini.' });
      return;
    }
    next();
  };
}
