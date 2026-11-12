import React, { useState } from 'react';
import { apiRequest } from '../../api/client.js';
import { GraduationCap, KeyRound, CheckCircle2, ArrowLeft, Send } from 'lucide-react';

interface PasswordRecoveryPageProps {
  onNavigate: (view: string) => void;
}

export const PasswordRecoveryPage: React.FC<PasswordRecoveryPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest('/auth/recover-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true); // Always show acknowledgment to prevent user enumeration
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Password Recovery</h2>
        <p className="text-xs text-slate-500">
          Restore access to your IELTS MASTER account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-8 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl space-y-6">
          
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold">Reset Instructions Transmitted</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                If an authorized account is linked to <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>, a secure authentication recovery dispatch has been logged in the system.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Enter your registered student or administrator email address to request a verified password reset dispatch.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.kz"
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Processing...' : 'Send Recovery Instructions'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
