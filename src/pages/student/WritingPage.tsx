import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client.js';
import { WritingTask } from '../../types/index.js';
import { PenTool, Search, Clock, FileText, ArrowRight } from 'lucide-react';

interface WritingPageProps {
  onSelectTask: (taskId: string) => void;
}

export const WritingPage: React.FC<WritingPageProps> = ({ onSelectTask }) => {
  const [tasks, setTasks] = useState<WritingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'academic_task1' | 'gt_task1' | 'task2'>('ALL');

  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await apiRequest<{ tasks: WritingTask[] }>('/content/writing');
        setTasks(res.tasks || []);
      } catch (err) {
        console.error('Failed to load writing tasks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  const filtered = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.prompt.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.taskType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <PenTool className="w-4 h-4" />
            <span>IELTS WRITING PREPARATION MODULE</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Academic & General Training Writing ({tasks.length} Tasks)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive text editor, live word counter, timer, official IELTS criteria evaluation, and model answers (Bands 6–9).
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 self-start md:self-auto">
          36 Complete Writing Tasks
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search essay topics..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Task Type Filter Tabs */}
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-950 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'ALL', label: 'All Tasks' },
            { id: 'academic_task1', label: 'Academic Task 1' },
            { id: 'gt_task1', label: 'General Training Task 1' },
            { id: 'task2', label: 'Writing Task 2' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTypeFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition whitespace-nowrap ${
                typeFilter === tab.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading writing curriculum...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500">No writing tasks match the selected criteria.</div>
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
                    {t.taskType.replace('_', ' ').toUpperCase()} · Task {idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Min {t.minWords} words
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {t.prompt}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.recommendedMinutes} mins</span>
                  </div>
                  <span>·</span>
                  <div>{t.examType}</div>
                  <span>·</span>
                  <div className="text-emerald-600 dark:text-emerald-400 font-medium">Bands 6–9 Models</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectTask(t.id)}
                className="mt-4 w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <span>Open Writing Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
