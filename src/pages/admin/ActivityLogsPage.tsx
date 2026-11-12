import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { ActivityLog } from '../../types';

export const ActivityLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ logs: ActivityLog[] }>('/logs?limit=100');
      setLogs(res.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter((l) => {
    if (actionFilter === 'ALL') return true;
    return l.action.includes(actionFilter);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-sky-500 text-slate-950">
              Audit Trail
            </span>
            <span className="text-xs text-slate-400">Asia/Almaty Timestamps</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            System & Security Activity Logs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete tamper-evident audit history of registrations, approvals, rejections, exam submissions, and admin actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'STUDENT', 'SUBMISSION', 'LOGIN', 'SETTINGS'].map((tag) => (
            <button
              key={tag}
              onClick={() => setActionFilter(tag)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                actionFilter === tag
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Retrieving audit records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No activity logs found for this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                  <th className="py-3 px-4">Timestamp (Almaty)</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">User / Actor</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-US', {
                        timeZone: 'Asia/Almaty',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 font-bold rounded bg-slate-950 text-sky-400 border border-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-bold">{log.userName}</td>
                    <td className="py-3 px-4 text-slate-300 font-sans text-xs">{log.details}</td>
                    <td className="py-3 px-4 text-slate-500">{log.ipAddress || '127.0.0.1'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
