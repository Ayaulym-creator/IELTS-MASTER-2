import React from 'react';
import { GraduationCap, Globe, Clock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Regional Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span>IELTS MASTER</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premium IELTS Academic and General Training preparation platform engineered specifically for students in Kazakhstan.
            </p>
            <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Default Timezone: Asia/Almaty (UTC+5)</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Language Policy: 100% English Academic Immersion</span>
              </div>
            </div>
          </div>

          {/* Academic Modules */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Curriculum Modules
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('reading')} className="hover:text-white transition">
                  IELTS Reading (36 Tasks)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('listening')} className="hover:text-white transition">
                  IELTS Listening (36 Tasks & Audio)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('writing')} className="hover:text-white transition">
                  IELTS Writing (Tasks 1 & 2)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('speaking')} className="hover:text-white transition">
                  IELTS Speaking Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('grammar')} className="hover:text-white transition">
                  36 Comprehensive Grammar Units
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vocabulary')} className="hover:text-white transition">
                  500+ IELTS Vocabulary Lexicon
                </button>
              </li>
            </ul>
          </div>

          {/* Examinations & Analytics */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Testing & Results
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('mock_tests')} className="hover:text-white transition">
                  Full IELTS Academic Mock Tests
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mock_tests')} className="hover:text-white transition">
                  Full General Training Mock Tests
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('my_results')} className="hover:text-white transition">
                  Performance Band Scores & Scoring
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('my_progress')} className="hover:text-white transition">
                  Skill Mastery Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('study_history')} className="hover:text-white transition">
                  Study Log & Historical Submissions
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional Contact */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Admissions & Support
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Al-Farabi Avenue Campus, Almaty</li>
              <li>Kabanbay Batyr Avenue Campus, Astana</li>
              <li>Email: admissions@ieltsmaster.kz</li>
              <li>Telephone: +7 (7172) 70-55-00</li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Super Admin Governed
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} IELTS MASTER. All rights reserved. English-only educational standard.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300 transition">
              About IELTS MASTER
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-300 transition">
              Admissions Policy
            </button>
            <button onClick={() => onNavigate('login')} className="hover:text-slate-300 transition">
              Administrative Access
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
