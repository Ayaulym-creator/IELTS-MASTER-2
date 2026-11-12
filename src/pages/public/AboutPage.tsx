import React from 'react';
import { ShieldCheck, BookCheck, Globe, GraduationCap } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            About IELTS MASTER
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Setting the Benchmark for IELTS Preparation in Kazakhstan
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            IELTS MASTER was founded with a singular educational mission: to provide ambitious students across Kazakhstan with an authentic, uncompromised IELTS preparation experience mirroring official British Council and IDP standards.
          </p>
        </div>

        {/* Why English-Only Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
            <Globe className="w-4 h-4" />
            <span>The English-Only Pedagogical Standard</span>
          </div>
          <h3 className="text-xl font-bold">Total Linguistic Immersion</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Academic research consistently demonstrates that candidates achieve Band 7.5 and above only when their daily study environment is conducted exclusively in English. For this reason, IELTS MASTER maintains a strict 100% English interface, instruction set, and feedback system. No translated shortcuts, no Russian or Cyrillic crutches—pure academic English from the moment you log in until you complete your mock examination.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-3">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h4 className="text-base font-bold">Admin-Approved Student Cohort</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We do not treat IELTS preparation as an open, noisy social platform. Every new student application is individually reviewed and approved by our Super Admin team to ensure serious intent, appropriate target setting, and dedicated academic progression.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-3">
            <BookCheck className="w-6 h-6 text-blue-500" />
            <h4 className="text-base font-bold">Complete Authentic Tasks Only</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We reject fragmented questions or artificial summaries. Our reading modules contain full 800-word passages, our listening exercises contain real audio streams with authentic international accents, and our writing editor checks against official IELTS assessment criteria.
            </p>
          </div>
        </div>

        {/* Regional Focus */}
        <div className="bg-slate-100 dark:bg-slate-900/60 rounded-xl p-8 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold">Dedicated to Kazakh Scholars</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Whether preparing for undergraduate and master's degree admissions at Nazarbayev University, securing Bolashak international scholarship funding, or targeting top universities across the UK, USA, Canada, and Europe, IELTS MASTER provides the empirical rigor required to surpass your target band score.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition"
            >
              Submit Your Application
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
