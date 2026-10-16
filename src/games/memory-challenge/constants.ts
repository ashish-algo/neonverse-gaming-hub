import {
  DifficultyOption,
  DifficultyTier,
  MemoryChallengeSaveData,
  MemoryMode,
  MemoryModeInfo,
} from './types';

export const MEMORY_MODES: Record<MemoryMode, MemoryModeInfo> = {
  sequence: {
    id: 'sequence',
    name: 'Memory Sequence',
    tagline: 'Audio-visual sequential recall',
    description:
      'Watch the glowing tiles light up in a sequence. Remember the order and repeat it correctly as the sequence gets longer.',
    iconName: 'Sparkles',
    accentColor: '#00F5FF', // Neon Cyan
    glowColor: 'rgba(0, 245, 255, 0.4)',
    skillsTrained: ['Sequential Memory', 'Auditory Rhythm', 'Working Attention'],
  },
  match: {
    id: 'match',
    name: 'Memory Match',
    tagline: 'Pair discovery & spatial mapping',
    description:
      'Flip the hidden cards, remember their positions, and find every matching pair using as few moves as possible.',
    iconName: 'Grid',
    accentColor: '#39FF14', // Neon Lime
    glowColor: 'rgba(57, 255, 20, 0.4)',
    skillsTrained: ['Spatial Recall', 'Associative Memory', 'Visual Search'],
  },
  pattern: {
    id: 'pattern',
    name: 'Pattern Recall',
    tagline: 'Matrix spatial configuration memory',
    description:
      'Memorize the highlighted cells in a grid. Once they disappear, select the same positions from memory.',
    iconName: 'Layers',
    accentColor: '#A855F7', // Electric Purple
    glowColor: 'rgba(168, 85, 247, 0.4)',
    skillsTrained: ['Spatial Geometry', 'Pattern Chunking', 'Visual Retention'],
  },
  numbers: {
    id: 'numbers',
    name: 'Number Memory',
    tagline: 'Numerical working memory buffer',
    description:
      'Memorize a number sequence before it disappears, then enter the exact sequence correctly.',
    iconName: 'Hash',
    accentColor: '#FF2DAA', // Neon Magenta
    glowColor: 'rgba(255, 45, 170, 0.4)',
    skillsTrained: ['Phonological Buffer', 'Digit Span', 'Active Recall'],
  },
};

export const DIFFICULTY_TIERS: DifficultyOption[] = [
  {
    id: 'beginner',
    label: 'Beginner',
    description: 'Gentle intro with generous viewing timers and smaller layouts.',
    accentColor: '#39FF14', // Lime
  },
  {
    id: 'easy',
    label: 'Easy',
    description: 'Balanced pace for steady cognitive warm-up.',
    accentColor: '#00F5FF', // Cyan
  },
  {
    id: 'moderate',
    label: 'Moderate',
    description: 'Standard arcade speed testing multi-item working memory.',
    accentColor: '#F59E0B', // Amber
  },
  {
    id: 'difficult',
    label: 'Difficult',
    description: 'Rapid display with compact boards and extended sequences.',
    accentColor: '#FF2DAA', // Magenta
  },
  {
    id: 'very-difficult',
    label: 'Very Difficult',
    description: 'Master tier with near-instant flashing and maximum cognitive load.',
    accentColor: '#A855F7', // Purple
  },
];

// ---------------------------------------------------------------------------
// 1. SEQUENCE CONFIGURATION
// ---------------------------------------------------------------------------
export const SEQUENCE_TILES_9 = [
  { id: 0, label: '1', color: '#00F5FF', activeColor: '#E0FFFF', glowColor: 'rgba(0, 245, 255, 0.8)', soundIndex: 0 },
  { id: 1, label: '2', color: '#39FF14', activeColor: '#F0FFF0', glowColor: 'rgba(57, 255, 20, 0.8)', soundIndex: 1 },
  { id: 2, label: '3', color: '#FFE600', activeColor: '#FFFFF0', glowColor: 'rgba(255, 230, 0, 0.8)', soundIndex: 2 },
  { id: 3, label: '4', color: '#FF2DAA', activeColor: '#FFF0F8', glowColor: 'rgba(255, 45, 170, 0.8)', soundIndex: 3 },
  { id: 4, label: '5', color: '#A855F7', activeColor: '#FAF5FF', glowColor: 'rgba(168, 85, 247, 0.8)', soundIndex: 4 },
  { id: 5, label: '6', color: '#38BDF8', activeColor: '#F0F9FF', glowColor: 'rgba(56, 189, 248, 0.8)', soundIndex: 5 },
  { id: 6, label: '7', color: '#F97316', activeColor: '#FFF7ED', glowColor: 'rgba(249, 115, 22, 0.8)', soundIndex: 6 },
  { id: 7, label: '8', color: '#EC4899', activeColor: '#FDF2F8', glowColor: 'rgba(236, 72, 153, 0.8)', soundIndex: 7 },
  { id: 8, label: '9', color: '#10B981', activeColor: '#ECFDF5', glowColor: 'rgba(16, 185, 129, 0.8)', soundIndex: 8 },
];

export const SEQUENCE_CONFIGS: Record<
  DifficultyTier,
  {
    gridSize: 2 | 3;
    tileCount: number;
    startLength: number;
    showDurationMs: number;
    pauseDurationMs: number;
    minDelayMs: number;
  }
> = {
  beginner: {
    gridSize: 2,
    tileCount: 4,
    startLength: 2,
    showDurationMs: 650,
    pauseDurationMs: 250,
    minDelayMs: 380,
  },
  easy: {
    gridSize: 2,
    tileCount: 4,
    startLength: 3,
    showDurationMs: 550,
    pauseDurationMs: 200,
    minDelayMs: 320,
  },
  moderate: {
    gridSize: 3,
    tileCount: 9,
    startLength: 3,
    showDurationMs: 480,
    pauseDurationMs: 180,
    minDelayMs: 260,
  },
  difficult: {
    gridSize: 3,
    tileCount: 9,
    startLength: 4,
    showDurationMs: 400,
    pauseDurationMs: 150,
    minDelayMs: 210,
  },
  'very-difficult': {
    gridSize: 3,
    tileCount: 9,
    startLength: 5,
    showDurationMs: 320,
    pauseDurationMs: 120,
    minDelayMs: 160,
  },
};

// ---------------------------------------------------------------------------
// 2. MATCH CONFIGURATION
// ---------------------------------------------------------------------------
export const MATCH_SYMBOLS = [
  { symbol: 'zap', label: 'Lightning', color: '#FFE600' },
  { symbol: 'shield', label: 'Shield', color: '#00F5FF' },
  { symbol: 'flame', label: 'Fire', color: '#FF8800' },
  { symbol: 'heart', label: 'Heart', color: '#FF2DAA' },
  { symbol: 'star', label: 'Star', color: '#39FF14' },
  { symbol: 'diamond', label: 'Diamond', color: '#A855F7' },
  { symbol: 'sun', label: 'Sun', color: '#F59E0B' },
  { symbol: 'moon', label: 'Moon', color: '#38BDF8' },
  { symbol: 'crosshair', label: 'Target', color: '#EC4899' },
  { symbol: 'cpu', label: 'Chip', color: '#10B981' },
  { symbol: 'radio', label: 'Signal', color: '#6366F1' },
  { symbol: 'disc', label: 'Disk', color: '#06B6D4' },
];

export const MATCH_CONFIGS: Record<
  DifficultyTier,
  {
    rows: number;
    cols: number;
    totalPairs: number;
    gridClass: string;
  }
> = {
  beginner: {
    rows: 2,
    cols: 3,
    totalPairs: 3,
    gridClass: 'grid-cols-3 max-w-sm',
  },
  easy: {
    rows: 3,
    cols: 4,
    totalPairs: 6,
    gridClass: 'grid-cols-4 max-w-md',
  },
  moderate: {
    rows: 4,
    cols: 4,
    totalPairs: 8,
    gridClass: 'grid-cols-4 max-w-lg',
  },
  difficult: {
    rows: 4,
    cols: 5,
    totalPairs: 10,
    gridClass: 'grid-cols-4 sm:grid-cols-5 max-w-xl',
  },
  'very-difficult': {
    rows: 4,
    cols: 6,
    totalPairs: 12,
    gridClass: 'grid-cols-4 sm:grid-cols-6 max-w-2xl',
  },
};

// ---------------------------------------------------------------------------
// 3. PATTERN CONFIGURATION
// ---------------------------------------------------------------------------
export const PATTERN_CONFIGS: Record<
  DifficultyTier,
  {
    gridSize: number;
    patternCount: number;
    viewDurationMs: number;
  }
> = {
  beginner: {
    gridSize: 3,
    patternCount: 3,
    viewDurationMs: 2400,
  },
  easy: {
    gridSize: 4,
    patternCount: 5,
    viewDurationMs: 2500,
  },
  moderate: {
    gridSize: 5,
    patternCount: 7,
    viewDurationMs: 2800,
  },
  difficult: {
    gridSize: 6,
    patternCount: 10,
    viewDurationMs: 3000,
  },
  'very-difficult': {
    gridSize: 6,
    patternCount: 13,
    viewDurationMs: 2800,
  },
};

// ---------------------------------------------------------------------------
// 4. NUMBER CONFIGURATION
// ---------------------------------------------------------------------------
export const NUMBER_CONFIGS: Record<
  DifficultyTier,
  {
    startDigits: number;
    baseViewTimeMs: number;
    perDigitMs: number;
  }
> = {
  beginner: {
    startDigits: 3,
    baseViewTimeMs: 2500,
    perDigitMs: 650,
  },
  easy: {
    startDigits: 5,
    baseViewTimeMs: 2800,
    perDigitMs: 600,
  },
  moderate: {
    startDigits: 7,
    baseViewTimeMs: 3200,
    perDigitMs: 550,
  },
  difficult: {
    startDigits: 9,
    baseViewTimeMs: 3800,
    perDigitMs: 500,
  },
  'very-difficult': {
    startDigits: 11,
    baseViewTimeMs: 4400,
    perDigitMs: 450,
  },
};

// ---------------------------------------------------------------------------
// 5. DEFAULT SAVE DATA
// ---------------------------------------------------------------------------
export const DEFAULT_MEMORY_SAVE_DATA: MemoryChallengeSaveData = {
  version: 1,
  totalGamesPlayed: 0,
  totalRoundsCompleted: 0,
  statsByMode: {
    sequence: { bestScore: 0, maxSequenceLength: 0 },
    match: { bestScore: 0, bestMatchMoves: 999, bestMatchTimeSeconds: 999 },
    pattern: { bestScore: 0, bestPatternAccuracy: 0 },
    numbers: { bestScore: 0, maxNumberDigits: 0 },
  },
  history: [],
  preferredDifficulty: 'beginner',
  preferredMode: 'sequence',
};
