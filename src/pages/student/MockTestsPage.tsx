import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client.js';
import { MockTest } from '../../types/index.js';
import { Award, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface MockTestsPageProps {
  onStartExam: (testId: string) => void;
}

export const MockTestsPage: React.FC<MockTestsPageProps> = ({ onStartExam }) => {
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMocks() {
      try {
        const res = await apiRequest<{ mockTests: MockTest[] }>('/content/mock-tests');
        setMockTests(res.mockTests || []);
      } catch (err) {
        console.error('Failed to load mock tests:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMocks();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <Award className="w-4 h-4" />
            <span>FULL IELTS MOCK EXAMINATIONS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Official Simulation Exam Rooms ({mockTests.length} Full Suites)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete four-skill tests: Listening (30m), Reading (60m), Writing (60m), and Speaking (14m) under real exam timing conditions.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 self-start md:self-auto">
          Academic & General Training
        </div>
      </div>

      {/* Grid of Mock Tests */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading mock examinations...</div>
      ) : mockTests.length === 0 ? (
        <div className="py-20 text-center text-xs text-slate-500">No mock examinations currently published.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockTests.map((test) => (
            <div
              key={test.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {test.examType} Full Mock
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    {test.durationMinutes} Minutes Total
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {test.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {test.description}
                </p>

                {/* 4 Skill Badges */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Listening: 4 Sections Audio</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Reading: 3 Full Passages</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Writing: Task 1 & Task 2</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Speaking: Parts 1, 2 & 3 Studio</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartExam(test.id)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Enter Official Examination Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
