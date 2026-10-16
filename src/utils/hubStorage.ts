import { HubSettings, PlayerProfile } from '../types/hub';

const PROFILE_KEY = 'neonverse_profile_v1';
const SETTINGS_KEY = 'neonverse_hub_settings_v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  displayName: 'PLAYER ONE',
  avatarColor: '#00F5FF',
  avatarIcon: 'Gamepad2',
  favoriteGames: ['tic-tac-toe'],
  recentGames: [
    {
      gameId: 'tic-tac-toe',
      playedAt: new Date().toISOString(),
      playCount: 1,
    },
  ],
};

export const DEFAULT_HUB_SETTINGS: HubSettings = {
  soundEnabled: true,
  volume: 0.7,
  reducedMotion: false,
};

export const AVATAR_COLORS = [
  '#00F5FF', // Cyan
  '#FF2DAA', // Magenta
  '#C7FF4D', // Lime
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#3B82F6', // Blue
];

export const AVATAR_ICONS = ['Gamepad2', 'Zap', 'Flame', 'Sparkles', 'Shield', 'Target'];

export function loadPlayerProfile(): PlayerProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function savePlayerProfile(profile: PlayerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}

export function recordGameLaunch(gameId: string): PlayerProfile {
  const current = loadPlayerProfile();
  const existingIndex = current.recentGames.findIndex((r) => r.gameId === gameId);

  let updatedRecent = [...current.recentGames];
  if (existingIndex >= 0) {
    const existing = updatedRecent[existingIndex];
    updatedRecent.splice(existingIndex, 1);
    updatedRecent.unshift({
      gameId,
      playedAt: new Date().toISOString(),
      playCount: existing.playCount + 1,
    });
  } else {
    updatedRecent.unshift({
      gameId,
      playedAt: new Date().toISOString(),
      playCount: 1,
    });
  }

  // Keep top 10 recent
  updatedRecent = updatedRecent.slice(0, 10);

  const updatedProfile: PlayerProfile = {
    ...current,
    recentGames: updatedRecent,
  };

  savePlayerProfile(updatedProfile);
  return updatedProfile;
}

export function toggleFavoriteGame(gameId: string): PlayerProfile {
  const current = loadPlayerProfile();
  const isFav = current.favoriteGames.includes(gameId);
  const updatedFavorites = isFav
    ? current.favoriteGames.filter((id) => id !== gameId)
    : [...current.favoriteGames, gameId];

  const updated: PlayerProfile = {
    ...current,
    favoriteGames: updatedFavorites,
  };

  savePlayerProfile(updated);
  return updated;
}

export function loadHubSettings(): HubSettings {
  if (typeof window === 'undefined') return DEFAULT_HUB_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_HUB_SETTINGS;
    return { ...DEFAULT_HUB_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_HUB_SETTINGS;
  }
}

export function saveHubSettings(settings: HubSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}
