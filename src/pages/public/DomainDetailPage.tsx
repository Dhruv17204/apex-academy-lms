import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { 
  Briefcase, 
  ChevronRight, 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  ArrowLeft,
  Wrench,
  CheckCircle2,
  Compass,
  Clock,
  Layers,
  Lock,
  ListChecks
} from 'lucide-react';
import { fetchDomainLearningPath } from '../../services/api.ts';
import { getDomainBySlug } from '../../data/domainsData.ts';

export const DomainDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [domainData, setDomainData] = useState<any>(null);
  const [pathCourses, setPathCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const domainMeta = slug ? getDomainBySlug(slug) : undefined;

  useEffect(() => {
    async function loadDomainPathData() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetchDomainLearningPath(slug);
        if (res.success) {
          setDomainData(res);
          setPathCourses(res.courses || []);
        }
      } catch (err) {
        console.error('Error loading domain path data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDomainPathData();
  }, [slug]);

  const domain = domainData?.domain;
  const learningPath = domainData?.learningPath;
  const domainName = domain?.name || domainMeta?.name || (slug ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Career Domain');
  const description = domain?.description || domainMeta?.description || `Explore structured learning paths, specialized courses, and career mentorship for ${domainName}.`;

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen text-slate-800 font-sans pb-20">
        
        {/* Domain Header Banner */}
        <div className="bg-slate-900 text-white py-14 px-4 border-b border-slate-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10 space-y-4">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Career Domains</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/programs" className="hover:text-white">Career Domains</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400 font-bold">{domainName}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Apex Career Domain Hub</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {domainName}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              {description}
            </p>

            {domainMeta?.learningFocus && (
              <div className="pt-2 text-xs text-indigo-200/80 font-medium">
                <span className="font-bold text-amber-400">Core Focus: </span>
                <span>{domainMeta.learningFocus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">

          {/* Section: Skills & Tools Overview */}
          {domainMeta && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Skills You Will Build */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>Key Competencies & Skills</span>
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {domainMeta.keySkills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools & Typical Roles */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-indigo-600" />
                    <span>Tools & Tech Stack</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {domainMeta.keyTools.map((tool, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span>Target Career Roles</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {domainMeta.targetRoles.map((role, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 text-xs font-semibold border border-indigo-100">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Career Learning Path Structure */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Compass className="w-6 h-6 text-indigo-600" />
                  <span>{learningPath?.title || `${domainName} Career Learning Path`}</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Industry-Aligned Structured Curriculum • Verifiable Certification Track
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-900 text-xs font-bold border border-indigo-100 self-start sm:self-auto">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>{pathCourses.length} Core & Specialization Courses</span>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-500 font-bold">Loading curriculum details...</p>
              </div>
            ) : pathCourses.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-5">
                  {pathCourses.map((course, idx) => (
                    <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-6 transition-all hover:shadow-md hover:border-indigo-200 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                            0{idx + 1}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">{course.title}</h4>
                              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                                {course.difficulty || 'Intermediate'}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                                <GraduationCap className="w-3 h-3 text-emerald-600" />
                                Certificate Included
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                              {course.short_description || course.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                          <Link to={`/courses/${course.slug}`}>
                            <Button variant="primary" size="sm" className="font-bold text-xs py-2 px-4 shadow-xs">
                              Explore Course
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-4 flex-wrap font-medium">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                            {course.module_count || 11} Modules
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            Self-Paced Learning
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-400">Target Skills:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(course.skills || ['Core Theory', 'Practical Labs', 'Assessments']).slice(0, 3).map((sk: string, sIdx: number) => (
                              <span key={sIdx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-xs">
                No courses mapped to this domain learning path yet.
              </div>
            )}
          </div>

          {/* Section: Learning Guarantee */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-black text-amber-400 flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Apex Academy Learning Experience</span>
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Every course features structured module quizzes, hands-on practical exercises, knowledge checkpoints, and employer-verifiable digital certificates.
              </p>
            </div>

            <Link to="/programs" className="flex-shrink-0">
              <Button variant="outline" className="text-xs font-bold text-white !bg-transparent border-slate-700 hover:!bg-slate-800">
                Explore All Career Domains
              </Button>
            </Link>
          </div>

        </div>

      </div>
    </MainLayout>
  );
};


