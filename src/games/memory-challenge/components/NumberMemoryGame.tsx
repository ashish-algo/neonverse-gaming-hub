import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Hash,
  Delete,
  CornerDownLeft,
  RotateCcw,
  Sparkles,
  Flame,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { DifficultyTier, MemoryGameResult } from '../types';
import { NUMBER_CONFIGS } from '../constants';
import { MemoryGameHUD } from './MemoryGameHUD';
import { sound } from '../../../utils/soundEngine';

interface NumberMemoryGameProps {
  difficulty: DifficultyTier;
  bestScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCompleteGame: (result: MemoryGameResult) => void;
  onExit: () => void;
}

type Phase = 'ready' | 'memorizing' | 'input' | 'success' | 'game-over';

export const NumberMemoryGame: React.FC<NumberMemoryGameProps> = ({
  difficulty,
  bestScore,
  soundEnabled,
  onToggleSound,
  onCompleteGame,
  onExit,
}) => {
  const config = NUMBER_CONFIGS[difficulty];

  const [phase, setPhase] = useState<Phase>('ready');
  const [currentDigitLength, setCurrentDigitLength] = useState<number>(config.startDigits);
  const [targetDigits, setTargetDigits] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');

  const [round, setRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxDigitsRecalled, setMaxDigitsRecalled] = useState<number>(0);

  // Memorization progress percentage (100% -> 0%)
  const [timerPercent, setTimerPercent] = useState<number>(100);

  const timerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  const clearAllTimers = useCallback(() => {
    if (timerTimeoutRef.current) {
      clearTimeout(timerTimeoutRef.current);
      timerTimeoutRef.current = null;
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

  // Generate random digits preserving leading zeros as string
  const generateRandomDigits = (length: number): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  // Start round with given digit count
  const startRound = useCallback(
    (digitsCount: number) => {
      clearAllTimers();
      setUserInput('');
      setPhase('ready');
      setTimerPercent(100);

      const generated = generateRandomDigits(digitsCount);
      setTargetDigits(generated);

      // 600ms get-ready then display digits
      timerTimeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        setPhase('memorizing');
        sound.playHoverChirp();

        const duration = config.baseViewTimeMs + digitsCount * config.perDigitMs;
        const startTime = Date.now();

        const tick = () => {
          if (!isMountedRef.current) return;
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
          setTimerPercent(remaining);

          if (elapsed < duration) {
            animFrameRef.current = requestAnimationFrame(tick);
          } else {
            // Viewing time expired: hide digits and allow input
            setPhase('input');
            sound.playScorePoint();
          }
        };

        animFrameRef.current = requestAnimationFrame(tick);
      }, 600);
    },
    [clearAllTimers, config.baseViewTimeMs, config.perDigitMs]
  );

  // Initialize fresh game session
  const initializeGame = useCallback(() => {
    setScore(0);
    setStreak(0);
    setRound(1);
    setMaxDigitsRecalled(0);
    setCurrentDigitLength(config.startDigits);
    startRound(config.startDigits);
  }, [config.startDigits, startRound]);

  useEffect(() => {
    initializeGame();
  }, [difficulty, initializeGame]);

  // Handle number input (keypad or keyboard)
  const handleInputDigit = (digit: string) => {
    if (phase !== 'input') return;
    if (userInput.length >= targetDigits.length) return;

    sound.playHoverChirp();
    setUserInput((prev) => prev + digit);
  };

  const handleBackspace = () => {
    if (phase !== 'input') return;
    sound.playButtonClick();
    setUserInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (phase !== 'input') return;
    sound.playButtonClick();
    setUserInput('');
  };

  // Evaluate user submission
  const handleSubmit = useCallback(() => {
    if (phase !== 'input') return;
    clearAllTimers();

    if (userInput === targetDigits) {
      // 100% CORRECT!
      setPhase('success');
      sound.playLevelVictory();

      const basePoints = 100;
      const digitBonus = Math.max(0, targetDigits.length - 3) * 25;
      const streakBonus = Math.min(60, streak * 10);
      const roundEarned = basePoints + digitBonus + streakBonus;

      const newScore = score + roundEarned;
      const newStreak = streak + 1;
      const newMaxDigits = Math.max(maxDigitsRecalled, targetDigits.length);

      setScore(newScore);
      setStreak(newStreak);
      setMaxDigitsRecalled(newMaxDigits);

      // Advance to next round with +1 digit
      const nextDigits = currentDigitLength + 1;
      setCurrentDigitLength(nextDigits);
      setRound((prev) => prev + 1);

      timerTimeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        startRound(nextDigits);
      }, 1300);
    } else {
      // WRONG SEQUENCE! Game over
      setPhase('game-over');
      sound.playInvalid();

      const finalResult: MemoryGameResult = {
        mode: 'numbers',
        difficulty,
        score,
        isNewRecord: score > bestScore,
        previousBest: bestScore,
        metrics: {
          digitsLength: maxDigitsRecalled,
          inputString: userInput,
          targetString: targetDigits,
        },
        completedAt: new Date().toISOString(),
      };

      timerTimeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        onCompleteGame(finalResult);
      }, 2000);
    }
  }, [
    phase,
    clearAllTimers,
    userInput,
    targetDigits,
    streak,
    score,
    maxDigitsRecalled,
    currentDigitLength,
    difficulty,
    bestScore,
    startRound,
    onCompleteGame,
  ]);

  // Physical keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'input') return;

      if (e.key >= '0' && e.key <= '9') {
        handleInputDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        if (userInput.length > 0) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, userInput, handleSubmit]);

  return (
    <div className="w-full flex-1 flex flex-col justify-between selection:bg-pink-500 selection:text-slate-950">
      <MemoryGameHUD
        mode="numbers"
        difficulty={difficulty}
        round={round}
        score={score}
        bestScore={bestScore}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onRestart={initializeGame}
        onExit={onExit}
        digitsCount={currentDigitLength}
        statusBadge={
          phase === 'memorizing'
            ? `MEMORIZE ${currentDigitLength} DIGITS`
            : phase === 'input'
            ? `ENTER ${targetDigits.length} DIGITS`
            : phase === 'success'
            ? 'PERFECT RECALL!'
            : phase === 'ready'
            ? 'GET READY'
            : 'SEQUENCE MISMATCH'
        }
      />

      <main className="w-full max-w-md mx-auto px-4 py-6 flex-1 flex flex-col items-center justify-center">
        {/* Top Status */}
        <div className="mb-4 text-center">
          {phase === 'ready' && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-pink-950/80 border border-pink-500/40 text-pink-300 font-mono text-xs font-bold animate-pulse">
              <span>Ready for {currentDigitLength} digits...</span>
            </div>
          )}

          {phase === 'memorizing' && (
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                <Eye className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Memorize the exact sequence!</span>
              </div>
              {/* Memorize Countdown Bar */}
              <div className="w-56 h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-75"
                  style={{ width: `${timerPercent}%` }}
                />
              </div>
            </div>
          )}

          {phase === 'input' && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs font-bold">
              <span>Type or tap the remembered digits ({userInput.length}/{targetDigits.length})</span>
            </div>
          )}

          {phase === 'success' && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-mono text-xs font-black shadow-[0_0_20px_rgba(52,211,153,0.4)]">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Exact Recall! +1 Digit next round</span>
            </div>
          )}

          {phase === 'game-over' && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-rose-950/90 border border-rose-500 text-rose-300 font-mono text-xs font-black">
              <AlertCircle className="w-4 h-4" />
              <span>Incorrect Recall! Finalizing...</span>
            </div>
          )}
        </div>

        {/* Central Display Area: Memorization or Input */}
        <div className="w-full mb-6 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden backdrop-blur-md">
          {phase === 'memorizing' ? (
            <div className="text-3xl sm:text-4xl md:text-5xl font-mono font-black tracking-widest text-transparent bg-gradient-to-r from-pink-400 via-white to-cyan-400 bg-clip-text drop-shadow-[0_0_25px_rgba(255,45,170,0.8)] select-all animate-pulse">
              {targetDigits}
            </div>
          ) : phase === 'game-over' ? (
            <div className="flex flex-col items-center gap-2 font-mono">
              <div className="text-xs text-slate-500 uppercase">EXPECTED:</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-wider">
                {targetDigits}
              </div>
              <div className="text-xs text-slate-500 uppercase mt-1">ENTERED:</div>
              <div className="text-2xl sm:text-3xl font-black text-rose-400 tracking-wider">
                {userInput || '(empty)'}
              </div>
            </div>
          ) : (
            /* Input Phase Display */
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              {Array.from({ length: targetDigits.length }).map((_, i) => {
                const char = userInput[i];
                const isCurrent = i === userInput.length;

                return (
                  <div
                    key={i}
                    className={`w-9 h-12 sm:w-11 sm:h-14 rounded-xl border-2 flex items-center justify-center font-mono text-xl sm:text-2xl font-black transition-all ${
                      char !== undefined
                        ? 'bg-pink-950/60 border-pink-400 text-pink-300 shadow-[0_0_15px_rgba(255,45,170,0.3)]'
                        : isCurrent
                        ? 'bg-slate-950 border-cyan-400 text-cyan-400 animate-pulse'
                        : 'bg-slate-950/70 border-slate-800 text-slate-700'
                    }`}
                  >
                    {char !== undefined ? char : isCurrent ? '_' : ''}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Numeric Cyber Keypad (Visible during input) */}
        {phase === 'input' && (
          <div className="w-full max-w-xs space-y-2 select-none">
            {/* Rows 1-3 */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleInputDigit(digit)}
                  className="py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-pink-500/50 text-white font-mono font-black text-lg sm:text-xl transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {digit}
                </button>
              ))}
            </div>

            {/* Bottom Row: Clear, 0, Backspace */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
                title="Clear all"
              >
                CLEAR
              </button>

              <button
                type="button"
                onClick={() => handleInputDigit('0')}
                className="py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-pink-500/50 text-white font-mono font-black text-lg sm:text-xl transition-all cursor-pointer shadow-sm active:scale-95"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleBackspace}
                className="py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 font-mono transition-all cursor-pointer flex items-center justify-center active:scale-95"
                title="Backspace"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            {/* Submit Action Button */}
            <button
              type="button"
              disabled={userInput.length === 0}
              onClick={handleSubmit}
              className={`w-full py-3.5 mt-2 rounded-2xl font-mono font-black text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                userInput.length > 0
                  ? 'bg-gradient-to-r from-pink-500 to-cyan-400 hover:from-pink-400 hover:to-cyan-300 text-slate-950 shadow-[0_0_20px_rgba(255,45,170,0.5)] cursor-pointer'
                  : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>SUBMIT SEQUENCE</span>
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
