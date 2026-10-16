export type ShapeCategory =
  | 'triangles'
  | 'squares'
  | 'rectangles'
  | 'parallelograms'
  | 'rhombuses';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type AstraName =
  | 'Agneyastra'
  | 'Varunastra'
  | 'Vayavyastra'
  | 'Suryastra'
  | 'Indrastra'
  | 'Nagastra'
  | 'Narayanastra'
  | 'Brahmastra'
  | 'Pashupatastra'
  | 'Sudarshana';

export interface LineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface SVGGeometryData {
  viewBoxWidth: number;
  viewBoxHeight: number;
  segments: LineSegment[];
  highlightShapes?: {
    points: string;
    label?: string;
  }[];
}

export interface GeometryQuestion {
  id: string;
  level: DifficultyLevel;
  targetShape: ShapeCategory;
  targetPrompt: string;
  svgData: SVGGeometryData;
  correctCount: number;
  options: number[]; // exactly 4 distinct numerical options
  correctIndex: number; // 0..3
  explanation: string;
  hint: string;
  geometryType:
    | 'triangle-rays'
    | 'triangular-grid'
    | 'rectangle-grid'
    | 'diagonal-grid'
    | 'parallelogram-grid'
    | 'rhombus-lattice'
    | 'triangle-dual-rays'
    | 'nested-diamonds'
    | 'square-diagonals'
    | 'triangle-truss'
    | 'star-polygon'
    | 'sierpinski-lattice'
    | 'parallelogram-chevron'
    | 'staircase-grid'
    | 'cross-grid'
    | 'l-shaped-grid'
    | 'concentric-crossbars'
    | 'isometric-rhombus'
    | 'multi-quad-mosaic'
    | 'mixed-geometry';
}

export interface LevelConfig {
  level: DifficultyLevel;
  astraName: AstraName;
  sanskritName: string;
  title: string;
  difficultyLabel: string;
  timePerQuestion: number; // in seconds
  questionCount: number; // 7
  passThreshold: number; // 4
  maxScore: number; // 700
  accentColor: string;
  glowColor: string;
  description: string;
  lore: string;
}

export interface QuestionResult {
  questionId: string;
  targetShape: ShapeCategory;
  userAnswer: number | null; // null if timed out
  correctAnswer: number;
  isCorrect: boolean;
  isTimeout: boolean;
  timeSpentSeconds: number;
  usedHint: boolean;
}

export interface LevelAttemptResult {
  level: DifficultyLevel;
  score: number;
  maxScore: number;
  correctCount: number;
  incorrectCount: number;
  timeoutCount: number;
  accuracy: number;
  isPassed: boolean;
  questionResults: QuestionResult[];
  completedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
}

export interface ShapeHunterSaveData {
  version: number;
  highestUnlockedLevel: DifficultyLevel;
  completedLevels: DifficultyLevel[];
  bestScores: Record<DifficultyLevel, number>;
  totalGamesPlayed: number;
  totalCorrectAnswers: number;
  totalTimedOut: number;
  totalQuestionsAttempted: number;
  unlockedAchievements: string[];
  recentQuestionIdsByLevel: Record<DifficultyLevel, string[]>;
  soundEnabled: boolean;
  hintsUsedCount: number;
}
