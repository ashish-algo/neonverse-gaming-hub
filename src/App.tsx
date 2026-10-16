/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { HubSettings, PlayerProfile } from './types/hub';
import {
  DEFAULT_HUB_SETTINGS,
  DEFAULT_PROFILE,
  loadHubSettings,
  loadPlayerProfile,
  recordGameLaunch,
  saveHubSettings,
  savePlayerProfile,
  toggleFavoriteGame,
} from './utils/hubStorage';
import { sound } from './utils/soundEngine';
import { NeonverseHub } from './components/hub/NeonverseHub';
import { TicTacToeGame } from './games/tic-tac-toe/TicTacToeGame';
import { ThinkANumberGame } from './games/think-a-number/ThinkANumberGame';
import { ShapeHunterGame } from './games/shape-hunter/ShapeHunterGame';

type AppRoute = 'hub' | 'game:tic-tac-toe' | 'game:think-a-number' | 'game:shape-hunter';

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#/games/tic-tac-toe') return 'game:tic-tac-toe';
      if (window.location.hash === '#/games/think-a-number') return 'game:think-a-number';
      if (window.location.hash === '#/games/shape-hunter') return 'game:shape-hunter';
    }
    return 'hub';
  });

  const [profile, setProfile] = useState<PlayerProfile>(() => loadPlayerProfile());
  const [settings, setSettings] = useState<HubSettings>(() => loadHubSettings());

  // Listen to browser hash changes for Back / Forward history navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/games/tic-tac-toe') {
        setRoute('game:tic-tac-toe');
      } else if (hash === '#/games/think-a-number') {
        setRoute('game:think-a-number');
      } else if (hash === '#/games/shape-hunter') {
        setRoute('game:shape-hunter');
      } else {
        setRoute('hub');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync initial sound preferences
  useEffect(() => {
    sound.setMuted(!settings.soundEnabled);
    sound.setVolume(settings.volume);
  }, [settings]);

  // Handle Game Launch
  const handleLaunchGame = (gameId: string) => {
    if (gameId === 'tic-tac-toe') {
      // Record session in profile
      const updatedProfile = recordGameLaunch('tic-tac-toe');
      setProfile(updatedProfile);

      // Navigate to game view with browser history support
      window.location.hash = '#/games/tic-tac-toe';
      setRoute('game:tic-tac-toe');
      window.scrollTo(0, 0);
    } else if (gameId === 'think-a-number') {
      // Record session in profile
      const updatedProfile = recordGameLaunch('think-a-number');
      setProfile(updatedProfile);

      // Navigate to game view with browser history support
      window.location.hash = '#/games/think-a-number';
      setRoute('game:think-a-number');
      window.scrollTo(0, 0);
    } else if (gameId === 'shape-hunter') {
      // Record session in profile
      const updatedProfile = recordGameLaunch('shape-hunter');
      setProfile(updatedProfile);

      // Navigate to game view with browser history support
      window.location.hash = '#/games/shape-hunter';
      setRoute('game:shape-hunter');
      window.scrollTo(0, 0);
    }
  };

  // Handle Back to Hub
  const handleBackToHub = () => {
    window.location.hash = '#/';
    setRoute('hub');
    window.scrollTo(0, 0);
  };

  // Profile update handler
  const handleUpdateProfile = (newProfile: PlayerProfile) => {
    setProfile(newProfile);
    savePlayerProfile(newProfile);
  };

  // Settings update handler
  const handleUpdateSettings = (newSettings: HubSettings) => {
    setSettings(newSettings);
    saveHubSettings(newSettings);
    sound.setMuted(!newSettings.soundEnabled);
    sound.setVolume(newSettings.volume);
  };

  // Toggle favorite game
  const handleToggleFavorite = (gameId: string) => {
    const updated = toggleFavoriteGame(gameId);
    setProfile(updated);
  };

  // Reset preferences
  const handleResetPreferences = () => {
    handleUpdateProfile(DEFAULT_PROFILE);
    handleUpdateSettings(DEFAULT_HUB_SETTINGS);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans">
      {route === 'hub' ? (
        <NeonverseHub
          profile={profile}
          settings={settings}
          onUpdateProfile={handleUpdateProfile}
          onUpdateSettings={handleUpdateSettings}
          onLaunchGame={handleLaunchGame}
          onToggleFavorite={handleToggleFavorite}
          onResetPreferences={handleResetPreferences}
        />
      ) : route === 'game:tic-tac-toe' ? (
        <TicTacToeGame onBackToHub={handleBackToHub} />
      ) : route === 'game:think-a-number' ? (
        <ThinkANumberGame onBackToHub={handleBackToHub} />
      ) : (
        <ShapeHunterGame onBackToHub={handleBackToHub} />
      )}
    </div>
  );
}
