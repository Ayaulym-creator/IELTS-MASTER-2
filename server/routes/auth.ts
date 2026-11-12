import { Router, Response } from 'express';
import { db } from '../db.js';
import { 
  hashPassword, 
  INITIAL_SUPER_ADMIN_EMAIL 
} from '../seed-data/users.js';
import { 
  AuthenticatedRequest, 
  authMiddleware, 
  createSessionToken, 
  revokeSessionToken 
} from '../middleware/auth.js';
import { User } from '../../src/types/index.js';

const router = Router();

// Student Registration
router.post('/register', (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      password, 
      passwordConfirmation, 
      phoneNumber, 
      englishLevel, 
      targetBandScore, 
      examType 
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email address, and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters in length.' });
    }

    if (passwordConfirmation && password !== passwordConfirmation) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = db.findUserByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    // Role cannot be escalated through public registration
    const newUser: User & { passwordHash: string } = {
      id: `usr_stu_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      role: 'STUDENT',
      status: 'PENDING_APPROVAL', // Strict requirement: must require Super Admin approval
      phoneNumber: phoneNumber?.trim() || '',
      englishLevel: englishLevel || 'B2 Upper-Intermediate',
      targetBandScore: Number(targetBandScore) || 7.0,
      examType: examType === 'General Training' ? 'General Training' : 'Academic',
      registeredAt: new Date().toISOString(),
      passwordHash: hashPassword(password)
    };

    db.createUser(newUser);

    // Log registration request for Super Admin dashboard
    db.logActivity({
      actorId: newUser.id,
      actorName: newUser.fullName,
      actorEmail: newUser.email,
      action: 'STUDENT_REGISTRATION_SUBMITTED',
      targetType: 'student',
      targetId: newUser.id,
      details: `New registration submitted by ${newUser.fullName} (${newUser.email}). Awaiting Super Admin approval.`
    });

    const { passwordHash: _, ...safeUser } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Your registration has been submitted successfully and is currently PENDING SUPER ADMIN APPROVAL. An administrator will verify your profile before learning platform access is granted.',
      user: safeUser
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error during registration.' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email address and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email address or password.' });
    }

    const hashedInput = hashPassword(password);
    if (user.passwordHash !== hashedInput) {
      return res.status(401).json({ error: 'Invalid email address or password.' });
    }

    // Check account status
    if (user.role === 'STUDENT') {
      if (user.status === 'PENDING_APPROVAL') {
        return res.status(403).json({
          error: 'PENDING_APPROVAL',
          status: 'PENDING_APPROVAL',
          message: 'Your registration is currently pending Super Admin approval. You will gain access once an administrator verifies and approves your account.'
        });
      }

      if (user.status === 'REJECTED') {
        return res.status(403).json({
          error: 'ACCOUNT_REJECTED',
          status: 'REJECTED',
          message: 'Your registration application was not approved. Please contact admissions@ieltsmaster.kz if you believe this is in error.'
        });
      }

      if (user.status === 'SUSPENDED') {
        return res.status(403).json({
          error: 'ACCOUNT_SUSPENDED',
          status: 'SUSPENDED',
          message: 'Your student account has been temporarily suspended by an administrator. Please contact support.'
        });
      }

      if (user.status === 'DEACTIVATED') {
        return res.status(403).json({
          error: 'ACCOUNT_DEACTIVATED',
          status: 'DEACTIVATED',
          message: 'This account has been deactivated. Please contact the platform administrators.'
        });
      }
    }

    // Successful authentication
    const token = createSessionToken(user.id);
    db.updateUser(user.id, { lastLoginAt: new Date().toISOString() });

    db.logActivity({
      actorId: user.id,
      actorName: user.fullName,
      actorEmail: user.email,
      action: 'USER_LOGIN',
      targetType: 'auth',
      details: `${user.role} login verified for ${user.fullName} (${user.email}).`
    });

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      success: true,
      token,
      user: safeUser
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Current User Profile
router.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ user: req.user });
});

// Logout
router.post('/logout', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    revokeSessionToken(authHeader.split(' ')[1]);
  }
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// First-time Super Admin Setup / Password Update
router.post('/setup-super-admin', (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required.' });
    }

    if (email.trim().toLowerCase() !== INITIAL_SUPER_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ error: 'Super Admin initialization is strictly restricted to the platform owner.' });
    }

    const superAdmin = db.findUserByEmail(INITIAL_SUPER_ADMIN_EMAIL);
    if (!superAdmin) {
      return res.status(404).json({ error: 'Super Admin record not initialized.' });
    }

    // Verify current password if already modified
    if (currentPassword && superAdmin.passwordHash !== hashPassword(currentPassword)) {
      return res.status(401).json({ error: 'Current password verification failed.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters.' });
    }

    db.updateUser(superAdmin.id, {
      passwordHash: hashPassword(newPassword),
      lastLoginAt: new Date().toISOString()
    });

    db.logActivity({
      actorId: superAdmin.id,
      actorName: superAdmin.fullName,
      actorEmail: superAdmin.email,
      action: 'SUPER_ADMIN_CREDENTIALS_INITIALIZED',
      targetType: 'admin',
      targetId: superAdmin.id,
      details: 'Super Admin credentials successfully initialized/updated by platform owner.'
    });

    const token = createSessionToken(superAdmin.id);
    const { passwordHash: _, ...safeUser } = superAdmin;

    return res.json({
      success: true,
      message: 'Super Admin credentials configured successfully.',
      token,
      user: safeUser
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
});

// Password recovery simulation (records log and sends reset acknowledgment)
router.post('/recover-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const user = db.findUserByEmail(email.trim().toLowerCase());
  if (user) {
    db.logActivity({
      actorId: user.id,
      actorName: user.fullName,
      actorEmail: user.email,
      action: 'PASSWORD_RECOVERY_REQUESTED',
      targetType: 'auth',
      details: `Password recovery instructions generated for ${user.email}.`
    });
  }

  return res.json({
    success: true,
    message: 'If an account exists with this email address, password recovery instructions have been transmitted.'
  });
});

export default router;
