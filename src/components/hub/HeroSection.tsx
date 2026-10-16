import React, { useState } from 'react';
import {
  Play,
  Compass,
  Sparkles,
  Zap,
  Shield,
  Trophy,
  Volume2,
  Terminal,
  Activity,
  Radio,
  Flame,
} from 'lucide-react';
import { GameEntry } from '../../types/hub';
import { sound } from '../../utils/soundEngine';

interface HeroSectionProps {
  featuredGame: GameEntry;
  lastPlayedGame?: GameEntry;
  onExploreGames: () => void;
  onContinuePlaying: () => void;
  reducedMotion: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredGame,
  lastPlayedGame,
  onExploreGames,
  onContinuePlaying,
  reducedMotion,
}) => {
  const [testedSound, setTestedSound] = useState(false);

  const handleSoundTest = () => {
    sound.playScoreCombo(3);
    setTestedSound(true);
    setTimeout(() => setTestedSound(false), 1200);
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-16 sm:pt-12 sm:pb-24 border-b border-cyan-500/20 select-none">
      {/* Dynamic Cyber Perspective Grid Floor in background */}
      <div className="cyber-perspective-floor" />

      {/* Floating neon glow ambient spots */}
      <div className="absolute top-1/4 left-5 w-80 h-80 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-5 left-1/3 w-72 h-72 bg-pink-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Cyberpunk Typography & Interactive CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Cyber Terminal Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/50 text-[11px] sm:text-xs font-mono font-bold text-cyan-300 shadow-[0_0_20px_rgba(0,245,255,0.3)] mb-5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>TERMINAL // </span>
              <span className="text-pink-400 animate-pulse font-mono">&gt; LINK_ESTABLISHED</span>
              <span className="w-1.5 h-3 bg-cyan-400 animate-ping inline-block ml-1" />
            </div>

            {/* Giant Catchy Cyberpunk Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-5">
              PLAY BEYOND{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-500 drop-shadow-[0_0_30px_rgba(139,92,246,0.7)] animate-glitch">
                LIMITS.
              </span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed max-w-xl mb-8">
              Welcome to the digital frontier. A multi-game cyberpunk arcade engine with zero microtransactions, real-time procedural Web Audio synthesis, and infinite competitive gameplay.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              {/* Primary CTA */}
              <button
                type="button"
                onClick={onExploreGames}
                onMouseEnter={() => sound.playHoverChirp()}
                className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-300 hover:to-pink-400 text-slate-950 font-black tracking-widest text-sm sm:text-base shadow-[0_0_35px_rgba(0,245,255,0.5)] transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer select-none group"
              >
                <Compass className="w-5 h-5 fill-current group-hover:rotate-45 transition-transform duration-300" />
                <span>EXPLORE GAME VAULT</span>
              </button>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={onContinuePlaying}
                onMouseEnter={() => sound.playHoverChirp()}
                className="px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-black tracking-widest text-sm sm:text-base border border-slate-700/90 hover:border-cyan-400/80 shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all flex items-center justify-center gap-2.5 cursor-pointer select-none group"
              >
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400 group-hover:scale-125 transition-transform" />
                <span>
                  {lastPlayedGame ? `RESUME: ${lastPlayedGame.title}` : 'START PLAYING'}
                </span>
              </button>
            </div>

            {/* Interactive Funky SFX Test & Ticker */}
            <div className="mt-8 flex items-center gap-3 w-full max-w-md">
              <button
                type="button"
                onClick={handleSoundTest}
                onMouseEnter={() => sound.playHoverChirp()}
                className="px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 border border-purple-500/50 text-[11px] font-mono font-bold text-purple-300 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(139,92,246,0.25)] cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                <span>{testedSound ? 'SYNTH CHIME FIRED!' : 'TEST CYBER AUDIO'}</span>
              </button>

              <div className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 overflow-hidden">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">TRANS: TIC-TAC-TOE #1 ONLINE</span>
              </div>
            </div>

            {/* Platform Feature Stats Pills with Cyber Glow */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 pt-6 border-t border-slate-800/80 w-full max-w-lg select-none">
              <div className="p-3 rounded-2xl bg-slate-900/70 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,245,255,0.15)]">
                <div className="text-xl sm:text-2xl font-black font-mono text-cyan-400 tracking-tight">
                  100%
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">
                  Zero Cost
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/70 border border-pink-500/30 shadow-[0_0_15px_rgba(255,45,170,0.15)]">
                <div className="text-xl sm:text-2xl font-black font-mono text-pink-400 tracking-tight">
                  LOCAL 2P
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">
                  Split Screen
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/70 border border-lime-500/30 shadow-[0_0_15px_rgba(199,255,77,0.15)]">
                <div className="text-xl sm:text-2xl font-black font-mono text-lime-400 tracking-tight">
                  8×8 MAX
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">
                  Scale Grid
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Tech Cyber Holographic Radar Console */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              {/* Outer Neon Orbit Radar Rings */}
              <div
                className={`absolute inset-0 rounded-full border-2 border-cyan-500/30 shadow-[0_0_60px_rgba(0,245,255,0.2)] ${
                  !reducedMotion ? 'animate-spin-slow' : ''
                }`}
                style={{ animationDuration: '24s' }}
              />

              <div
                className={`absolute inset-6 rounded-full border border-dashed border-pink-500/40 ${
                  !reducedMotion ? 'animate-spin-reverse-slow' : ''
                }`}
                style={{ animationDuration: '32s' }}
              />

              {/* Radar Scanner Sweep Beam */}
              {!reducedMotion && (
                <div className="absolute inset-8 rounded-full overflow-hidden pointer-events-none opacity-40">
                  <div className="w-full h-full bg-gradient-to-tr from-cyan-500/40 via-transparent to-transparent origin-center animate-radar" />
                </div>
              )}

              {/* Central Floating Cyberpunk Console Shield */}
              <div className="relative z-10 w-72 h-72 sm:w-80 sm:h-80 rounded-3xl bg-slate-950/90 border-2 border-cyan-400/70 shadow-[0_0_50px_rgba(0,245,255,0.35),inset_0_0_30px_rgba(139,92,246,0.3)] backdrop-blur-2xl p-6 flex flex-col justify-between hud-corner select-none">
                {/* Console Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[10px] font-mono font-black tracking-widest text-cyan-300">
                      NEON_CORE // READY
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-pink-400 font-bold bg-pink-950/80 px-2 py-0.5 rounded border border-pink-500/40">
                    ONLINE
                  </span>
                </div>

                {/* Cyberpunk Holographic Grid Core Art */}
                <div className="my-auto py-2 flex flex-col items-center justify-center text-center">
                  <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500/25 via-purple-600/35 to-pink-500/25 border-2 border-cyan-400/80 flex items-center justify-center mb-3 shadow-[0_0_35px_rgba(0,245,255,0.5)]">
                    <Zap className="w-12 h-12 text-cyan-300 drop-shadow-[0_0_15px_#00F5FF] animate-pulse" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-pink-500 rounded-full animate-ping" />
                  </div>
                  <div className="text-xs font-mono font-black tracking-widest text-white uppercase">
                    FEATURED ENGINE
                  </div>
                  <div className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-pink-400 tracking-wider">
                    TIC-TAC-TOE UNLIMITED
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">
                    Continuous 3-in-a-Row Scoring
                  </p>
                </div>

                {/* Console Footer Stats */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Shield className="w-3.5 h-3.5" /> PERSISTENT
                  </span>
                  <span className="text-amber-300 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    N×N COMBAT
                  </span>
                </div>
              </div>

              {/* Floating Holographic Cyber Badges around the console */}
              <div className="absolute -top-3 right-2 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-pink-500/60 text-[10px] font-mono text-pink-300 shadow-[0_0_20px_rgba(255,45,170,0.4)] backdrop-blur-md hidden sm:flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>N×N TACTICS</span>
              </div>

              <div className="absolute -bottom-3 left-2 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-cyan-500/60 text-[10px] font-mono text-cyan-300 shadow-[0_0_20px_rgba(0,245,255,0.4)] backdrop-blur-md hidden sm:flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                <span>LASER STRIKE FX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
