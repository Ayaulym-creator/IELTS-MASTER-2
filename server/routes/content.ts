import { Router, Response } from 'express';
import { db } from '../db.js';
import { 
  AuthenticatedRequest, 
  authMiddleware, 
  requireApprovedStudent, 
  requireAdmin 
} from '../middleware/auth.js';

const router = Router();

// Content retrieval requires approved authentication
router.use(authMiddleware);
router.use(requireApprovedStudent);

// --- Reading ---
router.get('/reading', (req: AuthenticatedRequest, res: Response) => {
  const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  const tasks = db.getReadingTasks(!isStaff);
  return res.json({ tasks });
});

router.get('/reading/:id', (req: AuthenticatedRequest, res: Response) => {
  const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  const task = db.getReadingTaskById(req.params.id);
  if (!task || (!task.isPublished && !isStaff)) {
    return res.status(404).json({ error: 'Reading task not found or not published.' });
  }
  return res.json({ task });
});

router.put('/reading/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateReadingTask(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Reading task not found.' });

  db.logActivity({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorEmail: req.user!.email,
    action: 'CONTENT_UPDATED_READING',
    targetType: 'content',
    targetId: req.params.id,
    details: `Updated Reading Task: ${updated.title}`
  });

  return res.json({ task: updated });
});

// --- Listening ---
router.get('/listening', (req: AuthenticatedRequest, res: Response) => {
  const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  const tasks = db.getListeningTasks(!isStaff);
  return res.json({ tasks });
});

router.get('/listening/:id', (req: AuthenticatedRequest, res: Response) => {
  const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  const task = db.getListeningTaskById(req.params.id);
  if (!task || (!task.isPublished && !isStaff)) {
    return res.status(404).json({ error: 'Listening task not found or not published.' });
  }
  return res.json({ task });
});

router.put('/listening/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateListeningTask(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Listening task not found.' });

  db.logActivity({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorEmail: req.user!.email,
    action: 'CONTENT_UPDATED_LISTENING',
    targetType: 'content',
    targetId: req.params.id,
    details: `Updated Listening Task: ${updated.title}`
  });

  return res.json({ task: updated });
});

// --- Writing ---
router.get('/writing', (req: AuthenticatedRequest, res: Response) => {
  const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  const tasks = db.getWritingTasks(!isStaff);
  return res.json({ tasks });
});

router.get('/writing/:id', (req: AuthenticatedRequest, res: Response) => {
  const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  const task = db.getWritingTaskById(req.params.id);
  if (!task || (!task.isPublished && !isStaff)) {
    return res.status(404).json({ error: 'Writing task not found or not published.' });
  }
  return res.json({ task });
});

router.put('/writing/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateWritingTask(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Writing task not found.' });

  db.logActivity({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorEmail: req.user!.email,
    action: 'CONTENT_UPDATED_WRITING',
    targetType: 'content',
    targetId: req.params.id,
    details: `Updated Writing Task: ${updated.title}`
  });

  return res.json({ task: updated });
});

// --- Speaking ---
router.get('/speaking', (req: AuthenticatedRequest, res: Response) => {
  const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  const tasks = db.getSpeakingTasks(!isStaff);
  return res.json({ tasks });
});

router.get('/speaking/:id', (req: AuthenticatedRequest, res: Response) => {
  const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  const task = db.getSpeakingTaskById(req.params.id);
  if (!task || (!task.isPublished && !isStaff)) {
    return res.status(404).json({ error: 'Speaking task not found or not published.' });
  }
  return res.json({ task });
});

router.put('/speaking/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateSpeakingTask(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Speaking task not found.' });

  db.logActivity({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorEmail: req.user!.email,
    action: 'CONTENT_UPDATED_SPEAKING',
    targetType: 'content',
    targetId: req.params.id,
    details: `Updated Speaking Task: ${updated.title}`
  });

  return res.json({ task: updated });
});

// --- Grammar ---
router.get('/grammar', (req: AuthenticatedRequest, res: Response) => {
  const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  const tasks = db.getGrammarTasks(!isStaff);
  return res.json({ tasks });
});

router.get('/grammar/:id', (req: AuthenticatedRequest, res: Response) => {
  const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  const task = db.getGrammarTaskById(req.params.id);
  if (!task || (!task.isPublished && !isStaff)) {
    return res.status(404).json({ error: 'Grammar unit not found or not published.' });
  }
  return res.json({ task });
});

router.put('/grammar/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateGrammarTask(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Grammar unit not found.' });

  db.logActivity({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorEmail: req.user!.email,
    action: 'CONTENT_UPDATED_GRAMMAR',
    targetType: 'content',
    targetId: req.params.id,
    details: `Updated Grammar Unit: ${updated.topic}`
  });

  return res.json({ task: updated });
});

// --- Vocabulary ---
router.get('/vocabulary', (req: AuthenticatedRequest, res: Response) => {
  const words = db.getVocabulary(req.user?.id);
  return res.json({ words });
});

router.post('/vocabulary/:id/favorite', (req: AuthenticatedRequest, res: Response) => {
  const isFav = db.toggleVocabularyFavorite(req.user!.id, req.params.id);
  return res.json({ isFavorite: isFav });
});

router.post('/vocabulary/:id/progress', (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  if (!['new', 'learning', 'review', 'mastered'].includes(status)) {
    return res.status(400).json({ error: 'Invalid learning status.' });
  }
  const updated = db.updateVocabularyProgress(req.user!.id, req.params.id, status);
  return res.json({ status: updated });
});

// --- Mock Tests ---
router.get('/mock-tests', (req: AuthenticatedRequest, res: Response) => {
  const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  const mockTests = db.getMockTests(!isStaff);
  return res.json({ mockTests });
});

router.get('/mock-tests/:id', (req: AuthenticatedRequest, res: Response) => {
  const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
  const mockTest = db.getMockTestById(req.params.id);
  if (!mockTest || (!mockTest.isPublished && !isStaff)) {
    return res.status(404).json({ error: 'Mock test not found or not published.' });
  }

  // Populate linked tasks for full mock experience
  const reading = db.getReadingTaskById(mockTest.readingTaskId);
  const listening = db.getListeningTaskById(mockTest.listeningTaskId);
  const writing1 = db.getWritingTaskById(mockTest.writingTask1Id);
  const writing2 = db.getWritingTaskById(mockTest.writingTask2Id);
  const speaking = db.getSpeakingTaskById(mockTest.speakingTaskId);

  return res.json({
    mockTest,
    sections: {
      reading,
      listening,
      writing1,
      writing2,
      speaking
    }
  });
});

export default router;
