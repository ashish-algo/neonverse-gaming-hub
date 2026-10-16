import React from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Grid,
  Layers,
  Hash,
  Clock,
  Award,
} from 'lucide-react';
import { DifficultyTier, MemoryMode } from '../types';
import { DIFFICULTY_TIERS, MEMORY_MODES } from '../constants';
import { sound } from '../../../utils/soundEngine';

interface MemoryGameHUDProps {
  mode: MemoryMode;
  difficulty: DifficultyTier;
  round: number;
  score: number;
  bestScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onExit: () => void;

  // Optional mode-specific metrics
  sequenceLength?: number;
  pairsFound?: number;
  totalPairs?: number;
  moves?: number;
  elapsedSeconds?: number;
  patternCellsCount?: number;
  digitsCount?: number;
  statusBadge?: string;
}

export const MemoryGameHUD: React.FC<MemoryGameHUDProps> = ({
  mode,
  difficulty,
  round,
  score,
  bestScore,
  soundEnabled,
  onToggleSound,
  onRestart,
  onExit,
  sequenceLength,
  pairsFound,
  totalPairs,
  moves,
  elapsedSeconds,
  patternCellsCount,
  digitsCount,
  statusBadge,
}) => {
  const modeInfo = MEMORY_MODES[mode];
  const diffInfo = DIFFICULTY_TIERS.find((d) => d.id === difficulty) || DIFFICULTY_TIERS[0];

  const renderModeIcon = () => {
    switch (mode) {
      case 'sequence':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'match':
        return <Grid className="w-4 h-4 text-lime-400" />;
      case 'pattern':
        return <Layers className="w-4 h-4 text-purple-400" />;
      case 'numbers':
        return <Hash className="w-4 h-4 text-pink-400" />;
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <header className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 select-none">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Exit button & Mode Name */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playButtonClick();
              onExit();
            }}
            onMouseEnter={() => sound.playHoverChirp()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/50 text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer group shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-cyan-400" />
            <span className="hidden sm:inline">MODES</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hidden xs:flex items-center justify-center">
              {renderModeIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm text-white tracking-wide">
                  {modeInfo.name}
                </span>
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-wider"
                  style={{ color: diffInfo.accentColor }}
                >
                  [{diffInfo.label}]
                </span>
              </div>
              {statusBadge && (
                <span className="text-[10px] font-mono text-cyan-400 tracking-wide block">
                  {statusBadge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Dynamic Mode Metrics */}
        <div className="hidden md:flex items-center gap-5 text-xs font-mono">
          {mode === 'sequence' && sequenceLength !== undefined && (
            <div className="flex items-center gap-2 text-slate-400">
              <span>SEQUENCE:</span>
              <span className="font-black text-cyan-300 text-sm">{sequenceLength} STEPS</span>
            </div>
          )}

          {mode === 'match' && (
            <>
              {pairsFound !== undefined && totalPairs !== undefined && (
                <div className="flex items-center gap-2 text-slate-400">
                  <span>PAIRS:</span>
                  <span className="font-black text-lime-400 text-sm">
                    {pairsFound}/{totalPairs}
                  </span>
                </div>
              )}
              {moves !== undefined && (
                <div className="flex items-center gap-2 text-slate-400">
                  <span>MOVES:</span>
                  <span className="font-black text-cyan-400 text-sm">{moves}</span>
                </div>
              )}
              {elapsedSeconds !== undefined && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-black text-amber-300 text-sm">
                    {formatTime(elapsedSeconds)}
                  </span>
                </div>
              )}
            </>
          )}

          {mode === 'pattern' && patternCellsCount !== undefined && (
            <div className="flex items-center gap-2 text-slate-400">
              <span>PATTERN CELLS:</span>
              <span className="font-black text-purple-400 text-sm">{patternCellsCount}</span>
            </div>
          )}

          {mode === 'numbers' && digitsCount !== undefined && (
            <div className="flex items-center gap-2 text-slate-400">
              <span>DIGITS:</span>
              <span className="font-black text-pink-400 text-sm">{digitsCount}</span>
            </div>
          )}
        </div>

        {/* Right: Score, Best, Sound, Restart */}
        <div className="flex items-center gap-3">
          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
              SCORE
            </span>
            <div className="flex items-center gap-1 text-sm font-black">
              <span className="text-cyan-400">{score}</span>
              {bestScore > 0 && (
                <span className="text-[10px] text-slate-500 font-normal">
                  (BEST: {bestScore})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                sound.playButtonClick();
                onRestart();
              }}
              onMouseEnter={() => sound.playHoverChirp()}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              title="Restart game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playButtonClick();
                onToggleSound();
              }}
              onMouseEnter={() => sound.playHoverChirp()}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile metrics strip */}
      <div className="flex md:hidden items-center justify-around py-1.5 px-4 bg-slate-950/70 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
        <div>ROUND {round}</div>
        {mode === 'sequence' && sequenceLength !== undefined && (
          <div>{sequenceLength} STEPS</div>
        )}
        {mode === 'match' && (
          <>
            <div>PAIRS: {pairsFound}/{totalPairs}</div>
            <div>MOVES: {moves}</div>
            {elapsedSeconds !== undefined && <div>{formatTime(elapsedSeconds)}</div>}
          </>
        )}
        {mode === 'pattern' && patternCellsCount !== undefined && (
          <div>{patternCellsCount} CELLS</div>
        )}
        {mode === 'numbers' && digitsCount !== undefined && (
          <div>{digitsCount} DIGITS</div>
        )}
      </div>
    </header>
  );
};
