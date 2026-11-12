import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [targetBand, setTargetBand] = useState<number>(user?.targetBandScore || 7.5);
  const [ieltsType, setIeltsType] = useState(user?.ieltsType || 'ACADEMIC');
  const [city, setCity] = useState(user?.city || 'Almaty');
  const [phone, setPhone] = useState(user?.phone || '+7 (701) 123-4567');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      await api.patch('/auth/me/profile', {
        targetBandScore: targetBand,
        ieltsType,
        city,
        phone,
      });
      await refreshUser();
      setMessage('Profile updated successfully.');
    } catch (err: any) {
      setMessage(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Student Profile</h1>
        <p className="text-sm text-slate-400 mt-1">
          Personal identification, target score goals, and regional preferences for Kazakhstan candidates.
        </p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
        {/* Account Info Pill */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.fullName}</h2>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                {user?.status}
              </span>
              <span className="text-[11px] text-slate-500">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { timeZone: 'Asia/Almaty' }) : '2026'}
              </span>
            </div>
          </div>
        </div>

        {message && (
          <div className="p-3 bg-sky-950/50 border border-sky-800 rounded-lg text-xs text-sky-300 font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target IELTS Band</label>
              <select
                value={targetBand}
                onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                  <option key={b} value={b}>
                    Band {b.toFixed(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">IELTS Test Module</label>
              <select
                value={ieltsType}
                onChange={(e) => setIeltsType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="ACADEMIC">Academic (University & Higher Education)</option>
                <option value="GENERAL_TRAINING">General Training (Migration & Work)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kazakhstan City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Almaty, Astana, Shymkent, Karaganda..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (701) 000-0000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
