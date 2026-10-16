import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LEVEL_CONFIGS } from './constants';
import { buildVerifiedQuestionBank, selectQuestionsForLevel } from './data/questionBank';
import {
  DifficultyLevel,
  GeometryQuestion,
  LevelAttemptResult,
  QuestionResult,
  ShapeHunterSaveData,
} from './types';
import {
  loadShapeHunterProgress,
  recordLevelAttempt,
  resetLevelScore,
} from './utils/shapeHunterStorage';
import { ShapeHunterHeader } from './components/ShapeHunterHeader';
import { QuestionPlayView } from './components/QuestionPlayView';
import { LevelSelectView } from './components/LevelSelectView';
import { LevelResultView } from './components/LevelResultView';
import { GrandVictoryView } from './components/GrandVictoryView';
import { AchievementsModal } from './components/AchievementsModal';
import { sound } from '../../utils/soundEngine';

interface ShapeHunterGameProps {
  onBackToHub: () => void;
}

type GameScreen = 'level-select' | 'playing' | 'level-result' | 'grand-victory';

export const ShapeHunterGame: React.FC<ShapeHunterGameProps> = ({ onBackToHub }) => {
  const [saveData, setSaveData] = useState<ShapeHunterSaveData>(() => loadShapeHunterProgress());
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('level-select');
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>(1);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active run state
  const [levelQuestions, setLevelQuestions] = useState<GeometryQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [currentLevelScore, setCurrentLevelScore] = useState(0);
  const [latestAttemptResult, setLatestAttemptResult] = useState<LevelAttemptResult | null>(null);

  // Per-question interactive state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // High precision timestamp-based timer state
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const questionStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<any>(null);
  const autoAdvanceTimeoutRef = useRef<any>(null);
  const warningTickFiredRef = useRef<Set<number>>(new Set());

  // Cached question bank
  const allQuestionsRef = useRef<GeometryQuestion[]>([]);
  if (allQuestionsRef.current.length === 0) {
    allQuestionsRef.current = buildVerifiedQuestionBank();
  }

  // Clear all running timers cleanly
  const clearTimers = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  // Start countdown timer for the current question
  const startTimerForQuestion = useCallback((totalSeconds: number) => {
    clearTimers();
    warningTickFiredRef.current.clear();

    const now = Date.now();
    questionStartTimeRef.current = now;
    const deadline = now + totalSeconds * 1000;

    setRemainingSeconds(totalSeconds);

    timerIntervalRef.current = setInterval(() => {
      const currentNow = Date.now();
      const diffMs = deadline - currentNow;
      const secondsLeft = Math.max(0, Math.ceil(diffMs / 1000));

      setRemainingSeconds(secondsLeft);

      // Audio ticks on countdown
      if (secondsLeft <= 15 && secondsLeft > 5 && !warningTickFiredRef.current.has(secondsLeft)) {
        warningTickFiredRef.current.add(secondsLeft);
        sound.playWarningTick();
      } else if (secondsLeft <= 5 && secondsLeft > 0 && !warningTickFiredRef.current.has(secondsLeft)) {
        warningTickFiredRef.current.add(secondsLeft);
        sound.playCriticalTick();
      }

      // Handle timer expiration at 0 seconds
      if (secondsLeft <= 0) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;

        // Immediately trigger timeout
        handleTimeout();
      }
    }, 200);
  }, [clearTimers]);

  // Handle timeout at 00:00
  const handleTimeout = () => {
    setHasAnswered(true);
    setIsTimedOut(true);
    sound.playTimeoutBuzzer();

    const currentQ = levelQuestions[currentQuestionIndex];
    if (!currentQ) return;

    const timeSpent = Math.round((Date.now() - questionStartTimeRef.current) / 1000);

    const result: QuestionResult = {
      questionId: currentQ.id,
      targetShape: currentQ.targetShape,
      userAnswer: null,
      correctAnswer: currentQ.correctCount,
      isCorrect: false,
      isTimeout: true,
      timeSpentSeconds: timeSpent,
      usedHint: false,
    };

    setQuestionResults((prev) => [...prev, result]);

    // Auto-advance after 1.5 seconds on timeout
    autoAdvanceTimeoutRef.current = setTimeout(() => {
      advanceToNextQuestionOrFinish();
    }, 1500);
  };

  // Launch a new attempt on a chosen level
  const handleStartLevel = (level: DifficultyLevel) => {
    clearTimers();
    setSelectedLevel(level);

    // Pick 7 distinct and mathematically validated questions for this Astra level
    const selectedQuestions = selectQuestionsForLevel(level, [], 7);

    setLevelQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setQuestionResults([]);
    setCurrentLevelScore(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setIsTimedOut(false);

    setCurrentScreen('playing');

    const config = LEVEL_CONFIGS[level];
    startTimerForQuestion(config.timePerQuestion);
  };

  // Handle user selecting an option
  const handleSelectOption = (option: number) => {
    if (hasAnswered || isTimedOut) return;

    clearTimers();
    setSelectedOption(option);
    setHasAnswered(true);

    const currentQ = levelQuestions[currentQuestionIndex];
    if (!currentQ) return;

    const isCorrect = option === currentQ.correctCount;
    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));

    if (isCorrect) {
      sound.playCorrectGeometry();
      setCurrentLevelScore((prev) => prev + 100);
    } else {
      sound.playWrongGeometry();
    }

    const result: QuestionResult = {
      questionId: currentQ.id,
      targetShape: currentQ.targetShape,
      userAnswer: option,
      correctAnswer: currentQ.correctCount,
      isCorrect,
      isTimeout: false,
      timeSpentSeconds: timeSpent,
      usedHint: false,
    };

    setQuestionResults((prev) => [...prev, result]);
  };

  // Advance to next question or complete level
  const advanceToNextQuestionOrFinish = () => {
    clearTimers();

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < levelQuestions.length) {
      // Advance to next question
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(null);
      setHasAnswered(false);
      setIsTimedOut(false);

      const config = LEVEL_CONFIGS[selectedLevel];
      startTimerForQuestion(config.timePerQuestion);
    } else {
      // Level Complete: tally results and persist
      finishLevelAttempt();
    }
  };

  // Finish level attempt and record in storage
  const finishLevelAttempt = () => {
    clearTimers();

    const config = LEVEL_CONFIGS[selectedLevel];
    const totalQuestionsCount = levelQuestions.length; // 7
    const correctCount = questionResults.filter((q) => q.isCorrect).length;
    const timeoutCount = questionResults.filter((q) => q.isTimeout).length;
    const incorrectCount = totalQuestionsCount - correctCount - timeoutCount;
    const isPassed = correctCount >= (config?.passThreshold ?? 4);
    const accuracy =
      totalQuestionsCount > 0 ? Math.round((correctCount / totalQuestionsCount) * 100) : 0;
    const score = correctCount * 100;

    const attemptResult: LevelAttemptResult = {
      level: selectedLevel,
      score,
      maxScore: config?.maxScore ?? 700,
      correctCount,
      incorrectCount,
      timeoutCount,
      accuracy,
      isPassed,
      questionResults,
      completedAt: new Date().toISOString(),
    };

    setLatestAttemptResult(attemptResult);

    // Save and check achievements
    const { updatedSave } = recordLevelAttempt(attemptResult);
    setSaveData(updatedSave);

    setCurrentScreen('level-result');
  };

  // Sound toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setMuted(!next);
  };

  // Current active question
  const currentQuestion = levelQuestions[currentQuestionIndex];
  const levelConfig = LEVEL_CONFIGS[selectedLevel];

  const correctCount = questionResults.filter((q) => q.isCorrect).length;
  const timeoutCount = questionResults.filter((q) => q.isTimeout).length;
  const incorrectCount = questionResults.filter((q) => !q.isCorrect && !q.isTimeout).length;

  // Reset score for a level
  const handleResetLevelScore = (level: DifficultyLevel) => {
    const updated = resetLevelScore(saveData, level);
    setSaveData(updated);
  };

  // Screen 1: Level Selection
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between arcade-grid-bg relative selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Background ambient lighting */}
      <div
        className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20 transition-colors duration-500"
        style={{ backgroundColor: levelConfig?.accentColor || '#00F5FF' }}
      />
      <div className="fixed bottom-10 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Screen 1: Level Selection */}
      {currentScreen === 'level-select' && (
        <LevelSelectView
          saveData={saveData}
          onSelectLevel={handleStartLevel}
          onResetLevelScore={handleResetLevelScore}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onBackToHub={onBackToHub}
        />
      )}

      {/* Screen 2: Playing Question */}
      {currentScreen === 'playing' && currentQuestion && (
        <div className="w-full flex-1 flex flex-col justify-between">
          <ShapeHunterHeader
            levelConfig={levelConfig}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={levelQuestions.length}
            levelScore={currentLevelScore}
            totalRunScore={currentLevelScore}
            correctCount={correctCount}
            incorrectCount={incorrectCount}
            timeoutCount={timeoutCount}
            remainingSeconds={remainingSeconds}
            isTimerWarning={remainingSeconds <= 15 && remainingSeconds > 5}
            isTimerCritical={remainingSeconds <= 5}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onExitLevel={() => {
              clearTimers();
              setCurrentScreen('level-select');
            }}
          />

          <main className="flex-1 flex items-center justify-center">
            <QuestionPlayView
              question={currentQuestion}
              levelConfig={levelConfig}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={levelQuestions.length}
              isTimedOut={isTimedOut}
              hasAnswered={hasAnswered}
              selectedOption={selectedOption}
              onSelectOption={handleSelectOption}
              onNextQuestion={advanceToNextQuestionOrFinish}
              isLastQuestion={currentQuestionIndex === levelQuestions.length - 1}
            />
          </main>
        </div>
      )}

      {/* Screen 3: Level Result Summary */}
      {currentScreen === 'level-result' && latestAttemptResult && (
        <LevelResultView
          result={latestAttemptResult}
          questions={levelQuestions}
          levelConfig={levelConfig}
          onNextLevel={() => {
            if (selectedLevel < 10) {
              handleStartLevel((selectedLevel + 1) as DifficultyLevel);
            } else {
              setCurrentScreen('grand-victory');
            }
          }}
          onRetryLevel={() => handleStartLevel(selectedLevel)}
          onLevelSelect={() => setCurrentScreen('level-select')}
          onBackToHub={onBackToHub}
          hasUnlockedNextLevel={saveData.highestUnlockedLevel > selectedLevel}
          isGameComplete={selectedLevel === 10 && latestAttemptResult.isPassed}
        />
      )}

      {/* Screen 4: Grand Victory */}
      {currentScreen === 'grand-victory' && (
        <GrandVictoryView
          saveData={saveData}
          onLevelSelect={() => setCurrentScreen('level-select')}
          onBackToHub={onBackToHub}
        />
      )}

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        saveData={saveData}
      />
    </div>
  );
};
