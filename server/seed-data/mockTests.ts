import { MockTest } from '../../src/types/index.js';

export const SEED_MOCK_TESTS: MockTest[] = [
  {
    id: 'mock_acad_1',
    title: 'IELTS Academic Full Mock Examination 1',
    examType: 'Academic',
    description: 'Comprehensive 4-skill examination under official timing: Listening (30 mins), Academic Reading (60 mins), Academic Writing Tasks 1 & 2 (60 mins), and Speaking Interview (14 mins).',
    durationMinutes: 164,
    listeningTaskId: 'ls_task_1',
    readingTaskId: 'rd_task_1',
    writingTask1Id: 'wr_task_1',
    writingTask2Id: 'wr_task_4',
    speakingTaskId: 'sp_task_2',
    isPublished: true,
    createdAt: '2026-03-01T08:00:00.000Z'
  },
  {
    id: 'mock_acad_2',
    title: 'IELTS Academic Full Mock Examination 2',
    examType: 'Academic',
    description: 'Authentic Academic practice suite featuring advanced scientific reading passages, complex listening audio, visual map writing, and long-turn speaking evaluation.',
    durationMinutes: 164,
    listeningTaskId: 'ls_task_3',
    readingTaskId: 'rd_task_2',
    writingTask1Id: 'wr_task_2',
    writingTask2Id: 'wr_task_4',
    speakingTaskId: 'sp_task_3',
    isPublished: true,
    createdAt: '2026-03-05T08:00:00.000Z'
  },
  {
    id: 'mock_gt_1',
    title: 'IELTS General Training Full Mock Examination 1',
    examType: 'General Training',
    description: 'Designed for immigration and workplace certification: Social listening, workplace & general interest reading, formal letter writing, opinion essay, and speaking test.',
    durationMinutes: 164,
    listeningTaskId: 'ls_task_2',
    readingTaskId: 'rd_task_3',
    writingTask1Id: 'wr_task_3',
    writingTask2Id: 'wr_task_4',
    speakingTaskId: 'sp_task_1',
    isPublished: true,
    createdAt: '2026-03-10T08:00:00.000Z'
  },
  {
    id: 'mock_gt_2',
    title: 'IELTS General Training Full Mock Examination 2',
    examType: 'General Training',
    description: 'Second full General Training examination suite measuring communicative competence, practical reading, professional correspondence, and oral fluency.',
    durationMinutes: 164,
    listeningTaskId: 'ls_task_4',
    readingTaskId: 'rd_task_5',
    writingTask1Id: 'wr_task_3',
    writingTask2Id: 'wr_task_4',
    speakingTaskId: 'sp_task_2',
    isPublished: true,
    createdAt: '2026-03-15T08:00:00.000Z'
  }
];
