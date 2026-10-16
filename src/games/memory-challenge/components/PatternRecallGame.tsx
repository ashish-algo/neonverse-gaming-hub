import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Layers,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { DifficultyTier, MemoryGameResult, PatternCell } from '../types';
import { PATTERN_CONFIGS } from '../constants';
import { MemoryGameHUD } from './MemoryGameHUD';
import { sound } from '../../../utils/soundEngine';

interface PatternRecallGameProps {
  difficulty: DifficultyTier;
  bestScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCompleteGame: (result: MemoryGameResult) => void;
  onExit: () => void;
}

type Phase = 'ready' | 'memorizing' | 'recalling' | 'evaluating' | 'summary';

export const PatternRecallGame: React.FC<PatternRecallGameProps> = ({
  difficulty,
  bestScore,
  soundEnabled,
  onToggleSound,
  onCompleteGame,
  onExit,
}) => {
  const config = PATTERN_CONFIGS[difficulty];
  const totalCells = config.gridSize * config.gridSize;

  const [phase, setPhase] = useState<Phase>('ready');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [targetIndices, setTargetIndices] = useState<Set<number>>(new Set());
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // Cumulative score and stats across 3 rounds in a session
  const TOTAL_SESSION_ROUNDS = 3;
  const [totalScore, setTotalScore] = useState<number>(0);
  const [totalCorrectCells, setTotalCorrectCells] = useState<number>(0);
  const [totalTargetCells, setTotalTargetCells] = useState<number>(0);
  const [totalWrongPicks, setTotalWrongPicks] = useState<number>(0);
  const [completedRounds, setCompletedRounds] = useState<number>(0);

  // Memorization timer percentage (100% -> 0%)
  const [memorizeProgress, setMemorizeProgress] = useState<number>(100);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Start a specific round
  const startRound = useCallback(
    (currentRound: number) => {
      clearAllTimers();
      setSelectedIndices(new Set());
      setPhase('ready');
      setMemorizeProgress(100);

      // Generate unique target cells
      const targets = new Set<number>();
      while (targets.size < config.patternCount) {
        targets.add(Math.floor(Math.random() * totalCells));
      }
      setTargetIndices(targets);

      // Brief get-ready delay (700ms) then start memorizing
      timerRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        setPhase('memorizing');
        sound.playHoverChirp();

        const startTime = Date.now();
        const duration = config.viewDurationMs;

        const updateProgress = () => {
          if (!isMountedRef.current) return;
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
          setMemorizeProgress(remaining);

          if (elapsed < duration) {
            animFrameRef.current = requestAnimationFrame(updateProgress);
          } else {
            // Memorization phase over, transition to recall phase
            setPhase('recalling');
            sound.playScorePoint();
          }
        };

        animFrameRef.current = requestAnimationFrame(updateProgress);
      }, 700);
    },
    [clearAllTimers, config.patternCount, config.viewDurationMs, totalCells]
  );

  // Initialize fresh game session
  const initializeGame = useCallback(() => {
    setTotalScore(0);
    setTotalCorrectCells(0);
    setTotalTargetCells(0);
    setTotalWrongPicks(0);
    setCompletedRounds(0);
    setRoundNumber(1);
    startRound(1);
  }, [startRound]);

  useEffect(() => {
    initializeGame();
  }, [difficulty, initializeGame]);

  // Toggle cell selection during recall phase
  const handleCellClick = (index: number) => {
    if (phase !== 'recalling') return;

    sound.playHoverChirp();
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Submit pattern and evaluate
  const handleSubmitPattern = () => {
    if (phase !== 'recalling') return;

    clearAllTimers();
    setPhase('evaluating');

    // Count correct, missed, and wrong
    let correctCount = 0;
    let wrongCount = 0;

    selectedIndices.forEach((idx) => {
      if (targetIndices.has(idx)) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const missedCount = targetIndices.size - correctCount;
    const isPerfect = correctCount === targetIndices.size && wrongCount === 0;

    if (isPerfect) {
      sound.playLevelVictory();
    } else if (correctCount > 0) {
      sound.playScorePoint();
    } else {
      sound.playInvalid();
    }

    // Scoring: +50 per correct cell, +150 bonus if perfect, -15 penalty per wrong pick
    const roundScore = Math.max(
      0,
      correctCount * 50 + (isPerfect ? 150 : 0) - wrongCount * 15
    );

    const nextTotalScore = totalScore + roundScore;
    const nextCorrect = totalCorrectCells + correctCount;
    const nextTargets = totalTargetCells + targetIndices.size;
    const nextWrong = totalWrongPicks + wrongCount;
    const nextRounds = completedRounds + 1;

    setTotalScore(nextTotalScore);
    setTotalCorrectCells(nextCorrect);
    setTotalTargetCells(nextTargets);
    setTotalWrongPicks(nextWrong);
    setCompletedRounds(nextRounds);
  };

  // Advance to next round or finish session
  const handleNextRoundOrFinish = () => {
    if (roundNumber < TOTAL_SESSION_ROUNDS) {
      const nextRound = roundNumber + 1;
      setRoundNumber(nextRound);
      startRound(nextRound);
    } else {
      // Completed all 3 rounds of session
      const accuracy =
        totalTargetCells > 0
          ? Math.round((totalCorrectCells / (totalTargetCells + totalWrongPicks)) * 100)
          : 0;

      const result: MemoryGameResult = {
        mode: 'pattern',
        difficulty,
        score: totalScore,
        isNewRecord: totalScore > bestScore,
        previousBest: bestScore,
        metrics: {
          gridDimension: config.gridSize,
          targetCount: totalTargetCells,
          correctSelected: totalCorrectCells,
          missedCount: totalTargetCells - totalCorrectCells,
          wrongCount: totalWrongPicks,
          accuracyPercent: accuracy,
        },
        completedAt: new Date().toISOString(),
      };

      onCompleteGame(result);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between selection:bg-purple-500 selection:text-slate-950">
      <MemoryGameHUD
        mode="pattern"
        difficulty={difficulty}
        round={roundNumber}
        score={totalScore}
        bestScore={bestScore}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onRestart={initializeGame}
        onExit={onExit}
        patternCellsCount={config.patternCount}
        statusBadge={
          phase === 'memorizing'
            ? 'MEMORIZE PATTERN'
            : phase === 'recalling'
            ? `SELECTED ${selectedIndices.size}/${config.patternCount}`
            : phase === 'evaluating'
            ? 'PATTERN REVIEW'
            : 'READY'
        }
      />

      <main className="w-full max-w-xl mx-auto px-4 py-6 flex-1 flex flex-col items-center justify-center">
        {/* Status / Instructions Banner */}
        <div className="w-full max-w-md text-center mb-4">
          {phase === 'ready' && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold animate-pulse">
              <span>Round {roundNumber} of {TOTAL_SESSION_ROUNDS}: Preparing pattern...</span>
            </div>
          )}

          {phase === 'memorizing' && (
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                <Eye className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Memorize the highlighted cells! ({config.patternCount} cells)</span>
              </div>
              {/* Memorize Countdown Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-75"
                  style={{ width: `${memorizeProgress}%` }}
                />
              </div>
            </div>
          )}

          {phase === 'recalling' && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
              <span>Reproduce the pattern ({selectedIndices.size} selected)</span>
            </div>
          )}

          {phase === 'evaluating' && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs font-bold">
              <span>Round {roundNumber} Results Review</span>
            </div>
          )}
        </div>

        {/* Matrix Grid */}
        <div
          className="p-3 sm:p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md select-none max-w-sm sm:max-w-md w-full"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${config.gridSize}, minmax(0, 1fr))`,
            gap: config.gridSize > 5 ? '6px' : '8px',
          }}
        >
          {Array.from({ length: totalCells }).map((_, idx) => {
            const isTarget = targetIndices.has(idx);
            const isSelected = selectedIndices.has(idx);

            // Phase based styling
            let cellStyle =
              'bg-slate-950/80 border-slate-800 text-transparent hover:border-slate-700';

            if (phase === 'memorizing') {
              if (isTarget) {
                cellStyle =
                  'bg-gradient-to-tr from-cyan-400 to-purple-500 border-white text-slate-950 shadow-[0_0_20px_rgba(0,245,255,0.8)] scale-[1.03]';
              }
            } else if (phase === 'recalling') {
              if (isSelected) {
                cellStyle =
                  'bg-purple-600/40 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-[0.98]';
              } else {
                cellStyle =
                  'bg-slate-950/80 hover:bg-slate-900 border-slate-800 hover:border-purple-500/50 cursor-pointer';
              }
            } else if (phase === 'evaluating') {
              if (isTarget && isSelected) {
                // Correct match!
                cellStyle =
                  'bg-emerald-500 border-emerald-300 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.8)]';
              } else if (isTarget && !isSelected) {
                // Missed!
                cellStyle =
                  'bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
              } else if (!isTarget && isSelected) {
                // False positive / wrong pick!
                cellStyle =
                  'bg-rose-500 border-rose-300 text-white shadow-[0_0_15px_rgba(244,63,94,0.8)]';
              } else {
                cellStyle = 'bg-slate-950/40 border-slate-900/60 opacity-40';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={phase !== 'recalling'}
                onClick={() => handleCellClick(idx)}
                className={`
                  aspect-square rounded-xl border-2 flex items-center justify-center font-mono font-bold text-xs sm:text-sm transition-all duration-150
                  ${cellStyle}
                `}
                aria-label={`Grid cell ${idx + 1}`}
              >
                {phase === 'evaluating' && (
                  <>
                    {isTarget && isSelected && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                    {isTarget && !isSelected && <Eye className="w-4 h-4 text-amber-300" />}
                    {!isTarget && isSelected && <XCircle className="w-4 h-4 stroke-[3]" />}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="w-full max-w-sm mt-5 flex flex-col items-center gap-3">
          {phase === 'recalling' && (
            <button
              type="button"
              onClick={() => {
                sound.playButtonClick();
                handleSubmitPattern();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-slate-950 font-mono font-black text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>SUBMIT PATTERN ({selectedIndices.size})</span>
            </button>
          )}

          {phase === 'evaluating' && (
            <div className="w-full flex flex-col items-center gap-3">
              {/* Review Legend */}
              <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block" />
                  Correct
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" />
                  Missed
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
                  Wrong
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playButtonClick();
                  handleNextRoundOrFinish();
                }}
                className="w-full py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-black text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>
                  {roundNumber < TOTAL_SESSION_ROUNDS
                    ? `PROCEED TO ROUND ${roundNumber + 1}`
                    : 'VIEW FINAL RESULTS'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
