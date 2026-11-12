import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client.js';
import { GrammarTask } from '../../types/index.js';
import { FileCheck2, Search, ArrowRight, CheckCircle2 } from 'lucide-react';

interface GrammarPageProps {
  onSelectUnit: (unitId: string) => void;
}

export const GrammarPage: React.FC<GrammarPageProps> = ({ onSelectUnit }) => {
  const [tasks, setTasks] = useState<GrammarTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');

  useEffect(() => {
    async function loadGrammar() {
      try {
        const res = await apiRequest<{ tasks: GrammarTask[] }>('/content/grammar');
        setTasks(res.tasks || []);
      } catch (err) {
        console.error('Failed to load grammar tasks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGrammar();
  }, []);

  const filtered = tasks.filter(t => {
    const matchesSearch = t.topic.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || t.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <FileCheck2 className="w-4 h-4" />
            <span>IELTS ACADEMIC GRAMMAR CURRICULUM</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            36 Comprehensive Grammar Units
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Targeted instruction covering all 36 specified topics: from Present Simple through Inversion and Advanced Syntactic Structures.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 self-start md:self-auto">
          Units 1 to 36 Complete
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
            placeholder="Search grammar topic..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={levelFilter}
          onChange={e => setLevelFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none w-full md:w-auto"
        >
          <option value="ALL">All Proficiency Levels</option>
          <option value="Intermediate (Band 5.5-6.5)">Intermediate (Units 1–10)</option>
          <option value="Upper-Intermediate (Band 6.5-7.5)">Upper-Intermediate (Units 11–24)</option>
          <option value="Advanced (Band 7.5+)">Advanced Structures (Units 25–36)</option>
        </select>
      </div>

      {/* Grid of 36 Units */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading grammar curriculum...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500">No grammar units match your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 font-mono">
                    Unit {t.unitNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {t.level.split(' ')[0]}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t.topic}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {t.rulesExplanation}
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {t.questions.length} Practice Exercises
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectUnit(t.id)}
                className="mt-4 w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <span>Study & Practice Unit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
