import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';

export const ContentManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reading' | 'listening' | 'writing' | 'speaking' | 'grammar' | 'vocabulary' | 'mock-tests'>('reading');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>(`/content/${activeTab}`);
      // res could be { tasks: [...] } or { units: [...] } or { words: [...] } or { tests: [...] }
      const list = res.tasks || res.units || res.words || res.tests || [];
      setItems(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (item: any) => {
    const newStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.patch(`/content/${activeTab}/${item.id}/status`, { status: newStatus });
      setNotice(`Updated "${item.title || item.word}" to ${newStatus}.`);
      fetchContent();
      setTimeout(() => setNotice(null), 3000);
    } catch (e: any) {
      alert(e.message || 'Status update failed');
    }
  };

  const filtered = items.filter((it) => {
    const text = (it.title || it.word || it.name || it.topic || '').toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Curriculum & Content Hub</h1>
          <p className="text-sm text-slate-400 mt-1">
            Publishing control, draft stages, and live content verification across all modules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-sky-400 font-bold">
            {items.length} {activeTab.toUpperCase()} ITEMS
          </span>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs font-bold text-emerald-300">
          {notice}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'reading', label: 'Reading (36 Tasks)' },
          { id: 'listening', label: 'Listening (36 Tasks)' },
          { id: 'writing', label: 'Writing (36 Tasks)' },
          { id: 'speaking', label: 'Speaking (36 Tasks)' },
          { id: 'grammar', label: 'Grammar (36 Units)' },
          { id: 'vocabulary', label: 'Vocabulary (500+ Words)' },
          { id: 'mock-tests', label: 'Mock Exams (4 Full)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSearch('');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === tab.id
                ? 'bg-sky-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search in ${activeTab}...`}
          className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
        <span className="text-xs text-slate-500">Showing {filtered.length} matching</span>
      </div>

      {/* Content Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading curriculum items...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No items match the query.</div>
        ) : (
          <div className="divide-y divide-slate-800/60 max-h-[600px] overflow-y-auto">
            {filtered.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500 font-bold">#{idx + 1}</span>
                    <h3 className="font-bold text-white text-sm">
                      {item.title || item.word || item.topic}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        item.status === 'PUBLISHED' || !item.status
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {item.status || 'PUBLISHED'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {item.definition || item.description || item.prompt || (item.passage ? item.passage.slice(0, 120) + '...' : '')}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                    {item.category && <span>Category: {item.category}</span>}
                    {item.questionType && <span>Type: {item.questionType}</span>}
                    {item.timeLimitMinutes && <span>Time: {item.timeLimitMinutes}m</span>}
                    {item.bandLevel && <span>Level: Band {item.bandLevel}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
                  >
                    Inspect
                  </button>
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                      item.status === 'DRAFT'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {item.status === 'DRAFT' ? 'Publish' : 'Make Draft'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspect Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-sky-400 font-bold uppercase">{activeTab} Details</span>
                <h2 className="text-xl font-bold text-white">{previewItem.title || previewItem.word}</h2>
              </div>
              <button onClick={() => setPreviewItem(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-[11px] font-mono text-slate-300 max-h-96">
                {JSON.stringify(previewItem, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
