import React from 'react';
import {
  Play,
  Lock,
  Star,
  Users,
  User,
  Grid,
  Zap,
  Brain,
  Activity,
  Flame,
  Layers,
  Clock,
  Sparkles,
  Shapes,
} from 'lucide-react';
import { GameEntry } from '../../types/hub';
import { sound } from '../../utils/soundEngine';

interface GameCardProps {
  game: GameEntry;
  onLaunchGame: (gameId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onLaunchGame,
  isFavorite,
  onToggleFavorite,
}) => {
  const isPlayable = game.status === 'playable';
  const isTwoPlayer = game.id === 'tic-tac-toe';

  // Render appropriate vector holographic emblem for each game
  const renderIcon = () => {
    switch (game.iconName) {
      case 'Grid':
        return <Grid className="w-12 h-12" style={{ color: game.accentColor }} />;
      case 'Zap':
        return <Zap className="w-12 h-12" style={{ color: game.accentColor }} />;
      case 'Brain':
        return <Brain className="w-12 h-12" style={{ color: game.accentColor }} />;
      case 'Activity':
        return <Activity className="w-12 h-12" style={{ color: game.accentColor }} />;
      case 'Flame':
        return <Flame className="w-12 h-12" style={{ color: game.accentColor }} />;
      case 'Shapes':
        return <Shapes className="w-12 h-12" style={{ color: game.accentColor }} />;
      case 'Layers':
      default:
        return <Layers className="w-12 h-12" style={{ color: game.accentColor }} />;
    }
  };

  return (
    <div
      onMouseEnter={() => sound.playHoverChirp()}
      className={`
        relative rounded-3xl bg-slate-950/90 border transition-all duration-300 flex flex-col justify-between overflow-hidden group hud-corner
        ${
          isPlayable
            ? 'border-slate-800 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(0,245,255,0.35)] hover:-translate-y-2'
            : 'border-slate-800/80 hover:border-slate-700 opacity-90 hover:opacity-100 hover:-translate-y-1'
        }
      `}
    >
      {/* Top Graphic Header */}
      <div className="relative h-48 sm:h-52 w-full bg-slate-950 p-4 flex flex-col justify-between overflow-hidden border-b border-slate-800">
        {/* Subtle scanline overlay */}
        <div className="absolute inset-0 cyber-scanlines opacity-30 pointer-events-none" />

        {/* Ambient colored background radial glow */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none group-hover:opacity-45 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${game.accentColor} 0%, transparent 70%)`,
          }}
        />

        {/* Top Badges & Favorite Button */}
        <div className="relative z-10 flex items-center justify-between">
          <span
            className="px-3 py-1 rounded-lg text-[10px] font-mono font-black tracking-wider uppercase border backdrop-blur-md shadow-sm"
            style={{
              backgroundColor: `${game.accentColor}20`,
              borderColor: `${game.accentColor}60`,
              color: game.accentColor,
            }}
          >
            {game.category}
          </span>

          <div className="flex items-center gap-1.5">
            {isPlayable ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-400/60 text-[9px] font-mono font-black text-emerald-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                PLAYABLE NOW
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-[9px] font-mono font-bold text-slate-400 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-slate-500" />
                COMING SOON
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                sound.playCyberBlip();
                onToggleFavorite(game.id);
              }}
              title={isFavorite ? 'Remove favorite' : 'Add to favorites'}
              className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-pink-400 transition-colors cursor-pointer border border-slate-800"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isFavorite ? 'text-pink-500 fill-pink-500' : 'text-slate-500'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Center Graphic Emblem */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto transition-transform duration-300 group-hover:scale-115">
          <div
            className="w-18 h-18 rounded-2xl flex items-center justify-center border-2 shadow-lg"
            style={{
              backgroundColor: `${game.accentColor}15`,
              borderColor: `${game.accentColor}70`,
              boxShadow: `0 0 25px ${game.glowColor}`,
            }}
          >
            {renderIcon()}
          </div>
        </div>

        {/* Bottom Graphic Info / Icon Bar */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
          {/* Prominent Required Persons Badge on the Icon Bar */}
          <span
            className={`px-2.5 py-1 rounded-lg border font-mono font-black text-[10px] tracking-wider flex items-center gap-1.5 shadow-md backdrop-blur-md ${
              isTwoPlayer
                ? 'bg-cyan-950/90 border-cyan-400/70 text-cyan-300 shadow-[0_0_12px_rgba(0,245,255,0.3)]'
                : 'bg-purple-950/90 border-pink-500/70 text-pink-300 shadow-[0_0_12px_rgba(255,45,170,0.3)]'
            }`}
          >
            {isTwoPlayer ? (
              <>
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>2 PLAYERS REQUIRED</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-pink-400" />
                <span>SINGLE PLAYER</span>
              </>
            )}
          </span>

          {game.playtime && (
            <span className="flex items-center gap-1 font-bold text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
              <Clock className="w-3 h-3 text-slate-400" />
              {game.playtime}
            </span>
          )}
        </div>
      </div>

      {/* Card Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h4
            className="text-xl font-black text-white tracking-wide mb-1 transition-colors group-hover:text-cyan-300"
          >
            {game.title}
          </h4>
          <p className="text-xs font-bold text-pink-400 mb-2">{game.subtitle}</p>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-3">
            {game.description}
          </p>

          {/* Player Requirement Explicit Info Pill */}
          <div className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 text-[10px] font-bold uppercase">PLAYERS:</span>
            <span
              className={`font-black text-[11px] flex items-center gap-1.5 ${
                isTwoPlayer ? 'text-cyan-300' : 'text-pink-300'
              }`}
            >
              {isTwoPlayer ? (
                <>
                  <Users className="w-3 h-3 text-cyan-400" />
                  <span>2 Players Required (Local 2P)</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-pink-400" />
                  <span>Single Player Required (1P)</span>
                </>
              )}
            </span>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap mb-5">
            {game.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-800/80">
          {isPlayable ? (
            <button
              type="button"
              onClick={() => onLaunchGame(game.id)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-300 hover:to-pink-400 text-slate-950 font-black tracking-widest text-xs shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-current" />
              LAUNCH GAME
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-3 px-4 rounded-xl bg-slate-900/60 text-slate-500 font-mono font-bold tracking-widest text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-slate-800"
            >
              <Lock className="w-3.5 h-3.5" />
              COMING SOON
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
