export type PlayerSymbol = 'X' | 'O';
export type PlayerId = 1 | 2;

export interface PlayerConfig {
  id: PlayerId;
  name: string;
  symbol: PlayerSymbol;
  color: string;
  glowColor: string;
}

export interface CellCoord {
  row: number;
  col: number;
}

export interface CellData {
  row: number;
  col: number;
  symbol: PlayerSymbol | null;
  moveIndex?: number;
}

export type BoardMatrix = CellData[][];

export type ScoringDirection = 'horizontal' | 'vertical' | 'main-diagonal' | 'anti-diagonal';

export interface ScoredGroup {
  id: string; // canonical unique ID derived from sorted cell coords
  symbol: PlayerSymbol;
  player: PlayerId;
  direction: ScoringDirection;
  cells: [CellCoord, CellCoord, CellCoord];
  moveIndex: number;
}

export interface MoveRecord {
  row: number;
  col: number;
  player: PlayerId;
  symbol: PlayerSymbol;
  moveIndex: number;
  newGroupsScored: ScoredGroup[];
  pointsEarned: number;
}

export interface GameSettings {
  boardSize: number; // 3 to 8
  player1: PlayerConfig;
  player2: PlayerConfig;
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  reducedMotion: boolean;
}

export interface RecentPointEvent {
  id: number;
  player: PlayerId;
  points: number;
  message: string;
  timestamp: number;
}

export interface GameState {
  board: BoardMatrix;
  size: number;
  currentPlayer: PlayerId;
  player1Score: number;
  player2Score: number;
  scoredGroups: ScoredGroup[];
  moveHistory: MoveRecord[];
  isGameOver: boolean;
  winner: PlayerId | 'draw' | null;
  totalCells: number;
  filledCells: number;
  startTime: number;
  endTime?: number;
}

export interface MatchHistoryEntry {
  id: string;
  date: string;
  boardSize: number;
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  winner: PlayerId | 'draw';
  totalMoves: number;
  durationSeconds: number;
}

export interface AggregateStats {
  matchesPlayed: number;
  player1Wins: number;
  player2Wins: number;
  draws: number;
  totalTripletsScored: number;
  highestSingleGameScore: number;
  mostRecentBoardSize: number;
}
