import React, { useState } from 'react';
import { PlayerProfile, HubSettings, GameEntry } from '../../types/hub';
import { getFeaturedGame, getGameById } from '../../registry/gameRegistry';
import { sound } from '../../utils/soundEngine';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { FeaturedGame } from './FeaturedGame';
import { RecentlyPlayed } from './RecentlyPlayed';
import { GameLibrary } from './GameLibrary';
import { Footer } from './Footer';
import { PlayerProfileModal } from './PlayerProfileModal';
import { HubSettingsModal } from './HubSettingsModal';
import { Radio, Zap, Shield, Sparkles, Terminal } from 'lucide-react';

interface NeonverseHubProps {
  profile: PlayerProfile;
  settings: HubSettings;
  onUpdateProfile: (profile: PlayerProfile) => void;
  onUpdateSettings: (settings: HubSettings) => void;
  onLaunchGame: (gameId: string) => void;
  onToggleFavorite: (gameId: string) => void;
  onResetPreferences: () => void;
}

export const NeonverseHub: React.FC<NeonverseHubProps> = ({
  profile,
  settings,
  onUpdateProfile,
  onUpdateSettings,
  onLaunchGame,
  onToggleFavorite,
  onResetPreferences,
}) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const featuredGame = getFeaturedGame();
  const lastPlayedRecord = profile.recentGames[0];
  const lastPlayedGame = lastPlayedRecord ? getGameById(lastPlayedRecord.gameId) : undefined;

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    sound.playButtonClick();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: settings.reducedMotion ? 'auto' : 'smooth' });
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: settings.reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const handleToggleSound = () => {
    const nextSound = !settings.soundEnabled;
    onUpdateSettings({ ...settings, soundEnabled: nextSound });
    sound.setMuted(!nextSound);
    if (nextSound) {
      sound.playButtonClick();
    }
  };

  const handleLaunchWithSound = (gameId: string) => {
    sound.playGameStart();
    onLaunchGame(gameId);
  };

  const handleOpenSearch = () => {
    sound.playButtonClick();
    scrollToSection('vault');
    const searchInput = document.querySelector<HTMLInputElement>('#vault input[type="text"]');
    if (searchInput) {
      searchInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between arcade-grid-bg relative selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Background ambient lighting effects */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-10 left-10 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Floating subtle cyber dust particles */}
      {!settings.reducedMotion && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-75" />
          <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse opacity-60" />
          <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-lime-400 rounded-full animate-ping opacity-50" />
          <div className="absolute top-3/4 left-1/6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-70" />
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        profile={profile}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenProfile={() => {
          sound.playButtonClick();
          setIsProfileOpen(true);
        }}
        onOpenSettings={() => {
          sound.playButtonClick();
          setIsSettingsOpen(true);
        }}
        onOpenSearch={handleOpenSearch}
        onNavigateSection={scrollToSection}
        activeSection={activeSection}
      />

      {/* Main Hub Content */}
      <main className="flex-1 w-full flex flex-col relative z-10">
        <div id="hero">
          <HeroSection
            featuredGame={featuredGame}
            lastPlayedGame={lastPlayedGame}
            onExploreGames={() => scrollToSection('vault')}
            onContinuePlaying={() => {
              if (lastPlayedGame && lastPlayedGame.status === 'playable') {
                handleLaunchWithSound(lastPlayedGame.id);
              } else {
                handleLaunchWithSound(featuredGame.id);
              }
            }}
            reducedMotion={settings.reducedMotion}
          />
        </div>

        {/* Cyberpunk Live Ticker Marquee Strip */}
        <div className="w-full bg-slate-950 border-y border-cyan-500/30 py-2.5 px-4 overflow-hidden relative select-none shadow-[0_0_20px_rgba(0,245,255,0.15)]">
          <div className="flex items-center gap-8 text-xs font-mono tracking-widest whitespace-nowrap">
            <span className="flex items-center gap-2 text-cyan-400 font-bold">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              HOT TITLE: TIC-TAC-TOE UNLIMITED // PLAYABLE
            </span>
            <span className="text-slate-700">///</span>
            <span className="flex items-center gap-2 text-pink-400 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              NEW ARRIVAL: THINK A NUMBER // BINARY MIND READER PLAYABLE NOW
            </span>
            <span className="text-slate-700">///</span>
            <span className="flex items-center gap-2 text-purple-400 font-bold">
              <Radio className="w-3.5 h-3.5 text-purple-400 animate-ping" />
              WEB AUDIO REAL-TIME FM & SYNTH CHIMES
            </span>
            <span className="text-slate-700">///</span>
            <span className="flex items-center gap-2 text-lime-400 font-bold">
              <Shield className="w-3.5 h-3.5" />
              ZERO MICROTRANSACTIONS // PURE LOCAL ARCADE
            </span>
          </div>
        </div>

        {/* Featured Game Spotlight */}
        <div id="featured">
          <FeaturedGame
            game={featuredGame}
            onLaunchGame={handleLaunchWithSound}
            isFavorite={profile.favoriteGames.includes(featuredGame.id)}
            onToggleFavorite={(id) => {
              sound.playCyberBlip();
              onToggleFavorite(id);
            }}
          />
        </div>

        {/* Recently Played Section */}
        <div id="recent">
          <RecentlyPlayed
            recentRecords={profile.recentGames}
            onLaunchGame={handleLaunchWithSound}
            onExploreVault={() => scrollToSection('vault')}
          />
        </div>

        {/* The Game Vault (Library) */}
        <div id="vault">
          <GameLibrary
            onLaunchGame={handleLaunchWithSound}
            favoriteGames={profile.favoriteGames}
            onToggleFavorite={(id) => {
              sound.playCyberBlip();
              onToggleFavorite(id);
            }}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer
        onNavigateSection={scrollToSection}
        onOpenSettings={() => {
          sound.playButtonClick();
          setIsSettingsOpen(true);
        }}
      />

      {/* Player Profile Modal */}
      <PlayerProfileModal
        isOpen={isProfileOpen}
        profile={profile}
        onSaveProfile={onUpdateProfile}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Hub Settings Modal */}
      <HubSettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        onResetPreferences={onResetPreferences}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
