import React from 'react';

interface WritingVisualPromptProps {
  visualType?: 'line_graph' | 'bar_chart' | 'pie_chart' | 'table' | 'map' | 'process_diagram' | 'mixed_chart';
  visualData?: any;
}

export const WritingVisualPrompt: React.FC<WritingVisualPromptProps> = ({ visualType, visualData }) => {
  if (!visualType || !visualData) {
    return null;
  }

  // 1. Line Graph
  if (visualType === 'line_graph' && visualData.xAxis && visualData.series) {
    const { xAxis, series, title } = visualData;
    const maxVal = 50;

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm my-4">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4 text-center">
          {title || 'Renewable Electricity Generation by Source (2010–2025)'}
        </h4>

        <div className="relative h-64 w-full">
          <svg className="w-full h-full" viewBox="0 0 500 240">
            {/* Grid Lines */}
            {[0, 10, 20, 30, 40, 50].map((val) => {
              const y = 200 - (val / maxVal) * 180;
              return (
                <g key={val}>
                  <line x1="50" y1={y} x2="480" y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                  <text x="42" y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400">
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Series Lines */}
            {series.map((s: any) => {
              const points = s.data.map((d: number, i: number) => {
                const x = 50 + (i / (xAxis.length - 1)) * 430;
                const y = 200 - (d / maxVal) * 180;
                return `${x},${y}`;
              }).join(' ');

              return (
                <g key={s.name}>
                  <polyline
                    fill="none"
                    stroke={s.color}
                    strokeWidth="3"
                    points={points}
                  />
                  {s.data.map((d: number, i: number) => {
                    const x = 50 + (i / (xAxis.length - 1)) * 430;
                    const y = 200 - (d / maxVal) * 180;
                    return (
                      <circle key={i} cx={x} cy={y} r="4" fill={s.color} />
                    );
                  })}
                </g>
              );
            })}

            {/* X Axis Labels */}
            {xAxis.map((label: string, i: number) => {
              const x = 50 + (i / (xAxis.length - 1)) * 430;
              return (
                <text key={label} x={x} y="225" textAnchor="middle" className="text-[11px] font-medium fill-slate-500">
                  {label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          {series.map((s: any) => (
            <div key={s.name} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-slate-700 dark:text-slate-300 font-medium">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Map Layout Comparison
  if (visualType === 'map' && visualData.zones) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm my-4">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3 text-center">
          {visualData.title || 'Architectural Floor Plan Transition'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-950/40">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Original Floorplan (2015)
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {visualData.zones.map((z: any, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">{z.label}:</span>
                  <span>{z.year2015}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-blue-200 dark:border-blue-900/50 rounded-lg p-4 bg-blue-50/50 dark:bg-blue-950/20">
            <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">
              Renovated Modern Layout (Present)
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {visualData.zones.map((z: any, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">{z.label}:</span>
                  <span className="text-blue-900 dark:text-blue-300 font-medium">{z.present}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 3. Bar Chart Fallback
  if (visualType === 'bar_chart' && visualData.categories && visualData.values) {
    const { categories, values, title } = visualData;
    const maxVal = Math.max(...values, 100);

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm my-4">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4 text-center">
          {title}
        </h4>
        <div className="flex items-end justify-around h-48 pt-4 px-2 border-b border-slate-200 dark:border-slate-700">
          {categories.map((cat: string, i: number) => {
            const hPercent = (values[i] / maxVal) * 100;
            return (
              <div key={cat} className="flex flex-col items-center gap-1.5 w-16">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                  {values[i]}
                </span>
                <div
                  className="w-full bg-blue-600 hover:bg-blue-500 rounded-t transition-all"
                  style={{ height: `${hPercent}%` }}
                />
                <span className="text-[10px] text-slate-500 text-center truncate w-full">
                  {cat}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
