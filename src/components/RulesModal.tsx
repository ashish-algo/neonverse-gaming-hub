import React from 'react';
import { X, CheckCircle2, Flame, Award, Layers } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl flex flex-col gap-5 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-bold">
              ?
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide">HOW TO PLAY & SCORE</h2>
              <p className="text-xs text-slate-400">Tic Tac Toe Unlimited Mechanics</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rule 1: Every 3-in-a-row is 1 point */}
        <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <h3>1. The 3-in-a-Row Scoring Rule</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Whenever a player completes any group of 3 consecutive identical symbols (horizontally, vertically, or diagonally), they instantly earn <strong>1 Point</strong> and a permanent neon strike-through line is drawn across those 3 cells.
          </p>
          {/* Visual Mini Diagram */}
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-400/80 text-cyan-400 font-black flex items-center justify-center text-sm shadow-[0_0_8px_rgba(0,240,255,0.4)]">X</div>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-400/80 text-cyan-400 font-black flex items-center justify-center text-sm shadow-[0_0_8px_rgba(0,240,255,0.4)]">X</div>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-400/80 text-cyan-400 font-black flex items-center justify-center text-sm shadow-[0_0_8px_rgba(0,240,255,0.4)]">X</div>
            <span className="text-slate-500 font-bold mx-2">=</span>
            <span className="text-xs font-black text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-1 rounded-md">
              +1 POINT
            </span>
          </div>
        </div>

        {/* Rule 2: Overlapping Sequences */}
        <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-sm mb-2">
            <Layers className="w-4 h-4" />
            <h3>2. Overlapping Sequences & Combos</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Longer continuous lines contain multiple distinct 3-cell windows:
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside mb-3">
            <li><strong>3 symbols in a line</strong> = 1 point</li>
            <li><strong>4 symbols in a line</strong> = 2 points (Cells 1-2-3 and Cells 2-3-4)</li>
            <li><strong>5 symbols in a line</strong> = 3 points (Cells 1-2-3, 2-3-4, and 3-4-5)</li>
          </ul>
          {/* 5 in a row diagram */}
          <div className="flex flex-col items-center gap-1.5 py-2.5 px-3 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-7 h-7 rounded-md bg-slate-800 border border-pink-500/50 text-pink-400 font-black flex items-center justify-center text-xs">O₁</span>
              <span className="w-7 h-7 rounded-md bg-slate-800 border border-pink-500/50 text-pink-400 font-black flex items-center justify-center text-xs">O₂</span>
              <span className="w-7 h-7 rounded-md bg-slate-800 border border-pink-500/50 text-pink-400 font-black flex items-center justify-center text-xs">O₃</span>
              <span className="w-7 h-7 rounded-md bg-slate-800 border border-pink-500/50 text-pink-400 font-black flex items-center justify-center text-xs">O₄</span>
              <span className="w-7 h-7 rounded-md bg-slate-800 border border-pink-500/50 text-pink-400 font-black flex items-center justify-center text-xs">O₅</span>
            </div>
            <div className="text-[11px] text-amber-300 font-bold mt-1">
              3 overlapping triplets = 3 POINTS for O!
            </div>
          </div>
        </div>

        {/* Rule 3: Cross Intersections */}
        <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
            <Flame className="w-4 h-4" />
            <h3>3. Multi-Line Intersection Moves</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Placing a single symbol that simultaneously completes triplets in two or more directions (e.g. horizontal + vertical + diagonal) awards points for <strong>every newly completed group</strong> at once!
          </p>
        </div>

        {/* Rule 4: Board Played Until 100% Full */}
        <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-2">
            <Award className="w-4 h-4" />
            <h3>4. Unlimited Gameplay Until Board is Full</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The game <strong>never ends early</strong>. You keep battling for territory and points until all N × N cells are filled. The player with the highest total score wins!
          </p>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm tracking-wider transition-colors shadow-lg shadow-cyan-950/50 cursor-pointer"
        >
          GOT IT, LET'S PLAY!
        </button>
      </div>
    </div>
  );
};
