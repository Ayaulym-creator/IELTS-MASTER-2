import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, FastForward, CheckCircle2 } from 'lucide-react';

interface IELTSAudioPlayerProps {
  title: string;
  transcript: string;
  durationSeconds: number;
  accent: string;
  onAudioComplete?: () => void;
}

export const IELTSAudioPlayer: React.FC<IELTSAudioPlayerProps> = ({
  title,
  transcript,
  durationSeconds,
  accent,
  onAudioComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [replayCount, setReplayCount] = useState<number>(0);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Initialize SpeechSynthesis
  useEffect(() => {
    if (isSpeechSupported) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isSpeechSupported]);

  // Clean transcript of speaker names for natural narration
  const getCleanSpeechText = (raw: string) => {
    return raw
      .replace(/^(Officer|Student|Ranger|Tutor|Liam|Sophie|Speaker):/gim, '')
      .replace(/\n+/g, ' ');
  };

  const startPlayback = () => {
    if (!synthRef.current) return;

    // Cancel any current speech
    synthRef.current.cancel();

    const cleanText = getCleanSpeechText(transcript);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    // Pick suitable voice based on accent
    const voices = synthRef.current.getVoices();
    let selectedVoice = voices.find(v => v.lang.startsWith('en-GB'));
    if (accent.includes('Australian')) {
      selectedVoice = voices.find(v => v.lang.startsWith('en-AU')) || selectedVoice;
    } else if (accent.includes('American') || accent.includes('International')) {
      selectedVoice = voices.find(v => v.lang.startsWith('en-US')) || selectedVoice;
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = playbackRate;
    utterance.volume = isMuted ? 0 : volume;

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentTime(durationSeconds);
      if (timerRef.current) clearInterval(timerRef.current);
      onAudioComplete?.();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis playback ended/error:', e);
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    synthRef.current.speak(utterance);
    setIsPlaying(true);

    // Timer simulation for progress bar
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= durationSeconds) {
          clearInterval(timerRef.current!);
          setIsPlaying(false);
          return durationSeconds;
        }
        return prev + 1;
      });
    }, 1000 / playbackRate);
  };

  const pausePlayback = () => {
    if (synthRef.current && isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumePlayback = () => {
    if (synthRef.current && synthRef.current.paused) {
      synthRef.current.resume();
      setIsPlaying(true);
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= durationSeconds) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            return durationSeconds;
          }
          return prev + 1;
        });
      }, 1000 / playbackRate);
    } else {
      startPlayback();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      resumePlayback();
    }
  };

  const handleRestart = () => {
    if (synthRef.current) synthRef.current.cancel();
    setCurrentTime(0);
    setReplayCount(prev => prev + 1);
    startPlayback();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const cycleSpeed = () => {
    const speeds = [0.85, 1.0, 1.2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (isPlaying) {
      handleRestart();
    }
  };

  const progressPercent = durationSeconds > 0 ? (currentTime / durationSeconds) * 100 : 0;

  return (
    <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="text-emerald-400 font-medium">AUTHENTIC IELTS AUDIO</span>
            <span>·</span>
            <span>{accent}</span>
            <span>·</span>
            <span>Duration {formatTime(durationSeconds)}</span>
          </div>
          <h4 className="text-base font-semibold text-slate-100">{title}</h4>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Replay Counter */}
          <div className="text-xs text-slate-400">
            Replays used: <span className="text-white font-medium">{replayCount}</span>
          </div>
          
          {/* Speed Toggle */}
          <button
            type="button"
            onClick={cycleSpeed}
            className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
            title="Adjust Audio Speed"
          >
            {playbackRate}x
          </button>
        </div>
      </div>

      {/* Progress Bar & Waveform Indicator */}
      <div className="space-y-1 mb-4">
        <div className="w-full bg-slate-800 rounded-full h-2 relative overflow-hidden cursor-pointer">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, progressPercent)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(durationSeconds)}</span>
        </div>
      </div>

      {/* Audio Controls Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Replay Audio"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="text-slate-400 hover:text-white p-1"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 md:w-28 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
