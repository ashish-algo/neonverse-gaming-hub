import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Trophy, Flame, Play, AlertCircle } from 'lucide-react';
import { DifficultyTier, MemoryGameResult } from '../types';
import { SEQUENCE_CONFIGS, SEQUENCE_TILES_9 } from '../constants';
import { MemoryGameHUD } from './MemoryGameHUD';
import { sound } from '../../../utils/soundEngine';

interface MemorySequenceGameProps {
  difficulty: DifficultyTier;
  bestScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCompleteGame: (result: MemoryGameResult) => void;
  onExit: () => void;
}

type Phase = 'ready' | 'demonstrating' | 'awaiting-input' | 'round-success' | 'game-over';

export const MemorySequenceGame: React.FC<MemorySequenceGameProps> = ({
  difficulty,
  bestScore,
  soundEnabled,
  onToggleSound,
  onCompleteGame,
  onExit,
}) => {
  const config = SEQUENCE_CONFIGS[difficulty];
  const tiles = SEQUENCE_TILES_9.slice(0, config.tileCount);

  const [phase, setPhase] = useState<Phase>('ready');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerStepIndex, setPlayerStepIndex] = useState<number>(0);
  const [activeTileId, setActiveTileId] = useState<number | null>(null);
  const [pressedTileId, setPressedTileId] = useState<number | null>(null);
  const [failedTileId, setFailedTileId] = useState<number | null>(null);

  const [round, setRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);

  // Timers and cleanup refs
  const demonstrationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isMountedRef = useRef(true);

  const clearAllTimers = useCallback(() => {
    if (demonstrationTimerRef.current) {
      clearTimeout(demonstrationTimerRef.current);
      demonstrationTimerRef.current = null;
    }
    activeTimeoutsRef.current.forEach((t) => clearTimeout(t));
    activeTimeoutsRef.current = [];
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Safe timeout register
  const registerTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      if (isMountedRef.current) fn();
    }, ms);
    activeTimeoutsRef.current.push(id);
    return id;
  }, []);

  // Play tile sound and briefly illuminate
  const flashTile = useCallback((tileId: number, durationMs: number = 300) => {
    sound.playTileTone(tileId);
    setActiveTileId(tileId);
    registerTimeout(() => {
      setActiveTileId((curr) => (curr === tileId ? null : curr));
    }, durationMs);
  }, [registerTimeout]);

  // Start demonstrating the sequence to player
  const demonstrateSequence = useCallback((seq: number[]) => {
    clearAllTimers();
    setPhase('demonstrating');
    setActiveTileId(null);
    setPressedTileId(null);
    setFailedTileId(null);

    const stepDelay = Math.max(config.minDelayMs, config.showDurationMs + config.pauseDurationMs);

    seq.forEach((tileId, idx) => {
      const delay = 600 + idx * stepDelay;
      registerTimeout(() => {
        flashTile(tileId, config.showDurationMs);
      }, delay);
    });

    const totalDemoTime = 600 + seq.length * stepDelay + 300;
    registerTimeout(() => {
      setPhase('awaiting-input');
      setPlayerStepIndex(0);
    }, totalDemoTime);
  }, [clearAllTimers, config, flashTile, registerTimeout]);

  // Initialize fresh game
  const startNewGame = useCallback(() => {
    clearAllTimers();
    setScore(0);
    setStreak(0);
    setRoundsCompleted(0);
    setRound(1);
    setFailedTileId(null);

    // Initial sequence of length config.startLength
    const initialSeq: number[] = [];
    for (let i = 0; i < config.startLength; i++) {
      initialSeq.push(Math.floor(Math.random() * config.tileCount));
    }

    setSequence(initialSeq);
    setPhase('ready');

    registerTimeout(() => {
      demonstrateSequence(initialSeq);
    }, 1000);
  }, [clearAllTimers, config, demonstrateSequence, registerTimeout]);

  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  // Handle player pressing a tile
  const handleTilePress = useCallback((tileId: number) => {
    if (phase !== 'awaiting-input') return;

    // Visual press feedback
    setPressedTileId(tileId);
    registerTimeout(() => setPressedTileId(null), 180);

    const expectedTileId = sequence[playerStepIndex];

    if (tileId === expectedTileId) {
      // Correct step
      sound.playTileTone(tileId);

      const nextStepIndex = playerStepIndex + 1;
      setPlayerStepIndex(nextStepIndex);

      if (nextStepIndex === sequence.length) {
        // Sequence fully completed!
        setPhase('round-success');
        sound.playScorePoint();

        // Calculate score: Base 10 + 5 per step beyond initial length + streak bonus
        const roundBase = 10;
        const lengthBonus = Math.max(0, sequence.length - config.startLength) * 5;
        const streakBonus = Math.min(50, streak * 3);
        const earned = roundBase + lengthBonus + streakBonus;

        const newScore = score + earned;
        const newStreak = streak + 1;
        const newRounds = roundsCompleted + 1;

        setScore(newScore);
        setStreak(newStreak);
        setRoundsCompleted(newRounds);

        // Advance to next round: append one random tile
        const nextTile = Math.floor(Math.random() * config.tileCount);
        const nextSequence = [...sequence, nextTile];
        setSequence(nextSequence);
        setRound((prev) => prev + 1);

        registerTimeout(() => {
          demonstrateSequence(nextSequence);
        }, 1200);
      }
    } else {
      // Wrong step! Game over
      setPhase('game-over');
      setFailedTileId(tileId);
      sound.playInvalid();

      const finalResult: MemoryGameResult = {
        mode: 'sequence',
        difficulty,
        score,
        isNewRecord: score > bestScore,
        previousBest: bestScore,
        metrics: {
          sequenceLength: sequence.length,
          roundsCompleted,
          streakCount: streak,
        },
        completedAt: new Date().toISOString(),
      };

      registerTimeout(() => {
        onCompleteGame(finalResult);
      }, 1400);
    }
  }, [
    phase,
    sequence,
    playerStepIndex,
    config.startLength,
    config.tileCount,
    streak,
    score,
    roundsCompleted,
    registerTimeout,
    demonstrateSequence,
    difficulty,
    bestScore,
    onCompleteGame,
  ]);

  // Keyboard navigation [1..9]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'awaiting-input') return;
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= tiles.length) {
        handleTilePress(num - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, tiles.length, handleTilePress]);

  return (
    <div className="w-full flex-1 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      <MemoryGameHUD
        mode="sequence"
        difficulty={difficulty}
        round={round}
        score={score}
        bestScore={bestScore}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onRestart={startNewGame}
        onExit={onExit}
        sequenceLength={sequence.length}
        statusBadge={
          phase === 'demonstrating'
            ? 'WATCH SEQUENCE'
            : phase === 'awaiting-input'
            ? `STEP ${playerStepIndex + 1} / ${sequence.length}`
            : phase === 'round-success'
            ? 'EXCELLENT!'
            : phase === 'ready'
            ? 'GET READY'
            : 'SEQUENCE BROKEN'
        }
      />

      {/* Main Play Area */}
      <main className="w-full max-w-xl mx-auto px-4 py-6 flex-1 flex flex-col items-center justify-center">
        {/* Status Prompt Banner */}
        <div className="mb-6 text-center">
          {phase === 'ready' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>Get ready... Memorize the sequence!</span>
            </div>
          )}

          {phase === 'demonstrating' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>Watching sequence... ({sequence.length} steps)</span>
            </div>
          )}

          {phase === 'awaiting-input' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span>Your Turn! Tap tiles in order ({playerStepIndex + 1}/{sequence.length})</span>
            </div>
          )}

          {phase === 'round-success' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-mono text-xs font-black shadow-[0_0_20px_rgba(0,245,255,0.4)]">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Sequence Matched! +1 Step next round</span>
            </div>
          )}

          {phase === 'game-over' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-950/90 border border-rose-500 text-rose-300 font-mono text-xs font-black">
              <AlertCircle className="w-4 h-4" />
              <span>Sequence Broken! Finalizing score...</span>
            </div>
          )}
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {sequence.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i < playerStepIndex
                  ? 'w-4 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : i === playerStepIndex && phase === 'awaiting-input'
                  ? 'w-5 bg-cyan-400 animate-pulse'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Interactive Tile Grid */}
        <div
          className={`grid gap-3 sm:gap-4 w-full p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-2xl backdrop-blur-sm ${
            config.gridSize === 2
              ? 'grid-cols-2 max-w-xs sm:max-w-sm'
              : 'grid-cols-3 max-w-sm sm:max-w-md'
          }`}
        >
          {tiles.map((tile) => {
            const isFlashing = activeTileId === tile.id;
            const isPressed = pressedTileId === tile.id;
            const isFailed = failedTileId === tile.id;

            return (
              <button
                key={tile.id}
                type="button"
                disabled={phase !== 'awaiting-input'}
                onClick={() => handleTilePress(tile.id)}
                className={`
                  relative aspect-square rounded-2xl border-2 font-mono font-black text-xl sm:text-2xl
                  flex flex-col items-center justify-center transition-all duration-150 select-none
                  ${
                    isFailed
                      ? 'bg-rose-600 border-rose-300 text-white shadow-[0_0_35px_rgba(244,63,94,0.9)] scale-95'
                      : isFlashing || isPressed
                      ? 'scale-105 border-white text-slate-950 shadow-[0_0_30px_rgba(255,255,255,0.9)] brightness-125'
                      : phase === 'awaiting-input'
                      ? 'bg-slate-950/80 hover:bg-slate-900 cursor-pointer active:scale-95'
                      : 'bg-slate-950/60 opacity-80 cursor-default'
                  }
                `}
                style={{
                  borderColor: isFailed
                    ? '#F43F5E'
                    : isFlashing || isPressed
                    ? '#FFFFFF'
                    : tile.color,
                  backgroundColor:
                    isFlashing || isPressed
                      ? tile.activeColor
                      : isFailed
                      ? '#F43F5E'
                      : `${tile.color}15`,
                  color: isFlashing || isPressed ? '#020617' : tile.color,
                  boxShadow:
                    isFlashing || isPressed
                      ? `0 0 25px ${tile.glowColor}`
                      : isFailed
                      ? '0 0 30px rgba(244, 63, 94, 0.8)'
                      : `0 0 10px ${tile.color}20`,
                }}
                aria-label={`Tile ${tile.label}`}
              >
                <span>{tile.label}</span>
                <span className="text-[10px] font-sans font-normal opacity-60 mt-0.5">
                  [{tile.id + 1}]
                </span>
              </button>
            );
          })}
        </div>

        {/* Keyboard Helper Footnote */}
        <p className="text-[11px] font-mono text-slate-500 mt-5 text-center">
          Tip: Tap tiles directly or use keyboard keys [1–{tiles.length}].
        </p>
      </main>
    </div>
  );
};
