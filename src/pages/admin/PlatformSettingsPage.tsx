import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { PlatformSettings } from '../../types';

export const PlatformSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ settings: PlatformSettings }>('/settings');
      setSettings(res.settings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      setSaving(true);
      await api.patch('/settings', settings);
      setMessage('Platform configurations saved successfully.');
      setTimeout(() => setMessage(null), 3000);
    } catch (e: any) {
      alert(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-12 text-center text-slate-500">Loading platform settings...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-sky-500 text-slate-950">
            System Config
          </span>
          <span className="text-xs text-slate-400">Production Platform Parameters</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          Platform Governance & System Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Operational controls, system announcement broadcasts, and strict admission parameters.
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs font-bold text-emerald-300">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
        {/* Core details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">General Identity</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Platform Brand Name</label>
            <input
              type="text"
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Support Contact Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">System Timezone</label>
              <input
                type="text"
                disabled
                value={settings.defaultTimezone}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Admission rules */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Admission Control</h3>

          <label className="flex items-start gap-3 p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowRegistration}
              onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
              className="mt-0.5 rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-sky-500"
            />
            <div>
              <span className="text-xs font-bold text-white block">Allow New Student Sign-ups</span>
              <span className="text-[11px] text-slate-400">
                When enabled, Kazakh candidates can register. New sign-ups enter PENDING_APPROVAL and require Super Admin approval.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="mt-0.5 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
            />
            <div>
              <span className="text-xs font-bold text-white block">Maintenance Mode</span>
              <span className="text-[11px] text-slate-400">
                Put platform in scheduled maintenance mode for regular database snapshots.
              </span>
            </div>
          </label>
        </div>

        {/* Global Announcement */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Global Candidate Announcement Banner
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Banner Text (Displayed to all students)
            </label>
            <textarea
              rows={2}
              value={settings.announcementBanner || ''}
              onChange={(e) => setSettings({ ...settings, announcementBanner: e.target.value })}
              placeholder="e.g. Next full mock exam date for Almaty & Astana candidates: Saturday, 10:00 AM Almaty Time."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Apply System Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
