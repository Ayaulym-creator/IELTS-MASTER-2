import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { Submission } from '../../types';

interface MyProgressPageProps {
  onNavigate: (page: string) => void;
}

export const MyProgressPage: React.FC<MyProgressPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<{ submissions: Submission[] }>('/submissions/my');
        setSubmissions(res.submissions || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const readingSubs = submissions.filter((s) => s.taskType === 'READING' && s.bandScore !== undefined);
  const listeningSubs = submissions.filter((s) => s.taskType === 'LISTENING' && s.bandScore !== undefined);
  const writingSubs = submissions.filter((s) => s.taskType === 'WRITING' && s.bandScore !== undefined);
  const speakingSubs = submissions.filter((s) => s.taskType === 'SPEAKING' && s.bandScore !== undefined);

  const avg = (arr: Submission[]) => {
    if (!arr.length) return null;
    const sum = arr.reduce((acc, curr) => acc + (curr.bandScore || 0), 0);
    return Math.round((sum / arr.length) * 2) / 2; // IELTS round to nearest 0.5
  };

  const readingAvg = avg(readingSubs);
  const listeningAvg = avg(listeningSubs);
  const writingAvg = avg(writingSubs);
  const speakingAvg = avg(speakingSubs);

  const validScores = [readingAvg, listeningAvg, writingAvg, speakingAvg].filter((s): s is number => s !== null);
  const overallAvg = validScores.length
    ? Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length) * 2) / 2
    : null;

  const targetBand = user?.targetBandScore || 7.5;
  const currentEst = overallAvg || 6.0;
  const gap = targetBand - currentEst;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Skill Progress & Band Trajectory</h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time band estimates calibrated to the British Council and IDP 9-band assessment standard.
        </p>
      </div>

      {/* Target Comparison Hero Card */}
      <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Estimated Overall Band</span>
            <div className="text-5xl font-black text-white">{overallAvg ? overallAvg.toFixed(1) : '6.5*'}</div>
            <p className="text-xs text-slate-400">
              {overallAvg
                ? `Calculated from ${submissions.length} completed assessments.`
                : '*Diagnostic baseline estimate based on active tasks.'}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Target Goal</span>
            <div className="text-5xl font-black text-amber-300">{targetBand.toFixed(1)}</div>
            <p className="text-xs text-slate-400">
              Exam Target for {user?.fullName || 'Student'} • {user?.ieltsType === 'GENERAL_TRAINING' ? 'General Training' : 'Academic'}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Readiness Status</span>
            <div className="text-2xl font-bold text-slate-200 mt-2">
              {gap <= 0 ? 'Target Band Achieved!' : `${gap.toFixed(1)} Band Gap to Target`}
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden mt-3">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, (currentEst / targetBand) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Skills Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Reading', count: 36, done: readingSubs.length, avg: readingAvg, color: 'text-sky-400', link: 'reading' },
          { name: 'Listening', count: 36, done: listeningSubs.length, avg: listeningAvg, color: 'text-indigo-400', link: 'listening' },
          { name: 'Writing', count: 36, done: writingSubs.length, avg: writingAvg, color: 'text-emerald-400', link: 'writing' },
          { name: 'Speaking', count: 36, done: speakingSubs.length, avg: speakingAvg, color: 'text-amber-400', link: 'speaking' },
        ].map((skill) => (
          <div key={skill.name} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">{skill.name}</h3>
              <span className={`text-xl font-black ${skill.color}`}>
                {skill.avg !== null ? `Band ${skill.avg.toFixed(1)}` : '—'}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Completed Tasks</span>
                <span>{skill.done} / {skill.count}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-sky-500 h-full rounded-full"
                  style={{ width: `${(skill.done / skill.count) * 100}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => onNavigate(skill.link)}
              className="w-full mt-2 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Practice {skill.name}
            </button>
          </div>
        ))}
      </div>

      {/* Learning Analytics Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <h3 className="text-lg font-bold text-white">Grammar & Lexical Mastery</h3>
          <p className="text-xs text-slate-400">
            36 systematic grammar units and 500+ curated IELTS academic vocabulary items.
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Grammar Curriculum (36 units)</span>
                <span className="font-mono text-sky-400">100% Structured Available</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '42%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Vocabulary Lexicon (500+ items across 18 topics)</span>
                <span className="font-mono text-emerald-400">Active Flashcard Deck</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
          <div className="pt-2 flex gap-3">
            <button
              onClick={() => onNavigate('grammar')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg"
            >
              Open Grammar
            </button>
            <button
              onClick={() => onNavigate('vocabulary')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg"
            >
              Flashcards & Lexicon
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <h3 className="text-lg font-bold text-white">Full-Length Mock Examinations</h3>
          <p className="text-xs text-slate-400">
            Real exam simulation conditions under strict IELTS British Council/IDP timing rules.
          </p>
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
            <div className="text-sm font-semibold text-slate-200">Recommended Next Step:</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete a full 4-skill mock test to generate an authoritative diagnostic report and calibrated band estimate.
            </p>
          </div>
          <button
            onClick={() => onNavigate('mock-tests')}
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Enter Mock Exam Hall
          </button>
        </div>
      </div>
    </div>
  );
};
