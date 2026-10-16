import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Check,
  X,
  Volume2,
  VolumeX,
  ChevronRight,
  Zap,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { NumberCard, RangeOption } from '../types';
import { sound } from '../../../utils/soundEngine';

interface NumberCardViewProps {
  card: NumberCard;
  cardIndex: number;
  totalCards: number;
  selectedRange: RangeOption;
  answers: (boolean | null)[];
  cards: NumberCard[];
  onAnswer: (answer: boolean) => void;
  onPreviousCard?: () => void;
  onJumpToCard?: (index: number) => void;
  canGoBack: boolean;
  onRestart: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

// Distinct futuristic cyberpunk color theme per card index
const CARD_THEMES = [
  {
    name: 'ELECTRIC CYAN',
    tag: 'MATRIX CIPHER 01',
    primary: 'text-cyan-400',
    border: 'border-cyan-500/60',
    borderActive: 'border-cyan-400',
    glow: 'shadow-[0_0_45px_rgba(0,245,255,0.28)]',
    cornerColor: '#00F5FF',
    beamGradient: 'from-transparent via-cyan-400 to-transparent',
    accentBg: 'bg-cyan-950/60',
    watermark: '01',
  },
  {
    name: 'HOT MAGENTA',
    tag: 'MATRIX CIPHER 02',
    primary: 'text-pink-400',
    border: 'border-pink-500/60',
    borderActive: 'border-pink-400',
    glow: 'shadow-[0_0_45px_rgba(255,45,170,0.28)]',
    cornerColor: '#FF2DAA',
    beamGradient: 'from-transparent via-pink-400 to-transparent',
    accentBg: 'bg-pink-950/60',
    watermark: '02',
  },
  {
    name: 'ELECTRIC PURPLE',
    tag: 'MATRIX CIPHER 03',
    primary: 'text-purple-400',
    border: 'border-purple-500/60',
    borderActive: 'border-purple-400',
    glow: 'shadow-[0_0_45px_rgba(139,92,246,0.28)]',
    cornerColor: '#8B5CF6',
    beamGradient: 'from-transparent via-purple-400 to-transparent',
    accentBg: 'bg-purple-950/60',
    watermark: '03',
  },
  {
    name: 'ACID LIME',
    tag: 'MATRIX CIPHER 04',
    primary: 'text-lime-400',
    border: 'border-lime-500/60',
    borderActive: 'border-lime-400',
    glow: 'shadow-[0_0_45px_rgba(199,255,77,0.28)]',
    cornerColor: '#C7FF4D',
    beamGradient: 'from-transparent via-lime-400 to-transparent',
    accentBg: 'bg-lime-950/60',
    watermark: '04',
  },
  {
    name: 'CYBER AMBER',
    tag: 'MATRIX CIPHER 05',
    primary: 'text-amber-400',
    border: 'border-amber-500/60',
    borderActive: 'border-amber-400',
    glow: 'shadow-[0_0_45px_rgba(251,191,36,0.28)]',
    cornerColor: '#F59E0B',
    beamGradient: 'from-transparent via-amber-400 to-transparent',
    accentBg: 'bg-amber-950/60',
    watermark: '05',
  },
  {
    name: 'NEON CORAL',
    tag: 'MATRIX CIPHER 06',
    primary: 'text-rose-400',
    border: 'border-rose-500/60',
    borderActive: 'border-rose-400',
    glow: 'shadow-[0_0_45px_rgba(244,63,94,0.28)]',
    cornerColor: '#F43F5E',
    beamGradient: 'from-transparent via-rose-400 to-transparent',
    accentBg: 'bg-rose-950/60',
    watermark: '06',
  },
  {
    name: 'ICE BLUE',
    tag: 'MATRIX CIPHER 07',
    primary: 'text-sky-400',
    border: 'border-sky-500/60',
    borderActive: 'border-sky-400',
    glow: 'shadow-[0_0_45px_rgba(56,189,248,0.28)]',
    cornerColor: '#38BDF8',
    beamGradient: 'from-transparent via-sky-400 to-transparent',
    accentBg: 'bg-sky-950/60',
    watermark: '07',
  },
  {
    name: 'NEON EMERALD',
    tag: 'MATRIX CIPHER 08',
    primary: 'text-emerald-400',
    border: 'border-emerald-500/60',
    borderActive: 'border-emerald-400',
    glow: 'shadow-[0_0_45px_rgba(16,185,129,0.28)]',
    cornerColor: '#10B981',
    beamGradient: 'from-transparent via-emerald-400 to-transparent',
    accentBg: 'bg-emerald-950/60',
    watermark: '08',
  },
  {
    name: 'ULTRA VIOLET',
    tag: 'MATRIX CIPHER 09',
    primary: 'text-violet-400',
    border: 'border-violet-500/60',
    borderActive: 'border-violet-400',
    glow: 'shadow-[0_0_45px_rgba(168,85,247,0.28)]',
    cornerColor: '#A855F7',
    beamGradient: 'from-transparent via-violet-400 to-transparent',
    accentBg: 'bg-violet-950/60',
    watermark: '09',
  },
];

// Quantum particle scatter trajectories for 3D de-materialization
const QUANTUM_PARTICLES = [
  { tx: '-140px', ty: '-100px', size: 6, delay: 0 },
  { tx: '130px', ty: '-120px', size: 8, delay: 20 },
  { tx: '-160px', ty: '70px', size: 7, delay: 40 },
  { tx: '150px', ty: '90px', size: 5, delay: 10 },
  { tx: '-70px', ty: '-150px', size: 9, delay: 30 },
  { tx: '80px', ty: '-140px', size: 6, delay: 50 },
  { tx: '-90px', ty: '140px', size: 8, delay: 20 },
  { tx: '100px', ty: '130px', size: 6, delay: 40 },
  { tx: '0px', ty: '-170px', size: 7, delay: 10 },
  { tx: '-170px', ty: '0px', size: 8, delay: 30 },
  { tx: '170px', ty: '0px', size: 7, delay: 20 },
  { tx: '0px', ty: '160px', size: 9, delay: 50 },
];

export const NumberCardView: React.FC<NumberCardViewProps> = ({
  card,
  cardIndex,
  totalCards,
  selectedRange,
  answers,
  cards,
  onAnswer,
  onPreviousCard,
  onJumpToCard,
  canGoBack,
  onRestart,
  soundEnabled,
  onToggleSound,
}) => {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDematerializing, setIsDematerializing] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const theme = CARD_THEMES[cardIndex % CARD_THEMES.length];

  // Sound and quantum entrance trigger on each card transition
  useEffect(() => {
    sound.playMaterialize(cardIndex);
    const lockTimer = setTimeout(() => {
      sound.playCardLock();
    }, 180);

    setIsDematerializing(false);
    setShowParticles(false);
    setFeedback(null);
    setIsProcessing(false);

    return () => clearTimeout(lockTimer);
  }, [cardIndex]);

  const percentProgress = Math.round(((cardIndex + 1) / totalCards) * 100);

  const handleSelect = (answer: boolean) => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (answer) {
      sound.playYesSound();
      setFeedback('yes');
    } else {
      sound.playNoSound();
      setFeedback('no');
    }

    // Trigger futuristic 3D de-materialization animation
    setTimeout(() => {
      sound.playDematerialize();
      setIsDematerializing(true);
      setShowParticles(true);
    }, 90);

    // After quantum disintegration completes (300ms), advance to next card
    setTimeout(() => {
      onAnswer(answer);
    }, 320);
  };

  const handleBack = () => {
    if (isProcessing || !onPreviousCard || !canGoBack) return;
    setIsProcessing(true);

    sound.playDematerialize();
    setIsDematerializing(true);
    setShowParticles(true);

    setTimeout(() => {
      onPreviousCard();
    }, 280);
  };

  // Determine grid columns based on number count
  const numCount = card.numbers.length;
  const gridColClass =
    numCount <= 16
      ? 'grid-cols-4 sm:grid-cols-4'
      : numCount <= 32
      ? 'grid-cols-4 sm:grid-cols-8'
      : numCount <= 64
      ? 'grid-cols-6 sm:grid-cols-8 md:grid-cols-10'
      : 'grid-cols-6 sm:grid-cols-10 md:grid-cols-12';

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col items-center select-none">
      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          {canGoBack && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleBack}
              onMouseEnter={() => sound.playHoverChirp()}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 font-mono text-[11px] font-bold cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>PREV CARD</span>
            </button>
          )}

          <button
            type="button"
            disabled={isProcessing}
            onClick={onRestart}
            onMouseEnter={() => sound.playHoverChirp()}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 font-mono text-[11px] font-bold cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">RESTART</span>
          </button>
        </div>

        {/* Center Progress Pill with animated step indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3.5 py-1 rounded-full bg-slate-950/90 border ${theme.border} text-[11px] sm:text-xs font-mono font-black ${theme.primary} shadow-lg flex items-center gap-2 transition-all`}
          >
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: theme.cornerColor }}
            />
            <span>CARD {cardIndex + 1} OF {totalCards}</span>
            <span className="text-[10px] opacity-75 font-normal hidden sm:inline">
              ({theme.tag})
            </span>
          </span>
        </div>

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          onMouseEnter={() => sound.playHoverChirp()}
          title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>
      </div>

      {/* Interactive Breadcrumb Tracker */}
      <div className="w-full flex items-center justify-between gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {cards.map((c, idx) => {
          const ans = answers[idx];
          const isCurrent = idx === cardIndex;
          const isPast = ans !== null && ans !== undefined;
          const cardTheme = CARD_THEMES[idx % CARD_THEMES.length];

          return (
            <button
              key={c.cardIndex}
              type="button"
              disabled={!isPast && !isCurrent}
              onClick={() => {
                if (isPast && onJumpToCard && !isProcessing) {
                  sound.playButtonClick();
                  onJumpToCard(idx);
                }
              }}
              title={
                isPast
                  ? `Card ${idx + 1}: answered ${ans ? 'YES' : 'NO'}. Click to review.`
                  : isCurrent
                  ? `Card ${idx + 1}: Currently scanning`
                  : `Card ${idx + 1}: Upcoming`
              }
              className={`flex-1 min-w-[52px] py-1.5 px-2 rounded-xl border text-[10px] font-mono font-bold flex flex-col items-center justify-center transition-all ${
                isCurrent
                  ? `bg-slate-900 border-2 ${cardTheme.borderActive} ${cardTheme.primary} ${cardTheme.glow} scale-105 z-10`
                  : ans === true
                  ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/60 cursor-pointer'
                  : ans === false
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 hover:bg-rose-900/60 cursor-pointer'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-default'
              }`}
            >
              <span className="text-[9px] uppercase tracking-wider opacity-75">
                C{idx + 1}
              </span>
              <span className="font-mono font-black truncate">
                {isCurrent ? (
                  <span className="flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 animate-pulse" />
                    SCAN
                  </span>
                ) : ans === true ? (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    YES
                  </span>
                ) : ans === false ? (
                  <span className="text-rose-400 flex items-center gap-0.5">
                    <X className="w-2.5 h-2.5 stroke-[3]" />
                    NO
                  </span>
                ) : (
                  <span>---</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress Bar with theme-reactive gradient */}
      <div className="w-full bg-slate-900/80 rounded-full h-1.5 overflow-hidden border border-slate-800 mb-4">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
          style={{ width: `${percentProgress}%` }}
        />
      </div>

      {/* 3D Holo-Deck Stage with Quantum De-materialization */}
      <div className="relative w-full [perspective:1200px]">
        {/* Background Quantum Shockwave Ring on Re-materialization */}
        <div
          key={`shockwave-${cardIndex}`}
          className="absolute inset-0 rounded-3xl border-2 pointer-events-none z-0 animate-quantum-shockwave"
          style={{ borderColor: theme.cornerColor }}
        />

        {/* Animated Target Acquisition Corner Brackets */}
        <div
          key={`brackets-${cardIndex}`}
          className="absolute -inset-2.5 pointer-events-none z-20 animate-bracket-lock"
        >
          <div
            className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-xl shadow-sm transition-all"
            style={{ borderColor: theme.cornerColor }}
          />
          <div
            className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-xl shadow-sm transition-all"
            style={{ borderColor: theme.cornerColor }}
          />
          <div
            className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-xl shadow-sm transition-all"
            style={{ borderColor: theme.cornerColor }}
          />
          <div
            className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-xl shadow-sm transition-all"
            style={{ borderColor: theme.cornerColor }}
          />
        </div>

        {/* Floating Quantum Particle Disintegration Burst */}
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
            {QUANTUM_PARTICLES.map((p, i) => (
              <div
                key={i}
                style={
                  {
                    '--tx': p.tx,
                    '--ty': p.ty,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    animationDelay: `${p.delay}ms`,
                    backgroundColor: i % 2 === 0 ? theme.cornerColor : '#00F5FF',
                    boxShadow: `0 0 12px ${theme.cornerColor}`,
                  } as React.CSSProperties
                }
                className="absolute rounded-sm animate-quantum-particle"
              />
            ))}
          </div>
        )}

        {/* Main 3D Card Body with Quantum De-materialization & Materialization */}
        <div
          key={`quantum-card-${cardIndex}`}
          className={`relative w-full rounded-3xl bg-slate-950/95 border-2 ${theme.border} ${theme.glow} p-5 sm:p-8 flex flex-col justify-between mb-5 overflow-hidden transition-all shadow-2xl [transform-style:preserve-3d] ${
            isDematerializing
              ? 'animate-quantum-dematerialize pointer-events-none'
              : 'animate-quantum-materialize'
          }`}
        >
          {/* Sweeping Holographic Assembly Lattice Mesh */}
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            <div
              className={`absolute inset-x-0 h-10 bg-gradient-to-b ${theme.beamGradient} opacity-60 animate-quantum-lattice`}
            />
            {/* Holographic Wireframe scanline */}
            <div
              className="absolute inset-x-0 h-0.5 bg-white shadow-[0_0_15px_#fff] animate-quantum-lattice"
            />
          </div>

          {/* Large Stylized Background Watermark */}
          <div
            className="absolute right-4 bottom-2 text-7xl sm:text-9xl font-black font-mono select-none pointer-events-none opacity-5 tracking-tighter"
            style={{ color: theme.cornerColor }}
          >
            {theme.watermark}
          </div>

          {/* Central Holographic Registration Stamp (Appears instantly on YES/NO click) */}
          {feedback && (
            <div className="absolute inset-x-4 top-4 z-40 p-3 rounded-2xl backdrop-blur-xl border flex items-center justify-center gap-2 animate-pop-in shadow-2xl">
              {feedback === 'yes' ? (
                <div className="w-full flex items-center justify-between px-3.5 py-1.5 bg-emerald-950/95 border border-emerald-400/80 rounded-xl text-emerald-200 text-xs sm:text-sm font-mono font-bold shadow-[0_0_25px_rgba(52,211,153,0.6)]">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    <span>MIND MATRIX: <strong className="text-emerald-300">YES (FOUND)</strong></span>
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono tracking-widest uppercase flex items-center gap-1">
                    DE-MATERIALIZING <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </span>
                </div>
              ) : (
                <div className="w-full flex items-center justify-between px-3.5 py-1.5 bg-rose-950/95 border border-rose-500/80 rounded-xl text-rose-200 text-xs sm:text-sm font-mono font-bold shadow-[0_0_25px_rgba(244,63,94,0.6)]">
                  <span className="flex items-center gap-2">
                    <X className="w-4 h-4 text-rose-400 stroke-[3]" />
                    <span>MIND MATRIX: <strong className="text-rose-300">NO (NOT FOUND)</strong></span>
                  </span>
                  <span className="text-[10px] text-rose-300 font-mono tracking-widest uppercase flex items-center gap-1">
                    DE-MATERIALIZING <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Card Header with prominent visual identifier */}
          <div className="flex flex-col items-center text-center mb-5 pb-4 border-b border-slate-800/80 relative z-10">
            {/* Top Eyebrow with Theme Color & Binary Bit Tag */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase mb-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm animate-pulse"
                style={{ backgroundColor: theme.cornerColor }}
              />
              <span className={theme.primary}>
                {theme.name} // CARD #{cardIndex + 1}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-mono text-[11px]">
                {theme.tag}
              </span>
            </div>

            <h3 className="text-xl sm:text-3xl font-black text-white tracking-wide mb-1 flex items-center justify-center gap-2">
              <span>IS YOUR NUMBER HERE?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              Examine the numbers below. If your chosen secret number is listed, click <strong className="text-emerald-400">YES</strong>. If not, click <strong className="text-rose-400">NO</strong>.
            </p>

            {/* Value Badge & Stats Bar */}
            <div className="mt-3 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-[10px] sm:text-xs font-mono text-slate-300 flex items-center gap-2.5 shadow-inner">
              <span className="text-slate-400 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                CIPHER DECK:
              </span>
              <span
                className="px-2.5 py-0.5 rounded-md border font-black font-mono shadow-sm tracking-wider"
                style={{
                  backgroundColor: `${theme.cornerColor}20`,
                  borderColor: `${theme.cornerColor}80`,
                  color: theme.cornerColor,
                }}
              >
                LAYER {cardIndex + 1}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-400" />
                CONTAINS <strong className="text-white">{card.numbers.length}</strong> NUMBERS
              </span>
            </div>
          </div>

          {/* Dynamic Number Grid with Staggered Entrance Visual */}
          <div className="relative w-full max-h-[46vh] sm:max-h-[50vh] overflow-y-auto pr-1 py-1 scrollbar-thin z-10">
            <div className={`grid ${gridColClass} gap-1.5 sm:gap-2 justify-center`}>
              {card.numbers.map((num, i) => (
                <div
                  key={`${cardIndex}-${num}`}
                  style={{
                    animationDelay: `${Math.min(i * 12, 180)}ms`,
                  }}
                  className="aspect-square sm:aspect-auto sm:py-2 px-1 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-slate-200 hover:text-white hover:bg-slate-800 transition-colors shadow-sm select-none animate-grid-cell-arrival"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Large Distinct Action Buttons: YES and NO */}
      <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 select-none">
        {/* NO Button */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => handleSelect(false)}
          onMouseEnter={() => sound.playHoverChirp()}
          className={`py-4 sm:py-5 px-4 rounded-2xl border-2 font-black tracking-widest text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
            feedback === 'no'
              ? 'bg-rose-500 text-white border-rose-300 scale-[0.98] shadow-[0_0_35px_rgba(244,63,94,0.8)]'
              : 'bg-slate-900/90 hover:bg-slate-850 text-rose-300 hover:text-rose-200 border-rose-500/40 hover:border-rose-400/80 hover:shadow-[0_0_25px_rgba(244,63,94,0.35)] hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <X className="w-5 h-5 stroke-[2.5]" />
          <span>{feedback === 'no' ? 'REGISTERED: NO' : "NO, IT'S NOT HERE"}</span>
        </button>

        {/* YES Button */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => handleSelect(true)}
          onMouseEnter={() => sound.playHoverChirp()}
          className={`py-4 sm:py-5 px-4 rounded-2xl border-2 font-black tracking-widest text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
            feedback === 'yes'
              ? 'bg-emerald-400 text-slate-950 border-emerald-200 scale-[0.98] shadow-[0_0_40px_rgba(52,211,153,0.9)]'
              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 border-emerald-400/60 hover:border-emerald-300 hover:shadow-[0_0_28px_rgba(52,211,153,0.45)] hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>{feedback === 'yes' ? 'REGISTERED: YES' : "YES, IT'S HERE"}</span>
        </button>
      </div>
    </div>
  );
};
