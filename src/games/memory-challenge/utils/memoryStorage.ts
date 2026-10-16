import { DEFAULT_MEMORY_SAVE_DATA } from '../constants';
import {
  DifficultyTier,
  MemoryChallengeSaveData,
  MemoryGameResult,
  MemoryMode,
} from '../types';

const STORAGE_KEY = 'neonverse_memory_challenge_save_v1';

export function loadMemoryProgress(): MemoryChallengeSaveData {
  if (typeof window === 'undefined') return DEFAULT_MEMORY_SAVE_DATA;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_MEMORY_SAVE_DATA;

    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_MEMORY_SAVE_DATA,
      ...parsed,
      statsByMode: {
        sequence: {
          ...DEFAULT_MEMORY_SAVE_DATA.statsByMode.sequence,
          ...(parsed.statsByMode?.sequence || {}),
        },
        match: {
          ...DEFAULT_MEMORY_SAVE_DATA.statsByMode.match,
          ...(parsed.statsByMode?.match || {}),
        },
        pattern: {
          ...DEFAULT_MEMORY_SAVE_DATA.statsByMode.pattern,
          ...(parsed.statsByMode?.pattern || {}),
        },
        numbers: {
          ...DEFAULT_MEMORY_SAVE_DATA.statsByMode.numbers,
          ...(parsed.statsByMode?.numbers || {}),
        },
      },
      history: Array.isArray(parsed.history) ? parsed.history.slice(0, 30) : [],
    };
  } catch (err) {
    console.error('Failed to parse Memory Challenge progress from storage:', err);
    return DEFAULT_MEMORY_SAVE_DATA;
  }
}

export function saveMemoryProgress(data: MemoryChallengeSaveData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save Memory Challenge progress to storage:', err);
  }
}

/**
 * Records a game result and updates records. Returns whether a new personal best was set.
 */
export function recordGameSession(
  current: MemoryChallengeSaveData,
  result: MemoryGameResult
): { updatedSave: MemoryChallengeSaveData; isNewBest: boolean } {
  const modeStats = current.statsByMode[result.mode] || { bestScore: 0 };
  const prevBestScore = modeStats.bestScore || 0;
  const isNewBestScore = result.score > prevBestScore;

  const updatedModeStats = { ...modeStats };

  if (result.score > updatedModeStats.bestScore) {
    updatedModeStats.bestScore = result.score;
  }

  // Update mode-specific high watermarks
  switch (result.mode) {
    case 'sequence':
      if (
        result.metrics.sequenceLength &&
        (!updatedModeStats.maxSequenceLength ||
          result.metrics.sequenceLength > updatedModeStats.maxSequenceLength)
      ) {
        updatedModeStats.maxSequenceLength = result.metrics.sequenceLength;
      }
      break;

    case 'match':
      if (
        result.metrics.moves &&
        (!updatedModeStats.bestMatchMoves ||
          result.metrics.moves < updatedModeStats.bestMatchMoves)
      ) {
        updatedModeStats.bestMatchMoves = result.metrics.moves;
      }
      if (
        result.metrics.elapsedSeconds &&
        (!updatedModeStats.bestMatchTimeSeconds ||
          result.metrics.elapsedSeconds < updatedModeStats.bestMatchTimeSeconds)
      ) {
        updatedModeStats.bestMatchTimeSeconds = result.metrics.elapsedSeconds;
      }
      break;

    case 'pattern':
      if (
        result.metrics.accuracyPercent !== undefined &&
        (!updatedModeStats.bestPatternAccuracy ||
          result.metrics.accuracyPercent > updatedModeStats.bestPatternAccuracy)
      ) {
        updatedModeStats.bestPatternAccuracy = result.metrics.accuracyPercent;
      }
      break;

    case 'numbers':
      if (
        result.metrics.digitsLength &&
        (!updatedModeStats.maxNumberDigits ||
          result.metrics.digitsLength > updatedModeStats.maxNumberDigits)
      ) {
        updatedModeStats.maxNumberDigits = result.metrics.digitsLength;
      }
      break;
  }

  const newHistoryEntry = {
    mode: result.mode,
    difficulty: result.difficulty,
    score: result.score,
    completedAt: result.completedAt,
  };

  const updatedSave: MemoryChallengeSaveData = {
    ...current,
    totalGamesPlayed: current.totalGamesPlayed + 1,
    totalRoundsCompleted:
      current.totalRoundsCompleted + (result.metrics.roundsCompleted || 1),
    preferredDifficulty: result.difficulty,
    preferredMode: result.mode,
    statsByMode: {
      ...current.statsByMode,
      [result.mode]: updatedModeStats,
    },
    history: [newHistoryEntry, ...current.history].slice(0, 30),
  };

  saveMemoryProgress(updatedSave);

  return {
    updatedSave,
    isNewBest: isNewBestScore,
  };
}

export function resetAllMemoryStats(): MemoryChallengeSaveData {
  saveMemoryProgress(DEFAULT_MEMORY_SAVE_DATA);
  return DEFAULT_MEMORY_SAVE_DATA;
}
