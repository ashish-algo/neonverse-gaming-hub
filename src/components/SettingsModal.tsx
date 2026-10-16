import React from 'react';
import { X, Volume2, VolumeX, Music, EyeOff, Sliders } from 'lucide-react';
import { GameSettings } from '../types/game';

interface SettingsModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl flex flex-col gap-5 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide">SETTINGS</h2>
              <p className="text-xs text-slate-400">Audio & Visual Preferences</p>
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

        {/* Setting Items */}
        <div className="flex flex-col gap-3.5">
          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-cyan-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <div>
                <div className="text-xs font-bold text-white">Sound Effects (SFX)</div>
                <div className="text-[11px] text-slate-400">Synthesizer moves, scoring & victory chimes</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.soundEnabled ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>

          {/* Volume Slider */}
          {settings.soundEnabled && (
            <div className="flex flex-col gap-1.5 px-3 py-2 bg-slate-950/40 rounded-xl border border-slate-800/60">
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                <span>SFX Volume</span>
                <span className="font-mono text-cyan-400">{Math.round(settings.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={settings.volume}
                onChange={(e) => onUpdateSettings({ ...settings, volume: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          )}

          {/* Ambient Music Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-3">
              <Music className={`w-5 h-5 ${settings.musicEnabled ? 'text-purple-400' : 'text-slate-500'}`} />
              <div>
                <div className="text-xs font-bold text-white">Ambient Synth Music</div>
                <div className="text-[11px] text-slate-400">Hypnotic procedural cyber soundtrack</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.musicEnabled ? 'bg-purple-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-3">
              <EyeOff className={`w-5 h-5 ${settings.reducedMotion ? 'text-amber-400' : 'text-slate-500'}`} />
              <div>
                <div className="text-xs font-bold text-white">Reduced Motion</div>
                <div className="text-[11px] text-slate-400">Disables celebratory confetti and intense motion</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.reducedMotion ? 'bg-amber-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs tracking-wider transition-colors"
        >
          SAVE & CLOSE
        </button>
      </div>
    </div>
  );
};
