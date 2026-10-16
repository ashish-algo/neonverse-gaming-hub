import React from 'react';
import { Play, Sparkles, Users, Award, Zap, Star, Flame, Trophy } from 'lucide-react';
import { GameEntry } from '../../types/hub';
import { sound } from '../../utils/soundEngine';

interface FeaturedGameProps {
  game: GameEntry;
  onLaunchGame: (gameId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
}

export const FeaturedGame: React.FC<FeaturedGameProps> = ({
  game,
  onLaunchGame,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <section className="py-12 sm:py-18 border-b border-cyan-500/20 relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,245,255,0.4)]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 font-bold flex items-center gap-2">
                <span>PREMIER SHOWCASE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wide">
                FEATURED GAME
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/50 text-xs font-mono font-bold text-cyan-300 shadow-[0_0_15px_rgba(0,245,255,0.25)]">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>PLAYABLE RIGHT NOW</span>
          </div>
        </div>

        {/* Featured Game Card Banner with Cyber HUD styling */}
        <div className="relative rounded-3xl bg-slate-950/90 border-2 border-cyan-500/50 shadow-[0_0_40px_rgba(0,245,255,0.25)] overflow-hidden transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_60px_rgba(0,245,255,0.4)] group hud-corner">
          {/* Animated gradient beam across card */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-500/20 via-purple-600/15 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 items-center relative z-10">
            {/* Left: Interactive Holographic Game Showcase */}
            <div
              className="lg:col-span-5 relative"
              onMouseEnter={() => sound.playHoverChirp()}
            >
              <div className="relative aspect-[4/3] rounded-2xl bg-slate-950 border-2 border-slate-800 p-4 overflow-hidden flex flex-col justify-between shadow-2xl group-hover:border-cyan-400/80 transition-all duration-300">
                {/* Laser scanline sweep */}
                <div className="absolute inset-0 cyber-scanlines opacity-40 pointer-events-none" />

                {/* Animated 3x3 Showcase Grid */}
                <div className="grid grid-cols-3 gap-2 w-full h-full p-2 relative z-10">
                  <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-2xl text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    X
                  </div>
                  <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-2xl text-pink-500">
                    O
                  </div>
                  <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-2xl text-cyan-400">
                    X
                  </div>

                  <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-2xl text-pink-500">
                    O
                  </div>
                  <div className="rounded-xl bg-slate-900/95 border-2 border-cyan-400 flex items-center justify-center font-black text-3xl text-cyan-300 shadow-[0_0_20px_rgba(0,245,255,0.7)] group-hover:scale-105 transition-transform">
                    X
                  </div>
                  <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-2xl text-pink-500">
                    O
                  </div>

                  <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-2xl text-pink-500">
                    O
                  </div>
                  <div className="rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center font-black text-2xl text-cyan-400">
                    X
                  </div>
                  <div className="rounded-xl bg-slate-900/95 border-2 border-cyan-400 flex items-center justify-center font-black text-3xl text-cyan-300 shadow-[0_0_20px_rgba(0,245,255,0.7)] group-hover:scale-105 transition-transform">
                    X
                  </div>

                  {/* High-intensity neon strike mark overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 p-2">
                    <line
                      x1="18%"
                      y1="18%"
                      x2="82%"
                      y2="82%"
                      stroke="#00F5FF"
                      strokeWidth="6"
                      strokeLinecap="round"
                      style={{ filter: 'drop-shadow(0 0 12px #00F5FF)' }}
                    />
                    <line
                      x1="18%"
                      y1="18%"
                      x2="82%"
                      y2="82%"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                  </svg>
                </div>

                {/* Floating tags over thumbnail */}
                <div className="relative z-20 flex items-center justify-between gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-cyan-400 text-[10px] font-mono font-black text-cyan-300 shadow-[0_0_10px_rgba(0,245,255,0.4)] backdrop-blur-md flex items-center gap-1">
                    <Users className="w-3 h-3 text-cyan-400" />
                    2 PLAYERS REQUIRED
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-pink-500 text-[10px] font-mono font-black text-pink-300 shadow-[0_0_10px_rgba(255,45,170,0.4)] backdrop-blur-md">
                    CUSTOM 3×3 TO 8×8
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Game Info & CTA */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400 text-[11px] font-mono font-black tracking-wider uppercase shadow-[0_0_10px_rgba(0,245,255,0.3)]">
                  {game.category}
                </span>

                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400 text-[11px] font-mono font-black tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                  <Users className="w-3.5 h-3.5" />
                  {game.playerMode}
                </span>

                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400 text-[11px] font-mono font-black tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                  <Award className="w-3.5 h-3.5" />
                  FIRST EDITION
                </span>

                <button
                  type="button"
                  onClick={() => {
                    sound.playCyberBlip();
                    onToggleFavorite(game.id);
                  }}
                  onMouseEnter={() => sound.playHoverChirp()}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-pink-400 transition-colors ml-auto cursor-pointer border border-slate-800 hover:border-pink-500/50"
                >
                  <Star
                    className={`w-4 h-4 ${
                      isFavorite ? 'text-pink-500 fill-pink-500' : 'text-slate-400'
                    }`}
                  />
                </button>
              </div>

              <h3 className="text-3xl sm:text-5xl font-black text-white tracking-wide mb-2 group-hover:text-cyan-300 transition-colors">
                {game.title}
              </h3>

              <p className="text-sm sm:text-base text-pink-400 font-bold mb-3 tracking-wide">
                "{game.subtitle}"
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 max-w-2xl">
                {game.description} Form three-in-a-row anywhere on the grid to score points and cross out cells with glowing neon laser strikes. Every move counts until every single cell is occupied!
              </p>

              {/* Tags Pill Row */}
              <div className="flex items-center gap-2 flex-wrap mb-8">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Big Neon Launch Action */}
              <button
                type="button"
                onClick={() => onLaunchGame(game.id)}
                onMouseEnter={() => sound.playHoverChirp()}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-300 hover:to-pink-400 text-slate-950 font-black tracking-widest text-base shadow-[0_0_35px_rgba(0,245,255,0.5)] transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer select-none group"
              >
                <Play className="w-5 h-5 fill-current group-hover:scale-125 transition-transform" />
                PLAY NOW — FULL SCREEN
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
