import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  User as UserIcon, 
  LogOut, 
  Home,
  CheckCircle2,
  Bell,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user, role, signOut } = useAuth();

  const isCurrent = (path: string) => location.pathname === path;

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  const displayEmail = user?.email || '';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'ST';

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 hidden md:flex border-r border-slate-800">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">Apex Student</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Main Menu
            </div>

            <Link
              to="/student/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isCurrent('/student/dashboard') 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/student/my-learning"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isCurrent('/student/my-learning') 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>My Learning</span>
            </Link>

            <Link
              to="/student/certificates"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isCurrent('/student/certificates') 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Certificates</span>
            </Link>

            <div className="px-3 pt-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Account
            </div>

            <Link
              to="/student/profile"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isCurrent('/student/profile') 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile Settings</span>
            </Link>
          </nav>
        </div>

        {/* User Card & Public Website Link */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {role === 'ADMIN' && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors px-2 py-1.5 rounded hover:bg-slate-800"
            >
              <Shield className="w-4 h-4" />
              <span>Switch to Admin Control</span>
            </Link>
          )}

          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors px-2 py-1.5 rounded hover:bg-slate-800"
          >
            <Home className="w-4 h-4" />
            <span>Return to Main Website</span>
          </Link>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
              {initials}
            </div>
            <div className="overflow-hidden text-xs">
              <p className="font-semibold text-white truncate">{displayName}</p>
              <p className="text-slate-400 text-[10px] truncate">{displayEmail}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-slate-800">Student Portal</h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>


        {/* Dynamic Page Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
