import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RefreshCw,
  Sliders,
  ArrowLeft,
  AlertCircle,
  Brain,
} from 'lucide-react';
import { NumberCard, RangeOption } from '../types';
import { sound } from '../../../utils/soundEngine';

interface NumberRevealViewProps {
  guessedNumber: number;
  selectedRange: RangeOption;
  answers: (boolean | null)[];
  cards: NumberCard[];
  onPlayAgain: () => void;
  onChangeRange: () => void;
  onBackToHub: () => void;
  reducedMotion: boolean;
}

const FULL_REVEAL_TEXT =
  'There is no magic here, it is completely based on mathematical calculations of permutation.';

export const NumberRevealView: React.FC<NumberRevealViewProps> = ({
  guessedNumber,
  selectedRange,
  onPlayAgain,
  onChangeRange,
  onBackToHub,
  reducedMotion,
}) => {
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const isZeroError = guessedNumber === 0;

  // Typewriter letter-by-letter writing animation
  useEffect(() => {
    if (isZeroError) return;

    sound.playMagicReveal();

    if (!reducedMotion) {
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF2DAA', '#00F5FF', '#C7FF4D', '#8B5CF6', '#ffffff'],
        });
      } catch {}
    }

    let index = 0;
    setTypedText('');
    setIsTypingComplete(false);

    // Initial delay before typing commences
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < FULL_REVEAL_TEXT.length) {
          const char = FULL_REVEAL_TEXT[index];
          setTypedText((prev) => prev + char);
          index++;

          // Subtle audio micro-tick on letters
          if (char !== ' ' && index % 2 === 0) {
            sound.playTypewriterTick();
          }
        } else {
          clearInterval(interval);
          setIsTypingComplete(true);
        }
      }, 36);

      return () => clearInterval(interval);
    }, 400);

    return () => clearTimeout(startTimer);
  }, [guessedNumber, isZeroError, reducedMotion]);

  // Handle immediate skip/reveal on click
  const handleSkipTyping = () => {
    if (!isTypingComplete) {
      setTypedText(FULL_REVEAL_TEXT);
      setIsTypingComplete(true);
      sound.playCyberBlip();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center animate-fade-in select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => {
            sound.playButtonClick();
            onBackToHub();
          }}
          onMouseEnter={() => sound.playHoverChirp()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/80 hover:border-cyan-500/50 transition-all text-xs font-mono font-bold shadow-md cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>BACK TO HUB</span>
        </button>

        <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
          RANGE: {selectedRange.label}
        </span>
      </div>

      {/* Case 1: Result is 0 (All NO responses) */}
      {isZeroError ? (
        <div className="w-full p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-amber-500/50 shadow-2xl flex flex-col items-center mb-8 hud-corner">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-2">
            HMM... SOMETHING DOESN'T ADD UP!
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed mb-6">
            Your answers point to <strong className="text-amber-400 font-mono">0</strong>, but your selected range starts at{' '}
            <strong className="text-cyan-400 font-mono">1</strong>. You may have answered NO on a card where your secret number actually appeared!
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                sound.playButtonClick();
                onPlayAgain();
              }}
              onMouseEnter={() => sound.playHoverChirp()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black tracking-widest text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              TRY AGAIN
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playButtonClick();
                onChangeRange();
              }}
              onMouseEnter={() => sound.playHoverChirp()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold tracking-wider text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              CHANGE RANGE
            </button>
          </div>
        </div>
      ) : (
        /* Case 2: Success Reveal (> 0) */
        <div className="w-full flex flex-col items-center">
          {/* Magic Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-pink-500/50 text-[11px] font-mono font-black text-pink-300 uppercase tracking-widest mb-3 shadow-[0_0_20px_rgba(255,45,170,0.4)]">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>MIND SCAN DECODED</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wide mb-2">
            I'VE GOT YOUR NUMBER!
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-widest uppercase mb-6">
            YOU WERE THINKING OF...
          </p>

          {/* Large Glowing Neon Number Display */}
          <div className="relative mb-6">
            <div className="relative px-12 py-8 sm:px-16 sm:py-10 rounded-3xl bg-slate-950/90 border-2 border-pink-500/80 shadow-[0_0_60px_rgba(255,45,170,0.5),inset_0_0_30px_rgba(255,45,170,0.2)] backdrop-blur-2xl flex flex-col items-center justify-center hud-corner animate-pop-in">
              <span className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 font-mono drop-shadow-[0_0_35px_rgba(255,45,170,0.8)]">
                {guessedNumber}
              </span>
            </div>
          </div>

          {/* Letter-by-Letter Animated Reveal Quote Box */}
          <div
            onClick={handleSkipTyping}
            className="w-full mb-8 p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-950/90 via-slate-900/95 to-pink-950/90 border-2 border-pink-500/70 shadow-[0_0_40px_rgba(255,45,170,0.35)] flex flex-col items-center sm:items-start text-center sm:text-left hud-corner cursor-pointer group transition-all hover:border-pink-400 animate-pop-in"
            title={!isTypingComplete ? 'Click to show immediately' : undefined}
          >
            {/* Terminal Header */}
            <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div className="flex items-center gap-2 text-pink-400 font-mono text-xs font-bold uppercase tracking-widest">
                <Brain className="w-4 h-4 text-pink-400 animate-pulse" />
                <span>MIND PROTOCOL // THE REVEAL</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isTypingComplete ? 'bg-emerald-400' : 'bg-pink-400 animate-ping'
                  }`}
                />
                <span>{isTypingComplete ? 'SYSTEM READY' : 'TYPING...'}</span>
              </div>
            </div>

            {/* Letter-by-Letter Typewriter Quote */}
            <div className="w-full min-h-[4.5rem] sm:min-h-[3.8rem] flex items-center">
              <p className="text-base sm:text-xl font-black text-white italic tracking-wide leading-relaxed font-sans">
                <span className="text-pink-400 font-serif text-2xl mr-1 select-none">“</span>
                <span>{typedText}</span>
                {!isTypingComplete ? (
                  <span className="inline-block w-2 sm:w-2.5 h-4 sm:h-5 ml-1.5 bg-cyan-400 animate-pulse align-middle shadow-[0_0_10px_#00F5FF]" />
                ) : (
                  <span className="text-pink-400 font-serif text-2xl ml-1 select-none">”</span>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playGameStart();
                onPlayAgain();
              }}
              onMouseEnter={() => sound.playHoverChirp()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 hover:from-pink-400 hover:to-cyan-300 text-slate-950 font-black tracking-widest text-sm sm:text-base shadow-[0_0_35px_rgba(255,45,170,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              PLAY AGAIN (SAME RANGE)
            </button>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => {
                  sound.playButtonClick();
                  onChangeRange();
                }}
                onMouseEnter={() => sound.playHoverChirp()}
                className="py-3 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                CHANGE RANGE
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playButtonClick();
                  onBackToHub();
                }}
                onMouseEnter={() => sound.playHoverChirp()}
                className="py-3 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-pink-400" />
                BACK TO HUB
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
