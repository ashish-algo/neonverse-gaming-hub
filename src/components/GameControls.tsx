import React from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  HelpCircle,
  Home,
  RefreshCw,
} from 'lucide-react';

interface GameControlsProps {
  moveCount: number;
  filledCells: number;
  totalCells: number;
  soundEnabled: boolean;
  canUndo: boolean;
  onUndo: () => void;
  onToggleSound: () => void;
  onOpenRules: () => void;
  onRestart: () => void;
  onGoHome: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  moveCount,
  filledCells,
  totalCells,
  soundEnabled,
  canUndo,
  onUndo,
  onToggleSound,
  onOpenRules,
  onRestart,
  onGoHome,
}) => {
  const percentFilled = Math.round((filledCells / totalCells) * 100);
  const remainingCells = totalCells - filledCells;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-2.5 sm:gap-3 select-none mb-3">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-2 px-1">
        {/* Navigation / Exit */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onGoHome}
            title="Return to Home Menu"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            title="Restart Match"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] sm:text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <span className="text-slate-400">MOVE</span>
            <span className="font-bold text-white font-mono">{moveCount}</span>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] sm:text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <span className="text-slate-400">LEFT</span>
            <span className="font-bold text-cyan-300 font-mono">{remainingCells}</span>
          </div>
        </div>

        {/* Tool buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo Last Move"
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
              canUndo
                ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border-slate-700 cursor-pointer'
                : 'bg-slate-950/40 text-slate-600 border-slate-800/50 cursor-not-allowed opacity-50'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Undo</span>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenRules}
            title="Scoring Rules"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Board fill progress bar */}
      <div className="w-full bg-slate-900/60 rounded-full h-1.5 overflow-hidden border border-slate-800/60">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
          style={{ width: `${percentFilled}%` }}
        />
      </div>
    </div>
  );
};
