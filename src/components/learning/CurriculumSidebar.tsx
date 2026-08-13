import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Code2, 
  BookMarked,
  Award,
  Lock
} from 'lucide-react';

interface LessonItem {
  id: string;
  title: string;
  lesson_type: string;
  duration_seconds?: number;
  display_order: number;
  is_preview?: boolean;
  is_required?: boolean;
}

interface ModuleItem {
  id: string;
  title: string;
  display_order: number;
  lessons: LessonItem[];
  assessmentUnlocked?: boolean;
  assessmentPassed?: boolean;
  isCompleted?: boolean;
}

interface CurriculumSidebarProps {
  modules: ModuleItem[];
  currentLessonId?: string;
  progressMap: Record<string, { status: string; watch_percentage?: number }>;
  onSelectLesson: (lessonId: string) => void;
  onOpenModuleAssessment?: (moduleId: string, moduleTitle: string) => void;
  onOpenFinalAssessment?: () => void;
  hasFinalAssessment?: boolean;
  overallProgressPercentage: number;
}

export const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({
  modules,
  currentLessonId,
  progressMap,
  onSelectLesson,
  onOpenModuleAssessment,
  onOpenFinalAssessment,
  hasFinalAssessment,
  overallProgressPercentage,
}) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    modules.forEach((m) => {
      initial[m.id] = true;
    });
    return initial;
  });

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'VIDEO':
        return <PlayCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
      case 'ARTICLE':
        return <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case 'PRACTICAL':
        return <Code2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      default:
        return <BookMarked className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  const MODULES_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.max(1, Math.ceil(modules.length / MODULES_PER_PAGE));

  // Auto-jump to page containing currentLessonId
  React.useEffect(() => {
    if (!currentLessonId || modules.length === 0) return;
    const modIdx = modules.findIndex(m => m.lessons?.some(l => l.id === currentLessonId));
    if (modIdx !== -1) {
      const pageForLesson = Math.floor(modIdx / MODULES_PER_PAGE) + 1;
      setCurrentPage(pageForLesson);
    }
  }, [currentLessonId, modules]);

  const visibleModules = modules.slice((currentPage - 1) * MODULES_PER_PAGE, currentPage * MODULES_PER_PAGE);

  return (
    <div className="w-full h-full bg-white border-r border-slate-200 flex flex-col overflow-hidden">
      
      {/* Sidebar Top Title */}
      <div className="p-4 border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Course Content</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} lessons • {modules.length} modules
            </p>
          </div>
          <span 
            className="px-2.5 py-1 text-white font-bold text-[10px] rounded-full"
            style={{ background: '#026adb' }}
          >
            {overallProgressPercentage}%
          </span>
        </div>
        {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1 shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${overallProgressPercentage}%`, background: 'linear-gradient(90deg, #026adb, #4f9ef5)' }}
            />
          </div>
      </div>

      {/* Modules List (Paginated up to 3 modules per page) */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {visibleModules.map((mod) => {
          const modIdx = modules.findIndex(m => m.id === mod.id);
          const isExpanded = !!expandedModules[mod.id];
          const completedInMod = (mod.lessons || []).filter(
            (les) => progressMap[les.id]?.status === 'COMPLETED'
          ).length;
          const totalInMod = mod.lessons?.length || 0;

          return (
            <div key={mod.id} className="bg-white">
              {/* Module Header Toggle */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full p-3.5 text-left flex items-start justify-between hover:bg-slate-50 transition-colors group"
              >
                <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#026adb' }}>
                    Module {modIdx + 1}
                  </span>
                  <h3 className="font-semibold text-slate-800 text-xs leading-snug">{mod.title}</h3>
                  {/* Per-module mini progress row */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: totalInMod > 0 ? `${Math.round((completedInMod / totalInMod) * 100)}%` : '0%',
                          background: completedInMod === totalInMod && totalInMod > 0 ? '#16a34a' : '#026adb'
                        }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold shrink-0 ${completedInMod === totalInMod && totalInMod > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {completedInMod}/{totalInMod} ({totalInMod > 0 ? Math.round((completedInMod / totalInMod) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="text-slate-400 pt-1 group-hover:text-slate-600 transition-colors shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Lessons List & Assessment CTA */}
              {isExpanded && (
                <div className="bg-slate-50/60 divide-y divide-slate-100/80 border-t border-slate-100">
                  {mod.lessons?.map((lesson) => {
                    const isCurrent = lesson.id === currentLessonId;
                    const prog = progressMap[lesson.id];
                    const isCompleted = prog?.status === 'COMPLETED';
                    const isInProgress = prog?.status === 'IN_PROGRESS';

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson.id)}
                        className={`w-full py-2.5 px-3 text-left flex items-start gap-2.5 transition-all border-l-[3px] ${
                          isCurrent
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-transparent hover:bg-slate-50 text-slate-700 hover:border-slate-200'
                        }`}
                        style={isCurrent ? { borderLeftColor: '#026adb', backgroundColor: '#e8f0fc' } : {}}
                      >
                        {/* Status Icon */}
                        <div className="pt-0.5 shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                          ) : isCurrent ? (
                            <PlayCircle className="w-4 h-4 fill-blue-100" style={{ color: '#026adb' }} />
                          ) : isInProgress ? (
                            <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300" />
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <span className={`text-xs leading-tight block ${
                            isCurrent ? 'font-semibold' : isCompleted ? 'text-slate-600' : 'text-slate-800'
                          }`}>
                            {lesson.title}
                          </span>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <div className="flex items-center gap-1">
                              {getLessonTypeIcon(lesson.lesson_type)}
                              <span className="capitalize">{lesson.lesson_type.toLowerCase()}</span>
                            </div>

                            {lesson.duration_seconds && lesson.duration_seconds > 0 && (
                              <span>• {Math.round(lesson.duration_seconds / 60)}m</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Module Assessment Entry Button */}
                  {onOpenModuleAssessment && (() => {
                    const isUnlocked = Boolean(mod.assessmentUnlocked || (totalInMod > 0 && completedInMod === totalInMod));
                    return (
                      <div className="p-3 bg-indigo-50/40 border-t border-indigo-100/60">
                        <button
                          onClick={() => isUnlocked && onOpenModuleAssessment(mod.id, mod.title)}
                          disabled={!isUnlocked && !mod.assessmentPassed}
                          className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                            mod.assessmentPassed
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100/70'
                              : isUnlocked
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs cursor-pointer'
                              : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {mod.assessmentPassed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : isUnlocked ? (
                              <Award className="w-4 h-4 text-white" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-400" />
                            )}
                            <span>Module Assessment</span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px]">
                            {mod.assessmentPassed ? (
                              <span className="font-extrabold text-emerald-700">PASSED ✓</span>
                            ) : isUnlocked ? (
                              <span>10 Qs • Pass 70%</span>
                            ) : (
                              <span>Complete lessons</span>
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}

        {/* Final Assessment Item Notice / CTA */}
        <div className="p-4 border-t border-slate-200 text-xs space-y-2 bg-amber-50/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Award className="w-4.5 h-4.5 text-amber-600 shrink-0" />
              <span>FINAL ASSESSMENT</span>
            </div>
            <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              30 Qs • Pass 70%
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            Comprehensive exam covering all 11 modules. Passing score is 70% (21/30).
          </p>

          {onOpenFinalAssessment && (
            <button
              onClick={onOpenFinalAssessment}
              className="w-full mt-1 p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Take Final Assessment</span>
            </button>
          )}
        </div>

        {/* 3-Module Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 text-xs font-bold text-slate-700 shrink-0">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-[11px] font-bold cursor-pointer"
            >
              ← Prev 3
            </button>

            <span className="text-[11px] text-slate-600 font-bold">
              Modules {(currentPage - 1) * MODULES_PER_PAGE + 1} - {Math.min(currentPage * MODULES_PER_PAGE, modules.length)} of {modules.length}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-[11px] font-bold cursor-pointer"
            >
              Next 3 →
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
