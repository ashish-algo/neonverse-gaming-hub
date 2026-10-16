import React from 'react';
import { ArrowLeft, Brain, Sparkles, Binary, CheckCircle2, Play } from 'lucide-react';
import { sound } from '../../../utils/soundEngine';

interface WelcomeScreenProps {
  onStart: () => void;
  onBackToHub: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onBackToHub }) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center animate-fade-in select-none">
      {/* Top Navigation */}
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

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/40 text-[11px] font-mono font-bold text-pink-300 shadow-[0_0_12px_rgba(255,45,170,0.3)]">
          <Brain className="w-3.5 h-3.5 text-pink-400" />
          <span>SINGLE PLAYER CHALLENGE</span>
        </div>
      </div>

      {/* Central Holographic Emblem */}
      <div className="relative mb-6">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-pink-500/20 via-purple-600/30 to-cyan-500/20 border-2 border-pink-500/60 shadow-[0_0_40px_rgba(255,45,170,0.4)] flex items-center justify-center backdrop-blur-xl">
          <Brain className="w-12 h-12 sm:w-14 sm:h-14 text-pink-400 drop-shadow-[0_0_15px_#FF2DAA] animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="inline-block px-3.5 py-1 rounded-full bg-slate-900/90 border border-pink-500/40 text-[10px] sm:text-xs font-mono font-black tracking-widest uppercase text-pink-300 mb-3 shadow-[0_0_15px_rgba(255,45,170,0.25)]">
        SINGLE PLAYER REQUIRED // MIND MATRIX
      </div>

      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
        THINK A NUMBER.{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 drop-shadow-[0_0_20px_rgba(255,45,170,0.5)]">
          I'LL GUESS IT.
        </span>
      </h1>

      <p className="text-sm sm:text-base text-slate-300 max-w-lg mb-8 leading-relaxed font-normal">
        Choose any whole number secretly in your head. Answer a few simple questions, and watch the system magically decode the exact number in your mind.
      </p>

      {/* 3 Step Instruction Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-10 text-left">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/40 transition-colors shadow-lg">
          <div className="w-7 h-7 rounded-xl bg-pink-500/20 border border-pink-400/50 flex items-center justify-center text-pink-400 text-xs font-black font-mono mb-2.5">
            01
          </div>
          <h4 className="text-xs font-bold text-white mb-1">Pick Your Number</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Lock any whole number within your chosen range in your mind. Never type it!
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-colors shadow-lg">
          <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-400 text-xs font-black font-mono mb-2.5">
            02
          </div>
          <h4 className="text-xs font-bold text-white mb-1">Answer Yes or No</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Scan each number card. Answer YES if your number appears on it, otherwise NO.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors shadow-lg">
          <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 text-xs font-black font-mono mb-2.5">
            03
          </div>
          <h4 className="text-xs font-bold text-white mb-1">Watch The Magic</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Witness the system reveal your exact number, and uncover the science behind it!
          </p>
        </div>
      </div>

      {/* Big Action Button */}
      <button
        type="button"
        onClick={() => {
          sound.playCyberBlip();
          onStart();
        }}
        onMouseEnter={() => sound.playHoverChirp()}
        className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 hover:from-pink-400 hover:to-cyan-300 text-slate-950 font-black tracking-widest text-base shadow-[0_0_35px_rgba(255,45,170,0.5)] transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group"
      >
        <Play className="w-5 h-5 fill-current group-hover:scale-125 transition-transform" />
        LET'S PLAY
      </button>
    </div>
  );
};
