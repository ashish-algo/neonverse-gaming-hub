import React from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { LevelConfig } from '../types';
import { sound } from '../../../utils/soundEngine';

interface ShapeHunterHeaderProps {
  levelConfig: LevelConfig;
  currentQuestionIndex: number; // 0..4
  totalQuestions: number; // 5
  levelScore: number;
  totalRunScore: number;
  correctCount: number;
  incorrectCount: number;
  timeoutCount: number;
  remainingSeconds: number;
  isTimerWarning: boolean; // <= 15s
  isTimerCritical: boolean; // <= 5s
  soundEnabled: boolean;
  onToggleSound: () => void;
  onExitLevel: () => void;
}

export const ShapeHunterHeader: React.FC<ShapeHunterHeaderProps> = ({
  levelConfig,
  currentQuestionIndex,
  totalQuestions,
  levelScore,
  totalRunScore,
  correctCount,
  incorrectCount,
  timeoutCount,
  remainingSeconds,
  isTimerWarning,
  isTimerCritical,
  soundEnabled,
  onToggleSound,
  onExitLevel,
}) => {
  // Format MM:SS
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <header className="w-full max-w-4xl mx-auto px-4 pt-4 pb-3 flex flex-col gap-3 select-none">
      {/* Top Utility Bar */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playButtonClick();
              onExitLevel();
            }}
            onMouseEnter={() => sound.playHoverChirp()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50 transition-all text-xs font-mono font-bold shadow-md cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">EXIT LEVEL</span>
            <span className="sm:hidden">EXIT</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black tracking-wider uppercase border shadow-sm flex items-center gap-1.5"
              style={{
                backgroundColor: `${levelConfig.accentColor}18`,
                borderColor: `${levelConfig.accentColor}50`,
                color: levelConfig.accentColor,
              }}
            >
              <span>LEVEL {levelConfig.level}: {levelConfig.astraName.toUpperCase()}</span>
              <span className="text-amber-300 font-sans font-medium text-[11px]">({levelConfig.sanskritName})</span>
            </span>
          </div>
        </div>

        {/* Center / Right Timer & Sound Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real-time Countdown Timer in MM:SS */}
          <div
            className={`
              flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono font-black text-sm sm:text-base border transition-all duration-300 shadow-md
              ${
                isTimerCritical
                  ? 'bg-rose-950/90 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
                  : isTimerWarning
                  ? 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'bg-slate-900/90 border-slate-700 text-cyan-300 shadow-[0_0_10px_rgba(0,245,255,0.2)]'
              }
            `}
          >
            <Clock
              className={`w-4 h-4 ${
                isTimerCritical
                  ? 'text-rose-400 animate-spin'
                  : isTimerWarning
                  ? 'text-amber-400'
                  : 'text-cyan-400'
              }`}
            />
            <span className="tracking-widest">{formattedTime}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playCyberBlip();
              onToggleSound();
            }}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-700/80 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Progress & Stat HUD Bar */}
      <div className="w-full p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        {/* Question Counter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] font-bold">QUESTION:</span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <span
                key={i}
                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black border transition-all ${
                  i === currentQuestionIndex
                    ? 'border-cyan-400 bg-cyan-950 text-cyan-300 shadow-[0_0_10px_rgba(0,245,255,0.4)] scale-110'
                    : i < currentQuestionIndex
                    ? 'border-slate-700 bg-slate-800 text-slate-400'
                    : 'border-slate-800 bg-slate-950 text-slate-600'
                }`}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>

        {/* Live Score & Run Tracking */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5" title="Level Score">
            <span className="text-slate-400 text-[11px]">LVL SCORE:</span>
            <span className="font-black text-white px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400">
              {levelScore}
              <span className="text-slate-500 text-[10px]">/{levelConfig.maxScore ?? 700}</span>
            </span>
          </div>

          {/* Quick Tally Badges */}
          <div className="hidden sm:flex items-center gap-2.5 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400 font-bold" title="Correct Answers">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{correctCount}</span>
            </span>
            <span className="flex items-center gap-1 text-rose-400 font-bold" title="Incorrect Answers">
              <XCircle className="w-3.5 h-3.5" />
              <span>{incorrectCount}</span>
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-bold" title="Timed Out Questions">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{timeoutCount}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
