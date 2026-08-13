import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StudentLayout } from '../../components/layout/StudentLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Card } from '../../components/common/Card.tsx';
import { Badge } from '../../components/common/Badge.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { fetchMyEnrollments } from '../../services/api.ts';
import { 
  BookOpen, 
  Clock, 
  Award, 
  PlayCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  BarChart2
} from 'lucide-react';

export const MyLearningPage: React.FC = () => {
  const { session } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  useEffect(() => {
    async function loadEnrollments() {
      const token = session?.access_token;
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await fetchMyEnrollments(token);
      if (res.success) {
        setEnrollments(res.enrollments || []);
      }
      setLoading(false);
    }

    loadEnrollments();
  }, [session]);

  const filteredEnrollments = enrollments.filter((e) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'IN_PROGRESS') return e.status === 'ENROLLED' || e.status === 'IN_PROGRESS';
    if (activeTab === 'COMPLETED') return e.status === 'COMPLETED';
    return true;
  });

  const formatDuration = (mins?: number) => {
    if (!mins) return 'Self-Paced';
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours === 0) return `${remainingMins} mins`;
    if (remainingMins === 0) return `${hours} hrs`;
    return `${hours} hrs ${remainingMins} mins`;
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">My Learning Dashboard</h1>
            <p className="text-xs text-slate-500">Track all your active course enrollments, progress, and certificates</p>
          </div>
          <Link to="/free-courses">
            <Button variant="outline" size="sm" icon={<BookOpen className="w-4 h-4" />}>
              Catalog & Bootcamps
            </Button>
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`pb-3 px-1 transition-colors border-b-2 ${
              activeTab === 'ALL'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Courses ({enrollments.length})
          </button>
          <button
            onClick={() => setActiveTab('IN_PROGRESS')}
            className={`pb-3 px-1 transition-colors border-b-2 ${
              activeTab === 'IN_PROGRESS'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            In Progress ({enrollments.filter((e) => e.status !== 'COMPLETED').length})
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`pb-3 px-1 transition-colors border-b-2 ${
              activeTab === 'COMPLETED'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Completed ({enrollments.filter((e) => e.status === 'COMPLETED').length})
          </button>
        </div>

        {/* Enrollments Content */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" text="Retrieving your enrolled courses from database..." />
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">You haven't enrolled in any courses yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our catalog of free Python, Cloud, Data Science, and Generative AI bootcamps to begin your learning journey.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/free-courses">
                <Button variant="primary" size="sm" className="font-bold">
                  Explore Free Courses <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((item) => {
              const course = item.course || {};
              const progress = Number(item.progress_percentage || 0);
              const isCompleted = item.status === 'COMPLETED';

              return (
                <Card key={item.id} className="p-5 flex flex-col justify-between space-y-4 hover:border-indigo-200 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full uppercase">
                        {course.category?.name || 'Course'}
                      </span>
                      <Badge variant={isCompleted ? 'emerald' : 'indigo'} size="sm">
                        {isCompleted ? 'Completed • 100%' : `Enrolled • ${progress}%`}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {course.short_description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                        <span>Course Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${Math.max(progress, 3)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{formatDuration(course.duration_minutes)}</span>
                    </div>

                    {isCompleted ? (
                      <div className="flex items-center gap-2">
                        <Link to="/student/certificates">
                          <Button variant="primary" size="sm" icon={<Award className="w-3.5 h-3.5" />}>
                            View Certificate
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Link to={`/learn/${course.slug || course.id}`}>
                        <Button variant="primary" size="sm" className="font-bold">
                          {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};
