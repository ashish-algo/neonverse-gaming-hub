import React from 'react';
import { Gamepad2, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenSettings }) => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-black tracking-widest text-white">
              NEONVERSE
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              ENTER THE GAME. DEFY THE ORDINARY.
            </p>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex items-center gap-6 text-xs font-bold text-slate-400">
          <button
            type="button"
            onClick={() => onNavigateSection('hero')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('vault')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            The Vault
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('recent')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Jack Back In
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="hover:text-purple-400 transition-colors cursor-pointer"
          >
            Settings
          </button>
        </div>

        {/* Status & Copyright */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>NEONVERSE CORE ONLINE v2.4</span>
        </div>
      </div>
    </footer>
  );
};
