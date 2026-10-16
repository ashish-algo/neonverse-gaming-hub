import React, { useEffect, useState } from 'react';
import { PlayerConfig, PlayerId, RecentPointEvent } from '../types/game';

interface ScoreBoardProps {
  player1: PlayerConfig;
  player2: PlayerConfig;
  player1Score: number;
  player2Score: number;
  currentPlayer: PlayerId;
  recentPointEvent: RecentPointEvent | null;
  reducedMotion: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  player1,
  player2,
  player1Score,
  player2Score,
  currentPlayer,
  recentPointEvent,
  reducedMotion,
}) => {
  const [p1Pulse, setP1Pulse] = useState(false);
  const [p2Pulse, setP2Pulse] = useState(false);

  useEffect(() => {
    if (!recentPointEvent) return;
    if (recentPointEvent.player === 1) {
      setP1Pulse(true);
      const timer = setTimeout(() => setP1Pulse(false), 900);
      return () => clearTimeout(timer);
    } else {
      setP2Pulse(true);
      const timer = setTimeout(() => setP2Pulse(false), 900);
      return () => clearTimeout(timer);
    }
  }, [recentPointEvent]);

  return (
    <div className="w-full max-w-2xl mx-auto grid grid-cols-2 gap-3 sm:gap-4 select-none mb-3 sm:mb-5">
      {/* Player 1 Card */}
      <div
        className={`
          relative overflow-hidden rounded-2xl p-3 sm:p-4 border transition-all duration-300
          ${
            currentPlayer === 1
              ? 'bg-slate-900/90 border-cyan-400/80 shadow-[0_0_20px_rgba(0,240,255,0.25)] ring-2 ring-cyan-400/50 scale-[1.02]'
              : 'bg-slate-900/60 border-slate-800/80 opacity-75'
          }
          ${p1Pulse && !reducedMotion ? 'ring-4 ring-cyan-300 shadow-[0_0_30px_rgba(0,240,255,0.6)]' : ''}
        `}
      >
        {/* Floating Point Notification */}
        {recentPointEvent && recentPointEvent.player === 1 && (
          <div
            key={recentPointEvent.id}
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 font-extrabold text-xs sm:text-sm text-cyan-300 bg-cyan-950/90 border border-cyan-400/60 px-2 py-0.5 rounded-full z-10 shadow-lg ${
              !reducedMotion ? 'animate-float-up' : ''
            }`}
          >
            {recentPointEvent.message}
          </div>
        )}

        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-black text-sm sm:text-base border shadow-sm"
              style={{
                backgroundColor: `${player1.color}20`,
                borderColor: player1.color,
                color: player1.color,
                textShadow: `0 0 8px ${player1.glowColor}`,
              }}
            >
              X
            </span>
            <span className="font-bold text-xs sm:text-sm text-slate-200 tracking-wide truncate max-w-[90px] sm:max-w-[130px]">
              {player1.name}
            </span>
          </div>

          {currentPlayer === 1 && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              TURN
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <div className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-baseline gap-1">
            <span
              className="transition-transform duration-200"
              style={{ color: player1.color, textShadow: `0 0 12px ${player1.glowColor}` }}
            >
              {player1Score}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider">
              {player1Score === 1 ? 'POINT' : 'POINTS'}
            </span>
          </div>
        </div>

        {/* Bottom accent glow bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-300"
          style={{
            backgroundColor: player1.color,
            boxShadow: `0 0 10px ${player1.color}`,
            opacity: currentPlayer === 1 ? 1 : 0.25,
          }}
        />
      </div>

      {/* Player 2 Card */}
      <div
        className={`
          relative overflow-hidden rounded-2xl p-3 sm:p-4 border transition-all duration-300
          ${
            currentPlayer === 2
              ? 'bg-slate-900/90 border-pink-500/80 shadow-[0_0_20px_rgba(255,0,127,0.25)] ring-2 ring-pink-500/50 scale-[1.02]'
              : 'bg-slate-900/60 border-slate-800/80 opacity-75'
          }
          ${p2Pulse && !reducedMotion ? 'ring-4 ring-pink-300 shadow-[0_0_30px_rgba(255,0,127,0.6)]' : ''}
        `}
      >
        {/* Floating Point Notification */}
        {recentPointEvent && recentPointEvent.player === 2 && (
          <div
            key={recentPointEvent.id}
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 font-extrabold text-xs sm:text-sm text-pink-300 bg-pink-950/90 border border-pink-500/60 px-2 py-0.5 rounded-full z-10 shadow-lg ${
              !reducedMotion ? 'animate-float-up' : ''
            }`}
          >
            {recentPointEvent.message}
          </div>
        )}

        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-black text-sm sm:text-base border shadow-sm"
              style={{
                backgroundColor: `${player2.color}20`,
                borderColor: player2.color,
                color: player2.color,
                textShadow: `0 0 8px ${player2.glowColor}`,
              }}
            >
              O
            </span>
            <span className="font-bold text-xs sm:text-sm text-slate-200 tracking-wide truncate max-w-[90px] sm:max-w-[130px]">
              {player2.name}
            </span>
          </div>

          {currentPlayer === 2 && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-400/40">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
              TURN
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <div className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-baseline gap-1">
            <span
              className="transition-transform duration-200"
              style={{ color: player2.color, textShadow: `0 0 12px ${player2.glowColor}` }}
            >
              {player2Score}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider">
              {player2Score === 1 ? 'POINT' : 'POINTS'}
            </span>
          </div>
        </div>

        {/* Bottom accent glow bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-300"
          style={{
            backgroundColor: player2.color,
            boxShadow: `0 0 10px ${player2.color}`,
            opacity: currentPlayer === 2 ? 1 : 0.25,
          }}
        />
      </div>
    </div>
  );
};
