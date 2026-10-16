import React, { useEffect, useState, useId } from 'react';
import { PlayerConfig, ScoredGroup } from '../types/game';

interface StrikeThroughOverlayProps {
  scoredGroups: ScoredGroup[];
  boardRef: React.RefObject<HTMLDivElement | null>;
  size: number;
  player1: PlayerConfig;
  player2: PlayerConfig;
  reducedMotion: boolean;
}

interface LineCoords {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  player: 1 | 2;
  color: string;
  glowColor: string;
  isNew: boolean;
}

export const StrikeThroughOverlay: React.FC<StrikeThroughOverlayProps> = ({
  scoredGroups,
  boardRef,
  size,
  player1,
  player2,
  reducedMotion,
}) => {
  const [boardDim, setBoardDim] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [lines, setLines] = useState<LineCoords[]>([]);
  const [renderedIds, setRenderedIds] = useState<Set<string>>(new Set());
  const filterId1 = useId();
  const filterId2 = useId();

  // Recalculate cell centers and line coordinates whenever board size, dimensions, or scoredGroups change
  useEffect(() => {
    const updateCoords = () => {
      const boardEl = boardRef.current;
      if (!boardEl) return;

      const boardRect = boardEl.getBoundingClientRect();
      if (boardRect.width === 0 || boardRect.height === 0) return;

      setBoardDim({ width: boardRect.width, height: boardRect.height });

      const newLines: LineCoords[] = [];

      for (const group of scoredGroups) {
        // Group cells are already sorted
        const startCell = group.cells[0];
        const endCell = group.cells[2];

        const startEl = boardEl.querySelector<HTMLElement>(
          `[data-cell="${startCell.row}-${startCell.col}"]`
        );
        const endEl = boardEl.querySelector<HTMLElement>(
          `[data-cell="${endCell.row}-${endCell.col}"]`
        );

        let x1: number, y1: number, x2: number, y2: number;

        if (startEl && endEl) {
          const startRect = startEl.getBoundingClientRect();
          const endRect = endEl.getBoundingClientRect();

          x1 = startRect.left + startRect.width / 2 - boardRect.left;
          y1 = startRect.top + startRect.height / 2 - boardRect.top;
          x2 = endRect.left + endRect.width / 2 - boardRect.left;
          y2 = endRect.top + endRect.height / 2 - boardRect.top;
        } else {
          // Fallback calculation using proportional grid layout
          const cellW = boardRect.width / size;
          const cellH = boardRect.height / size;
          x1 = (startCell.col + 0.5) * cellW;
          y1 = (startCell.row + 0.5) * cellH;
          x2 = (endCell.col + 0.5) * cellW;
          y2 = (endCell.row + 0.5) * cellH;
        }

        // Extend line slightly past cell centers for a striking visual look
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        const extend = len > 0 ? (len / 2) * 0.28 : 10;
        const ux = len > 0 ? dx / len : 0;
        const uy = len > 0 ? dy / len : 0;

        const extX1 = x1 - ux * extend;
        const extY1 = y1 - uy * extend;
        const extX2 = x2 + ux * extend;
        const extY2 = y2 + uy * extend;

        const isP1 = group.player === 1;
        const color = isP1 ? player1.color : player2.color;
        const glowColor = isP1 ? player1.glowColor : player2.glowColor;
        const isNew = !renderedIds.has(group.id);

        newLines.push({
          id: group.id,
          x1: extX1,
          y1: extY1,
          x2: extX2,
          y2: extY2,
          player: group.player,
          color,
          glowColor,
          isNew,
        });
      }

      setLines(newLines);

      // Record newly rendered IDs
      if (scoredGroups.length > 0) {
        setRenderedIds((prev) => {
          const next = new Set(prev);
          scoredGroups.forEach((g) => next.add(g.id));
          return next;
        });
      }
    };

    updateCoords();

    const boardEl = boardRef.current;
    let observer: ResizeObserver | null = null;
    if (boardEl && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        updateCoords();
      });
      observer.observe(boardEl);
    }

    window.addEventListener('resize', updateCoords);
    return () => {
      window.removeEventListener('resize', updateCoords);
      if (observer) observer.disconnect();
    };
  }, [scoredGroups, boardRef, size, player1.color, player2.color]);

  if (boardDim.width === 0 || boardDim.height === 0 || lines.length === 0) {
    return null;
  }

  // Adjust stroke width based on board size
  const baseStrokeWidth = Math.max(3.5, Math.min(8, 48 / size));

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-20 overflow-visible"
      width={boardDim.width}
      height={boardDim.height}
      style={{ width: boardDim.width, height: boardDim.height }}
    >
      <defs>
        {/* Neon glow filters */}
        <filter id={filterId1} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={filterId2} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {lines.map((line) => {
        const lineLen = Math.hypot(line.x2 - line.x1, line.y2 - line.y1);
        const filterId = line.player === 1 ? `url(#${filterId1})` : `url(#${filterId2})`;

        return (
          <g key={line.id} className="transition-all duration-300">
            {/* Outer wide neon glow line */}
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.color}
              strokeWidth={baseStrokeWidth * 2.2}
              strokeLinecap="round"
              opacity={0.4}
              filter={filterId}
            />

            {/* Main colored strike line */}
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.color}
              strokeWidth={baseStrokeWidth}
              strokeLinecap="round"
              className={line.isNew && !reducedMotion ? 'animate-strike' : ''}
              style={{
                strokeDasharray: line.isNew && !reducedMotion ? lineLen : undefined,
                strokeDashoffset: line.isNew && !reducedMotion ? 0 : undefined,
              }}
            />

            {/* Inner intense bright core line */}
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#ffffff"
              strokeWidth={Math.max(1.8, baseStrokeWidth * 0.35)}
              strokeLinecap="round"
              opacity={0.9}
            />
          </g>
        );
      })}
    </svg>
  );
};
