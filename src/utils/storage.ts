import { AggregateStats, GameSettings, MatchHistoryEntry } from '../types/game';

const SETTINGS_KEY = 'ttt_unlimited_settings_v1';
const HISTORY_KEY = 'ttt_unlimited_history_v1';
const STATS_KEY = 'ttt_unlimited_stats_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  boardSize: 4,
  player1: {
    id: 1,
    name: 'Player 1',
    symbol: 'X',
    color: '#00f0ff', // Cyber Neon Cyan
    glowColor: 'rgba(0, 240, 255, 0.7)',
  },
  player2: {
    id: 2,
    name: 'Player 2',
    symbol: 'O',
    color: '#ff007f', // Electric Hot Pink
    glowColor: 'rgba(255, 0, 127, 0.7)',
  },
  soundEnabled: true,
  musicEnabled: false,
  volume: 0.7,
  reducedMotion: false,
};

export const COLOR_PRESETS = [
  { name: 'Neon Cyan', color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.7)' },
  { name: 'Electric Pink', color: '#ff007f', glow: 'rgba(255, 0, 127, 0.7)' },
  { name: 'Vibrant Lime', color: '#10b981', glow: 'rgba(16, 185, 129, 0.7)' },
  { name: 'Solar Amber', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.7)' },
  { name: 'Plasma Purple', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.7)' },
  { name: 'Blaze Orange', color: '#ff5722', glow: 'rgba(255, 87, 34, 0.7)' },
];

export const INITIAL_STATS: AggregateStats = {
  matchesPlayed: 0,
  player1Wins: 0,
  player2Wins: 0,
  draws: 0,
  totalTripletsScored: 0,
  highestSingleGameScore: 0,
  mostRecentBoardSize: 4,
};

export function loadSettings(): GameSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      player1: { ...DEFAULT_SETTINGS.player1, ...(parsed.player1 || {}) },
      player2: { ...DEFAULT_SETTINGS.player2, ...(parsed.player2 || {}) },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // localStorage failure safe
  }
}

export function loadMatchHistory(): MatchHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMatchHistory(history: MatchHistoryEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Keep max 50 recent games
    const trimmed = history.slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage failure safe
  }
}

export function loadAggregateStats(): AggregateStats {
  if (typeof window === 'undefined') return INITIAL_STATS;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return INITIAL_STATS;
    return { ...INITIAL_STATS, ...JSON.parse(raw) };
  } catch {
    return INITIAL_STATS;
  }
}

export function saveAggregateStats(stats: AggregateStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // localStorage failure safe
  }
}

export function recordCompletedMatch(
  entry: Omit<MatchHistoryEntry, 'id'>,
  scoredGroupsCount: number
): { history: MatchHistoryEntry[]; stats: AggregateStats } {
  const currentHistory = loadMatchHistory();
  const currentStats = loadAggregateStats();

  const newEntry: MatchHistoryEntry = {
    ...entry,
    id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
  };

  const updatedHistory = [newEntry, ...currentHistory];
  saveMatchHistory(updatedHistory);

  const maxScore = Math.max(entry.player1Score, entry.player2Score);
  const updatedStats: AggregateStats = {
    matchesPlayed: currentStats.matchesPlayed + 1,
    player1Wins: entry.winner === 1 ? currentStats.player1Wins + 1 : currentStats.player1Wins,
    player2Wins: entry.winner === 2 ? currentStats.player2Wins + 1 : currentStats.player2Wins,
    draws: entry.winner === 'draw' ? currentStats.draws + 1 : currentStats.draws,
    totalTripletsScored: currentStats.totalTripletsScored + scoredGroupsCount,
    highestSingleGameScore: Math.max(currentStats.highestSingleGameScore, maxScore),
    mostRecentBoardSize: entry.boardSize,
  };
  saveAggregateStats(updatedStats);

  return { history: updatedHistory, stats: updatedStats };
}

export function clearHistoryAndStats(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(STATS_KEY);
  } catch {}
}
