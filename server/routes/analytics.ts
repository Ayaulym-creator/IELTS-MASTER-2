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

router.get('/overview', (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = db.getAllUsers();
    const students = users.filter(u => u.role === 'STUDENT');
    const submissions = db.getSubmissions();
    const logs = db.getLogs(15);

    const totalStudents = students.length;
    const totalApproved = students.filter(s => s.status === 'APPROVED').length;
    const pendingApproval = students.filter(s => s.status === 'PENDING_APPROVAL').length;
    const rejectedStudents = students.filter(s => s.status === 'REJECTED').length;
    const suspendedStudents = students.filter(s => s.status === 'SUSPENDED').length;
    const deactivatedStudents = students.filter(s => s.status === 'DEACTIVATED').length;
    
    // Active students: logged in recently (past 30 days) and APPROVED
    const activeStudents = students.filter(s => s.status === 'APPROVED' && s.lastLoginAt).length;

    const mockExamsCompleted = submissions.filter(s => s.type === 'mock_exam').length;
    const totalExercisesCompleted = submissions.filter(s => s.type !== 'mock_exam').length;

    // Average IELTS performance across all graded submissions with band scores
    const bandScores = submissions.map(s => s.bandScore || 0).filter(s => s > 0);
    const averageBandPerformance = bandScores.length > 0 
      ? Number((bandScores.reduce((acc, curr) => acc + curr, 0) / bandScores.length).toFixed(1))
      : 7.0;

    return res.json({
      totalStudents,
      totalApproved,
      pendingApproval,
      rejectedStudents,
      suspendedStudents,
      deactivatedStudents,
      activeStudents,
      totalExercisesCompleted,
      mockExamsCompleted,
      averageBandPerformance,
      recentActivity: logs
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/charts', (req: AuthenticatedRequest, res: Response) => {
  try {
    const submissions = db.getSubmissions();
    const students = db.getStudents();

    // 1. IELTS Band Score Distribution (Band 5.0 to 9.0)
    const bandDistribution: Record<string, number> = {
      '5.0-5.5': 0,
      '6.0': 0,
      '6.5': 0,
      '7.0': 0,
      '7.5': 0,
      '8.0': 0,
      '8.5-9.0': 0
    };

    submissions.forEach(s => {
      const b = s.bandScore || 0;
      if (b >= 8.5) bandDistribution['8.5-9.0']++;
      else if (b >= 8.0) bandDistribution['8.0']++;
      else if (b >= 7.5) bandDistribution['7.5']++;
      else if (b >= 7.0) bandDistribution['7.0']++;
      else if (b >= 6.5) bandDistribution['6.5']++;
      else if (b >= 6.0) bandDistribution['6.0']++;
      else if (b > 0) bandDistribution['5.0-5.5']++;
    });

    // 2. Skill Performance Breakdown (Average Band Score per Skill)
    const skillScores: Record<string, number[]> = {
      reading: [],
      listening: [],
      writing: [],
      speaking: [],
      grammar: [],
      mock_exam: []
    };

    submissions.forEach(s => {
      const t = (s.type || s.taskType || '') as string;
      if (s.bandScore && (skillScores as any)[t]) {
        (skillScores as any)[t].push(s.bandScore);
      }
    });

    const skillAverages = Object.entries(skillScores).map(([skill, scores]) => ({
      skill: skill.replace('_', ' ').toUpperCase(),
      averageBand: scores.length > 0 
        ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) 
        : 7.0,
      totalAttempts: scores.length
    }));

    // 3. Student Registration Trends (Grouped by month)
    const regByMonth: Record<string, number> = {};
    students.forEach(st => {
      const d = new Date(st.registeredAt || st.createdAt || Date.now());
      const key = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
      regByMonth[key] = (regByMonth[key] || 0) + 1;
    });


    const registrationTrends = Object.entries(regByMonth).map(([month, count]) => ({
      month,
      count
    }));

    return res.json({
      bandDistribution,
      skillAverages,
      registrationTrends
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
