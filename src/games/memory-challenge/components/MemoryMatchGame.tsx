import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Zap,
  Shield,
  Flame,
  Heart,
  Star,
  Diamond,
  Sun,
  Moon,
  Crosshair,
  Cpu,
  Radio,
  Disc,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { DifficultyTier, MatchCard, MemoryGameResult } from '../types';
import { MATCH_CONFIGS, MATCH_SYMBOLS } from '../constants';
import { MemoryGameHUD } from './MemoryGameHUD';
import { sound } from '../../../utils/soundEngine';

interface MemoryMatchGameProps {
  difficulty: DifficultyTier;
  bestScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCompleteGame: (result: MemoryGameResult) => void;
  onExit: () => void;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  difficulty,
  bestScore,
  soundEnabled,
  onToggleSound,
  onCompleteGame,
  onExit,
}) => {
  const config = MATCH_CONFIGS[difficulty];

  const [cards, setCards] = useState<MatchCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [pairsMatched, setPairsMatched] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Timer ref
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Icon component mapper
  const renderSymbolIcon = (symbol: string, color: string) => {
    const iconProps = { className: 'w-7 h-7 sm:w-8 sm:h-8', style: { color } };
    switch (symbol) {
      case 'zap':
        return <Zap {...iconProps} />;
      case 'shield':
        return <Shield {...iconProps} />;
      case 'flame':
        return <Flame {...iconProps} />;
      case 'heart':
        return <Heart {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      case 'diamond':
        return <Diamond {...iconProps} />;
      case 'sun':
        return <Sun {...iconProps} />;
      case 'moon':
        return <Moon {...iconProps} />;
      case 'crosshair':
        return <Crosshair {...iconProps} />;
      case 'cpu':
        return <Cpu {...iconProps} />;
      case 'radio':
        return <Radio {...iconProps} />;
      case 'disc':
      default:
        return <Disc {...iconProps} />;
    }
  };

  // Generate randomized card deck
  const initializeBoard = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setElapsedSeconds(0);
    setMoves(0);
    setPairsMatched(0);
    setFlippedIndices([]);
    setIsEvaluating(false);
    setIsCompleted(false);

    // Pick config.totalPairs symbols from MATCH_SYMBOLS
    const shuffledSymbols = [...MATCH_SYMBOLS].sort(() => Math.random() - 0.5);
    const selectedSymbols = shuffledSymbols.slice(0, config.totalPairs);

    // Create 2 cards per symbol
    const deck: MatchCard[] = [];
    selectedSymbols.forEach((sym, pairIdx) => {
      // First card
      deck.push({
        id: `card-${pairIdx}-a`,
        pairId: pairIdx,
        symbol: sym.symbol,
        label: sym.label,
        color: sym.color,
        isFlipped: false,
        isMatched: false,
      });
      // Second card
      deck.push({
        id: `card-${pairIdx}-b`,
        pairId: pairIdx,
        symbol: sym.symbol,
        label: sym.label,
        color: sym.color,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);

    // Start elapsed timer
    timerIntervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        setElapsedSeconds((prev) => prev + 1);
      }
    }, 1000);
  }, [config.totalPairs]);

  useEffect(() => {
    isMountedRef.current = true;
    initializeBoard();

    return () => {
      isMountedRef.current = false;
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [difficulty, initializeBoard]);

  // Handle card click
  const handleCardClick = (cardIndex: number) => {
    if (isEvaluating || isCompleted) return;

    const targetCard = cards[cardIndex];
    if (!targetCard || targetCard.isMatched || targetCard.isFlipped) return;
    if (flippedIndices.includes(cardIndex)) return;

    sound.playHoverChirp();

    const newFlipped = [...flippedIndices, cardIndex];

    // Flip card face-up
    setCards((prev) =>
      prev.map((c, idx) => (idx === cardIndex ? { ...c, isFlipped: true } : c))
    );
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      // Completed 1 move (two cards selected)
      setIsEvaluating(true);
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      const [firstIdx, secondIdx] = newFlipped;
      const cardA = cards[firstIdx];
      const cardB = targetCard;

      if (cardA.pairId === cardB.pairId) {
        // MATCH!
        sound.playMatchChime();

        setTimeout(() => {
          if (!isMountedRef.current) return;

          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );
          setFlippedIndices([]);
          setIsEvaluating(false);

          const nextPairs = pairsMatched + 1;
          setPairsMatched(nextPairs);

          // Check if board complete
          if (nextPairs === config.totalPairs) {
            handleGameCompletion(nextMoves, elapsedSeconds);
          }
        }, 400);
      } else {
        // MISMATCH!
        setTimeout(() => {
          if (!isMountedRef.current) return;

          sound.playInvalid();
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
          setIsEvaluating(false);
        }, 850);
      }
    }
  };

  // Completion calculation
  const handleGameCompletion = (finalMoves: number, finalTime: number) => {
    setIsCompleted(true);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    sound.playLevelVictory();

    // Deterministic score: (pairs * 250) - (extraMoves * 15) - (time * 2.5)
    const basePoints = config.totalPairs * 250;
    const extraMoves = Math.max(0, finalMoves - config.totalPairs);
    const penalty = extraMoves * 15 + Math.floor(finalTime * 2.5);
    const calculatedScore = Math.max(10, basePoints - penalty);

    const efficiency = Math.round(
      (config.totalPairs / Math.max(1, finalMoves)) * 100
    );

    const finalResult: MemoryGameResult = {
      mode: 'match',
      difficulty,
      score: calculatedScore,
      isNewRecord: calculatedScore > bestScore,
      previousBest: bestScore,
      metrics: {
        pairsMatched: config.totalPairs,
        totalPairs: config.totalPairs,
        moves: finalMoves,
        elapsedSeconds: finalTime,
        efficiencyPercent: efficiency,
      },
      completedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      if (isMountedRef.current) {
        onCompleteGame(finalResult);
      }
    }, 1200);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between selection:bg-lime-500 selection:text-slate-950">
      <MemoryGameHUD
        mode="match"
        difficulty={difficulty}
        round={1}
        score={Math.max(0, pairsMatched * 200 - moves * 10)}
        bestScore={bestScore}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onRestart={initializeBoard}
        onExit={onExit}
        pairsFound={pairsMatched}
        totalPairs={config.totalPairs}
        moves={moves}
        elapsedSeconds={elapsedSeconds}
        statusBadge={`${pairsMatched}/${config.totalPairs} PAIRS FOUND`}
      />

      <main className="w-full max-w-4xl mx-auto px-4 py-6 flex-1 flex flex-col items-center justify-center">
        {/* Progress & Stat Pill */}
        <div className="w-full max-w-md flex items-center justify-between px-4 py-2 mb-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-slate-500 uppercase">MOVES:</span>
            <span className="text-white font-black">{moves}</span>
          </div>

          <div className="flex items-center gap-1.5 text-lime-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {pairsMatched} of {config.totalPairs} Pairs
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-bold">
              {Math.floor(elapsedSeconds / 60)}:
              {elapsedSeconds % 60 < 10 ? '0' : ''}
              {elapsedSeconds % 60}
            </span>
          </div>
        </div>

        {/* Card Grid */}
        <div
          className={`grid gap-2.5 sm:gap-3.5 w-full mx-auto justify-center select-none ${config.gridClass}`}
        >
          {cards.map((card, idx) => {
            const isRevealed = card.isFlipped || card.isMatched;

            return (
              <button
                key={card.id}
                type="button"
                disabled={card.isMatched || isEvaluating}
                onClick={() => handleCardClick(idx)}
                className={`
                  relative aspect-[3/4] sm:aspect-square rounded-2xl border-2 flex flex-col items-center justify-center
                  transition-all duration-300 cursor-pointer p-2
                  ${
                    card.isMatched
                      ? 'bg-slate-950/90 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)] opacity-95 scale-[0.98]'
                      : isRevealed
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(0,245,255,0.4)] scale-100'
                      : 'bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md hover:scale-[1.02] active:scale-95'
                  }
                `}
                aria-label={
                  isRevealed ? `${card.label} card` : `Hidden card ${idx + 1}`
                }
              >
                {isRevealed ? (
                  <div className="flex flex-col items-center justify-center gap-1 animate-fade-in">
                    {renderSymbolIcon(card.symbol, card.color)}
                    <span
                      className="text-[10px] sm:text-xs font-mono font-bold tracking-tight mt-1"
                      style={{ color: card.color }}
                    >
                      {card.label}
                    </span>
                  </div>
                ) : (
                  /* Cyber Card Back */
                  <div className="w-full h-full rounded-xl border border-dashed border-slate-800/80 flex flex-col items-center justify-center p-1 group-hover:border-slate-700">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-600 font-mono text-[10px]">
                      ?
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
