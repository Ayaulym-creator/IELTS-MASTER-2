import React from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { GraduationCap, LogOut, User as UserIcon, ShieldAlert, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, logout, quickLogin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        
        {/* Zone 1: Single Text Element Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-xl tracking-tight whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-500 transition">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span>IELTS MASTER</span>
        </button>

        {/* Zone 2: 4–5 concise, single-line text links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigate('home')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 dark:hover:text-white ${
              currentView === 'home' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('preparation')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 dark:hover:text-white ${
              currentView === 'preparation' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
            }`}
          >
            IELTS Preparation
          </button>
          <button
            onClick={() => onNavigate('features')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 dark:hover:text-white ${
              currentView === 'features' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
            }`}
          >
            Curriculum
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 dark:hover:text-white ${
              currentView === 'about' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
            }`}
          >
            About
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 dark:hover:text-white ${
              currentView === 'contact' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action & User Session */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'SUPER_ADMIN' ? (
                <button
                  onClick={() => onNavigate('admin_dashboard')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 rounded-lg shadow-sm transition whitespace-nowrap shrink-0 flex items-center gap-2"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Super Admin Console
                </button>
              ) : user.role === 'ADMIN' ? (
                <button
                  onClick={() => onNavigate('admin_dashboard')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 rounded-lg shadow-sm transition whitespace-nowrap shrink-0"
                >
                  Admin Panel
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('student_dashboard')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  Student Dashboard
                </button>
              )}

              <button
                onClick={logout}
                className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition whitespace-nowrap shrink-0"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition whitespace-nowrap shrink-0"
              >
                Register as Student
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
