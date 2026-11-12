import React from 'react';
import { useAuth } from '../../context/AuthContext.js';
import {
  LayoutDashboard,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  FileCheck2,
  BookmarkCheck,
  Award,
  BarChart3,
  TrendingUp,
  History,
  User,
  Settings,
  Users,
  UserCheck,
  Shield,
  Layers,
  FileText,
  Sliders,
  Activity,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  mode: 'student' | 'admin';
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, mode }) => {
  const { user, logout } = useAuth();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const studentNavItems = [
    { id: 'student_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reading', label: 'Reading', icon: BookOpen, badge: '36' },
    { id: 'listening', label: 'Listening', icon: Headphones, badge: '36' },
    { id: 'writing', label: 'Writing', icon: PenTool, badge: '36' },
    { id: 'speaking', label: 'Speaking', icon: Mic, badge: '36' },
    { id: 'grammar', label: 'Grammar', icon: FileCheck2, badge: '36' },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookmarkCheck, badge: '500+' },
    { id: 'mock_tests', label: 'Full Mock Tests', icon: Award, badge: '4' },
    { id: 'my_results', label: 'My Results', icon: BarChart3 },
    { id: 'my_progress', label: 'My Progress', icon: TrendingUp },
    { id: 'study_history', label: 'Study History', icon: History },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const adminNavItems = [
    { id: 'admin_dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'student_management', label: 'Student Management', icon: Users },
    { id: 'pending_registrations', label: 'Pending Approvals', icon: UserCheck, alert: true },
    ...(isSuperAdmin ? [{ id: 'admin_management', label: 'Administrator Team', icon: Shield }] : []),
    { id: 'content_management', label: 'Content Management', icon: Layers },
    { id: 'analytics_reports', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'activity_logs', label: 'Activity Logs', icon: Activity },
    ...(isSuperAdmin ? [{ id: 'platform_settings', label: 'Platform Settings', icon: Sliders }] : [])
  ];

  const items = mode === 'student' ? studentNavItems : adminNavItems;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col h-[calc(100vh-61px)] sticky top-[61px] shrink-0 select-none">
      {/* User Status Bar */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="truncate min-w-0">
            <div className="text-xs font-semibold text-white truncate">
              {user?.fullName || 'User'}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                user?.status === 'APPROVED' ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className="truncate">{user?.role?.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {mode === 'student' ? 'Learning Navigation' : 'Administrative Navigation'}
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {(item as any).badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-slate-400'
                }`}>
                  {(item as any).badge}
                </span>
              )}

              {(item as any).alert && (
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mode Switcher / Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-1">
        {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
          <button
            onClick={() => onNavigate(mode === 'student' ? 'admin_dashboard' : 'student_dashboard')}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-blue-400 hover:bg-blue-950/30 hover:text-blue-300 transition flex items-center gap-2"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Switch to {mode === 'student' ? 'Admin Portal' : 'Student View'}</span>
          </button>
        )}

        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition flex items-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
