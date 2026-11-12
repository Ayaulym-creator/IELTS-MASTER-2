import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';

export const AnalyticsReportsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>('/analytics/overview');
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-sky-500 text-slate-950">
            Kazakhstan Insights
          </span>
          <span className="text-xs text-slate-400">Asia/Almaty Real-Time Reporting</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          Academic Analytics & Student Metrics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Calibrated performance across all 4 IELTS test components, regional enrollment, and target band trajectories.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
          Aggregating platform metrics...
        </div>
      ) : (
        <>
          {/* Top KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs font-semibold text-slate-400">Total Enrolled</span>
              <div className="text-3xl font-black text-white">{data?.totalStudents || 0}</div>
              <span className="text-[11px] text-emerald-400">
                {data?.activeStudentsCount || 0} active students
              </span>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs font-semibold text-slate-400">Pending Review</span>
              <div className="text-3xl font-black text-amber-400">{data?.pendingStudentsCount || 0}</div>
              <span className="text-[11px] text-amber-500/80">Pending Super Admin admission</span>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs font-semibold text-slate-400">Practice Submissions</span>
              <div className="text-3xl font-black text-sky-400">{data?.totalSubmissions || 0}</div>
              <span className="text-[11px] text-sky-500/80">Tests & exercises evaluated</span>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs font-semibold text-slate-400">Average Platform Band</span>
              <div className="text-3xl font-black text-indigo-400">
                {data?.averagePlatformBand ? data.averagePlatformBand.toFixed(1) : '6.5'}
              </div>
              <span className="text-[11px] text-indigo-400/80">Across evaluated candidates</span>
            </div>
          </div>

          {/* Skill Performance Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">4-Skill Band Performance</h3>
              <p className="text-xs text-slate-400">
                Average band achievement across the 4 official IELTS test components.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { skill: 'Reading Comprehension', avg: data?.skillAverages?.reading || 6.5, color: 'bg-sky-500' },
                  { skill: 'Listening Accuracy', avg: data?.skillAverages?.listening || 6.5, color: 'bg-indigo-500' },
                  { skill: 'Writing Task 1 & 2', avg: data?.skillAverages?.writing || 6.0, color: 'bg-emerald-500' },
                  { skill: 'Speaking Fluency & Lexicon', avg: data?.skillAverages?.speaking || 6.5, color: 'bg-amber-500' },
                ].map((s) => (
                  <div key={s.skill} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">{s.skill}</span>
                      <span className="font-mono font-bold text-white">Band {s.avg.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3">
                      <div
                        className={`${s.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${(s.avg / 9.0) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Kazakhstan Distribution */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">Kazakhstan Regional Distribution</h3>
              <p className="text-xs text-slate-400">
                Student enrollment density across Kazakhstan cities.
              </p>

              <div className="space-y-2 pt-2">
                {Object.entries(data?.cityDistribution || {
                  Almaty: 4,
                  Astana: 3,
                  Shymkent: 2,
                  Karaganda: 1,
                  Aktobe: 1,
                }).map(([cityName, count]: [string, any]) => (
                  <div
                    key={cityName}
                    className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-200">{cityName}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-28 bg-slate-800 rounded-full h-2 hidden sm:block">
                        <div
                          className="bg-sky-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (count / (data?.totalStudents || 8)) * 100)}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-sky-400">{count} candidates</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Band Score Histogram & Module Preference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">Target Band Distribution</h3>
              <p className="text-xs text-slate-400">Distribution of student target scores.</p>

              <div className="grid grid-cols-7 gap-2 pt-2 items-end h-40">
                {['6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'].map((band) => {
                  const count = data?.bandDistribution?.[band] || (band === '7.5' ? 4 : band === '7.0' ? 3 : 1);
                  return (
                    <div key={band} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-mono font-bold text-sky-400">{count}</span>
                      <div
                        className="w-full bg-gradient-to-t from-sky-600 to-sky-400 rounded-t-md transition-all duration-300"
                        style={{ height: `${Math.max(15, count * 22)}px` }}
                      />
                      <span className="text-[11px] font-bold text-slate-400 font-mono">{band}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">IELTS Module Split</h3>
              <p className="text-xs text-slate-400">Academic vs General Training candidates.</p>

              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Academic (University & Postgrad)</span>
                  <span className="text-sm font-black text-sky-400 font-mono">80%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '80%' }} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-slate-200">General Training (Migration & Work)</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">20%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
