import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button.tsx';
import { 
  ArrowLeft, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Menu, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface CoursePlayerHeaderProps {
  courseTitle: string;
  courseSlug: string;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  hasFinalAssessment?: boolean;
  onToggleMobileSidebar?: () => void;
}

export const CoursePlayerHeader: React.FC<CoursePlayerHeaderProps> = ({
  courseTitle,
  courseSlug,
  progressPercentage,
  completedLessons,
  totalLessons,
  hasFinalAssessment,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Drawer Toggle & Clean Navigation */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Toggle Curriculum Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link
            to="/student/my-learning"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>My Learning</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <Link
            to={`/courses/${courseSlug}`}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 font-semibold transition-colors"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Course Catalog</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="truncate max-w-[200px] sm:max-w-md">
            <span className="text-[10px] font-extrabold uppercase tracking-widest block" style={{ color: '#026adb' }}>
              Apex Academy LMS
            </span>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">{courseTitle}</h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {progressPercentage === 100 && hasFinalAssessment && (
            <div className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-2xs">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Final Assessment Unlocked</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
