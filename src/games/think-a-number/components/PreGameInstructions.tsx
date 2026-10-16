import React from 'react';
import { ArrowLeft, Lock, Play, ShieldAlert, Sparkles, CheckCircle2, User } from 'lucide-react';
import { RangeOption } from '../types';
import { sound } from '../../../utils/soundEngine';

interface PreGameInstructionsProps {
  selectedRange: RangeOption;
  onConfirmAndStart: () => void;
  onBackToRange: () => void;
}

export const PreGameInstructions: React.FC<PreGameInstructionsProps> = ({
  selectedRange,
  onConfirmAndStart,
  onBackToRange,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center animate-fade-in select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => {
            sound.playButtonClick();
            onBackToRange();
          }}
          onMouseEnter={() => sound.playHoverChirp()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-pink-400 border border-slate-700/80 hover:border-pink-500/50 transition-all text-xs font-mono font-bold shadow-md cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>CHANGE RANGE</span>
        </button>

        <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
          RANGE: {selectedRange.label}
        </span>
      </div>

      {/* Cyber Lock Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-900/90 border-2 border-cyan-400/70 shadow-[0_0_35px_rgba(0,245,255,0.4)] flex items-center justify-center backdrop-blur-xl">
          <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 drop-shadow-[0_0_10px_#00F5FF]" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-ping" />
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wide mb-3">
        LOCK YOUR NUMBER IN YOUR MIND.
      </h2>

      {/* Instruction Box */}
      <div className="w-full p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl mb-8 flex flex-col gap-4 text-left">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Pick a secret whole number</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Think of any whole number from <strong className="text-cyan-400">{selectedRange.min}</strong> to{' '}
              <strong className="text-cyan-400">{selectedRange.max}</strong>. Keep it secret in your head! I will never ask you to type it or say it out loud.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 pt-4 border-t border-slate-800/80">
          <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/30 shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Answer honestly for each card</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              You will be shown <strong className="text-pink-400">{selectedRange.cardCount} cards</strong>. On every card, simply click{' '}
              <strong className="text-emerald-400">YES</strong> if your number appears on it, or{' '}
              <strong className="text-rose-400">NO</strong> if it does not.
            </p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={() => {
          sound.playGameStart();
          onConfirmAndStart();
        }}
        onMouseEnter={() => sound.playHoverChirp()}
        className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-300 hover:to-pink-400 text-slate-950 font-black tracking-widest text-sm sm:text-base shadow-[0_0_35px_rgba(0,245,255,0.4)] transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group"
      >
        <Play className="w-5 h-5 fill-current group-hover:scale-125 transition-transform" />
        I HAVE MY NUMBER — START
      </button>
    </div>
  );
};
