import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Grid,
  ArrowLeft,
  Sparkles,
  Sliders,
  CheckCircle2,
  Clock,
  Layers,
  Hash,
} from 'lucide-react';
import { DifficultyTier, MemoryGameResult, MemoryMode } from '../types';
import { DIFFICULTY_TIERS, MEMORY_MODES } from '../constants';
import { sound } from '../../../utils/soundEngine';

interface MemoryGameResultsViewProps {
  result: MemoryGameResult;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
  onChooseMode: () => void;
  onBackToHub: () => void;
}

export const MemoryGameResultsView: React.FC<MemoryGameResultsViewProps> = ({
  result,
  onPlayAgain,
  onChangeDifficulty,
  onChooseMode,
  onBackToHub,
}) => {
  const modeInfo = MEMORY_MODES[result.mode];
  const diffInfo =
    DIFFICULTY_TIERS.find((d) => d.id === result.difficulty) || DIFFICULTY_TIERS[0];

  useEffect(() => {
    if (result.isNewRecord || result.score > 100) {
      sound.playLevelVictory();
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00F5FF', '#39FF14', '#FFE600', '#FF2DAA', '#A855F7'],
        });
      } catch {}
    } else {
      sound.playScorePoint();
    }
  }, [result.isNewRecord, result.score]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const renderMetricCards = () => {
    switch (result.mode) {
      case 'sequence':
        return (
          <>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">
                MAX SEQUENCE
              </span>
              <span className="text-2xl font-mono font-black text-cyan-400">
                {result.metrics.sequenceLength || 0}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">STEPS</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">
                ROUNDS CLEARED
              </span>
              <span className="text-2xl font-mono font-black text-emerald-400">
                {result.metrics.roundsCompleted || 0}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">ROUNDS</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">
                BEST PREVIOUS
              </span>
              <span className="text-2xl font-mono font-black text-slate-400">
                {result.previousBest}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">POINTS</span>
            </div>
          </>
        );

      case 'match':
        return (
          <>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">
                PAIRS FOUND
              </span>
              <span className="text-2xl font-mono font-black text-lime-400">
                {result.metrics.pairsMatched}/{result.metrics.totalPairs}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">100% COMPLETE</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">
                TOTAL MOVES
              </span>
              <span className="text-2xl font-mono font-black text-cyan-400">
                {result.metrics.moves || 0}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">ATTEMPTS</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">
                TIME ELAPSED
              </span>
              <span className="text-2xl font-mono font-black text-amber-400">
                {formatTime(result.metrics.elapsedSeconds || 0)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">SECONDS</span>
            </div>
          </>
        );

      case 'pattern':
        return (
          <>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">
                RECALL ACCURACY
              </span>
              <span className="text-2xl font-mono font-black text-purple-400">
                {result.metrics.accuracyPercent || 0}%
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">PRECISION</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">
                CELLS CORRECT
              </span>
              <span className="text-2xl font-mono font-black text-emerald-400">
                {result.metrics.correctSelected || 0}/{result.metrics.targetCount}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">TARGETS</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">
                ERRORS / MISSED
              </span>
              <span className="text-2xl font-mono font-black text-rose-400">
                {(result.metrics.wrongCount || 0) + (result.metrics.missedCount || 0)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">TOTAL DEVIATIONS</span>
            </div>
          </>
        );

      case 'numbers':
        return (
          <>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">
                DIGITS RECALLED
              </span>
              <span className="text-2xl font-mono font-black text-pink-400">
                {result.metrics.digitsLength || 0}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">DIGITS</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">
                ROUNDS WON
              </span>
              <span className="text-2xl font-mono font-black text-cyan-400">
                {result.metrics.roundsCompleted || 0}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">SUCCESSES</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">
                PREVIOUS BEST
              </span>
              <span className="text-2xl font-mono font-black text-slate-400">
                {result.previousBest}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">POINTS</span>
            </div>
          </>
        );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center animate-fade-in select-none text-center">
      {/* Top Left Navigation: Back to Neonverse Hub */}
      <div className="w-full flex items-center justify-start mb-6">
        <button
          type="button"
          onClick={() => {
            sound.playButtonClick();
            onBackToHub();
          }}
          onMouseEnter={() => sound.playHoverChirp()}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/80 hover:border-cyan-500/50 transition-all text-xs font-mono font-bold shadow-md cursor-pointer group uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-cyan-400" />
          <span>BACK TO NEONVERSE HUB</span>
        </button>
      </div>

      {/* Emblem / Trophy */}
      <div className="relative mb-5">
        <div
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center border-2 shadow-2xl transition-transform bg-slate-900/90 border-cyan-400 shadow-[0_0_35px_rgba(0,245,255,0.4)]"
          style={{ borderColor: modeInfo.accentColor }}
        >
          <Trophy
            className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce"
            style={{ color: modeInfo.accentColor }}
          />
        </div>
      </div>

      {/* Header Info */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 mb-2 font-mono text-xs">
          <span
            className="px-3 py-1 rounded-full border uppercase tracking-wider font-bold"
            style={{
              backgroundColor: `${modeInfo.accentColor}15`,
              borderColor: `${modeInfo.accentColor}40`,
              color: modeInfo.accentColor,
            }}
          >
            {modeInfo.name}
          </span>
          <span className="text-slate-500">·</span>
          <span
            className="font-bold uppercase tracking-wider"
            style={{ color: diffInfo.accentColor }}
          >
            {diffInfo.label}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-mono font-black text-white tracking-wide mb-2">
          {result.isNewRecord ? 'NEW PERSONAL RECORD!' : 'CHALLENGE COMPLETE'}
        </h1>
        <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md mx-auto">
          {result.isNewRecord
            ? 'Outstanding performance! You set a new high benchmark in this cognitive mode.'
            : 'Well played! Regular recall practice strengthens synaptic pathways and mental focus.'}
        </p>
      </div>

      {/* Primary Score Banner */}
      <div className="w-full p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl mb-6">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
          FINAL SCORE
        </span>
        <div className="text-5xl sm:text-6xl font-mono font-black tracking-tight text-white mb-2">
          {result.score}
        </div>
        {result.isNewRecord && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,215,0,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>NEW ALL-TIME BEST SCORE</span>
          </div>
        )}
      </div>

      {/* Mode Metrics Breakdown */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {renderMetricCards()}
      </div>

      {/* Primary Action Buttons */}
      <div className="w-full flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            sound.playGameStart();
            onPlayAgain();
          }}
          onMouseEnter={() => sound.playHoverChirp()}
          className="flex-1 min-w-[160px] px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-black text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-90" />
          <span>PLAY AGAIN</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playButtonClick();
            onChangeDifficulty();
          }}
          onMouseEnter={() => sound.playHoverChirp()}
          className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-mono font-bold text-xs tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>CHANGE DIFFICULTY</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playButtonClick();
            onChooseMode();
          }}
          onMouseEnter={() => sound.playHoverChirp()}
          className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-mono font-bold text-xs tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Grid className="w-4 h-4 text-purple-400" />
          <span>ALL MODES</span>
        </button>
      </div>
    </div>
  );
};
