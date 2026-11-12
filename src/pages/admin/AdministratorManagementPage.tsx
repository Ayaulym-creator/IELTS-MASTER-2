import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { User, AdminPermissions } from '../../types';

export const AdministratorManagementPage: React.FC = () => {
  const { user: currentSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // New admin form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [permissions, setPermissions] = useState<AdminPermissions>({
    canApproveStudents: true,
    canManageContent: true,
    canViewAnalytics: true,
    canManageAdmins: false,
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ admins: User[] }>('/admins');
      setAdmins(res.admins || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admins', {
        fullName,
        email,
        password,
        permissions,
      });
      setNotice(`Admin account for "${fullName}" created successfully.`);
      setShowAddModal(false);
      setFullName('');
      setEmail('');
      setPassword('');
      fetchAdmins();
      setTimeout(() => setNotice(null), 4000);
    } catch (e: any) {
      alert(e.message || 'Failed to create admin');
    }
  };

  const handleToggleActive = async (admin: User) => {
    if (admin.role === 'SUPER_ADMIN') {
      alert('The Super Admin account cannot be deactivated.');
      return;
    }
    try {
      await api.patch(`/admins/${admin.id}`, { isActive: !admin.isActive });
      fetchAdmins();
    } catch (e: any) {
      alert(e.message || 'Update failed');
    }
  };

  const handleDeleteAdmin = async (admin: User) => {
    if (admin.role === 'SUPER_ADMIN') {
      alert('The Super Admin account cannot be deleted.');
      return;
    }
    if (!window.confirm(`Delete administrator "${admin.fullName}"?`)) return;

    try {
      await api.delete(`/admins/${admin.id}`);
      setNotice(`Admin "${admin.fullName}" removed.`);
      fetchAdmins();
      setTimeout(() => setNotice(null), 3000);
    } catch (e: any) {
      alert(e.message || 'Deletion failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-sky-500 text-slate-950">
              Super Admin Privilege
            </span>
            <span className="text-xs text-slate-400">Team & Authority Governance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Administrator Team
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure teaching assistants, content managers, and administrative delegates with granular access controls.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-sky-500/10"
        >
          <span>+ Add Administrator</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs font-bold text-emerald-300">
          {notice}
        </div>
      )}

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {admins.map((admin) => {
          const isSuper = admin.role === 'SUPER_ADMIN';
          return (
            <div
              key={admin.id}
              className={`p-6 bg-slate-900 border rounded-2xl space-y-4 ${
                isSuper ? 'border-sky-500/50 bg-gradient-to-br from-sky-950/30 to-slate-900' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded ${
                        isSuper ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {admin.role.replace('_', ' ')}
                    </span>
                    {admin.isActive ? (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">ACTIVE</span>
                    ) : (
                      <span className="text-[10px] text-rose-400 font-mono font-bold">INACTIVE</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1.5">{admin.fullName}</h3>
                  <p className="text-xs text-slate-400 font-mono">{admin.email}</p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-base">
                  {admin.fullName.charAt(0)}
                </div>
              </div>

              {/* Permissions list */}
              {(() => {
                const perms = (admin.permissions || {}) as AdminPermissions;
                return (
                  <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1.5 text-xs">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                      Assigned Privileges
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className={perms.canApproveStudents ? 'text-emerald-400' : 'text-slate-600'}>
                          ●
                        </span>
                        Approve Students
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className={perms.canManageContent ? 'text-emerald-400' : 'text-slate-600'}>
                          ●
                        </span>
                        Manage Content
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className={perms.canViewAnalytics ? 'text-emerald-400' : 'text-slate-600'}>
                          ●
                        </span>
                        View Analytics
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className={perms.canManageAdmins ? 'text-emerald-400' : 'text-slate-600'}>
                          ●
                        </span>
                        Manage Admins
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                <span className="text-slate-500 text-[11px]">
                  {isSuper ? 'Permanent Account' : 'Standard Delegated Admin'}
                </span>

                {!isSuper && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(admin)}
                      className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold"
                    >
                      {admin.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteAdmin(admin)}
                      className="px-2.5 py-1 text-[11px] bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 border border-rose-900/60 rounded font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAdmin}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-white">Create Administrator Account</h2>
            <p className="text-xs text-slate-400">
              New administrators will have access to delegated areas according to assigned permissions.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Askar Beketov"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Staff Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@ieltsmaster.kz"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="block text-xs font-bold text-slate-300 uppercase">Delegated Permissions</span>
              {[
                { key: 'canApproveStudents', label: 'Approve & Reject Students' },
                { key: 'canManageContent', label: 'Publish & Edit Curriculum' },
                { key: 'canViewAnalytics', label: 'View Student Scores & Analytics' },
                { key: 'canManageAdmins', label: 'Create & Manage Subordinate Staff' },
              ].map((perm) => (
                <label key={perm.key} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(permissions as any)[perm.key]}
                    onChange={(e) =>
                      setPermissions({ ...permissions, [perm.key]: e.target.checked })
                    }
                    className="rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-sky-500"
                  />
                  <span>{perm.label}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-800 text-xs font-semibold text-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg"
              >
                Create Staff Admin
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
