import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Sidebar } from './components/layout/Sidebar';

// Public pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { PreparationPage } from './pages/public/PreparationPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { PasswordRecoveryPage } from './pages/public/PasswordRecoveryPage';

// Student pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { ReadingPage } from './pages/student/ReadingPage';
import { ReadingTaskPage } from './pages/student/ReadingTaskPage';
import { ListeningPage } from './pages/student/ListeningPage';
import { ListeningTaskPage } from './pages/student/ListeningTaskPage';
import { WritingPage } from './pages/student/WritingPage';
import { WritingTaskPage } from './pages/student/WritingTaskPage';
import { SpeakingPage } from './pages/student/SpeakingPage';
import { SpeakingTaskPage } from './pages/student/SpeakingTaskPage';
import { GrammarPage } from './pages/student/GrammarPage';
import { GrammarExercisePage } from './pages/student/GrammarExercisePage';
import { VocabularyPage } from './pages/student/VocabularyPage';
import { MockTestsPage } from './pages/student/MockTestsPage';
import { MockExamRoomPage } from './pages/student/MockExamRoomPage';
import { MyResultsPage } from './pages/student/MyResultsPage';
import { MyProgressPage } from './pages/student/MyProgressPage';
import { StudyHistoryPage } from './pages/student/StudyHistoryPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { SettingsPage } from './pages/student/SettingsPage';

// Admin pages
import { SuperAdminDashboardPage } from './pages/admin/SuperAdminDashboardPage';
import { StudentManagementPage } from './pages/admin/StudentManagementPage';
import { PendingRegistrationsPage } from './pages/admin/PendingRegistrationsPage';
import { AdministratorManagementPage } from './pages/admin/AdministratorManagementPage';
import { ContentManagementPage } from './pages/admin/ContentManagementPage';
import { AnalyticsReportsPage } from './pages/admin/AnalyticsReportsPage';
import { PlatformSettingsPage } from './pages/admin/PlatformSettingsPage';
import { ActivityLogsPage } from './pages/admin/ActivityLogsPage';

function AppContent() {
  const { user, loading, logout, quickLogin } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});

  // Route routing helper
  const navigate = (page: string, params: Record<string, string> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user logs in or out, automatically navigate to appropriate view
  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
          // If on a public or student landing page, go to admin dashboard
          if (['home', 'login', 'register', 'dashboard'].includes(currentPage)) {
            setCurrentPage('admin-dashboard');
          }
        } else if (user.role === 'STUDENT') {
          // If approved student is on login/register/home, go to student dashboard
          if (user.status === 'APPROVED' && ['home', 'login', 'register'].includes(currentPage)) {
            setCurrentPage('dashboard');
          }
        }
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-sans">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide">Initializing IELTS MASTER Platform...</p>
      </div>
    );
  }

  // Account status guard for students
  const isStudentUnapproved = user && user.role === 'STUDENT' && user.status !== 'APPROVED';

  const renderStatusBlocker = () => {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-slate-900 border border-amber-900/40 rounded-2xl text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mx-auto">
          ⏳
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 text-xs font-black uppercase rounded-full bg-amber-950 text-amber-300 border border-amber-800">
            Account Status: {user?.status}
          </span>
          <h2 className="text-2xl font-black text-white">Enrollment Verification in Progress</h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
            {user?.status === 'PENDING_APPROVAL' && (
              <>
                Your application for <strong>{user.fullName}</strong> ({user.city || 'Almaty'}, Kazakhstan) has been submitted to the IELTS MASTER admissions registry and is currently awaiting Super Admin review.
              </>
            )}
            {user?.status === 'SUSPENDED' && (
              <>
                Your student account has been temporarily placed on hold by an administrator.
                {user.suspensionReason && ` Reason: ${user.suspensionReason}`}
              </>
            )}
            {user?.status === 'REJECTED' && (
              <>
                Your enrollment application was not approved.
                {user.rejectionReason && ` Reason: ${user.rejectionReason}`}
              </>
            )}
            {user?.status === 'DEACTIVATED' && (
              <>Your student account has been deactivated.</>
            )}
          </p>
        </div>

        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-left text-xs space-y-2 max-w-md mx-auto">
          <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">What happens next?</div>
          <p className="text-slate-300">
            1. Super Admin (<code className="text-sky-400 font-mono">ayaulymensegen123@gmail.com</code>) validates your profile.
          </p>
          <p className="text-slate-300">
            2. Once approved, all 36 Reading, 36 Listening, 36 Writing, 36 Speaking tasks, 36 Grammar units, 500+ Vocabulary flashcards, and Full Mock Exams unlock instantly.
          </p>
          <p className="text-slate-400 text-[11px] pt-1">
            Standard review turnaround: 1–3 hours during Kazakhstan business hours (09:00 – 19:00 Asia/Almaty).
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => quickLogin('ayaulymensegen123@gmail.com')}
            className="w-full sm:w-auto px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs rounded-xl transition-colors shadow-lg shadow-sky-500/10"
          >
            Review as Super Admin (Switch Account)
          </button>
          <button
            onClick={logout}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  };

  // Render the requested page
  const renderMain = () => {
    // If student is unapproved and trying to access any learning/dashboard page
    if (isStudentUnapproved && currentPage !== 'home' && currentPage !== 'about' && currentPage !== 'contact') {
      return renderStatusBlocker();
    }

    switch (currentPage) {
      // Public
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      case 'prep':
        return <PreparationPage onNavigate={navigate} />;
      case 'features':
        return <FeaturesPage onNavigate={navigate} />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage onNavigate={navigate} />;
      case 'register':
        return <RegisterPage onNavigate={navigate} />;
      case 'forgot-password':
        return <PasswordRecoveryPage onNavigate={navigate} />;

      // Student Learning
      case 'dashboard':
      case 'student_dashboard':
        return <StudentDashboardPage onNavigate={(view: string, taskId?: string) => navigate(view, taskId ? { taskId } : {})} />;
      case 'reading':
        return <ReadingPage onSelectTask={(id: string) => navigate('reading-task', { taskId: id })} />;
      case 'reading-task':
        return <ReadingTaskPage taskId={pageParams.taskId || 'reading-01'} onBack={() => navigate('reading')} />;
      case 'listening':
        return <ListeningPage onSelectTask={(id: string) => navigate('listening-task', { taskId: id })} />;
      case 'listening-task':
        return <ListeningTaskPage taskId={pageParams.taskId || 'listening-01'} onBack={() => navigate('listening')} />;
      case 'writing':
        return <WritingPage onSelectTask={(id: string) => navigate('writing-task', { taskId: id })} />;
      case 'writing-task':
        return <WritingTaskPage taskId={pageParams.taskId || 'writing-01'} onBack={() => navigate('writing')} />;
      case 'speaking':
        return <SpeakingPage onSelectTask={(id: string) => navigate('speaking-task', { taskId: id })} />;
      case 'speaking-task':
        return <SpeakingTaskPage taskId={pageParams.taskId || 'speaking-01'} onBack={() => navigate('speaking')} />;
      case 'grammar':
        return <GrammarPage onSelectUnit={(id: string) => navigate('grammar-task', { unitId: id })} />;
      case 'grammar-task':
        return <GrammarExercisePage unitId={pageParams.unitId || 'grammar-01'} onBack={() => navigate('grammar')} />;
      case 'vocabulary':
        return <VocabularyPage />;
      case 'mock-tests':
        return <MockTestsPage onStartExam={(id: string) => navigate('mock-exam', { testId: id })} />;
      case 'mock-exam':
        return <MockExamRoomPage testId={pageParams.testId || 'mock-acad-01'} onExit={() => navigate('mock-tests')} />;
      case 'my-results':
        return <MyResultsPage onNavigate={navigate} />;
      case 'my-progress':
        return <MyProgressPage onNavigate={navigate} />;
      case 'study-history':
        return <StudyHistoryPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;

      // Admin & Super Admin Console
      case 'admin-dashboard':
        return <SuperAdminDashboardPage onNavigate={navigate} />;
      case 'admin-students':
        return <StudentManagementPage />;
      case 'admin-pending':
        return <PendingRegistrationsPage />;
      case 'admin-team':
        return <AdministratorManagementPage />;
      case 'admin-content':
        return <ContentManagementPage />;
      case 'admin-analytics':
        return <AnalyticsReportsPage />;
      case 'admin-settings':
        return <PlatformSettingsPage />;
      case 'admin-logs':
        return <ActivityLogsPage />;

      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  // Determine whether to show sidebar (logged in users inside app)
  const isAppView =
    user &&
    ![
      'home',
      'about',
      'prep',
      'features',
      'contact',
      'login',
      'register',
      'forgot-password',
    ].includes(currentPage);

  const sidebarMode = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? 'admin' : 'student';

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar currentView={currentPage} onNavigate={navigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {isAppView && !isStudentUnapproved && (
          <Sidebar
            currentView={currentPage}
            onNavigate={navigate}
            mode={sidebarMode}
          />
        )}

        <main className={`flex-1 ${isAppView ? 'p-4 md:p-8 max-w-7xl mx-auto w-full' : ''}`}>
          {renderMain()}
        </main>
      </div>

      {/* Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
