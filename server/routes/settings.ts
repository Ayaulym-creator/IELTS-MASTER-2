import { Router, Response } from 'express';
import { db } from '../db.js';
import { 
  AuthenticatedRequest, 
  authMiddleware, 
  requireSuperAdmin 
} from '../middleware/auth.js';

const router = Router();

// Publicly read platform settings (e.g. siteName, announcement)
router.get('/', (req, res) => {
  const settings = db.getSettings();
  return res.json({ settings });
});

// Update settings strictly restricted to Super Admin
router.put('/', authMiddleware, requireSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);

    db.logActivity({
      actorId: req.user!.id,
      actorName: req.user!.fullName,
      actorEmail: req.user!.email,
      action: 'PLATFORM_SETTINGS_UPDATED',
      targetType: 'settings',
      details: `Platform configuration parameters updated by Super Admin ${req.user!.fullName}.`
    });

    return res.json({ success: true, settings: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
