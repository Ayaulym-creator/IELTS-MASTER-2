import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client.js';
import { SpeakingTask, Submission } from '../../types/index.js';
import { SpeakingRecorder } from '../../components/recorder/SpeakingRecorder.js';
import { 
  ArrowLeft, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Send 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpeakingTaskPageProps {
  taskId: string;
  onBack: () => void;
}

export const SpeakingTaskPage: React.FC<SpeakingTaskPageProps> = ({ taskId, onBack }) => {
  const [task, setTask] = useState<SpeakingTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<Submission | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  useEffect(() => {
    async function loadTask() {
      try {
        const res = await apiRequest<{ task: SpeakingTask }>(`/content/speaking/${taskId}`);
        setTask(res.task);
      } catch (err) {
        console.error('Failed to load speaking task:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTask();
  }, [taskId]);

  const handleRecordingComplete = (url: string, duration: number) => {
    setRecordedAudioUrl(url);
    setRecordedDuration(duration);
  };

  const handleSubmit = async () => {
    if (!task) return;
    setIsSubmitting(true);

    try {
      const res = await apiRequest<{ submission: Submission }>('/submissions/speaking', {
        method: 'POST',
        body: JSON.stringify({
          taskId: task.id,
          taskTitle: task.title,
          timeSpentSeconds: recordedDuration || 120,
          audioDuration: recordedDuration || 120
        })
      });
      setSubmissionResult(res.submission);

      if ((res.submission.bandScore || 0) >= 7.5) {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      alert(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !task) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading speaking studio...</div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            title="Return to Speaking Tasks"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase">
              Part {task.part} · {task.topic}
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {task.title}
            </h1>
          </div>
        </div>

        {submissionResult && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold font-mono">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>Awarded: Band {submissionResult.bandScore?.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Task Prompt: Cue Card or Questions */}
      {task.cueCard ? (
        <div className="bg-amber-50/60 dark:bg-amber-950/20 border-2 border-dashed border-amber-300 dark:border-amber-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-900/60 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Candidate Cue Card (Individual Long Turn)
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
              1 min prep · 2 min speech
            </span>
          </div>

          <div className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
            {task.cueCard.mainPrompt}
          </div>

          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pl-4 border-l-2 border-amber-400">
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">You should say:</div>
            {task.cueCard.bulletPoints.map((pt, i) => (
              <div key={i}>• {pt}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
            Examiner Discussion Questions
          </h3>
          <div className="space-y-3">
            {task.questions?.map((q, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs md:text-sm font-medium text-slate-800 dark:text-slate-200">
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{i + 1}.</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Speaking Recording Studio Component */}
      <SpeakingRecorder
        prepSeconds={task.cueCard?.prepSeconds || 60}
        speakingSeconds={task.cueCard?.speakingSeconds || 120}
        onRecordingComplete={handleRecordingComplete}
      />

      {/* Submit Recording CTA */}
      {recordedAudioUrl && !submissionResult && (
        <div className="flex justify-end">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating Speech...' : 'Submit Recording for Assessment'}</span>
          </button>
        </div>
      )}

      {/* Feedback Banner */}
      {submissionResult && (
        <div className="p-5 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Speaking Examiner Assessment
            </h4>
            <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              Band {submissionResult.bandScore?.toFixed(1)}
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            {submissionResult.feedback}
          </p>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition"
          >
            Back to Speaking Tasks
          </button>
        </div>
      )}

      {/* Lexical Resource & High-Band Vocabulary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span>Topic-Specific Lexicon</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {task.highBandVocabulary.map((v, i) => (
              <span key={i} className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                {v}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            <Award className="w-4 h-4" />
            <span>Idiomatic Collocations</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {task.idiomaticExpressions.map((idm, i) => (
              <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                {idm}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Model Answer Toggle */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <button
          type="button"
          onClick={() => setShowModelAnswer(!showModelAnswer)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition"
        >
          <span>Band 8.5+ Model Spoken Response</span>
          <span className="text-blue-600">{showModelAnswer ? 'Hide' : 'Reveal'}</span>
        </button>

        {showModelAnswer && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif whitespace-pre-line">
            {task.modelAnswer}
          </div>
        )}
      </div>

    </div>
  );
};
