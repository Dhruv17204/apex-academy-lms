import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Users, 
  Award, 
  MessageSquare, 
  LogOut, 
  Home,
  CheckSquare,
  GraduationCap,
  Settings,
  UserCheck,
  ExternalLink,
  FolderOpen,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuth();

  const isCurrent = (path: string) => location.pathname === path;

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Admin User';

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      {/* Admin Sidebar - LIGHT THEME */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-200 bg-white">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                  APEX <span className="text-amber-600">ACADEMY</span>
                </span>
                <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-400">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Admin Navigation */}
          <nav className="p-4 space-y-6 text-xs font-semibold">
            {/* MAIN SECTION */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Main
              </div>

              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isCurrent('/admin/dashboard') 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/admin/curriculum"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  location.pathname.startsWith('/admin/curriculum') 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Curriculum Manager</span>
              </Link>

              <Link
                to="/admin/materials"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isCurrent('/admin/materials') 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                <span>Course Materials</span>
              </Link>

              <Link
                to="/admin/bulk-import"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isCurrent('/admin/bulk-import') 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Bulk Import Engine</span>
              </Link>

              <Link
                to="/admin/programs"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isCurrent('/admin/programs') 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Programs & Courses</span>
              </Link>

              <Link
                to="/admin/assessments"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isCurrent('/admin/assessments') 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Assessments & MCQs</span>
              </Link>

              <Link
                to="/admin/students"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isCurrent('/admin/students') 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Students & Enrollments</span>
              </Link>

              <Link
                to="/admin/certificates"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isCurrent('/admin/certificates') 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4 text-amber-600" />
                <span>Issued Certificates</span>
              </Link>
            </div>

            {/* CONTENT & LEADS SECTION */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Content & Leads
              </div>

              <Link
                to="/admin/content"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isCurrent('/admin/content') 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Articles & Stories</span>
              </Link>

              <Link
                to="/admin/inquiries"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isCurrent('/admin/inquiries') 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Counselor Leads</span>
              </Link>

              <Link
                to="/admin/inquiries"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isCurrent('/admin/inquiries') 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enterprise Inquiries</span>
              </Link>
            </div>

            {/* SYSTEM SECTION */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                System
              </div>

              <Link
                to="/admin/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
              >
                <Settings className="w-4 h-4" />
                <span>Platform Settings</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Footer info & Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-2">
          <Link
            to="/student/dashboard"
            className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors px-2 py-1.5 rounded-lg hover:bg-indigo-50"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Switch to Student Portal</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <Home className="w-4 h-4" />
            <span>Public Site Preview</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs font-medium text-red-600 hover:text-red-700 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <div className="text-[10px] text-slate-400 pt-1 px-2 border-t border-slate-200/60 font-mono">
            Apex Admin • {displayName}
          </div>
        </div>
      </aside>

      {/* Main Content Area - LIGHT THEME */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">Apex Academy Admin</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold tracking-wider uppercase border border-amber-200">
              ADMIN
            </span>
            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200 text-xs font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Admin Privileges Active ({displayName})</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Public Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
