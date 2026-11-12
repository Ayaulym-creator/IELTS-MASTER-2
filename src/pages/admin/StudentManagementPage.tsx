import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { User, StudentStatus } from '../../types';

export const StudentManagementPage: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [editModalStudent, setEditModalStudent] = useState<User | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ students: User[] }>('/students');
      setStudents(res.students || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (studentId: string, action: 'approve' | 'reject' | 'suspend' | 'restore' | 'deactivate', reason?: string) => {
    try {
      await api.post(`/students/${studentId}/${action}`, { reason });
      setActionNotice(`Student updated (${action}).`);
      await fetchStudents();
      if (selectedStudent && selectedStudent.id === studentId) {
        const updated = await api.get<{ student: User }>(`/students/${studentId}`);
        setSelectedStudent(updated.student);
      }
      setTimeout(() => setActionNotice(null), 3000);
    } catch (e: any) {
      alert(e.message || 'Operation failed');
    }
  };

  const handleDelete = async (student: User) => {
    if (!window.confirm(`Permanently remove student account for "${student.fullName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/students/${student.id}`);
      setActionNotice(`Student ${student.fullName} deleted.`);
      if (selectedStudent?.id === student.id) setSelectedStudent(null);
      await fetchStudents();
      setTimeout(() => setActionNotice(null), 3000);
    } catch (e: any) {
      alert(e.message || 'Deletion failed');
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalStudent) return;
    try {
      await api.patch(`/students/${editModalStudent.id}`, {
        fullName: editModalStudent.fullName,
        city: editModalStudent.city,
        phone: editModalStudent.phone,
        targetBandScore: editModalStudent.targetBandScore,
        ieltsType: editModalStudent.ieltsType,
      });
      setActionNotice('Student details updated.');
      setEditModalStudent(null);
      await fetchStudents();
      setTimeout(() => setActionNotice(null), 3000);
    } catch (e: any) {
      alert(e.message || 'Save failed');
    }
  };

  const filtered = students.filter((st) => {
    const matchesSearch =
      st.fullName.toLowerCase().includes(search.toLowerCase()) ||
      st.email.toLowerCase().includes(search.toLowerCase()) ||
      (st.city && st.city.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || st.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">APPROVED</span>;
      case 'PENDING_APPROVAL':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-950/80 text-amber-400 border border-amber-800 animate-pulse">PENDING</span>;
      case 'SUSPENDED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-950/80 text-rose-400 border border-rose-800">SUSPENDED</span>;
      case 'REJECTED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-400 border border-slate-700">REJECTED</span>;
      case 'DEACTIVATED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-900 text-slate-500 border border-slate-800">DEACTIVATED</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Student Roster Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Authoritative registry of all enrolled Kazakhstan candidates, approval gates, and academic standing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total registered:</span>
          <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-white font-mono font-bold text-xs">
            {students.length} students
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs font-bold text-emerald-300">
          {actionNotice}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, city..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['ALL', 'PENDING_APPROVAL', 'APPROVED', 'SUSPENDED', 'REJECTED', 'DEACTIVATED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                statusFilter === st
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'All' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading student directory...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No students match the current criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                  <th className="py-3 px-4">Student Name & Email</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Target Band</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered (Almaty)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{st.fullName}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{st.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{st.city || 'Almaty'}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-sky-400">
                        Band {st.targetBandScore?.toFixed(1) || '7.0'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-slate-300">
                        {st.ieltsType === 'GENERAL_TRAINING' ? 'General Training' : 'Academic'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(st.status)}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(st.createdAt || st.registeredAt || Date.now()).toLocaleDateString('en-US', {
                        timeZone: 'Asia/Almaty',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudent(st)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setEditModalStudent(st)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold"
                        >
                          Edit
                        </button>

                        {st.status === 'PENDING_APPROVAL' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(st.id, 'approve')}
                              className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-[11px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(st.id, 'reject', 'Application not accepted')}
                              className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded text-[11px] font-bold"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {st.status === 'APPROVED' && (
                          <button
                            onClick={() => handleStatusChange(st.id, 'suspend', 'Administrative review')}
                            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded text-[11px] font-medium"
                          >
                            Suspend
                          </button>
                        )}

                        {st.status === 'SUSPENDED' && (
                          <button
                            onClick={() => handleStatusChange(st.id, 'restore')}
                            className="px-2 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded text-[11px] font-medium"
                          >
                            Restore
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(st)}
                          className="px-2 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded text-[11px] font-semibold border border-rose-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Profile & History Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase">Student Record Dossier</span>
                <h2 className="text-xl font-bold text-white">{selectedStudent.fullName}</h2>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Email Address</span>
                <span className="font-mono text-white font-semibold">{selectedStudent.email}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Status</span>
                <div className="mt-1">{getStatusBadge(selectedStudent.status)}</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">City</span>
                <span className="text-white font-semibold">{selectedStudent.city || 'Almaty'}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Phone</span>
                <span className="text-white font-semibold">{selectedStudent.phone || 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Target Band</span>
                <span className="text-sky-400 font-bold font-mono text-base">
                  Band {selectedStudent.targetBandScore?.toFixed(1) || '7.0'}
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Module</span>
                <span className="text-white font-semibold">{selectedStudent.ieltsType}</span>
              </div>
            </div>

            {selectedStudent.rejectionReason && (
              <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-lg text-xs text-rose-300">
                <strong className="block mb-1">Rejection Reason:</strong>
                {selectedStudent.rejectionReason}
              </div>
            )}

            {selectedStudent.suspensionReason && (
              <div className="p-3 bg-amber-950/40 border border-amber-800 rounded-lg text-xs text-amber-300">
                <strong className="block mb-1">Suspension Reason:</strong>
                {selectedStudent.suspensionReason}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleEditSave}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4"
          >
            <h2 className="text-lg font-bold text-white">Edit Student Details</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={editModalStudent.fullName}
                onChange={(e) => setEditModalStudent({ ...editModalStudent, fullName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">City</label>
              <input
                type="text"
                value={editModalStudent.city || ''}
                onChange={(e) => setEditModalStudent({ ...editModalStudent, city: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Phone</label>
              <input
                type="text"
                value={editModalStudent.phone || ''}
                onChange={(e) => setEditModalStudent({ ...editModalStudent, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target Band</label>
              <input
                type="number"
                step="0.5"
                min="4"
                max="9"
                value={editModalStudent.targetBandScore || 7.0}
                onChange={(e) =>
                  setEditModalStudent({ ...editModalStudent, targetBandScore: parseFloat(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setEditModalStudent(null)}
                className="px-4 py-2 bg-slate-800 text-xs font-semibold text-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
