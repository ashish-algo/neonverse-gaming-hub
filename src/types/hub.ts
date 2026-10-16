export type GameCategory = 'all' | 'strategy' | 'arcade' | 'puzzle' | 'casual' | 'reflex';

export type GameStatus = 'playable' | 'coming-soon';

export interface GameEntry {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: GameCategory;
  tags: string[];
  playerMode: string;
  requiredPlayers?: string;
  status: GameStatus;
  featured: boolean;
  badge?: string;
  playtime?: string;
  releaseDate?: string;
  accentColor: string;
  glowColor: string;
  iconName: string;
  route: string;
}

export interface RecentGameRecord {
  gameId: string;
  playedAt: string;
  playCount: number;
}

export interface PlayerProfile {
  displayName: string;
  avatarColor: string;
  avatarIcon: string;
  favoriteGames: string[];
  recentGames: RecentGameRecord[];
}

export interface HubSettings {
  soundEnabled: boolean;
  volume: number;
  reducedMotion: boolean;
}
