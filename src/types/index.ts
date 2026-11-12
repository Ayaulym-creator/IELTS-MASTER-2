export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT';

export type AccountStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'DEACTIVATED';
export type StudentStatus = AccountStatus;

export type ExamType = 'Academic' | 'General Training' | 'ACADEMIC' | 'GENERAL_TRAINING';

export interface AdminPermissions {
  canApproveStudents?: boolean;
  canManageContent?: boolean;
  canViewAnalytics?: boolean;
  canManageAdmins?: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  city?: string;
  phone?: string;
  phoneNumber?: string;
  englishLevel?: string; // e.g. "B1 Intermediate", "B2 Upper-Intermediate", "C1 Advanced", "C2 Proficient"
  targetBandScore?: number; // e.g. 7.5
  examType?: ExamType;
  ieltsType?: 'ACADEMIC' | 'GENERAL_TRAINING' | 'Academic' | 'General Training';
  registeredAt?: string;
  createdAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  lastLoginAt?: string;
  avatarUrl?: string;
  isActive?: boolean;
  rejectionReason?: string;
  suspensionReason?: string;
  permissions?: AdminPermissions | string[]; // for ADMIN role
}

export type SkillType = 'reading' | 'listening' | 'writing' | 'speaking' | 'grammar' | 'vocabulary' | 'READING' | 'LISTENING' | 'WRITING' | 'SPEAKING' | 'GRAMMAR' | 'VOCABULARY';

export interface ReadingQuestion {
  id: string;
  number: number;
  type: 
    | 'multiple_choice' 
    | 'true_false_not_given' 
    | 'yes_no_not_given' 
    | 'matching_headings' 
    | 'matching_information' 
    | 'matching_features' 
    | 'matching_sentence_endings' 
    | 'sentence_completion' 
    | 'summary_completion' 
    | 'note_completion' 
    | 'table_completion' 
    | 'flow_chart_completion' 
    | 'diagram_label_completion' 
    | 'short_answer';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ReadingTask {
  id: string;
  title: string;
  examType: ExamType;
  category: string;
  difficulty: 'Band 5.5-6.5' | 'Band 6.5-7.5' | 'Band 7.5-9.0';
  estimatedMinutes: number;
  passageTitle: string;
  passageContent: string;
  questions: ReadingQuestion[];
  isPublished: boolean;
  createdAt: string;
}

export interface ListeningQuestion {
  id: string;
  number: number;
  type: 
    | 'multiple_choice' 
    | 'matching' 
    | 'plan_map_diagram' 
    | 'form_completion' 
    | 'note_completion' 
    | 'table_completion' 
    | 'flow_chart' 
    | 'sentence_completion' 
    | 'short_answer';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ListeningTask {
  id: string;
  title: string;
  section: 1 | 2 | 3 | 4; // Section 1: Social dialog, 2: Social monologue, 3: Academic dialog, 4: Academic lecture
  sectionDescription: string;
  accent: 'British English' | 'Australian English' | 'North American' | 'International English';
  difficulty: 'Band 5.5-6.5' | 'Band 6.5-7.5' | 'Band 7.5-9.0';
  audioDurationSeconds: number;
  audioTranscript: string; // Used for speech synthesis and review
  questions: ListeningQuestion[];
  isPublished: boolean;
  createdAt: string;
}

export type WritingTaskType = 'academic_task1' | 'gt_task1' | 'task2';

export interface WritingTask {
  id: string;
  title: string;
  taskType: WritingTaskType;
  examType: ExamType;
  prompt: string;
  visualType?: 'line_graph' | 'bar_chart' | 'pie_chart' | 'table' | 'map' | 'process_diagram' | 'mixed_chart';
  visualData?: any; // Structured data for rendering chart in SVG
  minWords: number;
  recommendedMinutes: number;
  modelAnswers: {
    band6: string;
    band7: string;
    band8: string;
    band9: string;
  };
  keyAssessmentPoints: string[];
  isPublished: boolean;
  createdAt: string;
}

export interface SpeakingTask {
  id: string;
  title: string;
  part: 1 | 2 | 3;
  topic: string;
  cueCard?: {
    mainPrompt: string;
    bulletPoints: string[];
    prepSeconds: number;
    speakingSeconds: number;
  };
  questions?: string[];
  modelAnswer: string;
  highBandVocabulary: string[];
  idiomaticExpressions: string[];
  isPublished: boolean;
  createdAt: string;
}

export interface GrammarQuestion {
  id: string;
  prompt: string;
  type: 'multiple_choice' | 'fill_in_the_blank' | 'error_correction' | 'sentence_transformation';
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface GrammarTask {
  id: string;
  unitNumber: number;
  topic: string;
  level: 'Intermediate (Band 5.5-6.5)' | 'Upper-Intermediate (Band 6.5-7.5)' | 'Advanced (Band 7.5+)';
  rulesExplanation: string;
  examples: { correct: string; incorrect?: string; note: string }[];
  questions: GrammarQuestion[];
  isPublished: boolean;
  createdAt: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'collocation' | 'idiom';
  category: 
    | 'Education' 
    | 'Technology' 
    | 'Environment' 
    | 'Health' 
    | 'Society' 
    | 'Culture' 
    | 'Business' 
    | 'Science' 
    | 'Travel' 
    | 'Work' 
    | 'Government' 
    | 'Media' 
    | 'Psychology' 
    | 'Economics' 
    | 'Crime' 
    | 'Globalization' 
    | 'IELTS Academic Vocabulary' 
    | 'IELTS Writing Vocabulary' 
    | 'IELTS Speaking Vocabulary';
  definition: string;
  exampleSentence: string;
  synonyms: string[];
  bandLevel: 'Band 6.0' | 'Band 7.0' | 'Band 8.0+';
  isFavorite?: boolean;
  learningStatus?: 'new' | 'learning' | 'review' | 'mastered';
}

export interface MockTest {
  id: string;
  title: string;
  examType: ExamType;
  description: string;
  durationMinutes: number;
  readingTaskId: string;
  listeningTaskId: string;
  writingTask1Id: string;
  writingTask2Id: string;
  speakingTaskId: string;
  isPublished: boolean;
  createdAt: string;
}

export interface Submission {
  id: string;
  studentId: string;
  studentName?: string;
  type?: SkillType | 'mock_exam';
  taskType?: string; // alias for type
  taskId: string;
  taskTitle: string;
  score?: number;
  rawScore?: number;
  totalQuestions?: number;
  totalScore?: number;
  bandScore?: number;
  feedback?: string;
  detailedCriteria?: {
    taskAchievement?: number;
    coherenceCohesion?: number;
    lexicalResource?: number;
    grammarAccuracy?: number;
  };
  criteriaBreakdown?: Record<string, number>;
  answers?: Record<string, any>;
  submittedText?: string;
  audioRecordingUrl?: string;
  submittedAt: string;
  timeSpentSeconds: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actorId?: string;
  actorName?: string;
  userName?: string; // alias for actorName
  actorEmail?: string;
  action: string;
  targetType?: 'student' | 'admin' | 'content' | 'settings' | 'auth';
  targetId?: string;
  details: string;
  metadata?: any;
  ipAddress?: string;
}

export interface PlatformSettings {
  siteName?: string;
  platformName?: string;
  registrationOpen?: boolean;
  allowRegistration?: boolean;
  requireAdminApproval?: boolean;
  defaultTimezone: string;
  maxMockAttemptsPerDay?: number;
  contactEmail?: string;
  supportEmail?: string;
  supportPhone?: string;
  announcementText?: string;
  announcementBanner?: string;
  maintenanceMode: boolean;
}
