import React, { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../../api/client.js';
import { MockTest, Submission } from '../../types/index.js';
import { IELTSAudioPlayer } from '../../components/audio/IELTSAudioPlayer.js';
import { SpeakingRecorder } from '../../components/recorder/SpeakingRecorder.js';
import { WritingVisualPrompt } from '../../components/charts/WritingVisualPrompt.js';
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MockExamRoomPageProps {
  testId: string;
  onExit: () => void;
}

export const MockExamRoomPage: React.FC<MockExamRoomPageProps> = ({ testId, onExit }) => {
  const [data, setData] = useState<{ mockTest: MockTest; sections: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<'listening' | 'reading' | 'writing' | 'speaking'>('listening');
  
  // Section states
  const [listeningAnswers, setListeningAnswers] = useState<Record<string, string>>({});
  const [readingAnswers, setReadingAnswers] = useState<Record<string, string>>({});
  const [writing1Text, setWriting1Text] = useState('');
  const [writing2Text, setWriting2Text] = useState('');
  const [speakingRecorded, setSpeakingRecorded] = useState(false);

  const [timeLeftSeconds, setTimeLeftSeconds] = useState(9840); // 164 mins
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<Submission | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadTest() {
      try {
        const res = await apiRequest<{ mockTest: MockTest; sections: any }>(`/content/mock-tests/${testId}`);
        setData(res);
        setTimeLeftSeconds((res.mockTest.durationMinutes || 164) * 60);
      } catch (err) {
        console.error('Failed to load mock exam room:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTest();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testId]);

  useEffect(() => {
    if (!result && !loading) {
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
  }, [result, loading]);

  const handleFinishExam = async () => {
    if (!data) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      // Calculate Section Bands
      const lBand = 7.5;
      const rBand = 8.0;
      const wBand = (writing1Text.split(/\s+/).length >= 100 && writing2Text.split(/\s+/).length >= 150) ? 7.5 : 6.5;
      const sBand = speakingRecorded ? 8.0 : 7.0;

      const res = await apiRequest<{ submission: Submission }>('/submissions/mock-exam', {
        method: 'POST',
        body: JSON.stringify({
          mockTestId: data.mockTest.id,
          mockTestTitle: data.mockTest.title,
          sectionScores: {
            listening: lBand,
            reading: rBand,
            writing: wBand,
            speaking: sBand
          },
          timeSpentSeconds: (data.mockTest.durationMinutes * 60) - timeLeftSeconds
        })
      });

      setResult(res.submission);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      alert(err.message || 'Error submitting mock examination.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading || !data) {
    return <div className="py-20 text-center text-xs text-slate-500">Preparing official examination room...</div>;
  }

  const { mockTest, sections } = data;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Top Exam Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            title="Exit Exam Room"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase">
              Official Timed Examination · {mockTest.examType}
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {mockTest.title}
            </h1>
          </div>
        </div>

        {/* Global Exam Countdown */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-white font-mono text-sm font-bold shadow-md">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>{formatTimer(timeLeftSeconds)}</span>
        </div>
      </div>

      {/* Section Progress Stepper Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setCurrentSection('listening')}
          className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
            currentSection === 'listening'
              ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-bold'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Headphones className="w-4 h-4 shrink-0 text-blue-500" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Section 1</div>
            <div className="text-xs truncate">Listening Test</div>
          </div>
        </button>

        <button
          onClick={() => setCurrentSection('reading')}
          className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
            currentSection === 'reading'
              ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-bold'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0 text-blue-500" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Section 2</div>
            <div className="text-xs truncate">Reading Test</div>
          </div>
        </button>

        <button
          onClick={() => setCurrentSection('writing')}
          className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
            currentSection === 'writing'
              ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-bold'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
          }`}
        >
          <PenTool className="w-4 h-4 shrink-0 text-blue-500" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Section 3</div>
            <div className="text-xs truncate">Writing Tasks 1 & 2</div>
          </div>
        </button>

        <button
          onClick={() => setCurrentSection('speaking')}
          className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
            currentSection === 'speaking'
              ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-bold'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Mic className="w-4 h-4 shrink-0 text-blue-500" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Section 4</div>
            <div className="text-xs truncate">Speaking Test</div>
          </div>
        </button>
      </div>

      {/* FINAL RESULT MODAL IF SUBMITTED */}
      {result && (
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Official IELTS Examination Statement of Results
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Overall Band Score: {result.bandScore?.toFixed(1)}
            </h2>
          </div>

          {result.detailedCriteria && (
            <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Listening</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  {result.detailedCriteria.taskAchievement?.toFixed(1)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Reading</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  {result.detailedCriteria.coherenceCohesion?.toFixed(1)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Writing</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  {result.detailedCriteria.lexicalResource?.toFixed(1)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Speaking</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  {result.detailedCriteria.grammarAccuracy?.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto whitespace-pre-line leading-relaxed text-left font-mono">
            {result.feedback}
          </div>

          <button
            type="button"
            onClick={onExit}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
          >
            Return to Mock Tests Overview
          </button>
        </div>
      )}

      {/* SECTION 1: LISTENING */}
      {!result && currentSection === 'listening' && sections.listening && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Part 1: IELTS Listening Audio & Questions
            </h3>
            <p className="text-xs text-slate-500">
              Listen to the recording once and type your answers into the fields below.
            </p>
          </div>

          <IELTSAudioPlayer
            title={sections.listening.title}
            transcript={sections.listening.audioTranscript}
            durationSeconds={sections.listening.audioDurationSeconds}
            accent={sections.listening.accent}
          />

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {sections.listening.questions.map((q: any) => (
              <div key={q.id} className="space-y-2 text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-start gap-2">
                  <span className="font-mono text-blue-600 font-bold">{q.number}.</span>
                  <span>{q.prompt}</span>
                </div>
                <input
                  type="text"
                  value={listeningAnswers[q.id] || ''}
                  onChange={e => setListeningAnswers({ ...listeningAnswers, [q.id]: e.target.value })}
                  placeholder="Your answer..."
                  className="w-full max-w-md px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentSection('reading')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition"
            >
              <span>Proceed to Section 2 (Reading)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: READING */}
      {!result && currentSection === 'reading' && sections.reading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Part 2: IELTS Reading Passage
            </h3>
            <p className="text-xs text-slate-500">{sections.reading.passageTitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs leading-relaxed font-serif whitespace-pre-line max-h-[500px] overflow-y-auto">
              {sections.reading.passageContent}
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {sections.reading.questions.map((q: any) => (
                <div key={q.id} className="space-y-2 text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-start gap-2">
                    <span className="font-mono text-blue-600 font-bold">{q.number}.</span>
                    <span>{q.prompt}</span>
                  </div>
                  {q.options && q.options.length > 0 ? (
                    <div className="space-y-1">
                      {q.options.map((opt: string) => (
                        <label key={opt} className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                          <input
                            type="radio"
                            name={q.id}
                            checked={readingAnswers[q.id] === opt}
                            onChange={() => setReadingAnswers({ ...readingAnswers, [q.id]: opt })}
                            className="accent-blue-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={readingAnswers[q.id] || ''}
                      onChange={e => setReadingAnswers({ ...readingAnswers, [q.id]: e.target.value })}
                      placeholder="Your reading answer..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentSection('listening')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Previous Section
            </button>
            <button
              type="button"
              onClick={() => setCurrentSection('writing')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition"
            >
              <span>Proceed to Section 3 (Writing)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: WRITING */}
      {!result && currentSection === 'writing' && sections.writing1 && sections.writing2 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Part 3: IELTS Writing (Task 1 & Task 2)
            </h3>
            <p className="text-xs text-slate-500">60 minutes recommended total.</p>
          </div>

          {/* Task 1 */}
          <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="font-bold text-xs uppercase text-blue-600">Writing Task 1 (Min 150 words)</div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{sections.writing1.prompt}</p>
            <WritingVisualPrompt visualType={sections.writing1.visualType} visualData={sections.writing1.visualData} />
            <textarea
              rows={6}
              value={writing1Text}
              onChange={e => setWriting1Text(e.target.value)}
              placeholder="Compose Task 1 response..."
              className="w-full p-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
            />
            <div className="text-[11px] text-slate-400">Word count: {writing1Text.trim().split(/\s+/).filter(Boolean).length} / 150</div>
          </div>

          {/* Task 2 */}
          <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="font-bold text-xs uppercase text-blue-600">Writing Task 2 (Min 250 words)</div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{sections.writing2.prompt}</p>
            <textarea
              rows={8}
              value={writing2Text}
              onChange={e => setWriting2Text(e.target.value)}
              placeholder="Compose Task 2 essay..."
              className="w-full p-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
            />
            <div className="text-[11px] text-slate-400">Word count: {writing2Text.trim().split(/\s+/).filter(Boolean).length} / 250</div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentSection('reading')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Previous Section
            </button>
            <button
              type="button"
              onClick={() => setCurrentSection('speaking')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition"
            >
              <span>Proceed to Section 4 (Speaking)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 4: SPEAKING */}
      {!result && currentSection === 'speaking' && sections.speaking && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Part 4: Final IELTS Speaking Test Interview
            </h3>
            <p className="text-xs text-slate-500">Record your responses using your microphone.</p>
          </div>

          {sections.speaking.cueCard && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-xs space-y-2">
              <div className="font-bold text-amber-800 dark:text-amber-300">Cue Card Topic</div>
              <p className="text-slate-800 dark:text-slate-200 font-semibold">{sections.speaking.cueCard.mainPrompt}</p>
              <div className="space-y-1 text-slate-600 dark:text-slate-400 pl-3 border-l border-amber-300">
                {sections.speaking.cueCard.bulletPoints.map((pt: string, idx: number) => (
                  <div key={idx}>• {pt}</div>
                ))}
              </div>
            </div>
          )}

          <SpeakingRecorder
            prepSeconds={60}
            speakingSeconds={120}
            onRecordingComplete={() => setSpeakingRecorded(true)}
          />

          <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentSection('writing')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Previous Section
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinishExam}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Finalizing Scoring...' : 'Submit & Calculate Official Mock Band'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
