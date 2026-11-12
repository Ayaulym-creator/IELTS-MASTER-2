import React, { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../../api/client.js';
import { WritingTask, Submission } from '../../types/index.js';
import { WritingVisualPrompt } from '../../components/charts/WritingVisualPrompt.js';
import { 
  ArrowLeft, 
  Clock, 
  Send, 
  Save, 
  Award, 
  FileCheck2, 
  BookOpen, 
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WritingTaskPageProps {
  taskId: string;
  onBack: () => void;
}

export const WritingTaskPage: React.FC<WritingTaskPageProps> = ({ taskId, onBack }) => {
  const [task, setTask] = useState<WritingTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [essayText, setEssayText] = useState('');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(2400); // 40 or 20 mins
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<Submission | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'model_answers'>('editor');
  const [selectedModelBand, setSelectedModelBand] = useState<'band9' | 'band8' | 'band7' | 'band6'>('band9');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadTask() {
      try {
        const res = await apiRequest<{ task: WritingTask }>(`/content/writing/${taskId}`);
        setTask(res.task);
        setTimeLeftSeconds((res.task?.recommendedMinutes || 40) * 60);

        // Check for local draft
        const draft = localStorage.getItem(`draft_writing_${taskId}`);
        if (draft) setEssayText(draft);
      } catch (err) {
        console.error('Failed to load writing task:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTask();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [taskId]);

  useEffect(() => {
    if (!submissionResult && !loading) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [submissionResult, loading]);

  const handleSaveDraft = () => {
    localStorage.setItem(`draft_writing_${taskId}`, essayText);
    setSaveStatus('Draft saved to browser storage.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSubmit = async () => {
    if (!task) return;
    if (wordsCount < 50) {
      alert('Please compose at least 50 words before submitting for assessment.');
      return;
    }

    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const res = await apiRequest<{ submission: Submission }>('/submissions/writing', {
        method: 'POST',
        body: JSON.stringify({
          taskId: task.id,
          taskTitle: task.title,
          submittedText: essayText,
          timeSpentSeconds: (task.recommendedMinutes * 60) - timeLeftSeconds
        })
      });
      setSubmissionResult(res.submission);
      localStorage.removeItem(`draft_writing_${taskId}`);

      if ((res.submission.bandScore || 0) >= 7.5) {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      alert(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const words = essayText.trim().split(/\s+/).filter(Boolean);
  const wordsCount = words.length;
  const charsCount = essayText.length;
  const minRequired = task?.minWords || 150;
  const isMinReached = wordsCount >= minRequired;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading || !task) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading writing workspace...</div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            title="Return to Writing Tasks"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase">
              {task.taskType.replace('_', ' ').toUpperCase()} · Min {task.minWords} Words
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {task.title}
            </h1>
          </div>
        </div>

        {/* Timer & Tabs */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-950">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                activeTab === 'editor'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Writing Editor
            </button>
            <button
              onClick={() => setActiveTab('model_answers')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                activeTab === 'model_answers'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-blue-500" />
              <span>Model Answers (Bands 6–9)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white border border-slate-800 text-xs font-mono font-bold shadow-sm">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{formatTimer(timeLeftSeconds)}</span>
          </div>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Prompt & Visual Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                Official Examination Prompt
              </h3>
              
              <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line">
                {task.prompt}
              </div>

              {/* Render charts/diagrams for Task 1 */}
              <WritingVisualPrompt visualType={task.visualType} visualData={task.visualData} />

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-500">
                <div className="font-semibold text-slate-700 dark:text-slate-300">Official Assessment Focus:</div>
                {task.keyAssessmentPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-500">•</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Criteria Evaluation Banner if submitted */}
            {submissionResult && (
              <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Official IELTS Assessment Result
                  </div>
                  <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                    Band {submissionResult.bandScore?.toFixed(1)}
                  </div>
                </div>

                {submissionResult.detailedCriteria && (
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 block">Task Achievement</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">
                        Band {submissionResult.detailedCriteria.taskAchievement?.toFixed(1)}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 block">Coherence & Cohesion</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">
                        Band {submissionResult.detailedCriteria.coherenceCohesion?.toFixed(1)}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 block">Lexical Resource</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">
                        Band {submissionResult.detailedCriteria.lexicalResource?.toFixed(1)}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 block">Grammar Accuracy</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">
                        Band {submissionResult.detailedCriteria.grammarAccuracy?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-blue-50/50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-100 dark:border-blue-900/50">
                  {submissionResult.feedback}
                </div>
              </div>
            )}
          </div>

          {/* Writing Editor Column */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            
            {/* Editor Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
              <div className="flex items-center gap-4">
                <div className={`font-semibold tabular-nums flex items-center gap-1.5 ${
                  isMinReached ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {isMinReached ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{wordsCount} / {minRequired} words</span>
                </div>
                <div className="text-slate-400 tabular-nums">
                  {charsCount} characters
                </div>
              </div>

              <div className="flex items-center gap-2">
                {saveStatus && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {saveStatus}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>
              </div>
            </div>

            {/* Main Textarea */}
            <textarea
              rows={16}
              value={essayText}
              disabled={!!submissionResult}
              onChange={e => setEssayText(e.target.value)}
              placeholder="Begin typing your response in formal academic English..."
              className="w-full p-4 text-xs md:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400">
                {!isMinReached && (
                  <span>Need {minRequired - wordsCount} more words to satisfy minimum benchmark.</span>
                )}
              </div>

              {!submissionResult ? (
                <button
                  type="button"
                  disabled={isSubmitting || wordsCount < 40}
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Evaluating Submission...' : 'Submit Essay for Evaluation'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition"
                >
                  Back to Writing Tasks
                </button>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* Model Answers Tab */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Official IELTS Benchmark Model Answers
              </h3>
              <p className="text-xs text-slate-500">
                Compare structural transitions, collocations, and grammatical variations across different band levels.
              </p>
            </div>

            {/* Band Selectors */}
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-950">
              {(['band9', 'band8', 'band7', 'band6'] as const).map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedModelBand(b)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                    selectedModelBand === b
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Band {b.replace('band', '')}.0
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif whitespace-pre-line">
            {task.modelAnswers[selectedModelBand]}
          </div>

          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Key Analytical Takeaway for Band {selectedModelBand.replace('band', '')}.0:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Notice the sentence length modulation, precise logical subordination, and deliberate deployment of academic collocations without conversational filler words.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
