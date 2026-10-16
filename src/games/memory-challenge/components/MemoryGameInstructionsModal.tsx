import React, { useState } from 'react';
import { X, Play, Info, Sparkles, Trophy, Zap, CheckCircle2 } from 'lucide-react';
import { DifficultyTier, MemoryMode } from '../types';
import { DIFFICULTY_TIERS, MEMORY_MODES } from '../constants';
import { sound } from '../../../utils/soundEngine';

interface MemoryGameInstructionsModalProps {
  isOpen: boolean;
  mode: MemoryMode;
  initialDifficulty: DifficultyTier;
  onClose: () => void;
  onStart: (chosenDifficulty: DifficultyTier) => void;
}

export const MemoryGameInstructionsModal: React.FC<MemoryGameInstructionsModalProps> = ({
  isOpen,
  mode,
  initialDifficulty,
  onClose,
  onStart,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyTier>(initialDifficulty);

  if (!isOpen) return null;

  const modeInfo = MEMORY_MODES[mode];

  const getInstructionsContent = () => {
    switch (mode) {
      case 'sequence':
        return {
          objective:
            'Watch the glowing neon tiles illuminate in sequence, memorize the exact order, and repeat it step-by-step. Each round adds a new tile to the sequence!',
          rules: [
            'Wait for the sequence to finish illuminating before pressing any tiles.',
            'Click or tap tiles in the exact order they appeared.',
            'Each successful sequence awards points and increases the sequence length by +1.',
            'A single incorrect press ends the run and reveals your final score and streak.',
          ],
          scoring:
            '+10 base points per completed round, +5 bonus points per step beyond initial length, plus streak multipliers.',
          controls: 'Click/Tap tiles directly, or press numbers [1–9] on your physical keyboard.',
        };

      case 'match':
        return {
          objective:
            'Uncover pairs of matching neon cards across the cyber matrix. Memorize card positions when revealed to clear the whole board in the fewest moves.',
          rules: [
            'Click any face-down card to reveal its cybernetic symbol.',
            'Click a second card to look for a matching partner.',
            'If they match, they stay permanently illuminated. If they mismatch, they flip back face-down after a brief glance.',
            'Clear all pairs on the board to complete the challenge.',
          ],
          scoring:
            'Points rewarded for matching speed and minimum move count. Score = (Pairs × 250) - (Extra Moves × 15) - (Seconds × 3). Never negative!',
          controls: 'Mouse click or touch tap on any face-down card to reveal.',
        };

      case 'pattern':
        return {
          objective:
            'A random arrangement of glowing cyber cells will flash onto the matrix. Memorize their spatial locations, and reproduce the pattern after it vanishes!',
          rules: [
            'Phase 1: Memorization. Watch the highlighted cells carefully during the countdown.',
            'Phase 2: Recall. The cells turn dark. Click the cells you remember being illuminated.',
            'Click "SUBMIT PATTERN" once you have made your choices.',
            'Full review reveals your correct picks, missed targets, and false positives.',
          ],
          scoring:
            '+50 points per correctly recalled cell, +150 bonus for 100% perfect pattern recall without mistakes.',
          controls: 'Click/Tap cells to toggle selection. Click Submit when done.',
        };

      case 'numbers':
        return {
          objective:
            'A high-intensity sequence of digits will appear on screen for a limited duration. Memorize the exact numbers and re-enter them with 100% precision!',
          rules: [
            'Watch the numbers during the countdown timer.',
            'When the timer expires, the digits hide completely.',
            'Enter the digits in their exact order using the cyber keypad or your physical keyboard.',
            'Leading zeros are strictly preserved (e.g., 0472).',
            'Press Enter or Submit to evaluate your recall.',
          ],
          scoring:
            '+100 points per successfully recalled sequence, plus +25 bonus per digit beyond 3. Consecutive streaks multiply your score!',
          controls: 'On-screen cyber keypad, or physical keyboard numbers (0–9), Backspace, and Enter.',
        };
    }
  };

  const content = getInstructionsContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl"
              style={{
                backgroundColor: `${modeInfo.accentColor}20`,
                color: modeInfo.accentColor,
              }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-black text-white tracking-wide">
                {modeInfo.name}
              </h2>
              <p className="text-xs font-mono text-slate-400">{modeInfo.tagline}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playButtonClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs">
          {/* Objective Box */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 leading-relaxed">
            <span className="text-cyan-400 font-bold block mb-1">OBJECTIVE:</span>
            {content.objective}
          </div>

          {/* Difficulty Tier Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              SELECT DIFFICULTY:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DIFFICULTY_TIERS.map((tier) => {
                const isSelected = selectedDifficulty === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      sound.playButtonClick();
                      setSelectedDifficulty(tier.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 shadow-md ring-1'
                        : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                    style={{
                      borderColor: isSelected ? tier.accentColor : undefined,
                      boxShadow: isSelected ? `0 0 15px ${tier.accentColor}30` : undefined,
                    }}
                  >
                    <span
                      className="text-xs font-black block tracking-wide"
                      style={{ color: tier.accentColor }}
                    >
                      {tier.label}
                    </span>
                    <span className="text-[10px] text-slate-500 line-clamp-1 block mt-0.5">
                      {tier.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rules List */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              RULES & MECHANICS:
            </span>
            <ul className="space-y-1.5 text-slate-300">
              {content.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Scoring & Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                SCORING
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">{content.scoring}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-purple-400 font-bold block mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                CONTROLS
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">{content.controls}</p>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playButtonClick();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-mono text-xs font-bold cursor-pointer transition-colors"
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playGameStart();
              onStart(selectedDifficulty);
            }}
            className="flex-1 px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-black tracking-wider uppercase shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Play className="w-4 h-4 fill-slate-950 transition-transform group-hover:scale-110" />
            <span>START GAME</span>
          </button>
        </div>
      </div>
    </div>
  );
};
