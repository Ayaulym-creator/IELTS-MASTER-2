import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { apiRequest } from '../../api/client.js';
import { Submission } from '../../types/index.js';
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  FileCheck2,
  BookmarkCheck,
  Award,
  TrendingUp,
  Clock,
  Flame,
  CheckCircle2,
  ArrowRight,
  Target,
  BarChart3
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (view: string, taskId?: string) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiRequest<{ submissions: Submission[] }>('/submissions/my');
        setSubmissions(res.submissions || []);
      } catch (err) {
        console.warn('Could not load student submissions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute skill-by-skill progress
  const readingSubs = submissions.filter(s => s.type === 'reading');
  const listeningSubs = submissions.filter(s => s.type === 'listening');
  const writingSubs = submissions.filter(s => s.type === 'writing');
  const speakingSubs = submissions.filter(s => s.type === 'speaking');
  const grammarSubs = submissions.filter(s => s.type === 'grammar');
  const mockSubs = submissions.filter(s => s.type === 'mock_exam');

  const totalExercisesCompleted = submissions.filter(s => s.type !== 'mock_exam').length;
  const overallProgressPercent = Math.min(100, Math.round((totalExercisesCompleted / 180) * 100));

  // Average Band Score
  const bandScores = submissions.map(s => s.bandScore || 0).filter(b => b > 0);
  const currentAvgBand = bandScores.length > 0 
    ? Number((bandScores.reduce((a, b) => a + b, 0) / bandScores.length).toFixed(1))
    : (user?.targetBandScore ? Number((user.targetBandScore - 0.5).toFixed(1)) : 7.0);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-600/40 border border-blue-400/30 text-xs font-semibold">
              <span>{user?.examType || 'Academic'} Module Candidate</span>
              <span>·</span>
              <span>Kazakhstan Cohort</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Good day, {user?.fullName || 'Student'}!
            </h1>
            <p className="text-xs md:text-sm text-blue-100 max-w-xl leading-relaxed">
              Continue your daily IELTS preparation plan. Today’s goal: Complete one Reading task and one Writing Task 1 visual report.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur border border-white/10 rounded-xl p-4 shrink-0">
            <div className="space-y-0.5">
              <div className="text-[11px] uppercase tracking-wider text-blue-200 font-medium">Target Band</div>
              <div className="text-3xl font-bold font-mono text-white">
                Band {user?.targetBandScore || '7.5'}
              </div>
              <div className="text-[11px] text-blue-200 flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span>Level: {user?.englishLevel || 'B2'}</span>
              </div>
            </div>

            <div className="w-px h-12 bg-white/20" />

            <div className="space-y-0.5">
              <div className="text-[11px] uppercase tracking-wider text-blue-200 font-medium">Study Streak</div>
              <div className="text-3xl font-bold font-mono text-amber-300 flex items-center gap-1">
                <Flame className="w-6 h-6 fill-amber-300 text-amber-300" />
                <span>7</span>
              </div>
              <div className="text-[11px] text-blue-200">Days Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Quick Access Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Curriculum Modules</h2>
          <span className="text-xs text-slate-500">Select any module to begin practice</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          
          <button
            onClick={() => onNavigate('reading')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Reading</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{readingSubs.length}/36 Done</div>
          </button>

          <button
            onClick={() => onNavigate('listening')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Listening</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{listeningSubs.length}/36 Audio</div>
          </button>

          <button
            onClick={() => onNavigate('writing')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <PenTool className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Writing</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{writingSubs.length}/36 Tasks</div>
          </button>

          <button
            onClick={() => onNavigate('speaking')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Speaking</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{speakingSubs.length}/36 Studio</div>
          </button>

          <button
            onClick={() => onNavigate('grammar')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Grammar</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{grammarSubs.length}/36 Units</div>
          </button>

          <button
            onClick={() => onNavigate('vocabulary')}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Vocabulary</div>
            <div className="text-[11px] text-slate-500 mt-0.5">500+ Words</div>
          </button>

          <button
            onClick={() => onNavigate('mock_tests')}
            className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 hover:border-blue-500 shadow-sm transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-blue-900 dark:text-blue-200">Mock Tests</div>
            <div className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">4 Full Exams</div>
          </button>

        </div>
      </div>

      {/* Progress & Recent Results Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Progress Breakdown */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Skill Completion Progress
            </h3>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              {overallProgressPercent}%
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Reading Module</span>
                <span className="text-slate-500">{readingSubs.length} / 36</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(readingSubs.length / 36) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Listening Module</span>
                <span className="text-slate-500">{listeningSubs.length} / 36</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(listeningSubs.length / 36) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Writing Tasks</span>
                <span className="text-slate-500">{writingSubs.length} / 36</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(writingSubs.length / 36) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Speaking Studio</span>
                <span className="text-slate-500">{speakingSubs.length} / 36</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(speakingSubs.length / 36) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Grammar Mastery</span>
                <span className="text-slate-500">{grammarSubs.length} / 36</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(grammarSubs.length / 36) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('my_progress')}
            className="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition"
          >
            View Detailed Progress Analytics
          </button>
        </div>

        {/* Recent Performance & Results */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Recent Exercise Attempts & Results
            </h3>
            <button
              onClick={() => onNavigate('my_results')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              View All Results
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-3">
              <Clock className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p>No submitted tasks recorded yet.</p>
              <button
                onClick={() => onNavigate('reading')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
              >
                Start First Reading Task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.slice(0, 4).map((sub) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-semibold uppercase text-blue-600 dark:text-blue-400">
                        {(sub.type || sub.taskType || 'TASK').replace('_', ' ')}
                      </span>
                      <span>·</span>
                      <span>{new Date(sub.submittedAt).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {sub.taskTitle}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold font-mono text-blue-600 dark:text-blue-400">
                      Band {sub.bandScore?.toFixed(1) || '—'}
                    </div>
                    {sub.score !== undefined && sub.totalScore !== undefined && (
                      <div className="text-[10px] text-slate-500">
                        {sub.score} / {sub.totalScore} correct
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
