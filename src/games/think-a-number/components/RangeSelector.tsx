import React from 'react';
import { ArrowLeft, Sparkles, ChevronRight, Layers, HelpCircle } from 'lucide-react';
import { RangeOption } from '../types';
import { RANGE_OPTIONS } from '../engine/mathEngine';
import { sound } from '../../../utils/soundEngine';

interface RangeSelectorProps {
  onSelectRange: (range: RangeOption) => void;
  onBack: () => void;
}

export const RangeSelector: React.FC<RangeSelectorProps> = ({ onSelectRange, onBack }) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center animate-fade-in select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => {
            sound.playButtonClick();
            onBack();
          }}
          onMouseEnter={() => sound.playHoverChirp()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-pink-400 border border-slate-700/80 hover:border-pink-500/50 transition-all text-xs font-mono font-bold shadow-md cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>BACK</span>
        </button>

        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold">
          STAGE 01 // SELECT CAPACITY
        </span>
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-pink-500/40 text-[10px] font-mono font-bold text-pink-300 uppercase tracking-widest mb-3 shadow-[0_0_12px_rgba(255,45,170,0.3)]">
          <Sparkles className="w-3 h-3 text-pink-400" />
          <span>BINARY SPACE SELECTION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wide mb-2">
          HOW HIGH CAN YOU THINK?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Choose your number range. Bigger ranges require a few more cards, but the result is just as fast and magical!
        </p>
      </div>

      {/* Range Options Grid */}
      <div className="w-full flex flex-col gap-3.5 mb-6">
        {RANGE_OPTIONS.map((range) => (
          <button
            key={range.id}
            type="button"
            onClick={() => {
              sound.playCyberBlip();
              onSelectRange(range);
            }}
            onMouseEnter={() => sound.playHoverChirp()}
            className="w-full p-4 sm:p-5 rounded-2xl bg-slate-900/85 hover:bg-slate-900 border border-slate-800 hover:border-pink-500/70 transition-all duration-200 flex items-center justify-between shadow-lg hover:shadow-[0_0_25px_rgba(255,45,170,0.25)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer group text-left"
          >
            <div className="flex items-center gap-4">
              {/* Range badge */}
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center border font-mono shadow-sm group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: `${range.accentColor}18`,
                  borderColor: range.accentColor,
                  color: range.accentColor,
                  boxShadow: `0 0 15px ${range.accentColor}40`,
                }}
              >
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">
                  CARDS
                </span>
                <span className="text-xl sm:text-2xl font-black">{range.cardCount}</span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg sm:text-2xl font-black text-white font-mono group-hover:text-pink-300 transition-colors">
                    {range.label}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                    {range.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">{range.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 group-hover:text-pink-400 transition-colors pl-2">
              <span className="text-xs font-mono font-bold hidden sm:inline">SELECT</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
