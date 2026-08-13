import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout.tsx';
import { fetchAdminCourses } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { BookOpen, Layers, CheckCircle2, Clock, Shield } from 'lucide-react';

export const AdminCoursesPage: React.FC = () => {
  const { session } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminCourses() {
      if (!session?.access_token) return;
      setLoading(true);
      try {
        const res = await fetchAdminCourses(session.access_token);
        if (res.success && res.courses) {
          setCourses(res.courses);
        }
      } catch (err) {
        console.error('Failed to load admin courses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminCourses();
  }, [session?.access_token]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <span>Master Course Library</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Overview of canonical courses, curriculum modules, and associated domain career paths
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-white text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5 shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Phase 6A Foundation</span>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-bold">Loading master course catalog...</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Course Name & Slug</th>
                    <th className="py-3.5 px-4">Level</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Module Count</th>
                    <th className="py-3.5 px-4">Associated Career Paths</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 space-y-1">
                        <div className="font-extrabold text-slate-900 text-sm">{course.title}</div>
                        <div className="text-[11px] font-mono text-indigo-600">{course.slug}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[10px]">
                          {course.difficulty}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {course.status === 'PUBLISHED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>PUBLISHED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>DRAFT</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-black text-xs border border-slate-200">
                          <Layers className="w-3 h-3 text-indigo-600" />
                          <span>{course.module_count} Modules</span>
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {course.associated_paths && course.associated_paths.length > 0 ? (
                            course.associated_paths.map((pathName: string, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] border border-slate-200 font-semibold">
                                {pathName.replace(' Career Path', '')}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[10px]">Unassigned</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs shadow-2xs">
            No courses found in database catalog.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
