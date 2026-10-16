import React, { useState } from 'react';
import { X, Award, RotateCcw, Trash2, Sparkles, Grid, Layers, Hash, Clock, CheckCircle } from 'lucide-react';
import { MemoryChallengeSaveData } from '../types';
import { sound } from '../../../utils/soundEngine';

interface MemoryStatsModalProps {
  isOpen: boolean;
  saveData: MemoryChallengeSaveData;
  onClose: () => void;
  onResetStats: () => void;
}

export const MemoryStatsModal: React.FC<MemoryStatsModalProps> = ({
  isOpen,
  saveData,
  onClose,
  onResetStats,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const formatTime = (secs?: number) => {
    if (!secs || secs >= 999) return '--';
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-mono font-black text-white tracking-wide">
                MEMORY RECORDS & STATS
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Cognitive telemetry & lifetime achievements
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playButtonClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs">
          {/* Global Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">
                GAMES PLAYED
              </span>
              <span className="text-2xl font-black text-cyan-400">
                {saveData.totalGamesPlayed}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">
                ROUNDS CLEARED
              </span>
              <span className="text-2xl font-black text-emerald-400">
                {saveData.totalRoundsCompleted}
              </span>
            </div>
          </div>

          {/* Mode Breakdown Cards */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              MODE RECORDS:
            </span>

            {/* Sequence */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-white block">MEMORY SEQUENCE</span>
                  <span className="text-[10px] text-slate-400">
                    Max Sequence: {saveData.statsByMode.sequence.maxSequenceLength || 0} steps
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">BEST SCORE</span>
                <span className="text-sm font-black text-cyan-400">
                  {saveData.statsByMode.sequence.bestScore || 0}
                </span>
              </div>
            </div>

            {/* Match */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-lime-950/60 text-lime-400 border border-lime-500/30">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-white block">MEMORY MATCH</span>
                  <span className="text-[10px] text-slate-400">
                    Best Moves: {saveData.statsByMode.match.bestMatchMoves && saveData.statsByMode.match.bestMatchMoves < 999 ? saveData.statsByMode.match.bestMatchMoves : '--'} · Time: {formatTime(saveData.statsByMode.match.bestMatchTimeSeconds)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">BEST SCORE</span>
                <span className="text-sm font-black text-lime-400">
                  {saveData.statsByMode.match.bestScore || 0}
                </span>
              </div>
            </div>

            {/* Pattern */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-500/30">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-white block">PATTERN RECALL</span>
                  <span className="text-[10px] text-slate-400">
                    Top Accuracy: {saveData.statsByMode.pattern.bestPatternAccuracy || 0}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">BEST SCORE</span>
                <span className="text-sm font-black text-purple-400">
                  {saveData.statsByMode.pattern.bestScore || 0}
                </span>
              </div>
            </div>

            {/* Numbers */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-pink-950/60 text-pink-400 border border-pink-500/30">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-white block">NUMBER MEMORY</span>
                  <span className="text-[10px] text-slate-400">
                    Longest Digit Span: {saveData.statsByMode.numbers.maxNumberDigits || 0} digits
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">BEST SCORE</span>
                <span className="text-sm font-black text-pink-400">
                  {saveData.statsByMode.numbers.bestScore || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Reset Confirmation or Trigger */}
          <div className="pt-2 border-t border-slate-800">
            {showConfirmReset ? (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-center space-y-2">
                <p className="text-xs text-rose-300 font-bold">
                  Are you sure you want to reset all Memory Challenge records?
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playWrongGeometry();
                      onResetStats();
                      setShowConfirmReset(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                  >
                    YES, RESET ALL
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>RESET ALL MEMORY RECORDS</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            type="button"
            onClick={() => {
              sound.playButtonClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs tracking-wider uppercase cursor-pointer"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
