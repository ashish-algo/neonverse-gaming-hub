import React, { useState } from 'react';
import {
  Gamepad2,
  Volume2,
  VolumeX,
  Search,
  Settings,
  User,
  Menu,
  X,
  Sparkles,
  Layers,
  RotateCcw,
  Zap,
  Activity,
} from 'lucide-react';
import { PlayerProfile } from '../../types/hub';
import { sound } from '../../utils/soundEngine';

interface NavbarProps {
  profile: PlayerProfile;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  soundEnabled,
  onToggleSound,
  onOpenProfile,
  onOpenSettings,
  onOpenSearch,
  onNavigateSection,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', label: 'Home', icon: Gamepad2 },
    { id: 'vault', label: 'The Vault', icon: Layers },
    { id: 'recent', label: 'Jack Back In', icon: RotateCcw },
  ];

  const handleNavClick = (id: string) => {
    sound.playCyberBlip();
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/90 border-b border-cyan-500/30 shadow-[0_4px_35px_rgba(0,0,0,0.9)]">
      {/* Top micro status bar */}
      <div className="w-full bg-slate-950/80 border-b border-slate-900 px-4 py-0.5 flex items-center justify-between text-[10px] font-mono text-slate-500 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            NODE_TOKYO // ONLINE
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-cyan-400/80">LATENCY: 0.8ms</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400 font-bold hidden md:inline">SYSTEM STATUS: OPTIMAL</span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-pink-400">ARCADE ENGINE v2.4</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Left: Brand Logo with Cyber Glitch & Emblem */}
        <div
          onClick={() => handleNavClick('hero')}
          onMouseEnter={() => sound.playHoverChirp()}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Animated Cyber Emblem */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-2xl bg-slate-900 border-2 border-cyan-400/60 shadow-[0_0_20px_rgba(0,245,255,0.4)] group-hover:shadow-[0_0_35px_rgba(0,245,255,0.8)] group-hover:border-cyan-300 transition-all">
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/25 to-pink-500/25 animate-pulse" />
            <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300 drop-shadow-[0_0_10px_#00F5FF]" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-lime-400" />
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-500 font-sans group-hover:animate-glitch transition-all">
                NEONVERSE
              </span>
              <span className="text-[10px] font-black tracking-widest text-cyan-300 px-1.5 py-0.5 bg-cyan-950/90 border border-cyan-400/50 rounded shadow-[0_0_10px_rgba(0,245,255,0.4)]">
                2099
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 tracking-widest font-mono uppercase hidden sm:block">
              ENTER THE GAME. DEFY THE ORDINARY.
            </p>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={() => sound.playHoverChirp()}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/90 border border-transparent hover:border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 shadow-[0_0_8px_#00F5FF]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Actions, Search, Live EQ Audio, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            onMouseEnter={() => sound.playHoverChirp()}
            title="Search Game Vault"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-md"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span className="hidden lg:inline text-slate-400 font-mono text-[11px]">SEARCH // VAULT</span>
          </button>

          {/* Sound Toggle with Live Equalizer Visualizer */}
          <button
            type="button"
            onClick={onToggleSound}
            onMouseEnter={() => sound.playHoverChirp()}
            title={soundEnabled ? 'Mute Sound FX' : 'Unmute Sound FX'}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400" />
                {/* Live Cyber Audio EQ bars */}
                <div className="flex items-end gap-0.5 h-3.5 w-3.5">
                  <span className="w-0.5 bg-cyan-400 rounded-full eq-bar-1" />
                  <span className="w-0.5 bg-purple-400 rounded-full eq-bar-2" />
                  <span className="w-0.5 bg-pink-400 rounded-full eq-bar-3" />
                  <span className="w-0.5 bg-lime-400 rounded-full eq-bar-4" />
                </div>
              </>
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            onMouseEnter={() => sound.playHoverChirp()}
            title="Hub Settings"
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-purple-400 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer hidden sm:flex shadow-md"
          >
            <Settings className="w-4 h-4 text-purple-400" />
          </button>

          {/* Player Profile Chip */}
          <button
            type="button"
            onClick={onOpenProfile}
            onMouseEnter={() => sound.playHoverChirp()}
            title="Player Profile"
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-pink-500/60 shadow-[0_0_15px_rgba(255,45,170,0.2)] transition-all cursor-pointer group"
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shadow-sm"
              style={{
                backgroundColor: `${profile.avatarColor}30`,
                color: profile.avatarColor,
                border: `1.5px solid ${profile.avatarColor}`,
                boxShadow: `0 0 10px ${profile.avatarColor}`,
              }}
            >
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-200 group-hover:text-white max-w-[85px] sm:max-w-[110px] truncate">
              {profile.displayName}
            </span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => {
              sound.playCyberBlip();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-2 rounded-xl bg-slate-900/90 md:hidden text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-pink-400" /> : <Menu className="w-5 h-5 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/98 p-4 flex flex-col gap-2.5 animate-fade-in shadow-2xl">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,245,255,0.3)]'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-cyan-400" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onOpenProfile();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-slate-300 flex items-center gap-2 py-2"
            >
              <User className="w-4 h-4 text-pink-400" />
              <span>Pilot Settings ({profile.displayName})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenSettings();
                setMobileMenuOpen(false);
              }}
              className="p-2 text-slate-400 hover:text-white"
            >
              <Settings className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom glowing neon gradient line */}
      <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 via-purple-500 to-pink-500 opacity-60 shadow-[0_0_10px_#00F5FF]" />
    </nav>
  );
};
