import React, { useState, useEffect, useRef } from 'react';
import { LessonResources } from './LessonResources.tsx';
import { getAuthTokenAsync } from '../../lib/supabaseClient.ts';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Copy, 
  Check,
  Target,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Volume2,
  Settings
} from 'lucide-react';

interface LessonRendererProps {
  courseSlug?: string;
  lesson: {
    id: string;
    title: string;
    description?: string;
    lesson_type: string;
    content?: string;
    video_url?: string;
    duration_seconds?: number;
    is_required?: boolean;
    learning_objectives?: string[] | null;
    key_takeaways?: string[] | null;
    practical_instructions?: string | null;
  };
  resources: any[];
  progress: {
    status: string;
    last_position_seconds?: number;
    watch_percentage?: number;
  };
  onUpdateProgress: (progressData: { last_position_seconds: number; watch_percentage?: number }) => void;
  onCompleteLesson: () => void;
  isCompleting?: boolean;
}

export const LessonRenderer: React.FC<LessonRendererProps> = ({
  courseSlug = 'statistics-data-analytics',
  lesson,
  resources,
  progress,
  onUpdateProgress,
  onCompleteLesson,
  isCompleting,
}) => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [videoTime, setVideoTime] = useState<number>(progress.last_position_seconds || 0);
  const [videoDuration, setVideoDuration] = useState<number>(lesson.duration_seconds || 300);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  // Knowledge Checkpoint state
  const [checkpoint, setCheckpoint] = useState<any>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{ is_correct: boolean; explanation: string; correct_option_id?: string } | null>(null);
  const [isSubmittingCheckpoint, setIsSubmittingCheckpoint] = useState<boolean>(false);

  const lastSavedTimeRef = useRef<number>(progress.last_position_seconds || 0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isCompleted = progress.status === 'COMPLETED';
  const subtitleTrack = resources?.find((r: any) => r.resource_type === 'SUBTITLE');

  useEffect(() => {
    setVideoTime(progress.last_position_seconds || 0);
    lastSavedTimeRef.current = progress.last_position_seconds || 0;
  }, [lesson.id, progress.last_position_seconds]);

  // Fetch Checkpoint for ARTICLE and VIDEO lessons
  useEffect(() => {
    setSubmissionResult(null);
    setSelectedOptionId(null);

    const fetchCheckpoint = async () => {
      try {
        const token = await getAuthTokenAsync();
        const headers: Record<string, string> = { 'Accept': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`/api/learn/${courseSlug}/lessons/${lesson.id}/checkpoint`, { headers });
        const data = await res.json();
        if (data.success && data.checkpoint) {
          setCheckpoint(data.checkpoint);
          if (data.checkpoint.previousAttempt) {
            setSelectedOptionId(data.checkpoint.previousAttempt.selected_option_id);
          }
        } else {
          setCheckpoint(null);
        }
      } catch (err) {
        console.error('Failed to fetch checkpoint:', err);
      }
    };

    fetchCheckpoint();
  }, [lesson.id, courseSlug]);

  const handleSubmitCheckpoint = async () => {
    if (!selectedOptionId || !checkpoint) return;
    setIsSubmittingCheckpoint(true);
    try {
      const token = await getAuthTokenAsync();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`/api/learn/${courseSlug}/lessons/${lesson.id}/checkpoint/attempt`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ selected_option_id: selectedOptionId })
      });
      const data = await res.json();
      if (data.success) {
        setSubmissionResult({
          is_correct: data.is_correct,
          explanation: data.explanation,
          correct_option_id: data.correct_option_id
        });
        // Instant student progress trigger on correct checkpoint answer
        if (data.is_correct && !isCompleted) {
          onCompleteLesson();
        }
      }
    } catch (err) {
      console.error('Failed to submit checkpoint attempt:', err);
    } finally {
      setIsSubmittingCheckpoint(false);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = Math.round(videoRef.current.duration) || lesson.duration_seconds || 300;
      setVideoDuration(dur);

      if (progress.last_position_seconds && progress.last_position_seconds > 0) {
        if (progress.last_position_seconds < dur) {
          videoRef.current.currentTime = progress.last_position_seconds;
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentSec = Math.floor(videoRef.current.currentTime);
      setVideoTime(currentSec);

      if (Math.abs(currentSec - lastSavedTimeRef.current) >= 5) {
        lastSavedTimeRef.current = currentSec;
        const watchPct = videoDuration > 0 ? Math.min(100, Math.round((currentSec / videoDuration) * 100)) : 0;
        onUpdateProgress({
          last_position_seconds: currentSec,
          watch_percentage: watchPct
        });

        if (watchPct >= 90 && !isCompleted) {
          onCompleteLesson();
        }
      }
    }
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    if (videoRef.current) {
      const dur = Math.floor(videoRef.current.duration) || videoDuration;
      onUpdateProgress({
        last_position_seconds: dur,
        watch_percentage: 100
      });
      if (!isCompleted) {
        onCompleteLesson();
      }
    }
  };

  const handleCopyText = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const formatSeconds = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Primary Content Renderer
  const renderPrimaryContent = () => {
    switch (lesson.lesson_type?.toUpperCase()) {
      case 'VIDEO': {
        const watchPercentage = videoDuration > 0 ? Math.min(100, Math.round((videoTime / videoDuration) * 100)) : 0;
        const hasRealVideo = lesson.video_url && lesson.video_url.trim().length > 0;

        return (
          <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden relative shadow-lg border border-slate-800 flex flex-col justify-between text-white">
            {hasRealVideo ? (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={lesson.video_url}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full rounded-2xl object-contain"
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                >
                  {subtitleTrack && (
                    <track
                      kind="subtitles"
                      src={subtitleTrack.file_url}
                      srcLang="en"
                      label={subtitleTrack.title || 'English'}
                      default
                    />
                  )}
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between text-xs text-slate-300 z-10">
                  <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-bold">
                    VIDEO LESSON
                  </span>
                  <span>{formatSeconds(videoTime)} / {formatSeconds(videoDuration)}</span>
                </div>

                <div className="text-center space-y-3 my-auto z-10 max-w-lg mx-auto">
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center mx-auto shadow-xl transition-all transform hover:scale-105"
                  >
                    <Play className={`w-8 h-8 fill-white ${isVideoPlaying ? 'ml-0' : 'ml-1'}`} />
                  </button>
                  <p className="text-xs text-slate-300 font-medium">
                    {isVideoPlaying ? 'Playing lesson video...' : 'Click to play video'}
                  </p>
                </div>

                <div className="space-y-2 z-10">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-200"
                      style={{ width: `${watchPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'ARTICLE':
      case 'READING': {
        const renderContent = (content: string) => {
          return content.split('\n\n').map((block, idx) => {
            const trimmed = block.trim();
            if (!trimmed) return null;

            // Code block
            if (trimmed.startsWith('```')) {
              const codeText = trimmed.replace(/^```[a-z]*\n?/, '').replace(/```$/, '').trim();
              return (
                <div key={idx} className="relative bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto my-4">
                  <button
                    onClick={() => handleCopyText(codeText)}
                    className="absolute right-3 top-3 p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="m-0 leading-relaxed whitespace-pre-wrap">{codeText}</pre>
                </div>
              );
            }

            // H1 heading
            if (trimmed.startsWith('# ')) {
              return <h3 key={idx} className="text-lg font-bold text-slate-900 mt-6 mb-2">{trimmed.slice(2)}</h3>;
            }
            // H2 heading
            if (trimmed.startsWith('## ')) {
              return <h4 key={idx} className="text-base font-semibold text-slate-800 mt-5 mb-2">{trimmed.slice(3)}</h4>;
            }
            // H3 heading
            if (trimmed.startsWith('### ')) {
              return <h5 key={idx} className="text-sm font-semibold text-slate-700 mt-4 mb-1.5">{trimmed.slice(4)}</h5>;
            }

            // Bullet list
            if (trimmed.split('\n').every(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
              const items = trimmed.split('\n').filter(l => l.trim());
              return (
                <ul key={idx} className="list-disc list-inside space-y-1.5 my-3">
                  {items.map((item, i) => (
                    <li key={i} className="text-sm text-slate-700 leading-relaxed pl-1">
                      {item.replace(/^[-*]\s+/, '')}
                    </li>
                  ))}
                </ul>
              );
            }

            // Numbered list
            if (trimmed.split('\n').some(line => /^\d+\.\s/.test(line.trim()))) {
              const items = trimmed.split('\n').filter(l => l.trim());
              return (
                <ol key={idx} className="list-decimal list-inside space-y-1.5 my-3">
                  {items.map((item, i) => (
                    <li key={i} className="text-sm text-slate-700 leading-relaxed pl-1">
                      {item.replace(/^\d+\.\s+/, '')}
                    </li>
                  ))}
                </ol>
              );
            }

            // Regular paragraph
            return (
              <p key={idx} className="text-sm text-slate-700 leading-7">
                {trimmed}
              </p>
            );
          }).filter(Boolean);
        };

        return (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: '#026adb' }}>
              <FileText className="w-4 h-4" />
              <span className="uppercase tracking-widest">{lesson.lesson_type} LESSON</span>
            </div>

            {lesson.content && lesson.content.trim() ? (
              lesson.content.trim().startsWith('<') ? (
                <div 
                  className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed prose-h2:text-xl prose-h2:font-extrabold prose-h2:text-slate-900 prose-h2:mt-7 prose-h2:mb-3 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-100 prose-h3:text-base prose-h3:font-bold prose-h3:text-slate-900 prose-h3:mt-5 prose-h3:mb-2 prose-p:text-sm prose-p:text-slate-700 prose-p:leading-7 prose-p:mb-4 prose-ul:list-disc prose-ul:pl-5 prose-ul:my-4 prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-4 prose-li:text-sm prose-li:text-slate-700 prose-li:mb-1.5 prose-strong:text-slate-900 prose-code:bg-slate-100 prose-code:text-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              ) : (
                <div className="space-y-4">
                  {renderContent(lesson.content)}
                </div>
              )
            ) : (
              <div className="p-10 bg-slate-50/80 border border-slate-200 rounded-2xl text-center space-y-3 max-w-xl mx-auto my-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900">Lesson Preparation in Progress</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This lesson is currently being prepared. Please continue with the next available lesson.
                </p>
              </div>
            )}
          </div>
        );
      }

      case 'PRACTICAL':
        // Practical lessons are treated as ARTICLE-type reading content
        return (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#026adb' }}>
              <FileText className="w-4 h-4" />
              <span>READING MATERIAL</span>
            </div>
            <div className="prose prose-slate max-w-none text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {lesson.content || 'Content for this lesson will be available soon.'}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const hasObjectives = Array.isArray(lesson.learning_objectives) && lesson.learning_objectives.length > 0;
  const hasTakeaways = Array.isArray(lesson.key_takeaways) && lesson.key_takeaways.length > 0;
  const hasNotes = Boolean(lesson.content && lesson.lesson_type === 'VIDEO');

  return (
    <div className="space-y-6 max-w-4xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
      
      {/* ── LESSON HEADER (GL-style: title + status + Complete CTA in same row) ── */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Breadcrumb-style lesson type badge */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded" style={{ background: '#e8f0fc', color: '#026adb' }}>
              {lesson.lesson_type}
            </span>
            {lesson.duration_seconds && lesson.duration_seconds > 0 && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {Math.round(lesson.duration_seconds / 60)} min
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {lesson.title}
          </h2>

          {lesson.description && (
            <p className="text-sm text-slate-500 leading-relaxed">{lesson.description}</p>
          )}
        </div>

        {/* GL-style Mark Complete Button — top right */}
        <div className="shrink-0 pt-1">
          {isCompleted ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Completed</span>
            </div>
          ) : (
            <button
              onClick={onCompleteLesson}
              disabled={isCompleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: '#026adb' }}
            >
              {isCompleting ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /><span>Mark as Complete</span></>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 2. LEARNING OBJECTIVES (IF POPULATED) */}
      {hasObjectives && (
        <div className="bg-indigo-50/60 border border-indigo-100 p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-black uppercase text-indigo-900 tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>Learning Objectives</span>
          </h3>
          <ul className="space-y-2 text-xs text-indigo-950 font-medium list-disc list-inside leading-relaxed">
            {lesson.learning_objectives!.map((obj, idx) => (
              <li key={idx}>{obj}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. PRIMARY CONTENT */}
      {renderPrimaryContent()}

      {/* 4. LESSON NOTES (IF POPULATED) */}
      {hasNotes && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-700" />
            <span>Structured Lesson Notes</span>
          </h3>
          <div className="prose prose-slate text-xs text-slate-700 whitespace-pre-line leading-relaxed">
            {lesson.content}
          </div>
        </div>
      )}

      {/* 5. KEY TAKEAWAYS (IF POPULATED) */}
      {hasTakeaways && (
        <div className="bg-emerald-50/60 border border-emerald-100 p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <span>Key Takeaways</span>
          </h3>
          <ul className="space-y-2 text-xs text-emerald-950 font-medium list-disc list-inside leading-relaxed">
            {lesson.key_takeaways!.map((tk, idx) => (
              <li key={idx}>{tk}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Practical instructions removed — GL Academy does not show a separate practical section */}

      {/* 6.5 CHECK YOUR UNDERSTANDING (KNOWLEDGE CHECKPOINT) */}
      {checkpoint && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-indigo-900 tracking-wider">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Check Your Understanding</span>
          </div>

          <h4 className="text-sm font-bold text-slate-900 leading-snug">
            {checkpoint.question}
          </h4>

          <div className="space-y-2">
            {checkpoint.options.map((opt: any) => {
              const isSelected = selectedOptionId === opt.id;
              let optionClass = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800';

              if (submissionResult) {
                if (opt.id === submissionResult.correct_option_id) {
                  optionClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                } else if (isSelected && !submissionResult.is_correct) {
                  optionClass = 'border-amber-500 bg-amber-50 text-amber-950';
                }
              } else if (isSelected) {
                optionClass = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold';
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => !submissionResult && setSelectedOptionId(opt.id)}
                  disabled={Boolean(submissionResult)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center gap-3 ${optionClass}`}
                >
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                  }`}>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                  <span>{opt.option_text}</span>
                </button>
              );
            })}
          </div>

          {!submissionResult ? (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmitCheckpoint}
                disabled={!selectedOptionId || isSubmittingCheckpoint}
                className="px-4 py-2 rounded-lg text-white text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: '#026adb' }}
              >
                {isSubmittingCheckpoint ? 'Checking...' : 'Check Answer'}
              </button>
            </div>
          ) : (
            <div className={`p-4 rounded-xl text-xs space-y-2 border ${
              submissionResult.is_correct ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div className="font-extrabold flex items-center justify-between">
                <span>{submissionResult.is_correct ? 'CORRECT ✓' : 'NOT QUITE'}</span>
                <button
                  type="button"
                  onClick={() => setSubmissionResult(null)}
                  className="text-[11px] underline font-bold"
                >
                  Try Again
                </button>
              </div>
              <p className="leading-relaxed font-medium">{submissionResult.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* SUPPORTING RESOURCES */}
      <LessonResources resources={resources} />

      {/* BOTTOM COMPLETION ROW (GL-style: bottom CTA + next navigation hint) */}
      <div className="pt-5 border-t border-slate-200 flex items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          {isCompleted ? (
            <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Lesson completed — continue to the next topic</span>
            </span>
          ) : (
            <span>Read through the lesson, then mark it complete to track your progress.</span>
          )}
        </div>

        {!isCompleted && (
          <button
            onClick={onCompleteLesson}
            disabled={isCompleting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: '#026adb' }}
          >
            {isCompleting ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /><span>Mark as Complete</span></>
            )}
          </button>
        )}
      </div>

    </div>
  );
};
