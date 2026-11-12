import { Router, Response } from 'express';
import { db } from '../db.js';
import { 
  AuthenticatedRequest, 
  authMiddleware, 
  requireSuperAdmin 
} from '../middleware/auth.js';
import { hashPassword, INITIAL_SUPER_ADMIN_EMAIL } from '../seed-data/users.js';
import { User } from '../../src/types/index.js';

const router = Router();

// Strictly restricted to Super Admin
router.use(authMiddleware);
router.use(requireSuperAdmin);

// List all administrators
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const admins = db.getAdmins();
    return res.json({ admins });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Create new administrator
router.post('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fullName, email, password, phoneNumber, permissions } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (db.findUserByEmail(normalizedEmail)) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const defaultPermissions = [
      'manage_content',
      'manage_reading',
      'manage_listening',
      'manage_writing',
      'manage_speaking',
      'manage_grammar',
      'manage_vocabulary',
      'manage_mock_tests',
      'view_students',
      'view_analytics'
    ];

    const newAdmin: User & { passwordHash: string } = {
      id: `usr_adm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      role: 'ADMIN',
      status: 'APPROVED',
      phoneNumber: phoneNumber?.trim() || '',
      englishLevel: 'C1 Advanced',
      targetBandScore: 8.5,
      examType: 'Academic',
      registeredAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      approvedBy: req.user!.id,
      permissions: Array.isArray(permissions) ? permissions : defaultPermissions,
      passwordHash: hashPassword(password)
    };

    db.createUser(newAdmin);

    db.logActivity({
      actorId: req.user!.id,
      actorName: req.user!.fullName,
      actorEmail: req.user!.email,
      action: 'ADMIN_CREATED',
      targetType: 'admin',
      targetId: newAdmin.id,
      details: `Created new administrator ${newAdmin.fullName} (${newAdmin.email}) with ${Array.isArray(newAdmin.permissions) ? newAdmin.permissions.length : Object.keys(newAdmin.permissions || {}).length} permissions.`
    });

    const { passwordHash: _, ...safeAdmin } = newAdmin;
    return res.status(201).json({ success: true, admin: safeAdmin });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Update administrator permissions / profile
router.put('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber, permissions, status } = req.body;

    const admin = db.findUserById(id);
    if (!admin) return res.status(404).json({ error: 'Administrator not found.' });

    // Safeguard Super Admin from privilege revocation
    if (admin.email.toLowerCase() === INITIAL_SUPER_ADMIN_EMAIL.toLowerCase()) {
      if (status && status !== 'APPROVED') {
        return res.status(403).json({ error: 'Cannot deactivate the primary Super Admin account.' });
      }
    }

    const updated = db.updateUser(id, {
      fullName: fullName?.trim() || admin.fullName,
      phoneNumber: phoneNumber !== undefined ? phoneNumber : admin.phoneNumber,
      permissions: Array.isArray(permissions) ? permissions : admin.permissions,
      status: status || admin.status
    });

    db.logActivity({
      actorId: req.user!.id,
      actorName: req.user!.fullName,
      actorEmail: req.user!.email,
      action: 'ADMIN_PERMISSIONS_UPDATED',
      targetType: 'admin',
      targetId: id,
      details: `Updated permissions/status for administrator ${admin.fullName} (${admin.email}).`
    });

    const { passwordHash: _, ...safeAdmin } = updated!;
    return res.json({ success: true, admin: safeAdmin });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete administrator
router.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const admin = db.findUserById(id);
    if (!admin) return res.status(404).json({ error: 'Administrator not found.' });

    if (admin.email.toLowerCase() === INITIAL_SUPER_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ error: 'The primary Super Admin account cannot be deleted.' });
    }

    db.deleteUser(id);

    db.logActivity({
      actorId: req.user!.id,
      actorName: req.user!.fullName,
      actorEmail: req.user!.email,
      action: 'ADMIN_DELETED',
      targetType: 'admin',
      targetId: id,
      details: `Deleted administrator record for ${admin.fullName} (${admin.email}).`
    });

    return res.json({ success: true, message: 'Administrator account deleted.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
