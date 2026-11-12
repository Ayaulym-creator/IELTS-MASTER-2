import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { User } from '../../types';

export const PendingRegistrationsPage: React.FC = () => {
  const [pending, setPending] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ students: User[] }>('/students/pending');
      setPending(res.students || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (student: User) => {
    try {
      await api.post(`/students/${student.id}/approve`, {});
      setMessage(`Approved enrollment for "${student.fullName}". Access granted immediately.`);
      fetchPending();
      setTimeout(() => setMessage(null), 4000);
    } catch (e: any) {
      alert(e.message || 'Approval failed');
    }
  };

  const handleReject = async (student: User) => {
    const reason = prompt(
      `Enter rejection reason for "${student.fullName}":`,
      'Registration details could not be verified'
    );
    if (!reason) return;

    try {
      await api.post(`/students/${student.id}/reject`, { reason });
      setMessage(`Rejected enrollment for "${student.fullName}".`);
      fetchPending();
      setTimeout(() => setMessage(null), 4000);
    } catch (e: any) {
      alert(e.message || 'Rejection failed');
    }
  };

  const handleApproveAll = async () => {
    if (!window.confirm(`Approve all ${pending.length} pending student candidates?`)) return;
    try {
      for (const st of pending) {
        await api.post(`/students/${st.id}/approve`, {});
      }
      setMessage(`All ${pending.length} students have been approved!`);
      fetchPending();
      setTimeout(() => setMessage(null), 4000);
    } catch (e: any) {
      alert(e.message || 'Batch approval failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-amber-500 text-slate-950">
              Admission Gate
            </span>
            <span className="text-xs text-slate-400">Strict Enrollment Verification</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Pending Student Approvals
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Students who registered on IELTS MASTER cannot access materials until vetted by the Super Admin.
          </p>
        </div>

        {pending.length > 1 && (
          <button
            onClick={handleApproveAll}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Approve All ({pending.length})
          </button>
        )}
      </div>

      {message && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs font-bold text-emerald-300">
          {message}
        </div>
      )}

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Checking pending admission inbox...</div>
        ) : pending.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="text-3xl text-slate-600">✓</div>
            <div className="text-base font-bold text-white">No Pending Registrations</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All candidate applications have been processed. New student registrations will automatically appear here for your review.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((st) => (
              <div
                key={st.id}
                className="p-5 bg-slate-950/70 border border-amber-900/30 hover:border-amber-700/50 rounded-xl transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{st.fullName}</h3>
                    <span className="text-xs text-slate-400">({st.city || 'Almaty'}, Kazakhstan)</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-950 text-amber-300 border border-amber-800">
                      PENDING APPROVAL
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <div>
                      Email: <span className="text-slate-200 font-mono">{st.email}</span>
                    </div>
                    <div>
                      Phone: <span className="text-slate-200 font-mono">{st.phone || 'N/A'}</span>
                    </div>
                    <div>
                      Target Band:{' '}
                      <span className="text-sky-400 font-mono font-bold">
                        {st.targetBandScore?.toFixed(1) || '7.0'}
                      </span>
                    </div>
                    <div>
                      Module:{' '}
                      <span className="text-slate-300 font-medium">
                        {st.ieltsType === 'GENERAL_TRAINING' ? 'General Training' : 'Academic'}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Application Timestamp:{' '}
                    {new Date(st.createdAt || st.registeredAt || Date.now()).toLocaleString('en-US', {
                      timeZone: 'Asia/Almaty',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    (Asia/Almaty)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(st)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-lg shadow-emerald-500/10"
                  >
                    Grant Admission
                  </button>
                  <button
                    onClick={() => handleReject(st)}
                    className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-800/60 font-semibold text-xs rounded-lg transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
