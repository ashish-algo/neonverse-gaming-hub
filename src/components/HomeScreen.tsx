import React, { useEffect, useState } from 'react';
import { Play, HelpCircle, History, Settings, Volume2, VolumeX, Sparkles, Users } from 'lucide-react';

interface HomeScreenProps {
  onPlayNow: () => void;
  onOpenRules: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlayNow,
  onOpenRules,
  onOpenHistory,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
}) => {
  // Animated showcase mini-board state for home screen visual delight
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-between px-4 py-8 max-w-xl mx-auto select-none animate-fade-in text-center">
      {/* Top utility row */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-400/60 text-[11px] font-mono font-black text-cyan-300 shadow-[0_0_12px_rgba(0,245,255,0.3)]">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>TWO PLAYERS REQUIRED</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-mono font-bold text-slate-400">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>ARCADE EDITION</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute' : 'Unmute'}
            className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            title="Settings"
            className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>

      {/* Hero Title & Arcade Badge */}
      <div className="my-auto flex flex-col items-center gap-6 py-4">
        <div>
          <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-400/30 text-xs font-bold text-cyan-300 tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            Continuous 3-in-a-row scoring
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-500 font-sans drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]">
            TIC TAC TOE
          </h1>
          <h2 className="text-2xl sm:text-3xl font-black tracking-[0.25em] text-white mt-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            UNLIMITED
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 font-medium tracking-wide">
            "More space. More strategy. More points."
          </p>
        </div>

        {/* Animated Arcade Mini Board Showcase */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 p-3 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-[0_0_40px_rgba(0,240,255,0.15)] flex items-center justify-center">
          <div className="grid grid-cols-3 gap-2 w-full h-full">
            {/* Cell 0,0 */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-xl text-cyan-400">
              {activeStep >= 1 ? 'X' : ''}
            </div>
            {/* Cell 0,1 */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-xl text-pink-500">
              {activeStep >= 2 ? 'O' : ''}
            </div>
            {/* Cell 0,2 */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-xl text-cyan-400">
              {activeStep >= 3 ? 'X' : ''}
            </div>

            {/* Cell 1,0 */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-xl text-pink-500">
              {activeStep >= 4 ? 'O' : ''}
            </div>
            {/* Cell 1,1 */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-xl text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.5)]">
              {activeStep >= 1 ? 'X' : ''}
            </div>
            {/* Cell 1,2 */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-xl text-pink-500">
              {activeStep >= 2 ? 'O' : ''}
            </div>

            {/* Cell 2,0 */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-xl text-pink-500">
              {activeStep >= 3 ? 'O' : ''}
            </div>
            {/* Cell 2,1 */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-xl text-cyan-400">
              {activeStep >= 4 ? 'X' : ''}
            </div>
            {/* Cell 2,2 */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-xl text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.5)]">
              {activeStep >= 1 ? 'X' : ''}
            </div>
          </div>

          {/* Diagonal Strike-through Line in showcase */}
          {activeStep >= 1 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 p-3">
              <line
                x1="18%"
                y1="18%"
                x2="82%"
                y2="82%"
                stroke="#00f0ff"
                strokeWidth="5"
                strokeLinecap="round"
                className="animate-strike"
                style={{ filter: 'drop-shadow(0 0 8px #00f0ff)' }}
              />
            </svg>
          )}

          {activeStep >= 1 && (
            <div className="absolute -top-3 -right-3 font-extrabold text-xs text-amber-300 bg-amber-400/20 border border-amber-400/60 px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md animate-pulse">
              +1 POINT!
            </div>
          )}
        </div>

        {/* Feature summary pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm">
          <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-semibold text-slate-300">
            3×3 up to 8×8 Grids
          </span>
          <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-semibold text-slate-300">
            Overlapping Combos
          </span>
          <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-semibold text-slate-300">
            Play Until Full
          </span>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="w-full flex flex-col gap-3 mt-4">
        <button
          type="button"
          onClick={onPlayNow}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-300 hover:to-pink-400 text-slate-950 font-black tracking-widest text-base sm:text-lg shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          PLAY NOW
        </button>

        <div className="grid grid-cols-2 gap-2.5 w-full">
          <button
            type="button"
            onClick={onOpenRules}
            className="py-3 px-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-800 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            HOW TO PLAY
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="py-3 px-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-800 cursor-pointer"
          >
            <History className="w-4 h-4 text-purple-400" />
            HISTORY & STATS
          </button>
        </div>
      </div>
    </div>
  );
};
