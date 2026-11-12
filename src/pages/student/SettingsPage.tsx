import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [audioSpeed, setAudioSpeed] = useState('1.0');
  const [accent, setAccent] = useState('british');
  const [highContrast, setHighContrast] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ielts_pref_speed', audioSpeed);
    localStorage.setItem('ielts_pref_accent', accent);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Audio & Practice Preferences</h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure listening synthesizer accents, test environment timing, and interface display.
        </p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
        {saved && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-800 rounded-lg text-xs text-emerald-300 font-medium">
            Preferences updated in your browser profile.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Audio Synthesis & Accents
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Default English Accent
              </label>
              <select
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="british">British Received Pronunciation (Standard IELTS)</option>
                <option value="australian">Australian English (Common in Section 1 & 2)</option>
                <option value="american">General American English</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Playback Speed Multiplier
              </label>
              <select
                value={audioSpeed}
                onChange={(e) => setAudioSpeed(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="0.9">0.9x (Careful Study)</option>
                <option value="1.0">1.0x (Standard Official IELTS Exam Pace)</option>
                <option value="1.1">1.1x (Challenging Speed Training)</option>
                <option value="1.25">1.25x (Fast Listening Conditioning)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Regional & Timezone Setting
            </h3>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Default Examination Timezone</div>
                <div className="text-xs text-slate-400">Asia/Almaty (UTC+5 standard across Kazakhstan)</div>
              </div>
              <span className="text-xs font-mono text-sky-400 font-bold">LOCKED</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
