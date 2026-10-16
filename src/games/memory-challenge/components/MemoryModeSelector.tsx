import React from 'react';
import {
  ArrowLeft,
  Sparkles,
  Grid,
  Layers,
  Hash,
  Play,
  Award,
  Zap,
  Info,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { DifficultyTier, MemoryChallengeSaveData, MemoryMode } from '../types';
import { DIFFICULTY_TIERS, MEMORY_MODES } from '../constants';
import { sound } from '../../../utils/soundEngine';

interface MemoryModeSelectorProps {
  saveData: MemoryChallengeSaveData;
  selectedDifficulty: DifficultyTier;
  onChangeDifficulty: (diff: DifficultyTier) => void;
  onSelectMode: (mode: MemoryMode) => void;
  onOpenStats: () => void;
  onBackToHub: () => void;
}

export const MemoryModeSelector: React.FC<MemoryModeSelectorProps> = ({
  saveData,
  selectedDifficulty,
  onChangeDifficulty,
  onSelectMode,
  onOpenStats,
  onBackToHub,
}) => {
  const currentDiff =
    DIFFICULTY_TIERS.find((d) => d.id === selectedDifficulty) || DIFFICULTY_TIERS[0];

  const getModeIcon = (mode: MemoryMode) => {
    switch (mode) {
      case 'sequence':
        return <Sparkles className="w-7 h-7 text-cyan-400" />;
      case 'match':
        return <Grid className="w-7 h-7 text-lime-400" />;
      case 'pattern':
        return <Layers className="w-7 h-7 text-purple-400" />;
      case 'numbers':
        return <Hash className="w-7 h-7 text-pink-400" />;
    }
  };

  const getModePreviewStat = (mode: MemoryMode) => {
    const stats = saveData.statsByMode[mode];
    if (!stats || stats.bestScore === 0) return 'No record yet';

    switch (mode) {
      case 'sequence':
        return `Best: ${stats.bestScore} pts (${stats.maxSequenceLength || 0} steps)`;
      case 'match':
        return `Best: ${stats.bestScore} pts (${stats.bestMatchMoves && stats.bestMatchMoves < 900 ? `${stats.bestMatchMoves} moves` : 'cleared'})`;
      case 'pattern':
        return `Best: ${stats.bestScore} pts (${stats.bestPatternAccuracy || 0}% accuracy)`;
      case 'numbers':
        return `Best: ${stats.bestScore} pts (${stats.maxNumberDigits || 0} digits)`;
    }
  };

  const modes: MemoryMode[] = ['sequence', 'match', 'pattern', 'numbers'];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center animate-fade-in select-none">
      {/* Top Bar: Back to Neonverse Hub & Records Button */}
      <div className="w-full flex items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={() => {
            sound.playButtonClick();
            onBackToHub();
          }}
          onMouseEnter={() => sound.playHoverChirp()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/80 hover:border-cyan-500/50 transition-all text-xs font-mono font-bold shadow-md cursor-pointer group uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-cyan-400" />
          <span>BACK TO NEONVERSE</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playButtonClick();
            onOpenStats();
          }}
          onMouseEnter={() => sound.playHoverChirp()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700/80 hover:border-amber-500/50 transition-all text-xs font-mono font-bold shadow-md cursor-pointer group"
        >
          <Award className="w-4 h-4 text-amber-400 transition-transform group-hover:scale-110" />
          <span className="hidden sm:inline">STATS & RECORDS</span>
          <span className="sm:hidden">STATS</span>
        </button>
      </div>

      {/* Main Header */}
      <div className="text-center max-w-2xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(0,245,255,0.2)]">
          <Zap className="w-3.5 h-3.5" />
          <span>COGNITIVE TRAINING SUITE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-mono font-black tracking-tight text-white mb-2 bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
          MEMORY CHALLENGE
        </h1>

        <p className="text-base sm:text-lg font-mono font-bold text-cyan-300 tracking-wide mb-2">
          &ldquo;Your memory is your greatest power.&rdquo;
        </p>

        <p className="text-xs sm:text-sm font-sans text-slate-400 max-w-xl mx-auto leading-relaxed">
          Choose your challenge, sharpen your focus, and see how much your brain can remember.
        </p>
      </div>

      {/* Difficulty Selection Bar */}
      <div className="w-full max-w-2xl mb-8 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>GLOBAL DIFFICULTY:</span>
          </div>
          <span
            className="text-xs font-mono font-black uppercase px-2 py-0.5 rounded-md border"
            style={{
              color: currentDiff.accentColor,
              backgroundColor: `${currentDiff.accentColor}15`,
              borderColor: `${currentDiff.accentColor}40`,
            }}
          >
            {currentDiff.label}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {DIFFICULTY_TIERS.map((tier) => {
            const isSelected = tier.id === selectedDifficulty;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => {
                  sound.playButtonClick();
                  onChangeDifficulty(tier.id);
                }}
                onMouseEnter={() => sound.playHoverChirp()}
                className={`py-2 px-1 rounded-xl text-center font-mono text-[11px] sm:text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'text-slate-950 shadow-md font-black'
                    : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: tier.accentColor,
                        borderColor: tier.accentColor,
                        boxShadow: `0 0 15px ${tier.accentColor}50`,
                      }
                    : {}
                }
              >
                {tier.label}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-400 font-sans mt-2 px-1 text-center">
          {currentDiff.description}
        </p>
      </div>

      {/* 4 Mode Selection Cards in 2x2 Grid (Desktop) / Vertical (Mobile) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {modes.map((modeKey) => {
          const mode = MEMORY_MODES[modeKey];
          const bestStatText = getModePreviewStat(modeKey);

          return (
            <div
              key={mode.id}
              className="relative group rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl"
              style={{
                boxShadow: `0 4px 20px -2px rgba(0, 0, 0, 0.5)`,
              }}
            >
              {/* Subtle accent glow behind the card on hover */}
              <div
                className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                style={{ backgroundColor: mode.accentColor }}
              />

              <div>
                {/* Mode Top Info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className="p-3.5 rounded-2xl border shadow-md flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: `${mode.accentColor}15`,
                      borderColor: `${mode.accentColor}40`,
                    }}
                  >
                    {getModeIcon(modeKey)}
                  </div>

                  <span
                    className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border"
                    style={{
                      backgroundColor: `${mode.accentColor}10`,
                      borderColor: `${mode.accentColor}30`,
                      color: mode.accentColor,
                    }}
                  >
                    MODE {modes.indexOf(modeKey) + 1}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-mono font-black text-white group-hover:text-cyan-300 transition-colors mb-1 tracking-tight">
                  {mode.name}
                </h3>

                <p className="text-xs font-mono text-slate-400 mb-3 tracking-wide">
                  {mode.tagline}
                </p>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-4">
                  {mode.description}
                </p>

                {/* Skills Trained Pills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {mode.skillsTrained.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Best Score & Play Button */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div className="font-mono">
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
                    PERSONAL RECORD
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    {bestStatText}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playGameStart();
                    onSelectMode(modeKey);
                  }}
                  onMouseEnter={() => sound.playHoverChirp()}
                  className="px-5 py-2.5 rounded-xl font-mono font-black text-xs tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-md group-hover:shadow-[0_0_20px_rgba(0,245,255,0.4)]"
                  style={{
                    backgroundColor: mode.accentColor,
                    color: '#020617', // slate-950
                  }}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY NOW</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
