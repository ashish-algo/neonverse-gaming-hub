export type MemoryMode = 'sequence' | 'match' | 'pattern' | 'numbers';

export type DifficultyTier =
  | 'beginner'
  | 'easy'
  | 'moderate'
  | 'difficult'
  | 'very-difficult';

export interface DifficultyOption {
  id: DifficultyTier;
  label: string;
  description: string;
  accentColor: string;
}

export interface MemoryModeInfo {
  id: MemoryMode;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  accentColor: string;
  glowColor: string;
  skillsTrained: string[];
}

export interface SequenceTile {
  id: number;
  label: string;
  color: string;
  activeColor: string;
  glowColor: string;
  soundIndex: number;
}

export interface MatchCard {
  id: string;
  pairId: number;
  symbol: string;
  label: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface PatternCell {
  index: number;
  row: number;
  col: number;
  isTarget: boolean;
  isSelected: boolean;
}

export interface ModeResultMetrics {
  // Sequence
  sequenceLength?: number;
  roundsCompleted?: number;
  streakCount?: number;

  // Match
  pairsMatched?: number;
  totalPairs?: number;
  moves?: number;
  elapsedSeconds?: number;
  efficiencyPercent?: number;

  // Pattern
  gridDimension?: number;
  targetCount?: number;
  correctSelected?: number;
  missedCount?: number;
  wrongCount?: number;
  accuracyPercent?: number;

  // Numbers
  digitsLength?: number;
  inputString?: string;
  targetString?: string;
}

export interface MemoryGameResult {
  mode: MemoryMode;
  difficulty: DifficultyTier;
  score: number;
  isNewRecord: boolean;
  previousBest: number;
  metrics: ModeResultMetrics;
  completedAt: string;
}

export interface ModeBestStats {
  bestScore: number;
  // Mode-specific high watermarks
  maxSequenceLength?: number;
  bestMatchMoves?: number;
  bestMatchTimeSeconds?: number;
  bestPatternAccuracy?: number;
  maxNumberDigits?: number;
}

export interface MemoryChallengeSaveData {
  version: number;
  totalGamesPlayed: number;
  totalRoundsCompleted: number;
  statsByMode: Record<MemoryMode, ModeBestStats>;
  history: Array<{
    mode: MemoryMode;
    difficulty: DifficultyTier;
    score: number;
    completedAt: string;
  }>;
  preferredDifficulty: DifficultyTier;
  preferredMode: MemoryMode;
}
