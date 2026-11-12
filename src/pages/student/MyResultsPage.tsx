import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { Submission } from '../../types';

interface MyResultsPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const MyResultsPage: React.FC<MyResultsPageProps> = ({ onNavigate }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterModule, setFilterModule] = useState<string>('ALL');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ submissions: Submission[] }>('/submissions/my');
      setSubmissions(res.submissions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = submissions.filter((sub) => {
    if (filterModule === 'ALL') return true;
    return sub.taskType === filterModule;
  });

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-slate-400';
    if (score >= 7.5) return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
    if (score >= 6.5) return 'text-sky-400 bg-sky-950/40 border-sky-800/60';
    if (score >= 5.5) return 'text-amber-400 bg-amber-950/40 border-amber-800/60';
    return 'text-rose-400 bg-rose-950/40 border-rose-800/60';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Test Results & Statements</h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete assessment history, examiner feedback, and band score diagnostic breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'READING', 'LISTENING', 'WRITING', 'SPEAKING', 'MOCK_TEST'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterModule(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterModule === type
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
          Loading submission records...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-slate-400">No completed tasks found in this section yet.</p>
          <button
            onClick={() => onNavigate('reading')}
            className="mt-4 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-semibold rounded-lg"
          >
            Start Practice
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((sub) => (
            <div
              key={sub.id}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-800 text-sky-400 border border-slate-700">
                    {sub.taskType}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(sub.submittedAt).toLocaleString('en-US', {
                      timeZone: 'Asia/Almaty',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    (Almaty)
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{sub.taskTitle}</h3>
                <p className="text-xs text-slate-400">Time spent: {Math.round(sub.timeSpentSeconds / 60)} minutes</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-400">IELTS Band</div>
                  <div className={`text-2xl font-black px-3 py-1 rounded-lg border text-center ${getScoreColor(sub.bandScore)}`}>
                    {sub.bandScore !== undefined ? sub.bandScore.toFixed(1) : '—'}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSubmission(sub)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
                >
                  View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  {selectedSubmission.taskType} Performance
                </span>
                <h2 className="text-xl font-extrabold text-white">{selectedSubmission.taskTitle}</h2>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Overall Band</div>
                <div className="text-2xl font-extrabold text-sky-400">
                  {selectedSubmission.bandScore?.toFixed(1) || 'N/A'}
                </div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Raw Score</div>
                <div className="text-2xl font-extrabold text-slate-200">
                  {selectedSubmission.rawScore !== undefined ? `${selectedSubmission.rawScore} / ${selectedSubmission.totalQuestions}` : 'N/A'}
                </div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Time Taken</div>
                <div className="text-2xl font-extrabold text-slate-200">
                  {Math.round(selectedSubmission.timeSpentSeconds / 60)} min
                </div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Status</div>
                <div className="text-sm font-bold text-emerald-400 mt-1">Evaluated</div>
              </div>
            </div>

            {/* Criteria Breakdown for Writing / Speaking */}
            {selectedSubmission.criteriaBreakdown && (
              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Official IELTS 4-Criteria Assessment
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  {Object.entries(selectedSubmission.criteriaBreakdown).map(([crit, val]) => {
                    const num = typeof val === 'number' ? val : parseFloat(val as any) || 0;
                    return (
                      <div key={crit} className="p-2 bg-slate-900 rounded border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase truncate">
                          {crit.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-lg font-bold text-sky-400">{num.toFixed(1)}</div>
                      </div>
                    );
                  })}

                </div>
              </div>
            )}

            {/* Examiner Feedback */}
            {selectedSubmission.feedback && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Examiner Diagnostic Notes
                </h4>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedSubmission.feedback}
                </div>
              </div>
            )}

            {/* Answers Breakdown */}
            {selectedSubmission.answers && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Recorded Responses ({Object.keys(selectedSubmission.answers).length} items)
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-1.5 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                  {Object.entries(selectedSubmission.answers).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="font-mono text-slate-400">{key}:</span>
                      <span className="font-semibold text-slate-200 truncate max-w-[300px]">
                        {typeof val === 'string' ? val : JSON.stringify(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
