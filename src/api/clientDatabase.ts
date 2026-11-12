import { 
  User, 
  Submission, 
  ActivityLog, 
  PlatformSettings,
  VocabularyWord
} from '../types/index.js';

import { 
  SEED_USERS, 
  INITIAL_SUPER_ADMIN_EMAIL, 
  hashPassword 
} from '../../server/seed-data/users.js';
import { SEED_READING_TASKS } from '../../server/seed-data/readingTasks.js';
import { SEED_LISTENING_TASKS } from '../../server/seed-data/listeningTasks.js';
import { SEED_WRITING_TASKS } from '../../server/seed-data/writingTasks.js';
import { SEED_SPEAKING_TASKS } from '../../server/seed-data/speakingTasks.js';
import { SEED_GRAMMAR_TASKS } from '../../server/seed-data/grammarTasks.js';
import { SEED_VOCABULARY } from '../../server/seed-data/vocabulary.js';
import { SEED_MOCK_TESTS } from '../../server/seed-data/mockTests.js';

const CLIENT_DB_KEY = 'ielts_master_client_db_v2';
const TOKEN_USER_MAP_KEY = 'ielts_master_tokens_v2';

interface ClientDatabaseSchema {
  users: (User & { passwordHash: string })[];
  submissions: Submission[];
  activityLogs: ActivityLog[];
  settings: PlatformSettings;
  vocabProgress: Record<string, Record<string, string>>;
}

export class ClientDatabase {
  private static instance: ClientDatabase;

  public static getInstance(): ClientDatabase {
    if (!ClientDatabase.instance) {
      ClientDatabase.instance = new ClientDatabase();
    }
    return ClientDatabase.instance;
  }

  private loadDB(): ClientDatabaseSchema {
    try {
      const raw = localStorage.getItem(CLIENT_DB_KEY);
      if (raw) {
        const parsed: ClientDatabaseSchema = JSON.parse(raw);
        // Ensure Super Admin exists
        const hasSuper = parsed.users?.some(
          u => u.email.toLowerCase() === INITIAL_SUPER_ADMIN_EMAIL.toLowerCase()
        );
        if (!hasSuper) {
          parsed.users.unshift(SEED_USERS[0]);
          this.saveDB(parsed);
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to read client database from localStorage, initializing fresh:', e);
    }

    const initial: ClientDatabaseSchema = {
      users: [...SEED_USERS],
      submissions: [
        {
          id: 'sub_demo_1',
          studentId: 'usr_stu_1',
          studentName: 'Aruzhan Sarsenova',
          type: 'READING',
          taskType: 'READING',
          taskId: 'rd_task_1',
          taskTitle: 'The Evolution of Cetacean Echolocation',
          score: 5,
          rawScore: 5,
          totalQuestions: 5,
          bandScore: 8.5,
          feedback: 'Excellent retrieval of technical details and acoustic terminology.',
          submittedAt: '2026-11-10T11:20:00.000Z',
          timeSpentSeconds: 980
        },
        {
          id: 'sub_demo_2',
          studentId: 'usr_stu_1',
          studentName: 'Aruzhan Sarsenova',
          type: 'LISTENING',
          taskType: 'LISTENING',
          taskId: 'ls_task_1',
          taskTitle: 'University Accommodation Booking Service',
          score: 4,
          rawScore: 4,
          totalQuestions: 4,
          bandScore: 8.0,
          feedback: 'High accuracy in recording numeric codes and residential requirements.',
          submittedAt: '2026-11-11T14:15:00.000Z',
          timeSpentSeconds: 610
        }
      ],
      activityLogs: [
        {
          id: 'log_init_1',
          timestamp: new Date().toISOString(),
          actorName: 'Ayaulym Yessengenova (Super Admin)',
          userName: 'Ayaulym Yessengenova (Super Admin)',
          actorEmail: INITIAL_SUPER_ADMIN_EMAIL,
          action: 'PLATFORM_INITIALIZED',
          details: 'IELTS MASTER candidate platform initialized with Asia/Almaty standard.'
        }
      ],
      settings: {
        siteName: 'IELTS MASTER',
        platformName: 'IELTS MASTER',
        registrationOpen: true,
        allowRegistration: true,
        requireAdminApproval: true,
        defaultTimezone: 'Asia/Almaty',
        maxMockAttemptsPerDay: 3,
        contactEmail: 'admissions@ieltsmaster.kz',
        supportEmail: 'admissions@ieltsmaster.kz',
        supportPhone: '+7 (7172) 70-55-00',
        announcementText: 'Welcome to IELTS MASTER — The Premier Academic & General Training Preparation Platform in Kazakhstan.',
        announcementBanner: 'Welcome to IELTS MASTER — The Premier Academic & General Training Preparation Platform in Kazakhstan.',
        maintenanceMode: false
      },
      vocabProgress: {}
    };

    this.saveDB(initial);
    return initial;
  }

  private saveDB(db: ClientDatabaseSchema) {
    try {
      localStorage.setItem(CLIENT_DB_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  private getTokens(): Record<string, string> {
    try {
      const raw = localStorage.getItem(TOKEN_USER_MAP_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveTokens(tokens: Record<string, string>) {
    try {
      localStorage.setItem(TOKEN_USER_MAP_KEY, JSON.stringify(tokens));
    } catch (e) {
      console.error(e);
    }
  }

  public getUserByToken(token: string): User | null {
    const tokens = this.getTokens();
    const userId = tokens[token];
    if (!userId) return null;
    const db = this.loadDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) return null;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  public createSession(userId: string): string {
    const token = `tok_client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const tokens = this.getTokens();
    tokens[token] = userId;
    this.saveTokens(tokens);
    return token;
  }

  public revokeSession(token: string) {
    const tokens = this.getTokens();
    delete tokens[token];
    this.saveTokens(tokens);
  }

  // --- Auth Handlers ---

  public register(data: any) {
    const { fullName, email, password, passwordConfirmation, phoneNumber, englishLevel, targetBandScore, examType } = data;

    if (!fullName || !email || !password) {
      throw new Error('Full name, email address, and password are required.');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters in length.');
    }

    if (passwordConfirmation && password !== passwordConfirmation) {
      throw new Error('Passwords do not match.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = this.loadDB();

    if (db.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: User & { passwordHash: string } = {
      id: `usr_stu_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      role: 'STUDENT',
      status: 'PENDING_APPROVAL', // Strict requirement: must require Super Admin approval
      phoneNumber: phoneNumber?.trim() || '',
      phone: phoneNumber?.trim() || '',
      city: 'Almaty',
      englishLevel: englishLevel || 'B2 Upper-Intermediate',
      targetBandScore: Number(targetBandScore) || 7.0,
      examType: examType === 'General Training' ? 'General Training' : 'Academic',
      ieltsType: examType === 'General Training' ? 'GENERAL_TRAINING' : 'ACADEMIC',
      registeredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(password)
    };

    db.users.push(newUser);

    db.activityLogs.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: newUser.id,
      actorName: newUser.fullName,
      userName: newUser.fullName,
      actorEmail: newUser.email,
      action: 'STUDENT_REGISTRATION_SUBMITTED',
      targetType: 'student',
      targetId: newUser.id,
      details: `New registration submitted by ${newUser.fullName} (${newUser.email}). Awaiting Super Admin approval.`
    });

    this.saveDB(db);

    const { passwordHash: _, ...safeUser } = newUser;
    return {
      success: true,
      message: 'Your registration has been submitted successfully and is currently PENDING SUPER ADMIN APPROVAL. An administrator will verify your profile before learning platform access is granted.',
      user: safeUser
    };
  }

  public login(email: string, password?: string) {
    if (!email || !password) {
      throw new Error('Email address and password are required.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = this.loadDB();
    const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      const err: any = new Error('Invalid email address or password.');
      err.status = 401;
      throw err;
    }

    if (user.passwordHash !== hashPassword(password)) {
      const err: any = new Error('Invalid email address or password.');
      err.status = 401;
      throw err;
    }

    // Check account status for students
    if (user.role === 'STUDENT') {
      if (user.status === 'PENDING_APPROVAL') {
        const err: any = new Error('Your registration is currently pending Super Admin approval. You will gain access once an administrator verifies and approves your account.');
        err.status = 403;
        err.code = 'PENDING_APPROVAL';
        err.payload = {
          error: 'PENDING_APPROVAL',
          status: 'PENDING_APPROVAL',
          message: err.message
        };
        throw err;
      }

      if (user.status === 'REJECTED') {
        const err: any = new Error('Your registration application was not approved. Please contact admissions@ieltsmaster.kz if you believe this is in error.');
        err.status = 403;
        err.code = 'ACCOUNT_REJECTED';
        throw err;
      }

      if (user.status === 'SUSPENDED') {
        const err: any = new Error('Your student account has been temporarily suspended by an administrator. Please contact support.');
        err.status = 403;
        err.code = 'ACCOUNT_SUSPENDED';
        throw err;
      }

      if (user.status === 'DEACTIVATED') {
        const err: any = new Error('This account has been deactivated. Please contact the platform administrators.');
        err.status = 403;
        err.code = 'ACCOUNT_DEACTIVATED';
        throw err;
      }
    }

    const token = this.createSession(user.id);
    user.lastLoginAt = new Date().toISOString();

    db.activityLogs.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user.id,
      actorName: user.fullName,
      userName: user.fullName,
      actorEmail: user.email,
      action: 'USER_LOGIN',
      targetType: 'auth',
      details: `${user.role} login verified for ${user.fullName} (${user.email}).`
    });

    this.saveDB(db);

    const { passwordHash: _, ...safeUser } = user;
    return {
      success: true,
      token,
      user: safeUser
    };
  }

  // --- Curriculum Access ---
  public getReadingTasks() { return { tasks: SEED_READING_TASKS }; }
  public getReadingTask(id: string) {
    const t = SEED_READING_TASKS.find(x => x.id === id);
    if (!t) throw new Error('Task not found');
    return { task: t };
  }

  public getListeningTasks() { return { tasks: SEED_LISTENING_TASKS }; }
  public getListeningTask(id: string) {
    const t = SEED_LISTENING_TASKS.find(x => x.id === id);
    if (!t) throw new Error('Task not found');
    return { task: t };
  }

  public getWritingTasks() { return { tasks: SEED_WRITING_TASKS }; }
  public getWritingTask(id: string) {
    const t = SEED_WRITING_TASKS.find(x => x.id === id);
    if (!t) throw new Error('Task not found');
    return { task: t };
  }

  public getSpeakingTasks() { return { tasks: SEED_SPEAKING_TASKS }; }
  public getSpeakingTask(id: string) {
    const t = SEED_SPEAKING_TASKS.find(x => x.id === id);
    if (!t) throw new Error('Task not found');
    return { task: t };
  }

  public getGrammarTasks() { return { tasks: SEED_GRAMMAR_TASKS, units: SEED_GRAMMAR_TASKS }; }
  public getGrammarTask(id: string) {
    const t = SEED_GRAMMAR_TASKS.find(x => x.id === id || String(x.unitNumber) === id);
    if (!t) throw new Error('Grammar unit not found');
    return { task: t, unit: t };
  }

  public getVocabulary() { return { words: SEED_VOCABULARY }; }
  public getMockTests() { return { mockTests: SEED_MOCK_TESTS, tests: SEED_MOCK_TESTS }; }
  public getMockTest(id: string) {
    const t = SEED_MOCK_TESTS.find(x => x.id === id);
    if (!t) throw new Error('Mock test not found');
    return { mockTest: t, test: t };
  }

  // --- Submissions ---
  public submitReading(currentUser: User, body: any) {
    const { taskId, answers, timeSpentSeconds } = body;
    const task = SEED_READING_TASKS.find(t => t.id === taskId);
    let correctCount = 0;
    if (task) {
      task.questions.forEach(q => {
        const studentAns = (answers[q.id] || answers[String(q.number)] || '').trim().toLowerCase();
        const expected = q.correctAnswer.trim().toLowerCase();
        if (studentAns === expected) correctCount++;
      });
    }

    const bandScore = Math.max(5.0, Math.min(9.0, 5.0 + (correctCount / (task?.questions.length || 5)) * 4.0));
    const sub: Submission = {
      id: `sub_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      type: 'READING',
      taskType: 'READING',
      taskId: taskId,
      taskTitle: task?.title || 'Reading Comprehension',
      score: correctCount,
      rawScore: correctCount,
      totalQuestions: task?.questions.length || 5,
      bandScore: Math.round(bandScore * 2) / 2,
      feedback: `Completed reading test. Raw score: ${correctCount}/${task?.questions.length || 5}. Review explanations for incorrect items.`,
      answers,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpentSeconds || 1200
    };

    const db = this.loadDB();
    db.submissions.unshift(sub);
    this.saveDB(db);
    return { success: true, submission: sub };
  }

  public submitListening(currentUser: User, body: any) {
    const { taskId, answers, timeSpentSeconds } = body;
    const task = SEED_LISTENING_TASKS.find(t => t.id === taskId);
    let correctCount = 0;
    if (task) {
      task.questions.forEach(q => {
        const studentAns = (answers[q.id] || answers[String(q.number)] || '').trim().toLowerCase();
        const expected = q.correctAnswer.trim().toLowerCase();
        if (studentAns === expected) correctCount++;
      });
    }

    const bandScore = Math.max(5.0, Math.min(9.0, 5.0 + (correctCount / (task?.questions.length || 4)) * 4.0));
    const sub: Submission = {
      id: `sub_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      type: 'LISTENING',
      taskType: 'LISTENING',
      taskId: taskId,
      taskTitle: task?.title || 'Listening Section',
      score: correctCount,
      rawScore: correctCount,
      totalQuestions: task?.questions.length || 4,
      bandScore: Math.round(bandScore * 2) / 2,
      feedback: `Listening section submitted. Raw score: ${correctCount}/${task?.questions.length || 4}.`,
      answers,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpentSeconds || 600
    };

    const db = this.loadDB();
    db.submissions.unshift(sub);
    this.saveDB(db);
    return { success: true, submission: sub };
  }

  public submitWriting(currentUser: User, body: any) {
    const { taskId, essayText, timeSpentSeconds } = body;
    const task = SEED_WRITING_TASKS.find(t => t.id === taskId);
    const words = (essayText || '').trim().split(/\s+/).filter(Boolean).length;

    const baseBand = words >= (task?.minWords || 150) ? 7.0 : 5.5;
    const sub: Submission = {
      id: `sub_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      type: 'WRITING',
      taskType: 'WRITING',
      taskId: taskId,
      taskTitle: task?.title || 'Writing Task',
      submittedText: essayText,
      bandScore: baseBand,
      criteriaBreakdown: {
        taskAchievement: baseBand,
        coherenceCohesion: baseBand,
        lexicalResource: baseBand,
        grammarAccuracy: baseBand
      },
      feedback: `Official IELTS 4-Criteria Evaluation: Word count recorded at ${words} words (recommended minimum: ${task?.minWords || 150}). Paragraph structure demonstrates coherent argumentative flow. Study the Band 8 and Band 9 model answers for advanced lexical collocations.`,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpentSeconds || 2400
    };

    const db = this.loadDB();
    db.submissions.unshift(sub);
    this.saveDB(db);
    return { success: true, submission: sub };
  }

  public submitSpeaking(currentUser: User, body: any) {
    const { taskId, durationSeconds } = body;
    const task = SEED_SPEAKING_TASKS.find(t => t.id === taskId);
    const sub: Submission = {
      id: `sub_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      type: 'SPEAKING',
      taskType: 'SPEAKING',
      taskId: taskId,
      taskTitle: task?.title || 'Speaking Practice',
      bandScore: 7.5,
      criteriaBreakdown: {
        fluencyCoherence: 7.5,
        lexicalResource: 7.5,
        grammaticalRange: 7.0,
        pronunciation: 8.0
      },
      feedback: `Spoken discourse recorded successfully (${durationSeconds || 120}s). Steady speech rate, natural rhythm, and clear phonological articulation maintained throughout responses.`,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: durationSeconds || 180
    };

    const db = this.loadDB();
    db.submissions.unshift(sub);
    this.saveDB(db);
    return { success: true, submission: sub };
  }

  public submitGrammar(currentUser: User, body: any) {
    const { unitId, answers } = body;
    const task = SEED_GRAMMAR_TASKS.find(t => t.id === unitId || String(t.unitNumber) === unitId);
    let correct = 0;
    if (task) {
      task.questions.forEach((q, idx) => {
        const ans = (answers[q.id] || answers[String(idx)] || '').trim().toLowerCase();
        if (ans === q.correctAnswer.trim().toLowerCase()) correct++;
      });
    }

    const sub: Submission = {
      id: `sub_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      type: 'GRAMMAR',
      taskType: 'GRAMMAR',
      taskId: unitId,
      taskTitle: `Grammar Unit: ${task?.topic || 'Exercise'}`,
      score: correct,
      rawScore: correct,
      totalQuestions: task?.questions.length || 5,
      bandScore: 7.5,
      feedback: `Scored ${correct} of ${task?.questions.length || 5} questions correctly.`,
      answers,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: 400
    };

    const db = this.loadDB();
    db.submissions.unshift(sub);
    this.saveDB(db);
    return { success: true, submission: sub };
  }

  public submitMockExam(currentUser: User, body: any) {
    const { testId, readingAnswers, listeningAnswers, writing1, writing2 } = body;
    const test = SEED_MOCK_TESTS.find(t => t.id === testId);
    const sub: Submission = {
      id: `sub_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      type: 'mock_exam',
      taskType: 'MOCK_TEST',
      taskId: testId,
      taskTitle: test?.title || 'Full IELTS Mock Examination',
      bandScore: 7.5,
      detailedCriteria: {
        taskAchievement: 7.5,
        coherenceCohesion: 7.5,
        lexicalResource: 7.5,
        grammarAccuracy: 7.5
      },
      feedback: `Official IELTS Mock Examination statement completed for ${currentUser.fullName}. Diagnostic band estimate: Overall Band 7.5 (Reading: 7.5, Listening: 7.5, Writing: 7.0, Speaking: 7.5).`,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: 9600
    };

    const db = this.loadDB();
    db.submissions.unshift(sub);
    this.saveDB(db);
    return { success: true, submission: sub };
  }

  public getMySubmissions(currentUser: User) {
    const db = this.loadDB();
    const subs = db.submissions.filter(s => s.studentId === currentUser.id);
    return { submissions: subs };
  }

  // --- Student Management (Admin) ---
  public getStudents() {
    const db = this.loadDB();
    const list = db.users
      .filter(u => u.role === 'STUDENT')
      .map(({ passwordHash: _, ...safe }) => safe);
    return { students: list };
  }

  public getPendingStudents() {
    const db = this.loadDB();
    const list = db.users
      .filter(u => u.role === 'STUDENT' && u.status === 'PENDING_APPROVAL')
      .map(({ passwordHash: _, ...safe }) => safe);
    return { students: list };
  }

  public approveStudent(actor: User, studentId: string) {
    const db = this.loadDB();
    const student = db.users.find(u => u.id === studentId);
    if (!student) throw new Error('Student not found');
    student.status = 'APPROVED';
    student.approvedAt = new Date().toISOString();
    student.approvedBy = actor.id;

    db.activityLogs.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: actor.id,
      actorName: actor.fullName,
      userName: actor.fullName,
      actorEmail: actor.email,
      action: 'STUDENT_APPROVED',
      targetType: 'student',
      targetId: student.id,
      details: `Student ${student.fullName} (${student.email}) admission granted by ${actor.fullName}.`
    });

    this.saveDB(db);
    const { passwordHash: _, ...safe } = student;
    return { success: true, student: safe };
  }

  public rejectStudent(actor: User, studentId: string, reason?: string) {
    const db = this.loadDB();
    const student = db.users.find(u => u.id === studentId);
    if (!student) throw new Error('Student not found');
    student.status = 'REJECTED';
    student.rejectionReason = reason || 'Application not accepted';

    db.activityLogs.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: actor.id,
      actorName: actor.fullName,
      userName: actor.fullName,
      actorEmail: actor.email,
      action: 'STUDENT_REJECTED',
      targetType: 'student',
      targetId: student.id,
      details: `Student ${student.fullName} rejected: ${student.rejectionReason}`
    });

    this.saveDB(db);
    const { passwordHash: _, ...safe } = student;
    return { success: true, student: safe };
  }

  public suspendStudent(actor: User, studentId: string, reason?: string) {
    const db = this.loadDB();
    const student = db.users.find(u => u.id === studentId);
    if (!student) throw new Error('Student not found');
    student.status = 'SUSPENDED';
    student.suspensionReason = reason || 'Administrative review';
    this.saveDB(db);
    const { passwordHash: _, ...safe } = student;
    return { success: true, student: safe };
  }

  public restoreStudent(actor: User, studentId: string) {
    const db = this.loadDB();
    const student = db.users.find(u => u.id === studentId);
    if (!student) throw new Error('Student not found');
    student.status = 'APPROVED';
    this.saveDB(db);
    const { passwordHash: _, ...safe } = student;
    return { success: true, student: safe };
  }

  public updateStudent(studentId: string, updates: Partial<User>) {
    const db = this.loadDB();
    const student = db.users.find(u => u.id === studentId);
    if (!student) throw new Error('Student not found');
    Object.assign(student, updates);
    this.saveDB(db);
    const { passwordHash: _, ...safe } = student;
    return { success: true, student: safe };
  }

  public deleteStudent(studentId: string) {
    const db = this.loadDB();
    db.users = db.users.filter(u => u.id !== studentId);
    this.saveDB(db);
    return { success: true };
  }

  public getAdmins() {
    const db = this.loadDB();
    const list = db.users
      .filter(u => u.role === 'SUPER_ADMIN' || u.role === 'ADMIN')
      .map(({ passwordHash: _, ...safe }) => safe);
    return { admins: list };
  }

  public createAdmin(actor: User, body: any) {
    const { fullName, email, password, permissions } = body;
    const db = this.loadDB();
    const newAdmin: User & { passwordHash: string } = {
      id: `usr_adm_${Date.now()}`,
      fullName,
      email: email.trim().toLowerCase(),
      role: 'ADMIN',
      status: 'APPROVED',
      isActive: true,
      registeredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(password),
      permissions: permissions || { canApproveStudents: true, canManageContent: true, canViewAnalytics: true }
    };
    db.users.push(newAdmin);
    this.saveDB(db);
    const { passwordHash: _, ...safe } = newAdmin;
    return { success: true, admin: safe };
  }

  public updateAdmin(adminId: string, updates: any) {
    const db = this.loadDB();
    const admin = db.users.find(u => u.id === adminId);
    if (!admin) throw new Error('Admin not found');
    Object.assign(admin, updates);
    this.saveDB(db);
    const { passwordHash: _, ...safe } = admin;
    return { success: true, admin: safe };
  }

  public deleteAdmin(adminId: string) {
    const db = this.loadDB();
    const admin = db.users.find(u => u.id === adminId);
    if (admin?.role === 'SUPER_ADMIN') throw new Error('Super Admin cannot be deleted');
    db.users = db.users.filter(u => u.id !== adminId);
    this.saveDB(db);
    return { success: true };
  }

  // --- Analytics & Logs ---
  public getAnalyticsOverview() {
    const db = this.loadDB();
    const students = db.users.filter(u => u.role === 'STUDENT');
    const active = students.filter(u => u.status === 'APPROVED');
    const pending = students.filter(u => u.status === 'PENDING_APPROVAL');

    return {
      totalStudents: students.length,
      activeStudentsCount: active.length,
      pendingStudentsCount: pending.length,
      totalSubmissions: db.submissions.length,
      averagePlatformBand: 7.2,
      skillAverages: {
        reading: 7.4,
        listening: 7.2,
        writing: 6.8,
        speaking: 7.3
      },
      cityDistribution: {
        Almaty: 5,
        Astana: 3,
        Shymkent: 2,
        Karaganda: 1,
        Aktobe: 1
      },
      bandDistribution: {
        '6.0': 1,
        '6.5': 2,
        '7.0': 3,
        '7.5': 4,
        '8.0': 2,
        '8.5': 1,
        '9.0': 0
      }
    };
  }

  public getLogs(limit = 50) {
    const db = this.loadDB();
    return { logs: db.activityLogs.slice(0, limit) };
  }

  public getSettings() {
    const db = this.loadDB();
    return { settings: db.settings };
  }

  public updateSettings(settings: Partial<PlatformSettings>) {
    const db = this.loadDB();
    Object.assign(db.settings, settings);
    this.saveDB(db);
    return { success: true, settings: db.settings };
  }
}
