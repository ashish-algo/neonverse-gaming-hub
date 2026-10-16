import React, { useState } from 'react';
import { ArrowLeft, Play, Grid, User, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { GameSettings } from '../types/game';
import { COLOR_PRESETS } from '../utils/storage';

interface GameSetupProps {
  initialSettings: GameSettings;
  onStartGame: (finalSettings: GameSettings) => void;
  onBackToHome: () => void;
}

const BOARD_SIZES = [
  { size: 3, label: '3×3', cells: 9, desc: 'Fast & Classic' },
  { size: 4, label: '4×4', cells: 16, desc: 'Tactical (Recommended)' },
  { size: 5, label: '5×5', cells: 25, desc: 'Strategic War' },
  { size: 6, label: '6×6', cells: 36, desc: 'Mega Grid' },
  { size: 7, label: '7×7', cells: 49, desc: 'Extreme Battle' },
  { size: 8, label: '8×8', cells: 64, desc: 'Unlimited Arena' },
];

export const GameSetup: React.FC<GameSetupProps> = ({
  initialSettings,
  onStartGame,
  onBackToHome,
}) => {
  const [boardSize, setBoardSize] = useState<number>(initialSettings.boardSize);
  const [p1Name, setP1Name] = useState<string>(initialSettings.player1.name);
  const [p2Name, setP2Name] = useState<string>(initialSettings.player2.name);
  const [p1Color, setP1Color] = useState<string>(initialSettings.player1.color);
  const [p2Color, setP2Color] = useState<string>(initialSettings.player2.color);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(initialSettings.soundEnabled);

  const p1Preset = COLOR_PRESETS.find((c) => c.color === p1Color) || COLOR_PRESETS[0];
  const p2Preset = COLOR_PRESETS.find((c) => c.color === p2Color) || COLOR_PRESETS[1];

  const handleStart = () => {
    const finalP1Name = p1Name.trim() || 'Player 1';
    const finalP2Name = p2Name.trim() || 'Player 2';

    const finalSettings: GameSettings = {
      ...initialSettings,
      boardSize,
      soundEnabled,
      player1: {
        ...initialSettings.player1,
        name: finalP1Name,
        color: p1Color,
        glowColor: p1Preset.glow,
      },
      player2: {
        ...initialSettings.player2,
        name: finalP2Name,
        color: p2Color,
        glowColor: p2Preset.glow,
      },
    };

    onStartGame(finalSettings);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6 animate-fade-in select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToHome}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400/60 text-[10px] font-mono font-black text-cyan-300 mb-1 shadow-[0_0_10px_rgba(0,245,255,0.3)]">
            <span>2 PLAYERS REQUIRED</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider">
            MATCH SETUP
          </h1>
          <p className="text-xs text-slate-400">Local 2-Player Pass & Play</p>
        </div>

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title="Toggle SFX"
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>
      </div>

      {/* Section 1: Board Size Selection */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 text-xs sm:text-sm font-bold tracking-wide">
            <Grid className="w-4 h-4" />
            <span>BOARD SIZE</span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {boardSize * boardSize} Total Cells
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
          {BOARD_SIZES.map((b) => {
            const isSelected = boardSize === b.size;
            return (
              <button
                key={b.size}
                type="button"
                onClick={() => setBoardSize(b.size)}
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] ring-1 ring-cyan-400 scale-[1.03]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <span
                  className={`text-base sm:text-lg font-black font-mono ${
                    isSelected ? 'text-cyan-300' : 'text-white'
                  }`}
                >
                  {b.label}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{b.cells} cells</span>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Grid Preview */}
        <div className="mt-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col items-center">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Live Grid Preview ({boardSize} × {boardSize})</span>
          </div>
          <div
            className="w-36 h-36 grid gap-1 p-2 rounded-xl bg-slate-900 border border-slate-800"
            style={{
              gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: boardSize * boardSize }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-sm bg-slate-800/60 border border-slate-700/40 flex items-center justify-center"
              >
                {idx === 0 && <span className="text-[9px] font-black" style={{ color: p1Color }}>X</span>}
                {idx === 1 && <span className="text-[9px] font-black" style={{ color: p2Color }}>O</span>}
                {idx === 2 && <span className="text-[9px] font-black" style={{ color: p1Color }}>X</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Players Configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Player 1 Card */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs border"
                style={{
                  backgroundColor: `${p1Color}20`,
                  borderColor: p1Color,
                  color: p1Color,
                }}
              >
                X
              </span>
              <span className="text-xs font-bold text-slate-300">PLAYER 1</span>
            </div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              Moves First
            </span>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Player Name</label>
            <input
              type="text"
              value={p1Name}
              maxLength={15}
              placeholder="Player 1"
              onChange={(e) => setP1Name(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-xs font-bold text-white outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1.5">Color Theme</label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setP1Color(preset.color)}
                  title={preset.name}
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                    p1Color === preset.color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: preset.color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Player 2 Card */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs border"
                style={{
                  backgroundColor: `${p2Color}20`,
                  borderColor: p2Color,
                  color: p2Color,
                }}
              >
                O
              </span>
              <span className="text-xs font-bold text-slate-300">PLAYER 2</span>
            </div>
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">
              Moves Second
            </span>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Player Name</label>
            <input
              type="text"
              value={p2Name}
              maxLength={15}
              placeholder="Player 2"
              onChange={(e) => setP2Name(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-pink-400 text-xs font-bold text-white outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1.5">Color Theme</label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setP2Color(preset.color)}
                  title={preset.name}
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                    p2Color === preset.color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: preset.color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Animated START GAME button */}
      <button
        type="button"
        onClick={handleStart}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-300 hover:to-pink-400 text-slate-950 font-black tracking-widest text-base shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
      >
        <Play className="w-5 h-5 fill-current" />
        START GAME
      </button>
    </div>
  );
};
