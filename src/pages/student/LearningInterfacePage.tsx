import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { getAuthTokenAsync } from '../../lib/supabaseClient.ts';
import { Button } from '../../components/common/Button.tsx';
import { CoursePlayerHeader } from '../../components/learning/CoursePlayerHeader.tsx';
import { CurriculumSidebar } from '../../components/learning/CurriculumSidebar.tsx';
import { LessonRenderer } from '../../components/learning/LessonRenderer.tsx';
import { ModuleAssessmentModal } from '../../components/learning/ModuleAssessmentModal.tsx';
import { FinalAssessmentModal } from '../../components/learning/FinalAssessmentModal.tsx';
import { 
  fetchCourseLearningOverview, 
  fetchLessonContent, 
  updateLessonProgress, 
  completeLesson,
  enrollInCourse
} from '../../services/api.ts';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Award, 
  Lock, 
  Sparkles, 
  BookOpen,
  ArrowRight,
  X,
  FileText,
  File
} from 'lucide-react';

export const LearningInterfacePage: React.FC = () => {
  const { courseSlug, courseId, lessonId: urlLessonId } = useParams();
  const slugOrId = courseSlug || courseId || 'python-programming-fundamentals';
  const navigate = useNavigate();
  const { session, isAuthenticated } = useAuth();

  const [overview, setOverview] = useState<any | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(urlLessonId || null);
  const [lessonData, setLessonData] = useState<any | null>(null);
  const [loadingOverview, setLoadingOverview] = useState<boolean>(true);
  const [loadingLesson, setLoadingLesson] = useState<boolean>(false);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);
  const [notEnrolled, setNotEnrolled] = useState<boolean>(false);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [activeAssessmentModule, setActiveAssessmentModule] = useState<{ id: string; title: string } | null>(null);
  const [finalAssessmentOpen, setFinalAssessmentOpen] = useState<boolean>(false);

  const handleOpenModuleAssessment = (modId: string, modTitle: string) => {
    setActiveAssessmentModule({ id: modId, title: modTitle });
  };

  const handleOpenFinalAssessment = () => {
    setFinalAssessmentOpen(true);
  };

  const token = session?.access_token;

  // 1. Fetch Course Overview & Curriculum
  const loadOverview = useCallback(async (silent = false) => {
    const activeToken = token || (await getAuthTokenAsync());
    if (!activeToken) return;
    if (!silent) setLoadingOverview(true);
    setNotEnrolled(false);

    const res = await fetchCourseLearningOverview(slugOrId, activeToken);

    if (res.notEnrolled) {
      setNotEnrolled(true);
      setOverview(null);
      setLoadingOverview(false);
      return;
    }

    if (res.success) {
      setOverview(res);
      setNotEnrolled(false);

      let targetLessonId = urlLessonId || currentLessonId || res.enrollment?.last_accessed_lesson_id;

      // If last_accessed_lesson_id is not set, pick the first lesson of first module
      if (!targetLessonId && res.modules && res.modules.length > 0) {
        const firstMod = res.modules[0];
        if (firstMod.lessons && firstMod.lessons.length > 0) {
          targetLessonId = firstMod.lessons[0].id;
        }
      }

      if (targetLessonId && targetLessonId !== currentLessonId) {
        setCurrentLessonId(targetLessonId);
      }

      // Ensure browser URL reflects canonical route /learn/:courseSlug/lesson/:lessonId
      if (res.course?.slug && targetLessonId) {
        const canonicalUrl = `/learn/${res.course.slug}/lesson/${targetLessonId}`;
        if (window.location.pathname !== canonicalUrl) {
          navigate(canonicalUrl, { replace: true });
        }
      }
    } else {
    }
    if (!silent) setLoadingOverview(false);
  }, [slugOrId, token, urlLessonId]);

  useEffect(() => {
    loadOverview();
  }, [slugOrId, token]);

  // Sync route param urlLessonId to state currentLessonId
  useEffect(() => {
    if (urlLessonId && urlLessonId !== currentLessonId) {
      setCurrentLessonId(urlLessonId);
    }
  }, [urlLessonId]);

  // 2. Fetch Detailed Lesson Content when currentLessonId changes
  const loadLesson = useCallback(async (lId: string) => {
    if (!token) return;
    setLoadingLesson(true);

    const res = await fetchLessonContent(slugOrId, lId, token);
    if (res.success) {
      setLessonData(res);
    } else {
      console.error('Failed to load lesson content:', res.error);
    }
    setLoadingLesson(false);
  }, [slugOrId, token]);

  useEffect(() => {
    if (currentLessonId) {
      loadLesson(currentLessonId);
    }
  }, [currentLessonId, loadLesson]);

  // 3. Handle Lesson Selection
  const handleSelectLesson = (lId: string) => {
    setCurrentLessonId(lId);
    setMobileSidebarOpen(false);
    // Keep URL synced with selected lesson canonical route
    if (overview?.course?.slug) {
      navigate(`/learn/${overview.course.slug}/lesson/${lId}`, { replace: true });
    }
  };

  // 4. Handle Save Progress (Video timestamp / position)
  const handleUpdateProgress = async (progressData: { last_position_seconds: number; watch_percentage?: number }) => {
    if (!token || !currentLessonId) return;
    await updateLessonProgress(slugOrId, currentLessonId, token, progressData);
  };

  // 5. Handle Complete Lesson — Optimistic UI update (GL-style: instant feedback)
  const handleCompleteLesson = async () => {
    if (!token || !currentLessonId) return;
    if (isCompleting) return;
    setIsCompleting(true);

    // OPTIMISTIC UPDATE: Immediately reflect COMPLETED in sidebar
    setOverview((prev: any) => {
      if (!prev) return prev;
      const newProgressMap = {
        ...prev.progressMap,
        [currentLessonId]: { status: 'COMPLETED', watch_percentage: 100 }
      };

      const updatedModules = (prev.modules || []).map((m: any) => {
        const completedInMod = (m.lessons || []).filter(
          (les: any) => newProgressMap[les.id]?.status === 'COMPLETED'
        ).length;
        const totalInMod = m.lessons?.length || 0;
        const isUnlocked = Boolean(m.assessmentUnlocked || (totalInMod > 0 && completedInMod === totalInMod));
        return {
          ...m,
          assessmentUnlocked: isUnlocked
        };
      });

      const prevCompleted = prev.stats?.completedRequiredLessons || 0;
      const prevTotal = prev.stats?.totalRequiredLessons || 0;
      const wasAlreadyCompleted = prev.progressMap?.[currentLessonId]?.status === 'COMPLETED';
      const newCompleted = wasAlreadyCompleted ? prevCompleted : Math.min(prevTotal, prevCompleted + 1);
      const newPct = prevTotal > 0 ? Math.round((newCompleted / prevTotal) * 100) : 0;

      return {
        ...prev,
        modules: updatedModules,
        progressMap: newProgressMap,
        stats: {
          ...prev.stats,
          completedRequiredLessons: newCompleted,
          progressPercentage: newPct
        }
      };
    });

    // API call in background
    const res = await completeLesson(slugOrId, currentLessonId, token);

    if (res.success) {
      // Don't need to reload current lesson if we are auto-advancing
      // await loadLesson(currentLessonId); 
      await loadOverview(true);

      // Auto-advance to next lesson if available
      if (lessonData?.nextLesson) {
        setTimeout(() => {
          handleSelectLesson(lessonData.nextLesson.id);
        }, 800);
      }
    } else {
      await loadOverview(true);
    }

    setIsCompleting(false);
  };

  // 6. Handle One-Click Enrollment for Non-Enrolled Gate
  const handleEnrollNow = async () => {
    if (!token || !overview?.courseId) return;
    setEnrolling(true);

    const res = await enrollInCourse(overview.courseId, token);
    if (res.success) {
      await loadOverview();
    }
    setEnrolling(false);
  };

  // LOADING STATE
  if (loadingOverview) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-300">Loading Apex Learning Interface...</p>
        </div>
      </div>
    );
  }

  // ENROLLMENT GATE / PROTECTED CONTENT SCREEN
  if (notEnrolled) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Enrollment Required</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              You must be enrolled in this course to access the lesson player and learning content.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full font-bold"
              onClick={handleEnrollNow}
              disabled={enrolling}
            >
              {enrolling ? 'Enrolling You Now...' : 'Enroll Free & Start Learning'}
            </Button>

            <Link to="/programs" className="block text-xs text-slate-400 hover:text-white underline">
              Return to Course Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = overview?.stats || { totalRequiredLessons: 0, completedRequiredLessons: 0, progressPercentage: 0 };
  const courseTitle = overview?.course?.title || 'Apex Course';
  const courseSlugName = overview?.course?.slug || slugOrId;

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
      
      {/* 1. Sticky Header */}
      <CoursePlayerHeader
        courseTitle={courseTitle}
        courseSlug={courseSlugName}
        progressPercentage={stats.progressPercentage}
        completedLessons={stats.completedRequiredLessons}
        totalLessons={stats.totalRequiredLessons}
        hasFinalAssessment={overview?.hasFinalAssessment}
        onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
      />

      {/* 2. Completion Banner (when 100% complete) */}
      {(stats.progressPercentage === 100 || overview?.enrollment?.status === 'COMPLETED') && (
        <div className="bg-emerald-50 text-emerald-950 border-b border-emerald-200 p-4 text-center text-xs font-medium space-y-2 shrink-0">
          <div className="flex items-center justify-center gap-2 font-bold text-sm text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>COURSE COMPLETED — {overview?.course?.title || 'Statistics for Data & Analytics'}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-emerald-900 font-semibold">
            <span>✓ {stats.completedRequiredLessons}/{stats.totalRequiredLessons} Lessons</span>
            <span>✓ {overview?.modules?.length || 0}/{overview?.modules?.length || 0} Module Assessments</span>
            <span>✓ Final Assessment Passed</span>
          </div>
        </div>
      )}

      {/* 3. Main Player & Curriculum Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex overflow-hidden">
        
        {/* Desktop Sidebar (Persistent) */}
        <aside className="hidden lg:block w-80 shrink-0 border-r border-slate-200">
          <CurriculumSidebar
            modules={overview?.modules || []}
            currentLessonId={currentLessonId || undefined}
            progressMap={overview?.progressMap || {}}
            onSelectLesson={handleSelectLesson}
            onOpenModuleAssessment={handleOpenModuleAssessment}
            onOpenFinalAssessment={handleOpenFinalAssessment}
            hasFinalAssessment={overview?.hasFinalAssessment}
            overallProgressPercentage={stats.progressPercentage}
          />
        </aside>

        {/* Mobile Sidebar (Drawer / Sheet) */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" 
              onClick={() => setMobileSidebarOpen(false)} 
            />
            <div className="relative w-80 max-w-full bg-white h-full flex flex-col z-10">
              <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
                <span className="font-bold text-xs">Curriculum Navigation</span>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <CurriculumSidebar
                  modules={overview?.modules || []}
                  currentLessonId={currentLessonId || undefined}
                  progressMap={overview?.progressMap || {}}
                  onSelectLesson={handleSelectLesson}
                  onOpenModuleAssessment={handleOpenModuleAssessment}
                  onOpenFinalAssessment={handleOpenFinalAssessment}
                  hasFinalAssessment={overview?.hasFinalAssessment}
                  overallProgressPercentage={stats.progressPercentage}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 bg-white p-4 sm:p-6 lg:p-8 overflow-y-auto flex flex-col justify-between relative">
          
          {loadingLesson ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="text-center space-y-3">
                <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-500">Loading lesson content...</p>
              </div>
            </div>
          ) : lessonData?.lesson ? (
            <div className="space-y-8">
              <LessonRenderer
                lesson={lessonData.lesson}
                resources={lessonData.resources || []}
                progress={lessonData.progress || { status: 'NOT_STARTED' }}
                onUpdateProgress={handleUpdateProgress}
                onCompleteLesson={handleCompleteLesson}
                isCompleting={isCompleting}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center py-20 text-slate-400 text-sm">
              Select a lesson from the curriculum sidebar to start.
            </div>
          )}

          {/* Bottom Coursera-style Lesson Navigation & Go to Next Item Floating CTA */}
          {lessonData && (
            <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
              {lessonData.prevLesson ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectLesson(lessonData.prevLesson.id)}
                  className="text-xs font-semibold"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span>Previous: {lessonData.prevLesson.title}</span>
                </Button>
              ) : (
                <div />
              )}

              {lessonData.nextLesson ? (
                <button
                  onClick={() => handleSelectLesson(lessonData.nextLesson.id)}
                  className="px-6 py-2.5 rounded-full text-slate-900 bg-white border border-slate-300 shadow-sm hover:shadow-md hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Go to next item</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <Link to="/student/my-learning">
                  <Button variant="outline" size="sm" className="text-xs font-semibold">
                    <span>Back to My Learning</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          )}

        </main>

      </div>

      {/* Module Assessment Modal */}
      {activeAssessmentModule && (
        <ModuleAssessmentModal
          isOpen={Boolean(activeAssessmentModule)}
          onClose={() => setActiveAssessmentModule(null)}
          courseSlug={courseSlugName}
          moduleId={activeAssessmentModule.id}
          moduleTitle={activeAssessmentModule.title}
          onAssessmentCompleted={loadOverview}
        />
      )}

      {/* Final Assessment Modal */}
      {finalAssessmentOpen && (
        <FinalAssessmentModal
          isOpen={finalAssessmentOpen}
          onClose={() => setFinalAssessmentOpen(false)}
          courseSlug={courseSlugName}
          onAssessmentCompleted={loadOverview}
        />
      )}

    </div>
  );
};
