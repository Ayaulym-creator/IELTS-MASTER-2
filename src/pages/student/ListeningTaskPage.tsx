import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client.js';
import { ListeningTask, Submission } from '../../types/index.js';
import { IELTSAudioPlayer } from '../../components/audio/IELTSAudioPlayer.js';
import { ArrowLeft, CheckCircle2, XCircle, Send, Award, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ListeningTaskPageProps {
  taskId: string;
  onBack: () => void;
}

export const ListeningTaskPage: React.FC<ListeningTaskPageProps> = ({ taskId, onBack }) => {
  const [task, setTask] = useState<ListeningTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<Submission | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    async function loadTask() {
      try {
        const res = await apiRequest<{ task: ListeningTask }>(`/content/listening/${taskId}`);
        setTask(res.task);
      } catch (err) {
        console.error('Failed to load listening task:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTask();
  }, [taskId]);

  const handleAnswerChange = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async () => {
    if (!task) return;
    setIsSubmitting(true);

    try {
      const res = await apiRequest<{ submission: Submission }>('/submissions/objective', {
        method: 'POST',
        body: JSON.stringify({
          type: 'listening',
          taskId: task.id,
          taskTitle: task.title,
          answers,
          timeSpentSeconds: task.audioDurationSeconds + 120
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
    return <div className="py-20 text-center text-xs text-slate-500">Loading listening audio session...</div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            title="Return to Listening List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase">
              Section {task.section} · {task.difficulty}
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

      {/* Embedded IELTS Audio Player */}
      <IELTSAudioPlayer
        title={task.title}
        transcript={task.audioTranscript}
        durationSeconds={task.audioDurationSeconds}
        accent={task.accent}
      />

      {/* Task Description */}
      <div className="p-4 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
        <span className="font-semibold text-slate-800 dark:text-slate-200">Official Exam Context: </span>
        {task.sectionDescription}
      </div>

      {/* Submission Result Score Banner */}
      {submissionResult && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-2">
          <div className="font-bold text-sm flex items-center justify-between">
            <span>Score: {submissionResult.score} / {submissionResult.totalScore}</span>
            <span className="font-mono text-base font-extrabold text-blue-600 dark:text-blue-400">
              Band {submissionResult.bandScore?.toFixed(1)}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-blue-700 dark:text-blue-300">
            {submissionResult.feedback}
          </p>
          <div className="pt-2 border-t border-blue-200 dark:border-blue-900">
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-xs font-semibold text-blue-700 dark:text-blue-300 hover:underline flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showTranscript ? 'Hide Audio Transcript' : 'Review Audio Transcript & Clues'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Transcript Review Accordion */}
      {showTranscript && (
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-xs leading-relaxed font-mono whitespace-pre-line text-slate-700 dark:text-slate-300">
          <h4 className="font-bold text-slate-900 dark:text-white font-sans text-sm mb-2">Verified Audio Script</h4>
          {task.audioTranscript}
        </div>
      )}

      {/* Questions Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Listening Questions ({task.questions.length})
        </h3>

        <div className="space-y-6">
          {task.questions.map((q) => {
            const isSubmitted = !!submissionResult;
            const userAns = String(answers[q.id] || '').trim();
            const isCorrect = userAns.toLowerCase() === String(q.correctAnswer).trim().toLowerCase() ||
                              String(q.correctAnswer).toLowerCase().includes(userAns.toLowerCase());

            return (
              <div key={q.id} className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {q.number}
                  </span>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {q.prompt}
                  </div>
                </div>

                {/* Multiple choice vs Short text input */}
                {q.options && q.options.length > 0 ? (
                  <div className="space-y-1.5 pl-7">
                    {q.options.map(opt => (
                      <label
                        key={opt}
                        className={`flex items-center gap-2.5 p-2 rounded-lg border transition cursor-pointer text-xs ${
                          answers[q.id] === opt
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          disabled={isSubmitted}
                          checked={answers[q.id] === opt}
                          onChange={() => handleAnswerChange(q.id, opt)}
                          className="accent-blue-600"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="pl-7">
                    <input
                      type="text"
                      disabled={isSubmitted}
                      value={answers[q.id] || ''}
                      onChange={e => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Type your exact response from audio..."
                      className="w-full max-w-md px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Explanations */}
                {isSubmitted && (
                  <div className={`mt-2 p-3 rounded-lg text-[11px] leading-relaxed pl-7 space-y-1 ${
                    isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-red-600" />}
                      <span>Correct Answer: {q.correctAnswer}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{q.explanation}</p>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {!submissionResult ? (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating Responses...' : 'Submit Answers & Calculate Band'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition"
          >
            Back to Listening Tasks
          </button>
        )}

      </div>

    </div>
  );
};
