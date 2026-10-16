import React, { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  Play,
  RotateCcw,
  Trophy,
  Award,
  HelpCircle,
  Clock,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  X,
} from 'lucide-react';
import { LEVEL_CONFIGS } from '../constants';
import { DifficultyLevel, ShapeHunterSaveData } from '../types';
import { sound } from '../../../utils/soundEngine';

interface LevelSelectViewProps {
  saveData: ShapeHunterSaveData;
  onSelectLevel: (level: DifficultyLevel) => void;
  onResetLevelScore: (level: DifficultyLevel) => void;
  onOpenAchievements: () => void;
  onBackToHub: () => void;
}

export const LevelSelectView: React.FC<LevelSelectViewProps> = ({
  saveData,
  onSelectLevel,
  onResetLevelScore,
  onOpenAchievements,
  onBackToHub,
}) => {
  const [showRulesModal, setShowRulesModal] = useState(false);

  const totalScore = Object.values(saveData.bestScores).reduce((a, b) => a + b, 0);
  const totalCompleted = saveData.totalQuestionsAttempted;
  const overallAccuracy =
    totalCompleted > 0
      ? Math.round((saveData.totalCorrectAnswers / totalCompleted) * 100)
      : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center animate-fade-in select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => {
            sound.playButtonClick();
            onBackToHub();
          }}
          onMouseEnter={() => sound.playHoverChirp()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/80 hover:border-cyan-500/50 transition-all text-xs font-mono font-bold shadow-md cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>BACK TO NEONVERSE</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playCyberBlip();
              setShowRulesModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/80 text-xs font-mono font-bold cursor-pointer transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">HOW TO PLAY</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playCyberBlip();
              onOpenAchievements();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700/80 text-xs font-mono font-bold cursor-pointer transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">ACHIEVEMENTS</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
              {saveData.unlockedAchievements.length}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Title & Tagline */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(0,245,255,0.3)]">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>VISUAL REASONING APTITUDE ARCADE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-wide mb-2">
          SHAPE HUNTER
        </h1>

        <p className="text-sm sm:text-base font-mono text-cyan-400 font-semibold tracking-wider uppercase mb-3">
          Spot the Shapes. Beat the Clock. Master Geometry.
        </p>

        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          Count triangles, squares, rectangles, parallelograms, and rhombuses in mathematically verified diagrams. Conquer 10 divine Astras from the Ramayana & Mahabharata. Answer 4 out of 7 correctly to advance!
        </p>
      </div>

      {/* Global Progress Dashboard Banner */}
      <div className="w-full p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">TOTAL SCORE</span>
          <span className="text-xl sm:text-2xl font-black text-cyan-400">
            {totalScore}
            <span className="text-xs text-slate-500 font-normal">/7000</span>
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">OVERALL ACCURACY</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400">
            {overallAccuracy}%
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">ASTRAS CONQUERED</span>
          <span className="text-xl sm:text-2xl font-black text-amber-400">
            {saveData.completedLevels.length} / 10
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-0.5">QUESTIONS SOLVED</span>
          <span className="text-xl sm:text-2xl font-black text-purple-400">
            {saveData.totalCorrectAnswers}
          </span>
        </div>
      </div>

      {/* 10 Astra Difficulty Level Cards */}
      <div className="w-full flex flex-col gap-3.5 mb-8">
        {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as DifficultyLevel[]).map((levelNum) => {
          const config = LEVEL_CONFIGS[levelNum];
          const isUnlocked = levelNum <= saveData.highestUnlockedLevel;
          const isPassed = saveData.completedLevels.includes(levelNum);
          const bestScore = saveData.bestScores[levelNum] || 0;

          return (
            <div
              key={levelNum}
              className={`
                relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden
                ${
                  isUnlocked
                    ? 'bg-slate-900/90 border-slate-800 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,245,255,0.25)] hover:scale-[1.01]'
                    : 'bg-slate-950/60 border-slate-900 opacity-60'
                }
              `}
            >
              {/* Left Details */}
              <div className="flex items-start sm:items-center gap-3.5">
                {/* Level Index Badge */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-base shrink-0 border"
                  style={{
                    backgroundColor: `${config.accentColor}18`,
                    borderColor: `${config.accentColor}60`,
                    color: config.accentColor,
                  }}
                >
                  {isUnlocked ? (levelNum < 10 ? `0${levelNum}` : `${levelNum}`) : <Lock className="w-5 h-5 text-slate-500" />}
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base sm:text-lg font-black text-white font-mono tracking-wide">
                      LEVEL {levelNum}: {config.astraName.toUpperCase()}
                    </h3>

                    <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 text-[11px] font-medium text-amber-300">
                      {config.sanskritName}
                    </span>

                    {isPassed && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-[10px] font-mono font-black text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        CONQUERED
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-mono text-slate-400 max-w-md">
                    {config.description}
                  </p>

                  <p className="text-[11px] text-slate-500 italic mt-0.5 max-w-lg hidden sm:block">
                    {config.lore}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{Math.floor(config.timePerQuestion / 60)}m {config.timePerQuestion % 60 ? `${config.timePerQuestion % 60}s` : ''} per Q</span>
                    </span>
                    <span>·</span>
                    <span>7 Questions</span>
                    <span>·</span>
                    <span>Pass: 4/7</span>
                  </div>
                </div>
              </div>

              {/* Right Side Best Score, Play/Replay & Reset Score Button */}
              <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full">
                  <div className="text-left sm:text-right font-mono">
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
                      BEST SCORE
                    </span>
                    <span
                      className={`text-lg font-black ${
                        bestScore > 0 ? 'text-cyan-400' : 'text-slate-600'
                      }`}
                    >
                      {bestScore}
                      <span className="text-xs text-slate-500 font-normal">/700</span>
                    </span>
                  </div>

                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playGameStart();
                        onSelectLevel(levelNum);
                      }}
                      onMouseEnter={() => sound.playHoverChirp()}
                      className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black font-mono text-xs tracking-wider shadow-[0_0_15px_rgba(0,245,255,0.4)] transition-all flex items-center gap-1.5 cursor-pointer group"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>{bestScore > 0 ? 'REPLAY' : 'PLAY'}</span>
                    </button>
                  ) : (
                    <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 font-mono text-xs flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>LOCKED</span>
                    </div>
                  )}
                </div>

                {/* Reset Score button: positioned below and in the middle of best score & replay */}
                {isUnlocked && bestScore > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playButtonClick();
                      onResetLevelScore(levelNum);
                    }}
                    onMouseEnter={() => sound.playHoverChirp()}
                    className="w-full flex items-center justify-center gap-1.5 py-1 px-3 rounded-lg bg-slate-900/90 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/50 transition-all text-[10px] font-mono font-bold tracking-wider uppercase cursor-pointer shadow-sm group"
                    title={`Reset score for Level ${levelNum}`}
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500 group-hover:text-rose-400 group-hover:-rotate-90 transition-all" />
                    <span>RESET SCORE</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rules & Geometric Definitions Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl hud-corner text-left">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white font-mono tracking-wide">
                  RULES & GEOMETRIC CATEGORY STANDARDS
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs font-mono text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-cyan-400 block mb-1">TRIANGLES:</strong>
                All 3-sided polygons of any size or orientation (single cells and multi-cell combinations).
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-emerald-400 block mb-1">SQUARES:</strong>
                Quadrilaterals with 4 equal sides and four 90-degree right angles.
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-amber-400 block mb-1">
                  RECTANGLES:
                </strong>
                Every square is a rectangle! In accordance with mathematical geometry, all squares and oblong rectangles are counted together (formula C(rows+1, 2) × C(cols+1, 2) in grids).
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-pink-400 block mb-1">
                  PARALLELOGRAMS & RHOMBUSES:
                </strong>
                Every rhombus, rectangle, and square is a parallelogram (both pairs of opposite sides are parallel)! A rhombus has all 4 sides equal in length.
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-purple-400 block mb-1">SCORING & ADVANCEMENT:</strong>
                +100 points per correct answer (max 700 pts). 0 points for wrong or timeout. You must achieve at least 4 correct answers out of 7 to pass an Astra level and unlock the next tier!
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-right">
              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold font-mono text-xs cursor-pointer"
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
