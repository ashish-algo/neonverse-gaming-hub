import { ACHIEVEMENTS, LEVEL_CONFIGS } from '../constants';
import {
  DifficultyLevel,
  LevelAttemptResult,
  ShapeHunterSaveData,
} from '../types';

const STORAGE_KEY = 'neonverse_shape_hunter_progress_v1';

export const DEFAULT_SHAPE_HUNTER_SAVE: ShapeHunterSaveData = {
  version: 2,
  highestUnlockedLevel: 1,
  completedLevels: [],
  bestScores: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
  },
  totalGamesPlayed: 0,
  totalCorrectAnswers: 0,
  totalTimedOut: 0,
  totalQuestionsAttempted: 0,
  unlockedAchievements: [],
  recentQuestionIdsByLevel: {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
  },
  soundEnabled: true,
  hintsUsedCount: 0,
};

export function loadShapeHunterProgress(): ShapeHunterSaveData {
  if (typeof window === 'undefined') return DEFAULT_SHAPE_HUNTER_SAVE;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SHAPE_HUNTER_SAVE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SHAPE_HUNTER_SAVE,
      ...parsed,
      bestScores: {
        ...DEFAULT_SHAPE_HUNTER_SAVE.bestScores,
        ...(parsed.bestScores || {}),
      },
      recentQuestionIdsByLevel: {
        ...DEFAULT_SHAPE_HUNTER_SAVE.recentQuestionIdsByLevel,
        ...(parsed.recentQuestionIdsByLevel || {}),
      },
    };
  } catch (err) {
    console.error('Failed to load Shape Hunter save data:', err);
    return DEFAULT_SHAPE_HUNTER_SAVE;
  }
}

export function saveShapeHunterProgress(data: ShapeHunterSaveData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save Shape Hunter progress:', err);
  }
}

/**
 * Evaluates achievements after a completed run or question.
 */
export function evaluateAchievements(
  current: ShapeHunterSaveData,
  attempt: LevelAttemptResult
): string[] {
  const newUnlocked: string[] = [...current.unlockedAchievements];

  const unlock = (id: string) => {
    if (!newUnlocked.includes(id)) {
      newUnlocked.push(id);
    }
  };

  // 1. First Clear
  if (attempt.isPassed) {
    unlock('first_clear');
  }

  // 2. Perfect 700 (all 7 questions correct)
  if (attempt.score === 700 || attempt.score === 500) {
    unlock('perfect_700');
  }

  // 3. Speed Hunter (under 15s on any correct answer)
  if (attempt.questionResults.some((q) => q.isCorrect && q.timeSpentSeconds <= 15)) {
    unlock('speed_hunter');
  }

  // 4. Brahmastra Wielder (Level 8 passed)
  if (attempt.level >= 8 && attempt.isPassed) {
    unlock('brahmastra_wielder');
  }

  // 5. Grand Champion / Sudarshana Conqueror (Level 10 passed)
  if (attempt.level === 10 && attempt.isPassed) {
    unlock('grand_champion');
  }

  // 6. Aggregate shape counting achievements
  let totalTriangles = 0;
  let totalQuads = 0;
  attempt.questionResults.forEach((q) => {
    if (q.isCorrect) {
      if (q.targetShape === 'triangles') totalTriangles++;
      if (['squares', 'rectangles', 'parallelograms', 'rhombuses'].includes(q.targetShape)) {
        totalQuads++;
      }
    }
  });

  if (current.totalCorrectAnswers + totalTriangles >= 10) {
    unlock('triangle_master');
  }
  if (current.totalCorrectAnswers + totalQuads >= 10) {
    unlock('quad_expert');
  }

  return newUnlocked;
}

/**
 * Records a level attempt and updates unlocked levels, high scores, and stats.
 */
export function recordLevelAttempt(
  attempt: LevelAttemptResult
): { updatedSave: ShapeHunterSaveData; newlyUnlockedAchievements: string[]; nextLevelUnlocked: boolean } {
  const current = loadShapeHunterProgress();

  const previousUnlockedLevel = current.highestUnlockedLevel;
  let nextHighestLevel = current.highestUnlockedLevel;
  let nextLevelUnlocked = false;

  // Check if passed and unlocks next level (up to 10)
  if (attempt.isPassed && attempt.level < 10) {
    const nextLevel = (attempt.level + 1) as DifficultyLevel;
    if (nextLevel > nextHighestLevel) {
      nextHighestLevel = nextLevel;
      nextLevelUnlocked = true;
    }
  }

  const completedSet = new Set(current.completedLevels);
  if (attempt.isPassed) {
    completedSet.add(attempt.level);
  }

  const bestScoreForLevel = Math.max(
    current.bestScores[attempt.level] || 0,
    attempt.score
  );

  const hintsUsedInRun = attempt.questionResults.filter((q) => q.usedHint).length;

  const previousAchievementsCount = current.unlockedAchievements.length;
  const updatedAchievements = evaluateAchievements(current, attempt);
  const newlyUnlockedAchievements = updatedAchievements.filter(
    (id) => !current.unlockedAchievements.includes(id)
  );

  const updatedSave: ShapeHunterSaveData = {
    ...current,
    highestUnlockedLevel: nextHighestLevel,
    completedLevels: Array.from(completedSet).sort((a, b) => a - b),
    bestScores: {
      ...current.bestScores,
      [attempt.level]: bestScoreForLevel,
    },
    totalGamesPlayed: current.totalGamesPlayed + 1,
    totalCorrectAnswers: current.totalCorrectAnswers + attempt.correctCount,
    totalTimedOut: current.totalTimedOut + attempt.timeoutCount,
    totalQuestionsAttempted: current.totalQuestionsAttempted + attempt.questionResults.length,
    unlockedAchievements: updatedAchievements,
    hintsUsedCount: current.hintsUsedCount + hintsUsedInRun,
  };

    saveShapeHunterProgress(updatedSave);

  return {
    updatedSave,
    newlyUnlockedAchievements,
    nextLevelUnlocked,
  };
}

/**
 * Resets the score and completed status for a specific level.
 */
export function resetLevelScore(
  current: ShapeHunterSaveData,
  level: DifficultyLevel
): ShapeHunterSaveData {
  const updatedSave: ShapeHunterSaveData = {
    ...current,
    bestScores: {
      ...current.bestScores,
      [level]: 0,
    },
    completedLevels: current.completedLevels.filter((lvl) => lvl !== level),
  };

  saveShapeHunterProgress(updatedSave);
  return updatedSave;
}
