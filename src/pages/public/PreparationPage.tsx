import React from 'react';
import { Award, BookOpen, Headphones, PenTool, Mic, CheckCircle2 } from 'lucide-react';

interface PreparationPageProps {
  onNavigate: (view: string) => void;
}

export const PreparationPage: React.FC<PreparationPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 text-slate-900 dark:text-slate-100">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Examination Guide
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            IELTS Academic vs General Training
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            Understand the structural differences between IELTS test formats and learn how IELTS MASTER trains you for every question format across both examination modalities.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/30 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">IELTS Academic</h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                Higher Education
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Designed for candidates applying for undergraduate, master’s, or doctorate admissions at international institutions, as well as registration with professional healthcare and engineering regulatory bodies.
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Reading: 3 long complex academic passages (scientific journals, history, biology)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Writing Task 1: Synthesize visual data (graphs, bar charts, maps, process flow)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Writing Task 2: Formal argumentative academic essay (min 250 words)</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">IELTS General Training</h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Immigration & Career
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Required for permanent residency applications (Canada Express Entry, Australia Skilled Migration, UK Visas) and secondary vocational training programs.
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Reading: Practical daily notices, workplace manuals, and one general interest article</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Writing Task 1: Formal, semi-formal, or informal correspondence letter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Writing Task 2: Discursive opinion or problem-solution essay (min 250 words)</span>
              </div>
            </div>
          </div>
        </div>

        {/* IELTS 9-Band Scale Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold">The Official 9-Band Performance Scale</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="font-bold text-blue-600 dark:text-blue-400 w-24">Band 9.0</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 w-36">Expert User</span>
              <span className="text-slate-500 flex-1">Complete operational command; appropriate, accurate, and fluent with complete understanding.</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="font-bold text-blue-600 dark:text-blue-400 w-24">Band 8.0</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 w-36">Very Good User</span>
              <span className="text-slate-500 flex-1">Fully operational command with only occasional unsystematic inaccuracies. Handles complex detailed argumentation well.</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="font-bold text-blue-600 dark:text-blue-400 w-24">Band 7.0</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 w-36">Good User</span>
              <span className="text-slate-500 flex-1">Operational command; generally handles complex language well and understands detailed reasoning despite occasional inaccuracies.</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="font-bold text-blue-600 dark:text-blue-400 w-24">Band 6.0</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 w-36">Competent User</span>
              <span className="text-slate-500 flex-1">Generally effective command despite some inaccuracies. Can use and understand fairly complex language, especially in familiar situations.</span>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('register')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-md transition"
          >
            Start Preparing on IELTS MASTER
          </button>
        </div>

      </div>
    </div>
  );
};
