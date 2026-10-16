import React from 'react';
import { CellData, PlayerConfig, PlayerSymbol } from '../types/game';

interface GameCellProps {
  cell: CellData;
  size: number;
  currentPlayer: 1 | 2;
  currentSymbol: PlayerSymbol;
  player1: PlayerConfig;
  player2: PlayerConfig;
  disabled: boolean;
  onCellClick: (row: number, col: number) => void;
  reducedMotion: boolean;
  isInScoredGroup: boolean;
}

export const GameCell: React.FC<GameCellProps> = ({
  cell,
  size,
  currentSymbol,
  player1,
  player2,
  disabled,
  onCellClick,
  reducedMotion,
  isInScoredGroup,
}) => {
  const isOccupied = cell.symbol !== null;
  const isP1 = cell.symbol === 'X';
  const playerColor = isP1 ? player1.color : player2.color;
  const playerGlow = isP1 ? player1.glowColor : player2.glowColor;

  const handleClick = () => {
    if (disabled || isOccupied) return;
    onCellClick(cell.row, cell.col);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Dynamic sizing classes according to board dimension
  const symbolScale = size <= 4 ? 'w-10 h-10 sm:w-14 sm:h-14' : size <= 6 ? 'w-7 h-7 sm:w-10 sm:h-10' : 'w-5 h-5 sm:w-8 sm:h-8';

  return (
    <button
      type="button"
      data-cell={`${cell.row}-${cell.col}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || isOccupied}
      aria-label={
        isOccupied
          ? `Row ${cell.row + 1}, column ${cell.col + 1}, occupied by ${cell.symbol}`
          : `Row ${cell.row + 1}, column ${cell.col + 1}, empty. Press to place ${currentSymbol}`
      }
      className={`
        relative aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center
        transition-all duration-200 select-none outline-none group
        focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
        ${
          isOccupied
            ? 'bg-slate-900/80 border border-slate-700/60 shadow-inner cursor-default'
            : 'bg-slate-800/40 border border-slate-700/40 hover:bg-slate-800/80 hover:border-slate-500/60 active:scale-[0.97] cursor-pointer'
        }
        ${isInScoredGroup ? 'ring-1 ring-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.15)]' : ''}
      `}
    >
      {/* Symbol rendering */}
      {cell.symbol === 'X' && (
        <svg
          className={`${symbolScale} ${!reducedMotion ? 'animate-pop-in' : ''}`}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="22"
            y1="22"
            x2="78"
            y2="78"
            stroke={playerColor}
            strokeWidth="14"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${playerGlow})` }}
          />
          <line
            x1="78"
            y1="22"
            x2="22"
            y2="78"
            stroke={playerColor}
            strokeWidth="14"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${playerGlow})` }}
          />
          <line
            x1="22"
            y1="22"
            x2="78"
            y2="78"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />
          <line
            x1="78"
            y1="22"
            x2="22"
            y2="78"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      )}

      {cell.symbol === 'O' && (
        <svg
          className={`${symbolScale} ${!reducedMotion ? 'animate-pop-in' : ''}`}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke={playerColor}
            strokeWidth="14"
            style={{ filter: `drop-shadow(0 0 8px ${playerGlow})` }}
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="#ffffff"
            strokeWidth="4"
            opacity="0.8"
          />
        </svg>
      )}

      {/* Ghost preview on hover for empty cell */}
      {!isOccupied && !disabled && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity duration-150 pointer-events-none">
          {currentSymbol === 'X' ? (
            <svg className={symbolScale} viewBox="0 0 100 100" fill="none">
              <line x1="24" y1="24" x2="76" y2="76" stroke={player1.color} strokeWidth="12" strokeLinecap="round" />
              <line x1="76" y1="24" x2="24" y2="76" stroke={player1.color} strokeWidth="12" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className={symbolScale} viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="28" stroke={player2.color} strokeWidth="12" />
            </svg>
          )}
        </div>
      )}
    </button>
  );
};
