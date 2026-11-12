import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface SpeakingRecorderProps {
  prepSeconds?: number;
  speakingSeconds?: number;
  onRecordingComplete: (blobUrl: string, duration: number) => void;
}

export const SpeakingRecorder: React.FC<SpeakingRecorderProps> = ({
  prepSeconds = 60,
  speakingSeconds = 120,
  onRecordingComplete
}) => {
  const [phase, setPhase] = useState<'idle' | 'prep' | 'recording' | 'recorded'>('idle');
  const [prepTimeLeft, setPrepTimeLeft] = useState(prepSeconds);
  const [recordTimeLeft, setRecordTimeLeft] = useState(speakingSeconds);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (audioElementRef.current) audioElementRef.current.pause();
    };
  }, []);

  const startPreparation = () => {
    setPhase('prep');
    setPrepTimeLeft(prepSeconds);
    setMicError(null);

    prepTimerRef.current = setInterval(() => {
      setPrepTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(prepTimerRef.current!);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        setPhase('recorded');
        const durationRecorded = speakingSeconds - recordTimeLeft;
        onRecordingComplete(url, durationRecorded);

        // Stop media tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setPhase('recording');
      setRecordTimeLeft(speakingSeconds);

      recordingTimerRef.current = setInterval(() => {
        setRecordTimeLeft(prev => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      setMicError('Microphone permission is required to record speaking practice. Please enable microphone permissions in your browser.');
      setPhase('idle');
    }
  };

  const stopRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const toggleAudioPlayback = () => {
    if (!recordedAudioUrl) return;

    if (!audioElementRef.current) {
      const audio = new Audio(recordedAudioUrl);
      audioElementRef.current = audio;
      audio.onended = () => setIsPlayingAudio(false);
    }

    if (isPlayingAudio) {
      audioElementRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioElementRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleReset = () => {
    if (audioElementRef.current) audioElementRef.current.pause();
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setRecordedAudioUrl(null);
    setIsPlayingAudio(false);
    setPhase('idle');
    setPrepTimeLeft(prepSeconds);
    setRecordTimeLeft(speakingSeconds);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <Mic className="w-5 h-5 text-blue-400" />
          Official IELTS Speaking Studio
        </h4>
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Prep: 1 min · Speaking: 2 min</span>
        </div>
      </div>

      {micError && (
        <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-lg text-xs text-red-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{micError}</span>
        </div>
      )}

      {/* Main Studio Controls */}
      <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-4">
        {phase === 'idle' && (
          <div className="text-center space-y-4">
            <p className="text-sm text-slate-300 max-w-md">
              Click below to initiate the official 60-second cue card preparation timer, or begin speaking immediately.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={startPreparation}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md transition"
              >
                Start 1-Min Preparation Timer
              </button>
              <button
                type="button"
                onClick={startRecording}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg border border-slate-700 transition"
              >
                Record Immediately
              </button>
            </div>
          </div>
        )}

        {phase === 'prep' && (
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Preparation Interval</span>
            <div className="text-5xl font-mono font-bold text-amber-400 tabular-nums">
              {formatTimer(prepTimeLeft)}
            </div>
            <p className="text-xs text-slate-400">Organize your thoughts according to the cue card prompts.</p>
            <button
              type="button"
              onClick={startRecording}
              className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
            >
              Ready Now: Begin Recording
            </button>
          </div>
        )}

        {phase === 'recording' && (
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Live Audio Recording</span>
            </div>
            <div className="text-5xl font-mono font-bold text-red-400 tabular-nums">
              {formatTimer(recordTimeLeft)}
            </div>

            {/* Pulsing Visual Waveform */}
            <div className="flex items-center justify-center gap-1.5 h-8 my-2">
              {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-red-500 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${(i * 0.1).toFixed(1)}s`
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={stopRecording}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 mx-auto shadow-lg transition"
            >
              <Square className="w-4 h-4 fill-current" />
              Stop & Finalize Recording
            </button>
          </div>
        )}

        {phase === 'recorded' && (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-semibold">Speaking Audio Successfully Recorded</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={toggleAudioPlayback}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-md transition"
              >
                {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                {isPlayingAudio ? 'Pause Playback' : 'Listen to Your Speech'}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                title="Record Again"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
