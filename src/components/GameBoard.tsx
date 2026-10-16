import React, { useRef } from 'react';
import { BoardMatrix, PlayerConfig, PlayerId, ScoredGroup } from '../types/game';
import { GameCell } from './GameCell';
import { StrikeThroughOverlay } from './StrikeThroughOverlay';

interface GameBoardProps {
  board: BoardMatrix;
  size: number;
  currentPlayer: PlayerId;
  player1: PlayerConfig;
  player2: PlayerConfig;
  scoredGroups: ScoredGroup[];
  isGameOver: boolean;
  onCellClick: (row: number, col: number) => void;
  reducedMotion: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  size,
  currentPlayer,
  player1,
  player2,
  scoredGroups,
  isGameOver,
  onCellClick,
  reducedMotion,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);

  // Pre-calculate which cells are part of any scored group for subtle ambient highlight
  const scoredCellKeys = new Set<string>();
  for (const group of scoredGroups) {
    for (const cell of group.cells) {
      scoredCellKeys.add(`${cell.row}-${cell.col}`);
    }
  }

  // Calculate dynamic gap based on board size
  const gapClass = size <= 4 ? 'gap-2 sm:gap-3' : size <= 6 ? 'gap-1.5 sm:gap-2' : 'gap-1 sm:gap-1.5';
  const paddingClass = size <= 4 ? 'p-3 sm:p-4' : 'p-2 sm:p-3';

  return (
    <div className="relative w-full max-w-[min(94vw,520px)] aspect-square mx-auto flex items-center justify-center">
      {/* Outer arcade neon bezel */}
      <div
        ref={boardRef}
        className={`
          relative w-full h-full rounded-2xl sm:rounded-3xl ${paddingClass}
          bg-slate-950/80 backdrop-blur-xl border border-slate-700/60
          shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(30,41,59,0.5)]
        `}
      >
        {/* Grid of Cells */}
        <div
          className={`grid w-full h-full ${gapClass}`}
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
          }}
          role="grid"
          aria-label={`Tic Tac Toe ${size} by ${size} game board`}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <GameCell
                key={`${r}-${c}`}
                cell={cell}
                size={size}
                currentPlayer={currentPlayer}
                currentSymbol={currentPlayer === 1 ? 'X' : 'O'}
                player1={player1}
                player2={player2}
                disabled={isGameOver}
                onCellClick={onCellClick}
                reducedMotion={reducedMotion}
                isInScoredGroup={scoredCellKeys.has(`${r}-${c}`)}
              />
            ))
          )}
        </div>

        {/* SVG Strike-Through Lines Overlay */}
        <StrikeThroughOverlay
          scoredGroups={scoredGroups}
          boardRef={boardRef}
          size={size}
          player1={player1}
          player2={player2}
          reducedMotion={reducedMotion}
        />
      </div>
    </div>
  );
};
