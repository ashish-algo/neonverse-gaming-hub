import React, { useState } from 'react';
import { X, User, Check, Sparkles, Trophy, Gamepad2, Heart } from 'lucide-react';
import { PlayerProfile } from '../../types/hub';
import { AVATAR_COLORS } from '../../utils/hubStorage';
import { GAMES_REGISTRY } from '../../registry/gameRegistry';

interface PlayerProfileModalProps {
  isOpen: boolean;
  profile: PlayerProfile;
  onSaveProfile: (profile: PlayerProfile) => void;
  onClose: () => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  isOpen,
  profile,
  onSaveProfile,
  onClose,
}) => {
  const [name, setName] = useState(profile.displayName);
  const [selectedColor, setSelectedColor] = useState(profile.avatarColor);

  if (!isOpen) return null;

  const handleSave = () => {
    const finalName = name.trim() || 'PLAYER ONE';
    onSaveProfile({
      ...profile,
      displayName: finalName,
      avatarColor: selectedColor,
    });
    onClose();
  };

  const favoriteGameEntries = GAMES_REGISTRY.filter((g) =>
    profile.favoriteGames.includes(g.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl flex flex-col gap-5 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg border"
              style={{
                backgroundColor: `${selectedColor}20`,
                borderColor: selectedColor,
                color: selectedColor,
              }}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide">PILOT PROFILE</h2>
              <p className="text-xs text-slate-400">Local Player Preferences</p>
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

        {/* Display Name Field */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1.5">
            PILOT CALLSIGN
          </label>
          <input
            type="text"
            value={name}
            maxLength={18}
            onChange={(e) => setName(e.target.value)}
            placeholder="PLAYER ONE"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-sm font-bold text-white outline-none"
          />
        </div>

        {/* Avatar Color Picker */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">
            PILOT CORE COLOR
          </label>
          <div className="flex items-center gap-3">
            {AVATAR_COLORS.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full transition-transform flex items-center justify-center cursor-pointer ${
                    isSelected ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {isSelected && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Favorites Summary */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-pink-400">
              <Heart className="w-3.5 h-3.5 fill-pink-500" />
              BOOKMARKED GAMES ({favoriteGameEntries.length})
            </span>
          </div>
          {favoriteGameEntries.length === 0 ? (
            <p className="text-[11px] text-slate-500">
              No favorites saved yet. Click the star on any game card to bookmark it!
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {favoriteGameEntries.map((g) => (
                <span
                  key={g.id}
                  className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] font-mono font-bold text-slate-300"
                >
                  {g.title}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-md cursor-pointer"
          >
            SAVE PROFILE
          </button>
        </div>
      </div>
    </div>
  );
};
