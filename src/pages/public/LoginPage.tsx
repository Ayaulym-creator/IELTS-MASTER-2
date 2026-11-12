import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { GraduationCap, LogIn, AlertCircle, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (view: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, quickLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorStatus(null);
    setErrorMessage(null);

    try {
      const user = await login(email, password);
      if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
        onNavigate('admin_dashboard');
      } else {
        onNavigate('student_dashboard');
      }
    } catch (err: any) {
      if (err.payload?.status === 'PENDING_APPROVAL' || err.code === 'PENDING_APPROVAL') {
        setErrorStatus('PENDING_APPROVAL');
        setErrorMessage(err.message || 'Your registration is currently pending Super Admin approval. You will gain access once an administrator verifies and approves your account.');
      } else if (err.payload?.status === 'REJECTED' || err.code === 'ACCOUNT_REJECTED') {
        setErrorStatus('REJECTED');
        setErrorMessage('Your student application was not approved. Please contact admissions@ieltsmaster.kz.');
      } else if (err.payload?.status === 'SUSPENDED' || err.code === 'ACCOUNT_SUSPENDED') {
        setErrorStatus('SUSPENDED');
        setErrorMessage('Your student account is currently suspended. Please contact platform administrators.');
      } else if (err.payload?.status === 'DEACTIVATED' || err.code === 'ACCOUNT_DEACTIVATED') {
        setErrorStatus('DEACTIVATED');
        setErrorMessage('This account has been deactivated.');
      } else {
        setErrorMessage(err.message || 'Invalid email address or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = async (targetEmail: string) => {
    setEmail(targetEmail);
    if (targetEmail.includes('@example.kz')) {
      setPassword('Student2026!');
    } else {
      setPassword('IeltsMaster2026!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Sign In to IELTS MASTER</h2>
        <p className="text-xs text-slate-500">
          Academic preparation portal for students and administrators
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-8 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl space-y-6">
          
          {/* Status Alert Banners */}
          {errorStatus === 'PENDING_APPROVAL' && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide text-amber-800 dark:text-amber-300">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Account Status: Pending Super Admin Approval</span>
              </div>
              <p className="text-xs leading-relaxed">
                {errorMessage}
              </p>
              <div className="text-[11px] text-amber-700 dark:text-amber-400 pt-1 border-t border-amber-200 dark:border-amber-900">
                To test the approval flow immediately, click below to login as Super Admin and approve this student!
              </div>
            </div>
          )}

          {errorStatus && errorStatus !== 'PENDING_APPROVAL' && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide text-red-800 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Account Access Denied</span>
              </div>
              <p className="text-xs leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {!errorStatus && errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('recover_password')}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Demonstration Accounts Quick-Fill Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
              Quick Demonstration Accounts (Single Click)
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('ayaulymensegen123@gmail.com')}
                className="p-2 text-left rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-500" /> Super Admin
                </div>
                <div className="text-[10px] text-slate-500 truncate">ayaulymensegen123@...</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('aruzhan.s@example.kz')}
                className="p-2 text-left rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Approved Student
                </div>
                <div className="text-[10px] text-slate-500 truncate">aruzhan.s@example.kz</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('alikhan.n@example.kz')}
                className="p-2 text-left rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100 transition"
              >
                <div className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" /> Pending Student
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 truncate">alikhan.n@example.kz</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('nurasyl.b@example.kz')}
                className="p-2 text-left rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 hover:bg-red-100 transition"
              >
                <div className="font-semibold text-red-800 dark:text-red-300 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-red-500" /> Suspended Student
                </div>
                <div className="text-[10px] text-red-600 dark:text-red-400 truncate">nurasyl.b@example.kz</div>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            Do not have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Register here
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
