import React, { useEffect, useRef, useState } from 'react';

interface YouTubeLessonPlayerProps {
  videoId: string;
  lessonTitle: string;
  lastPositionSeconds?: number;
  isCompleted?: boolean;
  onUpdateProgress: (progressData: {
    last_position_seconds: number;
    watch_percentage?: number;
  }) => void;
  onCompleteLesson: () => void;
}

export const YouTubeLessonPlayer: React.FC<YouTubeLessonPlayerProps> = ({
  videoId,
  lessonTitle,
  lastPositionSeconds = 0,
  isCompleted = false,
  onUpdateProgress,
  onCompleteLesson,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const pollIntervalRef = useRef<number | null>(null);

  // Progress tracking refs
  const lastSavedTimeRef = useRef<number>(lastPositionSeconds || 0);
  const hasCompletedRef = useRef<boolean>(isCompleted);
  const isReadyRef = useRef<boolean>(false);

  // Error and UI state
  const [error, setError] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<'UNSTARTED' | 'PLAYING' | 'PAUSED' | 'ENDED' | 'BUFFERING'>('UNSTARTED');
  const [currentTime, setCurrentTime] = useState<number>(lastPositionSeconds || 0);
  const [duration, setDuration] = useState<number>(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isApiReady, setIsApiReady] = useState(false);

  // Initialize and clean up YouTube API
  useEffect(() => {
    let isMounted = true;

    // Reset state for new lesson
    hasCompletedRef.current = isCompleted;
    lastSavedTimeRef.current = lastPositionSeconds || 0;
    isReadyRef.current = false;
    setIsApiReady(false);
    setError(null);
    setPlayerState('UNSTARTED');
    setCurrentTime(lastPositionSeconds || 0);
    setDuration(0);

    const loadPlayer = () => {
      if (!isMounted || !iframeRef.current) return;

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
        playerRef.current = null;
      }

      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event: any) => {
            if (!isMounted) return;
            isReadyRef.current = true;
            setIsApiReady(true);
            setDuration(event.target.getDuration() || 0);

            if (lastPositionSeconds && lastPositionSeconds > 0 && !isCompleted) {
              event.target.seekTo(Math.floor(lastPositionSeconds), true);
            }
          },
          onStateChange: handlePlayerStateChange,
          onError: () => {
            if (isMounted) setError('This video is unavailable or restricted from playback here.');
          }
        },
      });
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      if (!document.getElementById('youtube-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
      }

      const existingCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (existingCallback) existingCallback();
        if (isMounted) loadPlayer();
      };
    }

    return () => {
      isMounted = false;
      stopPolling();
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, [videoId]);

  useEffect(() => {
    if (isCompleted) {
      hasCompletedRef.current = true;
    }
  }, [isCompleted]);

  const handlePlayerStateChange = (event: any) => {
    if (!window.YT || !window.YT.PlayerState) return;
    const state = event.data;

    if (state === window.YT.PlayerState.PLAYING) {
      setPlayerState('PLAYING');
      setDuration(playerRef.current?.getDuration() || 0);
      startPolling();
    } else {
      stopPolling();
      if (state === window.YT.PlayerState.ENDED) {
        setPlayerState('ENDED');
        handleVideoEnded();
      } else if (state === window.YT.PlayerState.PAUSED) {
        setPlayerState('PAUSED');
        saveProgress(true);
      } else if (state === window.YT.PlayerState.UNSTARTED) {
        setPlayerState('UNSTARTED');
      } else if (state === window.YT.PlayerState.BUFFERING) {
        setPlayerState('BUFFERING');
      }
    }
  };

  const handleVideoEnded = () => {
    stopPolling();
    if (!playerRef.current || !isReadyRef.current) return;
    const duration = playerRef.current.getDuration() || 0;
    lastSavedTimeRef.current = duration;
    onUpdateProgress({
      last_position_seconds: Math.floor(duration),
      watch_percentage: 100
    });
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onCompleteLesson();
    }
  };

  const startPolling = () => {
    stopPolling();
    pollIntervalRef.current = window.setInterval(() => {
      saveProgress(false);
    }, 1000);
  };

  const stopPolling = () => {
    if (pollIntervalRef.current !== null) {
      window.clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const saveProgress = (force: boolean) => {
    if (!playerRef.current || !isReadyRef.current) return;
    try {
      const currentSec = playerRef.current.getCurrentTime() || 0;
      const duration = playerRef.current.getDuration() || 0;
      if (duration === 0) return;
      const watchPct = Math.min(100, Math.max(0, Math.round((currentSec / duration) * 100)));

      setCurrentTime(currentSec);

      if (force || Math.abs(currentSec - lastSavedTimeRef.current) >= 5) {
        lastSavedTimeRef.current = currentSec;
        onUpdateProgress({
          last_position_seconds: Math.floor(currentSec),
          watch_percentage: watchPct
        });
      }

      if (watchPct >= 90 && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onCompleteLesson();
      }
    } catch (e) {
      stopPolling();
    }
  };

  if (error) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center flex-col text-center p-6 rounded-2xl">
        <p className="text-rose-400 font-semibold mb-2">Video Error</p>
        <p className="text-slate-300 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black relative group rounded-2xl overflow-hidden shadow-2xl">
      {/* 
        Native YouTube iframe without sandbox so API communication works properly.
        Allows native features (fullscreen, captions, speed, double-tap to seek).
      */}
      <iframe
        ref={iframeRef}
        className="w-full h-full absolute inset-0 z-0"
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        title={lessonTitle}
      />
    </div>
  );
};

export default YouTubeLessonPlayer;
