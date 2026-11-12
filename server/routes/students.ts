import { Router, Response } from 'express';
import { db } from '../db.js';
import { 
  AuthenticatedRequest, 
  authMiddleware, 
  requireAdmin, 
  requireSuperAdmin 
} from '../middleware/auth.js';

const router = Router();

// All routes require at least ADMIN privileges
router.use(authMiddleware);
router.use(requireAdmin);

// List all students with search, status filters, and sorting
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search, examType, sortBy = 'registeredAt', order = 'desc' } = req.query;

    let students = db.getStudents();

    if (status && status !== 'ALL') {
      students = students.filter(s => s.status === status);
    }

    if (examType && examType !== 'ALL') {
      students = students.filter(s => s.examType === examType);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      students = students.filter(s => 
        s.fullName.toLowerCase().includes(q) || 
        s.email.toLowerCase().includes(q) ||
        (s.phoneNumber && s.phoneNumber.toLowerCase().includes(q))
      );
    }

    // Sort
    students.sort((a, b) => {
      let valA = (a as any)[sortBy as string] || '';
      let valB = (b as any)[sortBy as string] || '';
      if (order === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    // Attach submission counts to each student record
    const submissions = db.getSubmissions();
    const studentsWithStats = students.map(st => {
      const studentSubs = submissions.filter(s => s.studentId === st.id);
      const mockCount = studentSubs.filter(s => s.type === 'mock_exam').length;
      const completedExercises = studentSubs.filter(s => s.type !== 'mock_exam').length;
      
      let avgScore = 0;
      if (studentSubs.length > 0) {
        const scores = studentSubs.map(s => s.bandScore || 0).filter(s => s > 0);
        if (scores.length > 0) {
          avgScore = Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));
        }
      }

      return {
        ...st,
        completedExercises,
        completedMockExams: mockCount,
        averageBandScore: avgScore || null
      };
    });

    return res.json({ students: studentsWithStats });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to retrieve students.' });
  }
});

// Pending registrations specifically
router.get('/pending', (req: AuthenticatedRequest, res: Response) => {
  try {
    const pending = db.getPendingStudents();
    return res.json({ pending, students: pending });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Single student profile with full activity and submissions
router.get('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = db.findUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const { passwordHash: _, ...student } = user;
    const submissions = db.getSubmissions(id);
    const logs = db.getLogs(200).filter(l => l.targetId === id || l.actorId === id);

    return res.json({
      student,
      submissions,
      logs
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Approve student registration
router.post('/:id/approve', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const student = db.findUserById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student account not found.' });
    }

    const updated = db.updateUser(id, {
      status: 'APPROVED',
      approvedAt: new Date().toISOString(),
      approvedBy: req.user!.id
    });

    db.logActivity({
      actorId: req.user!.id,
      actorName: req.user!.fullName,
      actorEmail: req.user!.email,
      action: 'STUDENT_APPROVAL',
      targetType: 'student',
      targetId: id,
      details: `Approved student registration for ${student.fullName} (${student.email}) by ${req.user!.fullName}.`
    });

    const { passwordHash: _, ...safeUser } = updated!;
    return res.json({ success: true, student: safeUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Reject student registration
router.post('/:id/reject', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const student = db.findUserById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student account not found.' });
    }

    const updated = db.updateUser(id, { status: 'REJECTED' });

    db.logActivity({
      actorId: req.user!.id,
      actorName: req.user!.fullName,
      actorEmail: req.user!.email,
      action: 'STUDENT_REJECTION',
      targetType: 'student',
      targetId: id,
      details: `Rejected registration for ${student.fullName} (${student.email}). Reason: ${reason || 'Application criteria unmet'}.`
    });

    const { passwordHash: _, ...safeUser } = updated!;
    return res.json({ success: true, student: safeUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Suspend student
router.post('/:id/suspend', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const student = db.findUserById(id);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const updated = db.updateUser(id, { status: 'SUSPENDED' });

    db.logActivity({
      actorId: req.user!.id,
      actorName: req.user!.fullName,
      actorEmail: req.user!.email,
      action: 'STUDENT_SUSPENSION',
      targetType: 'student',
      targetId: id,
      details: `Suspended account access for ${student.fullName} (${student.email}).`
    });

    const { passwordHash: _, ...safeUser } = updated!;
    return res.json({ success: true, student: safeUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Restore / Activate student to APPROVED
router.post('/:id/restore', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const student = db.findUserById(id);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const updated = db.updateUser(id, { 
      status: 'APPROVED',
      approvedAt: student.approvedAt || new Date().toISOString(),
      approvedBy: student.approvedBy || req.user!.id
    });

    db.logActivity({
      actorId: req.user!.id,
      actorName: req.user!.fullName,
      actorEmail: req.user!.email,
      action: 'STUDENT_RESTORED',
      targetType: 'student',
      targetId: id,
      details: `Restored full active access for ${student.fullName} (${student.email}).`
    });

    const { passwordHash: _, ...safeUser } = updated!;
    return res.json({ success: true, student: safeUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Deactivate student
router.post('/:id/deactivate', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const student = db.findUserById(id);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const updated = db.updateUser(id, { status: 'DEACTIVATED' });

    db.logActivity({
      actorId: req.user!.id,
      actorName: req.user!.fullName,
      actorEmail: req.user!.email,
      action: 'STUDENT_DEACTIVATION',
      targetType: 'student',
      targetId: id,
      details: `Deactivated student account for ${student.fullName} (${student.email}).`
    });

    const { passwordHash: _, ...safeUser } = updated!;
    return res.json({ success: true, student: safeUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Edit student details
router.put('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber, englishLevel, targetBandScore, examType } = req.body;

    const student = db.findUserById(id);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const updated = db.updateUser(id, {
      fullName: fullName?.trim() || student.fullName,
      phoneNumber: phoneNumber !== undefined ? phoneNumber : student.phoneNumber,
      englishLevel: englishLevel || student.englishLevel,
      targetBandScore: targetBandScore ? Number(targetBandScore) : student.targetBandScore,
      examType: examType || student.examType
    });

    db.logActivity({
      actorId: req.user!.id,
      actorName: req.user!.fullName,
      actorEmail: req.user!.email,
      action: 'STUDENT_PROFILE_UPDATED',
      targetType: 'student',
      targetId: id,
      details: `Updated profile details for student ${student.fullName} (${student.email}).`
    });

    const { passwordHash: _, ...safeUser } = updated!;
    return res.json({ success: true, student: safeUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete student account (Super Admin only for safety)
router.delete('/:id', requireSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const student = db.findUserById(id);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    db.deleteUser(id);

    db.logActivity({
      actorId: req.user!.id,
      actorName: req.user!.fullName,
      actorEmail: req.user!.email,
      action: 'STUDENT_ACCOUNT_DELETED',
      targetType: 'student',
      targetId: id,
      details: `Deleted student record for ${student.fullName} (${student.email}).`
    });

    return res.json({ success: true, message: 'Student account deleted permanently.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
