import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Sliders, Home, Award, Sparkles } from 'lucide-react';
import { GameState, PlayerConfig } from '../types/game';

interface GameOverModalProps {
  gameState: GameState;
  player1: PlayerConfig;
  player2: PlayerConfig;
  reducedMotion: boolean;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  gameState,
  player1,
  player2,
  reducedMotion,
  onPlayAgain,
  onChangeSettings,
  onGoHome,
}) => {
  const isWinnerP1 = gameState.winner === 1;
  const isWinnerP2 = gameState.winner === 2;
  const isDraw = gameState.winner === 'draw';

  const winnerConfig = isWinnerP1 ? player1 : isWinnerP2 ? player2 : null;
  const scoreDiff = Math.abs(gameState.player1Score - gameState.player2Score);

  useEffect(() => {
    if (!reducedMotion && (isWinnerP1 || isWinnerP2)) {
      // Fire celebratory confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: [player1.color, player2.color, '#fbbf24', '#ffffff'],
        });

        const timeout = setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: [player1.color, player2.color, '#fbbf24'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: [player1.color, player2.color, '#fbbf24'],
          });
        }, 300);

        return () => clearTimeout(timeout);
      } catch {}
    }
  }, [isWinnerP1, isWinnerP2, player1.color, player2.color, reducedMotion]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col items-center text-center">
        {/* Top visual badge */}
        <div className="relative mb-3">
          {isDraw ? (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            </div>
          ) : (
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg border"
              style={{
                backgroundColor: `${winnerConfig?.color}20`,
                borderColor: winnerConfig?.color,
                boxShadow: `0 0 30px ${winnerConfig?.glowColor}`,
              }}
            >
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-bounce" />
            </div>
          )}
        </div>

        {/* Heading title */}
        {isDraw ? (
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider">
              IT'S A DRAW!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Both players scored an equal number of points!
            </p>
          </div>
        ) : (
          <div>
            <span className="text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-amber-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              VICTORY!
            </span>
            <h2
              className="text-2xl sm:text-3xl font-black tracking-wide mt-1"
              style={{
                color: winnerConfig?.color,
                textShadow: `0 0 15px ${winnerConfig?.glowColor}`,
              }}
            >
              {winnerConfig?.name} WINS!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Won by {scoreDiff} {scoreDiff === 1 ? 'point' : 'points'} margin
            </p>
          </div>
        )}

        {/* Final scores breakdown */}
        <div className="w-full grid grid-cols-2 gap-3 my-5">
          <div
            className={`p-3 rounded-2xl border transition-all ${
              isWinnerP1
                ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-xs font-bold text-cyan-400">X</span>
              <span className="text-xs font-semibold text-slate-300 truncate max-w-[100px]">
                {player1.name}
              </span>
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {gameState.player1Score}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
              {gameState.player1Score === 1 ? 'Point' : 'Points'}
            </div>
          </div>

          <div
            className={`p-3 rounded-2xl border transition-all ${
              isWinnerP2
                ? 'bg-slate-800/90 border-pink-500 shadow-[0_0_15px_rgba(255,0,127,0.2)]'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-xs font-bold text-pink-400">O</span>
              <span className="text-xs font-semibold text-slate-300 truncate max-w-[100px]">
                {player2.name}
              </span>
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {gameState.player2Score}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
              {gameState.player2Score === 1 ? 'Point' : 'Points'}
            </div>
          </div>
        </div>

        {/* Match Statistics */}
        <div className="w-full flex items-center justify-around py-2.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 mb-6">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Board</div>
            <div className="font-bold text-white font-mono">{gameState.size}×{gameState.size}</div>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Total Moves</div>
            <div className="font-bold text-white font-mono">{gameState.moveHistory.length}</div>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Triplets Formed</div>
            <div className="font-bold text-amber-300 font-mono">{gameState.scoredGroups.length}</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-300 hover:to-pink-400 text-slate-950 font-black tracking-wider text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            PLAY AGAIN
          </button>

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              type="button"
              onClick={onChangeSettings}
              className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              SETTINGS
            </button>

            <button
              type="button"
              onClick={onGoHome}
              className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-pink-400" />
              HOME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
