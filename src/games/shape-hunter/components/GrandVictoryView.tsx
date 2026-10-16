import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Crown,
  Trophy,
  Award,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Grid,
  CheckCircle,
} from 'lucide-react';
import { DifficultyLevel, ShapeHunterSaveData } from '../types';
import { LEVEL_CONFIGS } from '../constants';
import { sound } from '../../../utils/soundEngine';

interface GrandVictoryViewProps {
  saveData: ShapeHunterSaveData;
  onLevelSelect: () => void;
  onBackToHub: () => void;
}

export const GrandVictoryView: React.FC<GrandVictoryViewProps> = ({
  saveData,
  onLevelSelect,
  onBackToHub,
}) => {
  const totalScore = Object.values(saveData.bestScores).reduce((a, b) => a + b, 0);
  const totalCompleted = saveData.totalQuestionsAttempted;
  const accuracy =
    totalCompleted > 0
      ? Math.round((saveData.totalCorrectAnswers / totalCompleted) * 100)
      : 0;

  useEffect(() => {
    sound.playLevelVictory();
    try {
      const end = Date.now() + 2.5 * 1000;
      const interval: any = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2,
          },
          colors: ['#00F5FF', '#39FF14', '#FFE600', '#FF8800', '#FF2DAA'],
        });
      }, 250);
      return () => clearInterval(interval);
    } catch {}
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center text-center animate-fade-in select-none">
      {/* Upper-Left Navigation: Back to Neonverse Hub */}
      <div className="w-full flex items-center justify-start mb-4">
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

      {/* Grand Crown Trophy */}
      <div className="relative mb-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 border-2 border-amber-300 flex items-center justify-center shadow-[0_0_50px_rgba(255,215,0,0.6)] animate-pulse">
          <Crown className="w-14 h-14 text-white" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(255,230,0,0.3)]">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>MASTER OF ALL 10 DIVINE ASTRAS</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-white tracking-wide mb-3">
        SUDARSHANA SUPREME CHAMPION
      </h1>

      <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
        You have successfully mastered every divine weapon from the Ramayana and Mahabharata — beginning with the elemental Agneyastra and culminating in the supreme Sudarshana Chakra. Your combinatorial eye and geometric speed are peerless!
      </p>

      {/* Hall of Fame Score Card */}
      <div className="w-full p-6 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-2xl mb-8 hud-corner">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
              BEST TOTAL SCORE
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {totalScore}
              <span className="text-xs text-slate-500 font-normal">/7000</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
              OVERALL ACCURACY
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {accuracy}%
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
              ASTRAS CONQUERED
            </span>
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
              10 / 10
            </span>
          </div>
        </div>

        {/* Level breakdown pills for all 10 Astras */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
          {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as DifficultyLevel[]).map((lvl) => {
            const config = LEVEL_CONFIGS[lvl];
            const score = saveData.bestScores[lvl] || 0;
            return (
              <div
                key={lvl}
                className="px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono flex flex-col items-center gap-0.5"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>{config.astraName}</span>
                </div>
                <span className="text-cyan-400 text-[11px] font-mono">{score}/700</span>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playButtonClick();
              onLevelSelect();
            }}
            onMouseEnter={() => sound.playHoverChirp()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black font-mono text-xs tracking-wider shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Grid className="w-4 h-4" />
            <span>LEVEL SELECTION</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playButtonClick();
              onBackToHub();
            }}
            onMouseEnter={() => sound.playHoverChirp()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-mono text-xs tracking-wider border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO NEONVERSE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
