import React from 'react';
import { useAuth } from '../../context/AuthContext.js';
import {
  GraduationCap,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  FileCheck,
  BookmarkCheck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Users
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user, quickLogin } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-700 dark:text-blue-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Premier IELTS Preparation System in Kazakhstan</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Master the IELTS with Complete Academic Rigor.
              </h1>

              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                IELTS MASTER provides over 36 complete authentic tasks for every skill, 36 comprehensive grammar units, 500+ academic vocabulary terms, and full mock examinations under official timing.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {user ? (
                  <button
                    onClick={() => onNavigate(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? 'admin_dashboard' : 'student_dashboard')}
                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg shadow-md transition flex items-center gap-2"
                  >
                    <span>Enter Your Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onNavigate('register')}
                      className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg shadow-md transition flex items-center gap-2"
                    >
                      <span>Register as Student</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigate('login')}
                      className="px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-lg border border-slate-300 dark:border-slate-700 transition"
                    >
                      Sign In to Platform
                    </button>
                  </>
                )}
              </div>

              {/* Quick Evaluation Switchers for Demonstration */}
              {!user && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    Instant Demo Login (Single Click)
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => quickLogin('ayaulymensegen123@gmail.com')}
                      className="px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition font-medium"
                    >
                      Login as Super Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => quickLogin('aruzhan.s@example.kz')}
                      className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition font-medium"
                    >
                      Login as Approved Student
                    </button>
                    <button
                      type="button"
                      onClick={() => quickLogin('alikhan.n@example.kz')}
                      className="px-3 py-1.5 rounded-md bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition font-medium"
                    >
                      Test Pending Approval Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hero Key Metrics Strip */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Curriculum Benchmark</h3>
                    <p className="text-xs text-slate-500">IELTS Academic & General Training</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 rounded">
                    Band 8.0+ Target
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">36+</div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">Reading Tasks</div>
                    <div className="text-[11px] text-slate-500">All 14 question formats</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">36+</div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">Listening Tasks</div>
                    <div className="text-[11px] text-slate-500">Real audio playback</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">36+</div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">Writing Tasks</div>
                    <div className="text-[11px] text-slate-500">Bands 6–9 model essays</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">36+</div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">Speaking Tasks</div>
                    <div className="text-[11px] text-slate-500">Mic recording studio</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-blue-900 dark:text-blue-200">500+ Unique IELTS Lexicon</div>
                    <div className="text-[11px] text-blue-700 dark:text-blue-400">18 thematic categories with phonetics</div>
                  </div>
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The 6 Core Modules Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Comprehensive Curriculum
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Six Pillars of IELTS Mastery
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Engineered strictly in English to ensure complete academic immersion and examination confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">IELTS Reading</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              At least 36 fully developed tasks spanning all 14 question types: True/False/Not Given, Matching Headings, Summary, and Table Completion with automated grading.
            </p>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>36 Complete Passages</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">IELTS Listening</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              36 playable audio tasks across Sections 1 to 4 with British, Australian, and international English accents, complete with full audio progress bar and speed controls.
            </p>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Actual Audio Playback</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <PenTool className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">IELTS Writing</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Academic Task 1 charts & diagrams, General Training letters, and Task 2 essays evaluated against official Task Achievement, Cohesion, Lexical, and Grammar criteria.
            </p>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Bands 6, 7, 8 & 9 Model Answers</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Speaking Studio</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Full Parts 1, 2, and 3 practice tasks featuring 1-minute cue card preparation timers, 2-minute live microphone recording, and instant audio playback analysis.
            </p>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Interactive Audio Recording</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Grammar Curriculum</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              All 36 official grammar topics covered in order: from Present Simple through Passive Voice, Mixed Conditionals, Inversion, and Advanced Syntactic Structures.
            </p>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>36 Complete Units</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Vocabulary Lexicon</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Over 500 unique English words and idioms categorized across 18 topics, equipped with IPA phonetics, definitions, interactive flashcards, and spaced repetition.
            </p>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>500+ Unique Entries</span>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials from Kazakh Students */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Student Proven Success
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Endorsed by Top Scholars Across Kazakhstan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "The 36 authentic writing tasks with model answers for Band 8 and Band 9 helped me understand exactly how to structure complex essays. I secured Band 8.5 on my Academic examination."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Ayaulym Yessengenova</div>
                  <div className="text-[11px] text-slate-500">Almaty · Academic Candidate</div>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">Band 8.5</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "Having playable audio with distinct accents and the 500+ vocabulary flashcard system made all the difference. The platform feels like real Cambridge exam testing."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Aruzhan Sarsenova</div>
                  <div className="text-[11px] text-slate-500">Astana · Academic Candidate</div>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">Band 8.0</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "The Speaking Studio’s preparation and speaking timers eliminated my hesitation under exam conditions. The feedback on fluency and lexical resource was spot-on."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Zhansaya Yermekova</div>
                  <div className="text-[11px] text-slate-500">Shymkent · Academic Candidate</div>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">Band 8.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Begin Your Journey to IELTS Band 8.0+
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Every registration is verified by our administrative team to guarantee academic discipline and small-cohort personalized attention.
        </p>
        <button
          onClick={() => onNavigate('register')}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg shadow-lg transition inline-flex items-center gap-2"
        >
          <span>Submit Student Registration</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
