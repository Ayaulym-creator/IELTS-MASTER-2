import { Router, Response } from 'express';
import { db } from '../db.js';
import { 
  AuthenticatedRequest, 
  authMiddleware, 
  requireAdmin 
} from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const limit = Number(req.query.limit) || 100;
  const logs = db.getLogs(limit);
  return res.json({ logs });
});

export default router;
