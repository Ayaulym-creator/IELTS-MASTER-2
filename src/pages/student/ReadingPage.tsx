import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client.js';
import { ReadingTask } from '../../types/index.js';
import { BookOpen, Search, Filter, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface ReadingPageProps {
  onSelectTask: (taskId: string) => void;
}

export const ReadingPage: React.FC<ReadingPageProps> = ({ onSelectTask }) => {
  const [tasks, setTasks] = useState<ReadingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [difficulty, setDifficulty] = useState('ALL');
  const [examType, setExamType] = useState('ALL');

  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await apiRequest<{ tasks: ReadingTask[] }>('/content/reading');
        setTasks(res.tasks || []);
      } catch (err) {
        console.error('Failed to load reading tasks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  const categories = ['ALL', ...Array.from(new Set(tasks.map(t => t.category)))];

  const filtered = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.passageTitle.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'ALL' || t.category === category;
    const matchesDifficulty = difficulty === 'ALL' || t.difficulty === difficulty;
    const matchesExam = examType === 'ALL' || t.examType === examType;
    return matchesSearch && matchesCategory && matchesDifficulty && matchesExam;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>IELTS READING PREPARATION SYSTEM</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Academic & General Training Reading ({tasks.length} Tasks)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full 800+ word passages containing all 14 official IELTS question formats with automated scoring.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 self-start md:self-auto">
          36 Authentic Tasks Available
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search passage topics..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={examType}
            onChange={e => setExamType(e.target.value)}
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Exam Types</option>
            <option value="Academic">Academic</option>
            <option value="General Training">General Training</option>
          </select>

          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Difficulty Bands</option>
            <option value="Band 5.5-6.5">Band 5.5-6.5</option>
            <option value="Band 6.5-7.5">Band 6.5-7.5</option>
            <option value="Band 7.5-9.0">Band 7.5-9.0</option>
          </select>

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading reading curriculum...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500">No reading tasks match the selected criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t, idx) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    Task {idx + 1} · {t.examType}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {t.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {t.passageTitle}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.estimatedMinutes} mins</span>
                  </div>
                  <span>·</span>
                  <div>{t.questions.length} questions</div>
                  <span>·</span>
                  <div className="truncate">{t.category}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectTask(t.id)}
                className="mt-4 w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <span>Open Reading Task</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
