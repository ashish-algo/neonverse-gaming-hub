import {
  BoardMatrix,
  CellCoord,
  GameState,
  MoveRecord,
  PlayerId,
  PlayerSymbol,
  ScoredGroup,
  ScoringDirection,
} from '../types/game';

/**
 * Creates an empty N x N board.
 */
export function createBoard(size: number): BoardMatrix {
  const board: BoardMatrix = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      row.push({
        row: r,
        col: c,
        symbol: null,
      });
    }
    board.push(row);
  }
  return board;
}

/**
 * Clones a board deeply to keep state updates pure and immutable.
 */
export function cloneBoard(board: BoardMatrix): BoardMatrix {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
    }))
  );
}

/**
 * Generates a stable, canonical unique ID for a 3-cell group.
 * The cells are sorted primarily by row, secondarily by col,
 * ensuring that regardless of discovery order, the ID is identical.
 */
export function getCanonicalGroupId(cells: [CellCoord, CellCoord, CellCoord]): string {
  const sorted = [...cells].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });
  return `${sorted[0].row},${sorted[0].col}_${sorted[1].row},${sorted[1].col}_${sorted[2].row},${sorted[2].col}`;
}

/**
 * Checks if a coordinate is within board boundaries.
 */
export function isInsideBoard(row: number, col: number, size: number): boolean {
  return row >= 0 && row < size && col >= 0 && col < size;
}

interface DirectionVector {
  dr: number;
  dc: number;
  direction: ScoringDirection;
}

const DIRECTIONS: DirectionVector[] = [
  { dr: 0, dc: 1, direction: 'horizontal' },
  { dr: 1, dc: 0, direction: 'vertical' },
  { dr: 1, dc: 1, direction: 'main-diagonal' },
  { dr: 1, dc: -1, direction: 'anti-diagonal' },
];

/**
 * Scans all possible 3-cell triplets containing (row, col) in the 4 directions.
 * Returns any completed triplets that have not already been scored.
 */
export function findNewScoredGroups(
  board: BoardMatrix,
  row: number,
  col: number,
  symbol: PlayerSymbol,
  player: PlayerId,
  moveIndex: number,
  existingScoredGroupIds: Set<string>
): ScoredGroup[] {
  const size = board.length;
  const newGroups: ScoredGroup[] = [];
  const newlySeenIds = new Set<string>();

  for (const { dr, dc, direction } of DIRECTIONS) {
    // For each direction, the newly placed cell (row, col) could be:
    // offset = 0: first in triplet: (r, c), (r+dr, c+dc), (r+2dr, c+2dc)
    // offset = 1: middle in triplet: (r-dr, c-dc), (r, c), (r+dr, c+dc)
    // offset = 2: last in triplet: (r-2dr, c-2dc), (r-dr, c-dc), (r, c)
    for (let offset = 0; offset <= 2; offset++) {
      const r0 = row - offset * dr;
      const c0 = col - offset * dc;
      const r1 = r0 + dr;
      const c1 = c0 + dc;
      const r2 = r0 + 2 * dr;
      const c2 = c0 + 2 * dc;

      // Check bounds
      if (
        !isInsideBoard(r0, c0, size) ||
        !isInsideBoard(r1, c1, size) ||
        !isInsideBoard(r2, c2, size)
      ) {
        continue;
      }

      // Check matching symbols
      const s0 = board[r0][c0].symbol;
      const s1 = board[r1][c1].symbol;
      const s2 = board[r2][c2].symbol;

      if (s0 === symbol && s1 === symbol && s2 === symbol) {
        const tripletCells: [CellCoord, CellCoord, CellCoord] = [
          { row: r0, col: c0 },
          { row: r1, col: c1 },
          { row: r2, col: c2 },
        ];
        const groupId = getCanonicalGroupId(tripletCells);

        if (!existingScoredGroupIds.has(groupId) && !newlySeenIds.has(groupId)) {
          newlySeenIds.add(groupId);
          newGroups.push({
            id: groupId,
            symbol,
            player,
            direction,
            cells: tripletCells,
            moveIndex,
          });
        }
      }
    }
  }

  return newGroups;
}

/**
 * Initializes a new game state.
 */
export function initializeGameState(size: number): GameState {
  const safeSize = Math.max(3, Math.min(8, Math.round(size)));
  return {
    board: createBoard(safeSize),
    size: safeSize,
    currentPlayer: 1,
    player1Score: 0,
    player2Score: 0,
    scoredGroups: [],
    moveHistory: [],
    isGameOver: false,
    winner: null,
    totalCells: safeSize * safeSize,
    filledCells: 0,
    startTime: Date.now(),
  };
}

/**
 * Pure state reducer to execute a move on the board.
 * Returns the new GameState if valid, or null if move is invalid.
 */
export function makeMove(
  state: GameState,
  row: number,
  col: number
): { nextState: GameState; newlyScored: ScoredGroup[]; pointsEarned: number } | null {
  if (state.isGameOver) return null;
  if (!isInsideBoard(row, col, state.size)) return null;
  if (state.board[row][col].symbol !== null) return null; // cell occupied

  const symbol: PlayerSymbol = state.currentPlayer === 1 ? 'X' : 'O';
  const player = state.currentPlayer;
  const moveIndex = state.moveHistory.length + 1;

  // Clone board and set symbol
  const nextBoard = cloneBoard(state.board);
  nextBoard[row][col].symbol = symbol;
  nextBoard[row][col].moveIndex = moveIndex;

  // Gather existing scored IDs for O(1) duplicate prevention
  const existingIds = new Set(state.scoredGroups.map((g) => g.id));

  // Detect newly scored groups
  const newlyScored = findNewScoredGroups(
    nextBoard,
    row,
    col,
    symbol,
    player,
    moveIndex,
    existingIds
  );

  const pointsEarned = newlyScored.length;

  const nextPlayer1Score =
    player === 1 ? state.player1Score + pointsEarned : state.player1Score;
  const nextPlayer2Score =
    player === 2 ? state.player2Score + pointsEarned : state.player2Score;

  const nextFilledCells = state.filledCells + 1;
  const isFull = nextFilledCells >= state.totalCells;

  let winner: PlayerId | 'draw' | null = null;
  if (isFull) {
    if (nextPlayer1Score > nextPlayer2Score) {
      winner = 1;
    } else if (nextPlayer2Score > nextPlayer1Score) {
      winner = 2;
    } else {
      winner = 'draw';
    }
  }

  const moveRecord: MoveRecord = {
    row,
    col,
    player,
    symbol,
    moveIndex,
    newGroupsScored: newlyScored,
    pointsEarned,
  };

  const nextState: GameState = {
    ...state,
    board: nextBoard,
    currentPlayer: isFull ? state.currentPlayer : player === 1 ? 2 : 1,
    player1Score: nextPlayer1Score,
    player2Score: nextPlayer2Score,
    scoredGroups: [...state.scoredGroups, ...newlyScored],
    moveHistory: [...state.moveHistory, moveRecord],
    isGameOver: isFull,
    winner,
    filledCells: nextFilledCells,
    endTime: isFull ? Date.now() : undefined,
  };

  return { nextState, newlyScored, pointsEarned };
}

/**
 * Reverts the most recent move cleanly without leaving any stale state.
 */
export function undoMove(state: GameState): GameState {
  if (state.moveHistory.length === 0) return state;

  const lastMove = state.moveHistory[state.moveHistory.length - 1];
  const nextMoveHistory = state.moveHistory.slice(0, -1);

  // Restore board cell
  const nextBoard = cloneBoard(state.board);
  nextBoard[lastMove.row][lastMove.col].symbol = null;
  delete nextBoard[lastMove.row][lastMove.col].moveIndex;

  // Remove scored groups created by this move
  const removedGroupIds = new Set(lastMove.newGroupsScored.map((g) => g.id));
  const nextScoredGroups = state.scoredGroups.filter((g) => !removedGroupIds.has(g.id));

  // Deduct points
  const nextPlayer1Score =
    lastMove.player === 1
      ? Math.max(0, state.player1Score - lastMove.pointsEarned)
      : state.player1Score;
  const nextPlayer2Score =
    lastMove.player === 2
      ? Math.max(0, state.player2Score - lastMove.pointsEarned)
      : state.player2Score;

  return {
    ...state,
    board: nextBoard,
    currentPlayer: lastMove.player, // Hand turn back to player who made the move
    player1Score: nextPlayer1Score,
    player2Score: nextPlayer2Score,
    scoredGroups: nextScoredGroups,
    moveHistory: nextMoveHistory,
    isGameOver: false,
    winner: null,
    filledCells: Math.max(0, state.filledCells - 1),
    endTime: undefined,
  };
}
