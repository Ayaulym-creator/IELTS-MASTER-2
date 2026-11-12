import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client.js';
import { SpeakingTask } from '../../types/index.js';
import { Mic, Search, Clock, ArrowRight, Award } from 'lucide-react';

interface SpeakingPageProps {
  onSelectTask: (taskId: string) => void;
}

export const SpeakingPage: React.FC<SpeakingPageProps> = ({ onSelectTask }) => {
  const [tasks, setTasks] = useState<SpeakingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [partFilter, setPartFilter] = useState<'ALL' | '1' | '2' | '3'>('ALL');

  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await apiRequest<{ tasks: SpeakingTask[] }>('/content/speaking');
        setTasks(res.tasks || []);
      } catch (err) {
        console.error('Failed to load speaking tasks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  const filtered = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.topic.toLowerCase().includes(search.toLowerCase());
    const matchesPart = partFilter === 'ALL' || t.part === Number(partFilter);
    return matchesSearch && matchesPart;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <Mic className="w-4 h-4" />
            <span>IELTS SPEAKING STUDIO</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Oral Fluency & Interview Studio ({tasks.length} Tasks)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full Parts 1, 2, and 3 practice tasks with cue cards, preparation timers, live microphone recording, and model responses.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 self-start md:self-auto">
          36 Complete Speaking Tasks
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
            placeholder="Search speaking topics..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Part Filters */}
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-950 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'ALL', label: 'All Speaking Parts' },
            { id: '1', label: 'Part 1: Interview' },
            { id: '2', label: 'Part 2: Cue Cards' },
            { id: '3', label: 'Part 3: Discussion' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPartFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition whitespace-nowrap ${
                partFilter === tab.id
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
        <div className="py-16 text-center text-xs text-slate-400">Loading speaking studio...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500">No speaking tasks match the selected criteria.</div>
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
                    Part {t.part} · Task {idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {t.topic}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {t.cueCard ? t.cueCard.mainPrompt : t.questions?.[0]}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Award className="w-3.5 h-3.5" />
                    <span>Idioms & High-Band Lexicon</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectTask(t.id)}
                className="mt-4 w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <span>Launch Recording Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
