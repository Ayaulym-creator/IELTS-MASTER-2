import { User } from '../../src/types/index.js';
import crypto from 'crypto';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_ielts_master_salt_2026').digest('hex');
}

export const INITIAL_SUPER_ADMIN_EMAIL = 'ayaulymensegen123@gmail.com';
export const DEFAULT_ADMIN_PASSWORD = hashPassword('IeltsMaster2026!');
export const DEFAULT_STUDENT_PASSWORD = hashPassword('Student2026!');

export const SEED_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'usr_super_admin_1',
    fullName: 'Ayaulym Yessengenova (Super Admin)',
    email: INITIAL_SUPER_ADMIN_EMAIL,
    role: 'SUPER_ADMIN',
    status: 'APPROVED',
    phoneNumber: '+7 (701) 555-0199',
    englishLevel: 'C2 Proficient',
    targetBandScore: 9.0,
    examType: 'Academic',
    registeredAt: '2026-01-10T09:00:00.000Z',
    approvedAt: '2026-01-10T09:00:00.000Z',
    approvedBy: 'System Genesis',
    lastLoginAt: '2026-11-11T20:30:00.000Z',
    passwordHash: DEFAULT_ADMIN_PASSWORD,
    permissions: [
      'manage_students',
      'approve_students',
      'manage_admins',
      'manage_content',
      'manage_reading',
      'manage_listening',
      'manage_writing',
      'manage_speaking',
      'manage_grammar',
      'manage_vocabulary',
      'manage_mock_tests',
      'view_analytics',
      'manage_settings',
      'view_logs'
    ]
  },
  {
    id: 'usr_admin_1',
    fullName: 'Daniyar Abdrakhmanov (Lead Examiner)',
    email: 'daniyar.admin@ieltsmaster.kz',
    role: 'ADMIN',
    status: 'APPROVED',
    phoneNumber: '+7 (702) 444-1234',
    englishLevel: 'C1 Advanced',
    targetBandScore: 8.5,
    examType: 'Academic',
    registeredAt: '2026-02-01T10:00:00.000Z',
    approvedAt: '2026-02-01T10:15:00.000Z',
    approvedBy: 'usr_super_admin_1',
    lastLoginAt: '2026-11-10T14:20:00.000Z',
    passwordHash: DEFAULT_ADMIN_PASSWORD,
    permissions: [
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
    ]
  },
  // Authentic Kazakh Student Demonstration Accounts
  {
    id: 'usr_stu_1',
    fullName: 'Aruzhan Sarsenova',
    email: 'aruzhan.s@example.kz',
    role: 'STUDENT',
    status: 'APPROVED',
    phoneNumber: '+7 (777) 123-4567',
    englishLevel: 'C1 Advanced',
    targetBandScore: 8.0,
    examType: 'Academic',
    registeredAt: '2026-09-01T08:30:00.000Z',
    approvedAt: '2026-09-01T11:00:00.000Z',
    approvedBy: 'usr_super_admin_1',
    lastLoginAt: '2026-11-11T18:45:00.000Z',
    passwordHash: DEFAULT_STUDENT_PASSWORD
  },
  {
    id: 'usr_stu_2',
    fullName: 'Alikhan Nurlanov',
    email: 'alikhan.n@example.kz',
    role: 'STUDENT',
    status: 'PENDING_APPROVAL',
    phoneNumber: '+7 (705) 987-6543',
    englishLevel: 'B1 Intermediate',
    targetBandScore: 6.5,
    examType: 'General Training',
    registeredAt: '2026-11-11T19:15:00.000Z',
    lastLoginAt: '2026-11-11T19:15:00.000Z',
    passwordHash: DEFAULT_STUDENT_PASSWORD
  },
  {
    id: 'usr_stu_3',
    fullName: 'Madina Kassymova',
    email: 'madina.k@example.kz',
    role: 'STUDENT',
    status: 'APPROVED',
    phoneNumber: '+7 (708) 555-8899',
    englishLevel: 'B2 Upper-Intermediate',
    targetBandScore: 7.0,
    examType: 'Academic',
    registeredAt: '2026-09-15T12:00:00.000Z',
    approvedAt: '2026-09-15T13:40:00.000Z',
    approvedBy: 'usr_super_admin_1',
    lastLoginAt: '2026-11-11T15:20:00.000Z',
    passwordHash: DEFAULT_STUDENT_PASSWORD
  },
  {
    id: 'usr_stu_4',
    fullName: 'Aidana Muratova',
    email: 'aidana.m@example.kz',
    role: 'STUDENT',
    status: 'PENDING_APPROVAL',
    phoneNumber: '+7 (701) 333-2211',
    englishLevel: 'B2 Upper-Intermediate',
    targetBandScore: 7.5,
    examType: 'Academic',
    registeredAt: '2026-11-11T20:00:00.000Z',
    lastLoginAt: '2026-11-11T20:00:00.000Z',
    passwordHash: DEFAULT_STUDENT_PASSWORD
  },
  {
    id: 'usr_stu_5',
    fullName: 'Nurasyl Bekov',
    email: 'nurasyl.b@example.kz',
    role: 'STUDENT',
    status: 'SUSPENDED',
    phoneNumber: '+7 (775) 112-9988',
    englishLevel: 'B2 Upper-Intermediate',
    targetBandScore: 7.0,
    examType: 'Academic',
    registeredAt: '2026-08-10T14:00:00.000Z',
    approvedAt: '2026-08-10T15:10:00.000Z',
    approvedBy: 'usr_super_admin_1',
    lastLoginAt: '2026-10-25T11:00:00.000Z',
    passwordHash: DEFAULT_STUDENT_PASSWORD
  },
  {
    id: 'usr_stu_6',
    fullName: 'Zhansaya Yermekova',
    email: 'zhansaya.y@example.kz',
    role: 'STUDENT',
    status: 'APPROVED',
    phoneNumber: '+7 (707) 777-6655',
    englishLevel: 'C1 Advanced',
    targetBandScore: 8.5,
    examType: 'Academic',
    registeredAt: '2026-10-01T09:30:00.000Z',
    approvedAt: '2026-10-01T10:00:00.000Z',
    approvedBy: 'usr_super_admin_1',
    lastLoginAt: '2026-11-10T09:15:00.000Z',
    passwordHash: DEFAULT_STUDENT_PASSWORD
  },
  {
    id: 'usr_stu_7',
    fullName: 'Dias Temirkhanov',
    email: 'dias.t@example.kz',
    role: 'STUDENT',
    status: 'REJECTED',
    phoneNumber: '+7 (702) 666-4433',
    englishLevel: 'B1 Intermediate',
    targetBandScore: 6.0,
    examType: 'General Training',
    registeredAt: '2026-11-05T16:00:00.000Z',
    passwordHash: DEFAULT_STUDENT_PASSWORD
  },
  {
    id: 'usr_stu_8',
    fullName: 'Kamila Ospanova',
    email: 'kamila.o@example.kz',
    role: 'STUDENT',
    status: 'DEACTIVATED',
    phoneNumber: '+7 (700) 222-1144',
    englishLevel: 'B2 Upper-Intermediate',
    targetBandScore: 7.5,
    examType: 'Academic',
    registeredAt: '2026-07-20T11:00:00.000Z',
    approvedAt: '2026-07-20T12:00:00.000Z',
    approvedBy: 'usr_super_admin_1',
    lastLoginAt: '2026-09-30T17:00:00.000Z',
    passwordHash: DEFAULT_STUDENT_PASSWORD
  }
];
