import React from 'react';
import { X, Award, Sparkles, Zap, Triangle, Square, Crown, Shield, CheckCircle2 } from 'lucide-react';
import { ACHIEVEMENTS } from '../constants';
import { ShapeHunterSaveData } from '../types';
import { sound } from '../../../utils/soundEngine';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  saveData: ShapeHunterSaveData;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  saveData,
}) => {
  if (!isOpen) return null;

  const renderIcon = (iconName: string, isUnlocked: boolean) => {
    const className = `w-6 h-6 ${isUnlocked ? 'text-amber-400' : 'text-slate-600'}`;
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Triangle':
        return <Triangle className={className} />;
      case 'Square':
        return <Square className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      case 'Award':
      default:
        return <Award className={className} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl hud-corner">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-white font-mono tracking-wide">
              SHAPE HUNTER ACHIEVEMENTS
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playCyberBlip();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Achievements */}
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = saveData.unlockedAchievements.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  {renderIcon(ach.iconName, isUnlocked)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-black tracking-wide ${
                        isUnlocked ? 'text-amber-300' : 'text-slate-400'
                      }`}
                    >
                      {ach.title}
                    </span>
                    {isUnlocked && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 leading-snug mt-0.5">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>
            UNLOCKED: {saveData.unlockedAchievements.length} / {ACHIEVEMENTS.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
