import React from 'react';
import { 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  FileCheck2, 
  BookmarkCheck, 
  Award, 
  BarChart3, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

interface FeaturesPageProps {
  onNavigate: (view: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Platform Specifications
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            The Complete IELTS Learning Architecture
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Every feature on IELTS MASTER has been developed to fulfill authentic international exam standards. Explore our six curriculum modules and testing engine below.
          </p>
        </div>

        {/* Feature Sections */}
        <div className="space-y-12">
          
          {/* 1. Reading Module */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">IELTS Reading Preparation</h3>
                  <p className="text-xs text-slate-500">36 Complete Tasks · All 14 Question Formats</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                Academic & General Training
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Multiple Choice Questions</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> True / False / Not Given</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Yes / No / Not Given</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Matching Headings & Features</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Summary & Note Completion</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Flow-Chart & Diagram Labeling</div>
            </div>
          </div>

          {/* 2. Listening Module */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">IELTS Listening System</h3>
                  <p className="text-xs text-slate-500">36 Complete Tasks · Playable Voice Audio · Sections 1–4</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                British, Australian & International Accents
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Section 1: Everyday Social Dialogue</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Section 2: Public Services Monologue</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Section 3: Educational Seminar & Tutorial</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Section 4: Academic Scientific Lecture</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Interactive Audio Waveform & Speed (0.8x–1.2x)</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Form, Table, Note, and Diagram Completion</div>
            </div>
          </div>

          {/* 3. Writing Module */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">IELTS Writing Studio</h3>
                  <p className="text-xs text-slate-500">36 Tasks · Academic Task 1 Charts · GT Letters · Task 2 Essays</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                Official 4-Criterion Evaluation
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Task Achievement / Task Response</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Coherence & Cohesion Analysis</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Lexical Resource & Academic Collocations</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Grammatical Range & Syntactic Accuracy</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Live Word & Character Counter with Exam Timer</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Model Answers for Bands 6.0, 7.0, 8.0 & 9.0</div>
            </div>
          </div>

          {/* 4. Speaking Studio */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">IELTS Speaking Studio</h3>
                  <p className="text-xs text-slate-500">36 Tasks · Parts 1, 2, and 3 · Audio Recording & Cue Cards</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                Microphone MediaRecorder
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Part 1: Personal Interview Questions</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Part 2: Cue Card with 1-Min Preparation Timer</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Part 2: 2-Minute Long Turn Voice Recording</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Part 3: Deep In-Depth Abstract Discussion</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> High-Band Vocabulary & Idiomatic Suggestions</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Instant Playback and Practice History</div>
            </div>
          </div>

          {/* 5. Grammar & Vocabulary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-6 h-6 text-blue-600" />
                <h4 className="text-lg font-bold">36 Grammar Units</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Covering all 36 specified topics: Present Simple, Present Continuous, Conditionals 0–3 & Mixed, Passive Voice, Relative Clauses, Inversion, Subjunctive, and Advanced Sentence Structures with interactive practice questions.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <BookmarkCheck className="w-6 h-6 text-emerald-600" />
                <h4 className="text-lg font-bold">500+ Unique Vocabulary Lexicon</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                18 academic categories including Education, Environment, Health, Society, Technology, Business, and Globalization with IPA phonetics, definitions, examples, interactive flashcards, quizzes, and spaced repetition.
              </p>
            </div>
          </div>

        </div>

        <div className="text-center pt-6">
          <button
            onClick={() => onNavigate('register')}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-md transition"
          >
            Create Your Student Account
          </button>
        </div>

      </div>
    </div>
  );
};
