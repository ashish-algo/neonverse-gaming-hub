import React from 'react';
import { RotateCcw, Play, Clock, Sparkles, Gamepad2 } from 'lucide-react';
import { GameEntry, RecentGameRecord } from '../../types/hub';
import { getGameById } from '../../registry/gameRegistry';

interface RecentlyPlayedProps {
  recentRecords: RecentGameRecord[];
  onLaunchGame: (gameId: string) => void;
  onExploreVault: () => void;
}

export const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({
  recentRecords,
  onLaunchGame,
  onExploreVault,
}) => {
  // Map records to full GameEntry objects
  const recentGames = recentRecords
    .map((record) => {
      const game = getGameById(record.gameId);
      if (!game) return null;
      return { game, record };
    })
    .filter((item): item is { game: GameEntry; record: RecentGameRecord } => item !== null);

  return (
    <section id="recent" className="py-12 sm:py-16 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-purple-400 font-bold">
                SESSION MEMORY
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                JACK BACK IN
              </h2>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400 hidden sm:block">
            RECENT ACTIVITY
          </span>
        </div>

        {/* Content: Recent Cards or Friendly Empty State */}
        {recentGames.length === 0 ? (
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4">
              <Gamepad2 className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Recent Activity Detected</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              You haven't launched a session yet in the NEONVERSE. Fire up Tic-Tac-Toe Unlimited to log your first match!
            </p>
            <button
              type="button"
              onClick={onExploreVault}
              className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs tracking-wider transition-all shadow-md cursor-pointer"
            >
              BROWSE GAME VAULT
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentGames.map(({ game, record }) => {
              const playedDate = new Date(record.playedAt);
              const formattedTime = playedDate.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={game.id}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/60 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-[0_0_25px_rgba(139,92,246,0.25)] group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        {formattedTime}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/40 text-[10px] font-mono text-purple-300">
                        {record.playCount} {record.playCount === 1 ? 'SESSION' : 'SESSIONS'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                        {game.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                        {game.id === 'tic-tac-toe' ? '2 PLAYERS' : 'SINGLE PLAYER'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {game.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      READY TO LAUNCH
                    </span>

                    <button
                      type="button"
                      onClick={() => onLaunchGame(game.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs tracking-wider shadow-md flex items-center gap-1.5 transition-all cursor-pointer group-hover:scale-105"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      RESUME
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
