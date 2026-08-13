import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StudentLayout } from '../../components/layout/StudentLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Card } from '../../components/common/Card.tsx';
import { Badge } from '../../components/common/Badge.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { fetchMyEnrollments, fetchMyCertificates } from '../../services/api.ts';
import { 
  BookOpen, 
  Award, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  BarChart2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { profile, user, session } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';

  useEffect(() => {
    async function loadData() {
      const token = session?.access_token;
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const [res, certRes] = await Promise.all([
        fetchMyEnrollments(token),
        fetchMyCertificates(token)
      ]);

      if (res.success) {
        setEnrollments(res.enrollments || []);
      }
      if (certRes.success) {
        setCertificates(certRes.certificates || []);
      }
      setLoading(false);
    }

    loadData();
  }, [session]);

  const totalEnrolled = enrollments.length;
  const inProgressCount = enrollments.filter((e) => e.status !== 'COMPLETED').length;
  const completedCount = enrollments.filter((e) => e.status === 'COMPLETED').length;
  const certificatesEarnedCount = certificates.length;

  const overallCompletion = totalEnrolled > 0
    ? Math.round(
        enrollments.reduce((acc, curr) => acc + Number(curr.progress_percentage || 0), 0) / totalEnrolled
      )
    : 0;

  const activeEnrollment = enrollments[0];

  return (
    <StudentLayout>
      <div className="space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-semibold rounded-full">
              Student Workspace Active
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              {totalEnrolled === 0
                ? "You haven't enrolled in any courses yet. Browse our free bootcamps to get started!"
                : `You are currently enrolled in ${totalEnrolled} course${totalEnrolled > 1 ? 's' : ''}. Keep up the momentum!`}
            </p>
          </div>
          {activeEnrollment ? (
            <Link to={`/learn/${activeEnrollment.course?.slug || activeEnrollment.course?.id}`}>
              <Button variant="primary" icon={<PlayCircle className="w-4 h-4" />}>
                Continue {activeEnrollment.course?.title || 'Learning'}
              </Button>
            </Link>
          ) : (
            <Link to="/free-courses">
              <Button variant="primary" icon={<Sparkles className="w-4 h-4" />}>
                Browse Catalog
              </Button>
            </Link>
          )}
        </div>

        {/* Dashboard Stat Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Courses Enrolled</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{totalEnrolled}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</p>
              <p className="text-2xl font-black text-indigo-600 mt-1">{inProgressCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certificates Earned</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{certificatesEarnedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Completion</p>
              <p className="text-2xl font-black text-amber-500 mt-1">{overallCompletion}%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Active Courses Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Active Courses in Progress</h3>
            <Link to="/student/my-learning" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All Enrolled →
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="md" text="Loading active course stats..." />
            </div>
          ) : enrollments.length === 0 ? (
            <Card className="p-8 text-center space-y-3">
              <p className="text-xs text-slate-500">No active enrollments found.</p>
              <Link to="/free-courses">
                <Button variant="outline" size="sm">
                  Explore Catalog
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {enrollments.slice(0, 3).map((item) => {
                const course = item.course || {};
                const progress = Number(item.progress_percentage || 0);

                return (
                  <Card key={item.id} className="p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <Badge variant="indigo" size="sm" className="mb-1">
                          {course.category?.name || 'Enrolled Course'}
                        </Badge>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{course.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{course.short_description}</p>
                      </div>
                      <Link to={`/learn/${course.slug || course.id}`}>
                        <Button variant="primary" size="sm" className="shrink-0 font-bold">
                          {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                        </Button>
                      </Link>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-300"
                          style={{ width: `${Math.max(progress, 2)}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};
