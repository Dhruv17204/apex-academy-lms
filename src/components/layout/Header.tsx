import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  ChevronDown,
  Search,
  Menu,
  X,
  User,
  Shield,
  BookOpen,
  Sparkles,
  Building2,
  Trophy,
  LogOut
} from 'lucide-react';
import { MegaMenu } from './MegaMenu.tsx';
import { Button } from '../common/Button.tsx';
import { useAuth } from '../../context/AuthContext.tsx';

export const Header: React.FC = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, profile, role, signOut, user } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & MegaMenu Trigger */}
          <div className="flex items-center gap-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <Link to="/" className="relative flex items-center gap-2.5 group">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #026adb 0%, #0041b2 100%)', boxShadow: '0 4px 12px rgba(2, 106, 219, 0.2)' }}
              >
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 transition-colors">
                  APEX<span style={{ color: '#026adb' }}>ACADEMY</span>
                </span>
                <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-1">
                  Learning & Certification
                </span>
              </div>
              
              {/* Custom Hover Tooltip */}
              <div className="absolute top-full left-4 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 bg-slate-800 text-white text-[11px] font-medium py-1.5 px-3 rounded shadow-lg whitespace-nowrap translate-y-1 group-hover:translate-y-0">
                Return to Home
                <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
              </div>
            </Link>

            {/* Explore Programs Dropdown Button (GL Solid Blue Style) */}
            <div className="hidden lg:block relative" onMouseEnter={() => setIsMegaMenuOpen(true)}>
              <button
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white transition-all hover:bg-blue-700 shadow-sm"
                style={{ backgroundColor: '#026adb' }}
              >
                <span>Explore Programs</span>
                <ChevronDown className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <Link
              to="/programs"
              className="transition-colors py-1 hover:text-blue-600"
              style={isCurrent('/programs') ? { color: '#026adb', fontWeight: 'bold' } : {}}
            >
              All Programs
            </Link>
            <Link
              to="/free-courses"
              className="transition-colors py-1 hover:text-blue-600"
              style={isCurrent('/free-courses') ? { color: '#026adb', fontWeight: 'bold' } : {}}
            >
              Free Courses
            </Link>
            <Link
              to="/career-support"
              className="transition-colors py-1 hover:text-blue-600"
              style={isCurrent('/career-support') ? { color: '#026adb', fontWeight: 'bold' } : {}}
            >
              Career Support
            </Link>
            <Link
              to="/success-stories"
              className="transition-colors py-1 hover:text-blue-600"
              style={isCurrent('/success-stories') ? { color: '#026adb', fontWeight: 'bold' } : {}}
            >
              Success Stories
            </Link>
            <Link
              to="/enterprise"
              className="transition-colors py-1 hover:text-blue-600"
              style={isCurrent('/enterprise') ? { color: '#026adb', fontWeight: 'bold' } : {}}
            >
              Enterprise
            </Link>
          </nav>

          {/* Auth & Application Actions (GL Style Profile Avatar Dropdown) */}
          <div className="hidden sm:flex items-center gap-4 relative" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {isAuthenticated ? (
              <div
                className="relative"
                onMouseEnter={() => setIsUserDropdownOpen(true)}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                <button
                  className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 hover:bg-blue-200 transition-all font-bold text-xs border border-blue-200 cursor-pointer shadow-xs"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-blue-600" />}
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Signed in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{profile?.full_name || user?.email || 'Student'}</p>
                    </div>

                    <Link
                      to="/student/dashboard"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      <span>Student Dashboard</span>
                    </Link>

                    {role === 'ADMIN' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-amber-700 hover:bg-slate-50 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 mt-1 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-3.5 py-1.5 border-slate-200">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs font-bold shadow-sm text-white hover:opacity-90 px-4 py-1.5 border-none"
                    style={{ backgroundColor: '#026adb' }}
                  >
                    Register Free
                  </Button>
                </Link>
              </>
            )}
          </div>


          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MegaMenu Component */}
      <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search programs & courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 text-sm rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              style={{ border: '1px solid transparent' }}
              onFocus={(e) => {
                e.target.style.borderColor = '#026adb';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'transparent';
              }}
            />
          </form>

          <nav className="flex flex-col gap-2 font-medium text-sm text-slate-800">
            <Link
              to="/programs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: '#026adb' }} />
                <span>All Programs</span>
              </div>
            </Link>

            <Link
              to="/free-courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Free Courses</span>
            </Link>

            <Link
              to="/career-support"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Career Support</span>
            </Link>

            <Link
              to="/success-stories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
            >
              <User className="w-4 h-4" style={{ color: '#026adb' }} />
              <span>Success Stories</span>
            </Link>

            <Link
              to="/enterprise"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>Enterprise Learning</span>
            </Link>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/student/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="primary"
                      className="w-full flex items-center justify-center gap-2 text-white border-none"
                      style={{ backgroundColor: '#026adb' }}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Student Dashboard</span>
                    </Button>
                  </Link>
                  {role === 'ADMIN' && (
                    <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-amber-500/50 text-amber-700 flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>Admin Control Panel</span>
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut();
                    }}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="primary"
                      className="w-full text-white border-none"
                      style={{ backgroundColor: '#026adb' }}
                    >
                      Register Free Account
                    </Button>
                  </Link>
                </>
              )}
            </div>

          </nav>
        </div>
      )}
    </header>
  );
};
