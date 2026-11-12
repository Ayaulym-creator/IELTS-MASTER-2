import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { User, ActivityLog } from '../../types';

interface SuperAdminDashboardPageProps {
  onNavigate: (page: string) => void;
}

export const SuperAdminDashboardPage: React.FC<SuperAdminDashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [pendingStudents, setPendingStudents] = useState<User[]>([]);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, pendingRes, logsRes] = await Promise.all([
        api.get<any>('/analytics/overview'),
        api.get<{ students: User[] }>('/students/pending'),
        api.get<{ logs: ActivityLog[] }>('/logs?limit=8'),
      ]);
      setStats(analyticsRes);
      setPendingStudents(pendingRes.students || []);
      setRecentLogs(logsRes.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, name: string) => {
    try {
      await api.post(`/students/${id}/approve`, {});
      setActionMessage(`Student "${name}" approved successfully.`);
      fetchDashboardData();
      setTimeout(() => setActionMessage(null), 3500);
    } catch (e: any) {
      alert(e.message || 'Failed to approve');
    }
  };

  const handleReject = async (id: string, name: string) => {
    const reason = prompt(`Enter reason for rejecting ${name}:`, 'Incomplete registration details');
    if (!reason) return;
    try {
      await api.post(`/students/${id}/reject`, { reason });
      setActionMessage(`Student "${name}" rejected.`);
      fetchDashboardData();
      setTimeout(() => setActionMessage(null), 3500);
    } catch (e: any) {
      alert(e.message || 'Failed to reject');
    }
  };

  return (
    <div className="space-y-8">
      {/* Super Admin Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-800/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-black uppercase rounded bg-sky-500 text-slate-950">
              Super Admin Console
            </span>
            <span className="text-xs text-slate-400">Asia/Almaty Timezone</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Welcome, {user?.fullName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Permanent Super Administrator account ({user?.email}) with full platform authority.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin-pending')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/10"
          >
            <span>Pending Approvals</span>
            <span className="px-1.5 py-0.5 bg-slate-950 text-amber-300 text-[10px] font-black rounded-full">
              {stats?.pendingStudentsCount ?? pendingStudents.length}
            </span>
          </button>
          <button
            onClick={() => onNavigate('admin-students')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            Manage Students
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs font-bold text-emerald-300 animate-fadeIn">
          {actionMessage}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="text-xs font-medium text-slate-400">Total Registered</div>
          <div className="text-3xl font-black text-white">{stats?.totalStudents ?? '—'}</div>
          <div className="text-[11px] text-slate-500">Across Kazakhstan</div>
        </div>

        <div className="p-5 bg-slate-900 border border-amber-900/40 rounded-xl space-y-1 bg-gradient-to-b from-amber-950/20 to-slate-900">
          <div className="text-xs font-medium text-amber-400">Pending Review</div>
          <div className="text-3xl font-black text-amber-300">{stats?.pendingStudentsCount ?? '—'}</div>
          <div className="text-[11px] text-amber-500/80">Awaiting Super Admin approval</div>
        </div>

        <div className="p-5 bg-slate-900 border border-emerald-900/40 rounded-xl space-y-1">
          <div className="text-xs font-medium text-emerald-400">Active Students</div>
          <div className="text-3xl font-black text-emerald-300">{stats?.activeStudentsCount ?? '—'}</div>
          <div className="text-[11px] text-emerald-500/80">Approved & practicing</div>
        </div>

        <div className="p-5 bg-slate-900 border border-sky-900/40 rounded-xl space-y-1">
          <div className="text-xs font-medium text-sky-400">Total Submissions</div>
          <div className="text-3xl font-black text-sky-300">{stats?.totalSubmissions ?? '—'}</div>
          <div className="text-[11px] text-sky-500/80">Across all 4 skills & mocks</div>
        </div>
      </div>

      {/* Pending Student Approval Queue */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Pending Registration Queue</h2>
            <p className="text-xs text-slate-400">
              Students are strictly blocked from all IELTS materials until you grant admission.
            </p>
          </div>
          <button
            onClick={() => onNavigate('admin-pending')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300"
          >
            View All Pending ({pendingStudents.length}) →
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading pending students...</div>
        ) : pendingStudents.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-slate-800/80">
            <span className="text-xs text-slate-400">No pending student registrations at this time. All caught up!</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50">
            {pendingStudents.slice(0, 5).map((st) => (
              <div key={st.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{st.fullName}</span>
                    <span className="text-xs text-slate-400">({st.city}, Kazakhstan)</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-950 text-amber-300 border border-amber-800">
                      PENDING
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {st.email} • Target: Band {st.targetBandScore || 7.0} • {st.ieltsType}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Registered:{' '}
                    {new Date(st.createdAt || st.registeredAt || Date.now()).toLocaleString('en-US', {
                      timeZone: 'Asia/Almaty',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    (Almaty)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(st.id, st.fullName)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(st.id, st.fullName)}
                    className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-800/60 text-xs font-bold rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Platform Activity Logs */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Platform Audit Log</h2>
            <p className="text-xs text-slate-400">Real-time log of security, student, and admin events.</p>
          </div>
          <button
            onClick={() => onNavigate('admin-logs')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300"
          >
            Full Audit Log →
          </button>
        </div>

        <div className="space-y-2">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-300 font-bold">{log.userName}:</span>
                <span className="text-slate-400">{log.details}</span>
              </div>
              <span className="text-slate-500 font-mono text-[11px] whitespace-nowrap ml-4">
                {new Date(log.timestamp).toLocaleTimeString('en-US', {
                  timeZone: 'Asia/Almaty',
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                Almaty
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
