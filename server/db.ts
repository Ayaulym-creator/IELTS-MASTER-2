import fs from 'fs';
import path from 'path';
import { 
  User, 
  ReadingTask, 
  ListeningTask, 
  WritingTask, 
  SpeakingTask, 
  GrammarTask, 
  VocabularyWord, 
  MockTest, 
  Submission, 
  ActivityLog, 
  PlatformSettings 
} from '../src/types/index.js';

import { 
  SEED_USERS, 
  INITIAL_SUPER_ADMIN_EMAIL, 
  hashPassword 
} from './seed-data/users.js';
import { SEED_READING_TASKS } from './seed-data/readingTasks.js';
import { SEED_LISTENING_TASKS } from './seed-data/listeningTasks.js';
import { SEED_WRITING_TASKS } from './seed-data/writingTasks.js';
import { SEED_SPEAKING_TASKS } from './seed-data/speakingTasks.js';
import { SEED_GRAMMAR_TASKS } from './seed-data/grammarTasks.js';
import { SEED_VOCABULARY } from './seed-data/vocabulary.js';
import { SEED_MOCK_TESTS } from './seed-data/mockTests.js';

export interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  readingTasks: ReadingTask[];
  listeningTasks: ListeningTask[];
  writingTasks: WritingTask[];
  speakingTasks: SpeakingTask[];
  grammarTasks: GrammarTask[];
  vocabulary: VocabularyWord[];
  mockTests: MockTest[];
  submissions: Submission[];
  activityLogs: ActivityLog[];
  settings: PlatformSettings;
  userFavorites: Record<string, string[]>; // userId -> array of vocabulary IDs
  userVocabProgress: Record<string, Record<string, 'new' | 'learning' | 'review' | 'mastered'>>; // userId -> (vocabId -> status)
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'ielts_master_database.json');

class DatabaseService {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure initial Super Admin is always present with permanent privileges
        this.ensureSuperAdmin(parsed);
        if (!parsed.vocabulary || parsed.vocabulary.length < SEED_VOCABULARY.length) {
          parsed.vocabulary = SEED_VOCABULARY;
          this.persistSync(parsed);
        }
        return parsed;
      } catch (err) {
        console.error('Failed to parse existing database file, re-seeding...', err);
      }
    }

    const seeded = this.createInitialSeed();
    this.persistSync(seeded);
    return seeded;
  }

  private ensureSuperAdmin(db: DatabaseSchema) {
    const adminIndex = db.users.findIndex(u => u.email.toLowerCase() === INITIAL_SUPER_ADMIN_EMAIL.toLowerCase());
    if (adminIndex === -1) {
      db.users.unshift(SEED_USERS[0]);
    } else {
      // Guarantee permanent super admin role and approved status
      db.users[adminIndex].role = 'SUPER_ADMIN';
      db.users[adminIndex].status = 'APPROVED';
    }
  }

  private createInitialSeed(): DatabaseSchema {
    // Realistic sample submissions for demonstrated Kazakh students
    const sampleSubmissions: Submission[] = [
      {
        id: 'sub_1',
        studentId: 'usr_stu_1',
        studentName: 'Aruzhan Sarsenova',
        type: 'reading',
        taskId: 'rd_task_1',
        taskTitle: 'The Evolution of Cetacean Echolocation',
        score: 5,
        totalScore: 5,
        bandScore: 8.5,
        feedback: 'Flawless comprehension of advanced acoustic terminology and detail retrieval.',
        submittedAt: '2026-11-10T11:20:00.000Z',
        timeSpentSeconds: 980
      },
      {
        id: 'sub_2',
        studentId: 'usr_stu_1',
        studentName: 'Aruzhan Sarsenova',
        type: 'listening',
        taskId: 'ls_task_1',
        taskTitle: 'University Accommodation Booking Service',
        score: 4,
        totalScore: 4,
        bandScore: 8.0,
        feedback: 'Accurate spelling and full retention of numerical fee requirements.',
        submittedAt: '2026-11-10T12:00:00.000Z',
        timeSpentSeconds: 720
      },
      {
        id: 'sub_3',
        studentId: 'usr_stu_1',
        studentName: 'Aruzhan Sarsenova',
        type: 'writing',
        taskId: 'wr_task_1',
        taskTitle: 'Renewable Electricity Generation by Source (2010–2025)',
        bandScore: 8.0,
        detailedCriteria: {
          taskAchievement: 8.0,
          coherenceCohesion: 8.0,
          lexicalResource: 8.0,
          grammarAccuracy: 8.0
        },
        feedback: 'Comprehensive overview with precise trend grouping and exceptional comparative phrasing.',
        submittedText: 'The line chart outlines renewable electricity generation across four categories in a European state between 2010 and 2025...',
        submittedAt: '2026-11-11T14:15:00.000Z',
        timeSpentSeconds: 1150
      },
      {
        id: 'sub_4',
        studentId: 'usr_stu_3',
        studentName: 'Madina Kassymova',
        type: 'grammar',
        taskId: 'gm_task_1',
        taskTitle: 'Unit 1: Present Simple',
        score: 3,
        totalScore: 3,
        bandScore: 7.5,
        feedback: 'Excellent grasp of third-person singular morphological agreements.',
        submittedAt: '2026-11-09T16:40:00.000Z',
        timeSpentSeconds: 420
      },
      {
        id: 'sub_5',
        studentId: 'usr_stu_6',
        studentName: 'Zhansaya Yermekova',
        type: 'mock_exam',
        taskId: 'mock_acad_1',
        taskTitle: 'IELTS Academic Full Mock Examination 1',
        bandScore: 8.0,
        detailedCriteria: {
          taskAchievement: 8.0,
          coherenceCohesion: 8.0,
          lexicalResource: 8.5,
          grammarAccuracy: 8.0
        },
        feedback: 'Overall performance: Reading 8.5, Listening 8.0, Writing 7.5, Speaking 8.0. Exemplary preparation.',
        submittedAt: '2026-11-08T15:30:00.000Z',
        timeSpentSeconds: 9800
      }
    ];

    const sampleLogs: ActivityLog[] = [
      {
        id: 'log_1',
        timestamp: '2026-01-10T09:00:00.000Z',
        actorId: 'usr_super_admin_1',
        actorName: 'Ayaulym Yessengenova (Super Admin)',
        actorEmail: INITIAL_SUPER_ADMIN_EMAIL,
        action: 'PLATFORM_INITIALIZATION',
        targetType: 'settings',
        details: 'IELTS MASTER platform provisioned with permanent Super Admin account and standard educational curriculum.'
      },
      {
        id: 'log_2',
        timestamp: '2026-09-01T11:00:00.000Z',
        actorId: 'usr_super_admin_1',
        actorName: 'Ayaulym Yessengenova (Super Admin)',
        actorEmail: INITIAL_SUPER_ADMIN_EMAIL,
        action: 'STUDENT_APPROVAL',
        targetType: 'student',
        targetId: 'usr_stu_1',
        details: 'Approved student registration for Aruzhan Sarsenova (aruzhan.s@example.kz).'
      },
      {
        id: 'log_3',
        timestamp: '2026-10-01T10:00:00.000Z',
        actorId: 'usr_super_admin_1',
        actorName: 'Ayaulym Yessengenova (Super Admin)',
        actorEmail: INITIAL_SUPER_ADMIN_EMAIL,
        action: 'STUDENT_APPROVAL',
        targetType: 'student',
        targetId: 'usr_stu_6',
        details: 'Approved student registration for Zhansaya Yermekova (zhansaya.y@example.kz).'
      },
      {
        id: 'log_4',
        timestamp: '2026-11-11T19:15:00.000Z',
        actorId: 'system',
        actorName: 'Registration Gateway',
        actorEmail: 'system@ieltsmaster.kz',
        action: 'NEW_REGISTRATION_PENDING',
        targetType: 'student',
        targetId: 'usr_stu_2',
        details: 'New student registration submitted by Alikhan Nurlanov (alikhan.n@example.kz) awaiting Super Admin approval.'
      }
    ];

    const initialSettings: PlatformSettings = {
      siteName: 'IELTS MASTER',
      registrationOpen: true,
      requireAdminApproval: true,
      defaultTimezone: 'Asia/Almaty',
      maxMockAttemptsPerDay: 3,
      contactEmail: 'admissions@ieltsmaster.kz',
      supportPhone: '+7 (7172) 70-55-00',
      announcementText: 'Welcome to IELTS MASTER — The Premier Academic & General Training Preparation Platform in Kazakhstan.',
      maintenanceMode: false
    };

    return {
      users: SEED_USERS,
      readingTasks: SEED_READING_TASKS,
      listeningTasks: SEED_LISTENING_TASKS,
      writingTasks: SEED_WRITING_TASKS,
      speakingTasks: SEED_SPEAKING_TASKS,
      grammarTasks: SEED_GRAMMAR_TASKS,
      vocabulary: SEED_VOCABULARY,
      mockTests: SEED_MOCK_TESTS,
      submissions: sampleSubmissions,
      activityLogs: sampleLogs,
      settings: initialSettings,
      userFavorites: {
        'usr_stu_1': ['voc_1', 'voc_2', 'voc_5', 'voc_10']
      },
      userVocabProgress: {
        'usr_stu_1': {
          'voc_1': 'mastered',
          'voc_2': 'mastered',
          'voc_3': 'review',
          'voc_4': 'learning'
        }
      }
    };
  }

  private persistSync(dataToSave: DatabaseSchema) {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  public scheduleSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.persistSync(this.data);
      this.saveTimeout = null;
    }, 300);
  }

  public getRaw(): DatabaseSchema {
    return this.data;
  }

  // --- Users & Auth ---
  public findUserById(id: string) {
    return this.data.users.find(u => u.id === id);
  }

  public findUserByEmail(email: string) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public getAllUsers() {
    // Return sanitized users without passwordHash
    return this.data.users.map(({ passwordHash, ...user }) => user);
  }

  public getStudents() {
    return this.data.users
      .filter(u => u.role === 'STUDENT')
      .map(({ passwordHash, ...user }) => user);
  }

  public getPendingStudents() {
    return this.data.users
      .filter(u => u.role === 'STUDENT' && u.status === 'PENDING_APPROVAL')
      .map(({ passwordHash, ...user }) => user);
  }

  public getAdmins() {
    return this.data.users
      .filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN')
      .map(({ passwordHash, ...user }) => user);
  }

  public createUser(user: User & { passwordHash: string }) {
    this.data.users.push(user);
    this.scheduleSave();
    return user;
  }

  public updateUser(id: string, updates: Partial<User & { passwordHash: string }>) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    
    // Prevent downgrading the Initial Super Admin
    if (this.data.users[idx].email.toLowerCase() === INITIAL_SUPER_ADMIN_EMAIL.toLowerCase()) {
      if (updates.role && updates.role !== 'SUPER_ADMIN') {
        throw new Error('Permanent Super Admin role cannot be modified.');
      }
      if (updates.status && updates.status !== 'APPROVED') {
        throw new Error('Permanent Super Admin account cannot be deactivated or suspended.');
      }
    }

    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.scheduleSave();
    return this.data.users[idx];
  }

  public deleteUser(id: string) {
    const user = this.findUserById(id);
    if (!user) return false;
    if (user.email.toLowerCase() === INITIAL_SUPER_ADMIN_EMAIL.toLowerCase()) {
      throw new Error('Permanent Super Admin account cannot be deleted.');
    }
    this.data.users = this.data.users.filter(u => u.id !== id);
    this.scheduleSave();
    return true;
  }

  // --- Activity Logging ---
  public logActivity(log: Omit<ActivityLog, 'id' | 'timestamp'>) {
    const newLog: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    this.data.activityLogs.unshift(newLog);
    // Keep last 1000 logs
    if (this.data.activityLogs.length > 1000) {
      this.data.activityLogs.pop();
    }
    this.scheduleSave();
    return newLog;
  }

  public getLogs(limit = 100) {
    return this.data.activityLogs.slice(0, limit);
  }

  // --- Tasks Access & Management ---
  public getReadingTasks(publishedOnly = false) {
    if (publishedOnly) return this.data.readingTasks.filter(t => t.isPublished);
    return this.data.readingTasks;
  }

  public getReadingTaskById(id: string) {
    return this.data.readingTasks.find(t => t.id === id);
  }

  public updateReadingTask(id: string, updates: Partial<ReadingTask>) {
    const idx = this.data.readingTasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.readingTasks[idx] = { ...this.data.readingTasks[idx], ...updates };
    this.scheduleSave();
    return this.data.readingTasks[idx];
  }

  public getListeningTasks(publishedOnly = false) {
    if (publishedOnly) return this.data.listeningTasks.filter(t => t.isPublished);
    return this.data.listeningTasks;
  }

  public getListeningTaskById(id: string) {
    return this.data.listeningTasks.find(t => t.id === id);
  }

  public updateListeningTask(id: string, updates: Partial<ListeningTask>) {
    const idx = this.data.listeningTasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.listeningTasks[idx] = { ...this.data.listeningTasks[idx], ...updates };
    this.scheduleSave();
    return this.data.listeningTasks[idx];
  }

  public getWritingTasks(publishedOnly = false) {
    if (publishedOnly) return this.data.writingTasks.filter(t => t.isPublished);
    return this.data.writingTasks;
  }

  public getWritingTaskById(id: string) {
    return this.data.writingTasks.find(t => t.id === id);
  }

  public updateWritingTask(id: string, updates: Partial<WritingTask>) {
    const idx = this.data.writingTasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.writingTasks[idx] = { ...this.data.writingTasks[idx], ...updates };
    this.scheduleSave();
    return this.data.writingTasks[idx];
  }

  public getSpeakingTasks(publishedOnly = false) {
    if (publishedOnly) return this.data.speakingTasks.filter(t => t.isPublished);
    return this.data.speakingTasks;
  }

  public getSpeakingTaskById(id: string) {
    return this.data.speakingTasks.find(t => t.id === id);
  }

  public updateSpeakingTask(id: string, updates: Partial<SpeakingTask>) {
    const idx = this.data.speakingTasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.speakingTasks[idx] = { ...this.data.speakingTasks[idx], ...updates };
    this.scheduleSave();
    return this.data.speakingTasks[idx];
  }

  public getGrammarTasks(publishedOnly = false) {
    if (publishedOnly) return this.data.grammarTasks.filter(t => t.isPublished);
    return this.data.grammarTasks;
  }

  public getGrammarTaskById(id: string) {
    return this.data.grammarTasks.find(t => t.id === id);
  }

  public updateGrammarTask(id: string, updates: Partial<GrammarTask>) {
    const idx = this.data.grammarTasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.grammarTasks[idx] = { ...this.data.grammarTasks[idx], ...updates };
    this.scheduleSave();
    return this.data.grammarTasks[idx];
  }

  public getVocabulary(userId?: string) {
    const userFavs = new Set(userId ? (this.data.userFavorites[userId] || []) : []);
    const userProg = userId ? (this.data.userVocabProgress[userId] || {}) : {};

    return this.data.vocabulary.map(v => ({
      ...v,
      isFavorite: userFavs.has(v.id),
      learningStatus: userProg[v.id] || 'new'
    }));
  }

  public toggleVocabularyFavorite(userId: string, vocabId: string) {
    if (!this.data.userFavorites[userId]) {
      this.data.userFavorites[userId] = [];
    }
    const list = this.data.userFavorites[userId];
    const existsIndex = list.indexOf(vocabId);
    if (existsIndex > -1) {
      list.splice(existsIndex, 1);
    } else {
      list.push(vocabId);
    }
    this.scheduleSave();
    return list.includes(vocabId);
  }

  public updateVocabularyProgress(userId: string, vocabId: string, status: 'new' | 'learning' | 'review' | 'mastered') {
    if (!this.data.userVocabProgress[userId]) {
      this.data.userVocabProgress[userId] = {};
    }
    this.data.userVocabProgress[userId][vocabId] = status;
    this.scheduleSave();
    return this.data.userVocabProgress[userId][vocabId];
  }

  public getMockTests(publishedOnly = false) {
    if (publishedOnly) return this.data.mockTests.filter(t => t.isPublished);
    return this.data.mockTests;
  }

  public getMockTestById(id: string) {
    return this.data.mockTests.find(t => t.id === id);
  }

  public updateMockTest(id: string, updates: Partial<MockTest>) {
    const idx = this.data.mockTests.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.mockTests[idx] = { ...this.data.mockTests[idx], ...updates };
    this.scheduleSave();
    return this.data.mockTests[idx];
  }

  // --- Submissions ---
  public addSubmission(sub: Omit<Submission, 'id' | 'submittedAt'>) {
    const newSub: Submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      submittedAt: new Date().toISOString(),
      ...sub
    };
    this.data.submissions.unshift(newSub);
    this.scheduleSave();
    return newSub;
  }

  public getSubmissions(studentId?: string) {
    if (studentId) {
      return this.data.submissions.filter(s => s.studentId === studentId);
    }
    return this.data.submissions;
  }

  // --- Settings ---
  public getSettings() {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<PlatformSettings>) {
    this.data.settings = { ...this.data.settings, ...updates };
    this.scheduleSave();
    return this.data.settings;
  }
}

export const db = new DatabaseService();
