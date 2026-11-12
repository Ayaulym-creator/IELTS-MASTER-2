import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { ActivityLog } from '../../types';

export const StudyHistoryPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get<{ logs: ActivityLog[] }>('/logs/my');
        setLogs(res.logs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Study History & Log</h1>
        <p className="text-sm text-slate-400 mt-1">
          Chronological record of completed practice sessions, submissions, and platform activity (Asia/Almaty timezone).
        </p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading history records...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No activity recorded yet. Start practicing reading, listening, writing, or speaking tasks!
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-sky-400 uppercase">
                      {log.action}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{log.details}</span>
                  </div>
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="text-[11px] text-slate-500 font-mono">
                      {JSON.stringify(log.metadata)}
                    </div>
                  )}
                </div>

                <div className="text-right text-[11px] text-slate-500 whitespace-nowrap ml-4">
                  {new Date(log.timestamp).toLocaleString('en-US', {
                    timeZone: 'Asia/Almaty',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  Almaty
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
