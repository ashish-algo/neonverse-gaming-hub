import { GameCategory, GameEntry } from '../types/hub';

/**
 * Centralized Game Registry for NEONVERSE.
 *
 * TO ADD A NEW GAME IN THE FUTURE:
 * 1. Build your game component inside `src/games/<your-game-name>/`
 * 2. Add an entry to the `GAMES_REGISTRY` array below with:
 *    - `id`: unique string id
 *    - `status`: 'playable'
 *    - `route`: `#/games/<your-game-name>`
 * 3. Connect its component in `src/App.tsx` (or your router mapping).
 */
export const GAMES_REGISTRY: GameEntry[] = [
  {
    id: 'tic-tac-toe',
    title: 'TIC-TAC-TOE UNLIMITED',
    subtitle: 'Classic strategy. Infinite possibilities.',
    description:
      'Extended N×N tactical battle. Connect 3 anywhere to score points, trigger glowing laser strikes, and battle until the entire grid is full.',
    category: 'strategy',
    tags: ['Strategy', 'Turn-Based', '2 Players', 'Combos'],
    playerMode: '2 PLAYERS REQUIRED',
    requiredPlayers: '2 Players Required',
    status: 'playable',
    featured: true,
    badge: 'FIRST EDITION',
    playtime: '3–8 MIN',
    releaseDate: 'NOW PLAYABLE',
    accentColor: '#00F5FF', // Neon Cyan
    glowColor: 'rgba(0, 245, 255, 0.6)',
    iconName: 'Grid',
    route: '#/games/tic-tac-toe',
  },
  {
    id: 'think-a-number',
    title: 'THINK A NUMBER',
    subtitle: 'Think it. Answer. Watch the magic.',
    description:
      'A clever binary-number mind trick that reveals the exact number in your mind through the mathematical power of powers of 2.',
    category: 'puzzle',
    tags: ['Mind Games', 'Binary Trick', 'Math', 'Powers of 2', 'Single Player'],
    playerMode: 'SINGLE PLAYER',
    requiredPlayers: 'Single Player Required',
    status: 'playable',
    featured: false,
    badge: 'PLAYABLE NOW',
    playtime: '2–4 MIN',
    releaseDate: 'NOW PLAYABLE',
    accentColor: '#FF2DAA', // Hot Magenta
    glowColor: 'rgba(255, 45, 170, 0.6)',
    iconName: 'Brain',
    route: '#/games/think-a-number',
  },
  {
    id: 'shape-hunter',
    title: 'SHAPE HUNTER',
    subtitle: 'Spot the Shapes. Beat the Clock. Master Geometry.',
    description:
      'A precision visual aptitude challenge. Count triangles, squares, rectangles, parallelograms, and rhombuses across 10 epic Astra levels inspired by the Ramayana and Mahabharata (Agneyastra to Sudarshana Chakra).',
    category: 'puzzle',
    tags: ['Geometry', 'Aptitude', 'Single Player', 'Timed', 'Math'],
    playerMode: 'SINGLE PLAYER',
    requiredPlayers: 'Single Player Required',
    status: 'playable',
    featured: true,
    badge: 'NEW RELEASE',
    playtime: '1–5 MIN/LVL',
    releaseDate: 'NOW PLAYABLE',
    accentColor: '#39FF14', // Neon Lime
    glowColor: 'rgba(57, 255, 20, 0.6)',
    iconName: 'Shapes',
    route: '#/games/shape-hunter',
  },
  {
    id: 'cyber-snake',
    title: 'CYBER SNAKE 2099',
    subtitle: 'Neon speed. Hypersonic reflexes.',
    description:
      'Pilot a quantum light cycle through morphing cyber arenas. Collect digital plasma fragments and survive shifting electromagnetic hazards.',
    category: 'arcade',
    tags: ['Arcade', 'Fast-Paced', 'Single Player', 'High Score'],
    playerMode: 'SINGLE PLAYER',
    requiredPlayers: 'Single Player Required',
    status: 'coming-soon',
    featured: false,
    badge: 'IN DEVELOPMENT',
    playtime: '2–5 MIN',
    releaseDate: 'PHASE II',
    accentColor: '#C7FF4D', // Acid Lime
    glowColor: 'rgba(199, 255, 77, 0.6)',
    iconName: 'Zap',
    route: '#/games/cyber-snake',
  },
  {
    id: 'neon-memory',
    title: 'NEON MATRIX MEMORY',
    subtitle: 'Audio-visual neural sequencing.',
    description:
      'Test your cognitive limits against pulsing synthesizer chord progressions and neon light patterns across ascending difficulty tiers.',
    category: 'puzzle',
    tags: ['Puzzle', 'Memory', 'Audio-Visual', 'Brain'],
    playerMode: 'SINGLE PLAYER',
    requiredPlayers: 'Single Player Required',
    status: 'coming-soon',
    featured: false,
    badge: 'IN DEVELOPMENT',
    playtime: '3–6 MIN',
    releaseDate: 'PHASE II',
    accentColor: '#FF2DAA', // Hot Magenta
    glowColor: 'rgba(255, 45, 170, 0.6)',
    iconName: 'Brain',
    route: '#/games/neon-memory',
  },
  {
    id: 'reflex-rush',
    title: 'REFLEX RUSH',
    subtitle: 'Millisecond timing. Pure adrenaline.',
    description:
      'Hit rapidly shrinking target zones in sync with aggressive electronic synth beats. Precision accuracy rewards massive multiplier chains.',
    category: 'reflex',
    tags: ['Reflex', 'Rhythm', 'Precision', 'Arcade'],
    playerMode: 'SINGLE PLAYER',
    requiredPlayers: 'Single Player Required',
    status: 'coming-soon',
    featured: false,
    badge: 'COMING SOON',
    playtime: '1–4 MIN',
    releaseDate: 'PHASE III',
    accentColor: '#8B5CF6', // Electric Purple
    glowColor: 'rgba(139, 92, 246, 0.6)',
    iconName: 'Activity',
    route: '#/games/reflex-rush',
  },
  {
    id: 'pixel-breaker',
    title: 'PIXEL BREAKER X',
    subtitle: 'Laser ball physics & destructive chaos.',
    description:
      'Smash through neon brick barricades with high-velocity plasma orbs, multi-ball powerups, and electromagnetic deflection shields.',
    category: 'arcade',
    tags: ['Arcade', 'Physics', 'Action', 'Powerups'],
    playerMode: 'SINGLE PLAYER',
    requiredPlayers: 'Single Player Required',
    status: 'coming-soon',
    featured: false,
    badge: 'COMING SOON',
    playtime: '3–7 MIN',
    releaseDate: 'PHASE III',
    accentColor: '#F59E0B', // Solar Amber
    glowColor: 'rgba(245, 158, 11, 0.6)',
    iconName: 'Flame',
    route: '#/games/pixel-breaker',
  },
  {
    id: 'quantum-grid',
    title: 'QUANTUM GRID LOCK',
    subtitle: 'Spatial logic & laser routing.',
    description:
      'Rotate quantum mirrors and prism nodes to guide optical laser beams to target receptors before the system clock cycles out.',
    category: 'puzzle',
    tags: ['Puzzle', 'Logic', 'Strategy', 'Casual'],
    playerMode: 'SINGLE PLAYER',
    requiredPlayers: 'Single Player Required',
    status: 'coming-soon',
    featured: false,
    badge: 'COMING SOON',
    playtime: '5–10 MIN',
    releaseDate: 'PHASE IV',
    accentColor: '#06B6D4', // Deep Cyan
    glowColor: 'rgba(6, 182, 212, 0.6)',
    iconName: 'Layers',
    route: '#/games/quantum-grid',
  },
];

export const CATEGORIES: { id: GameCategory; label: string }[] = [
  { id: 'all', label: 'All Games' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'arcade', label: 'Arcade' },
  { id: 'puzzle', label: 'Puzzle' },
  { id: 'reflex', label: 'Reflex' },
  { id: 'casual', label: 'Casual' },
];

export function getGameById(id: string): GameEntry | undefined {
  return GAMES_REGISTRY.find((g) => g.id === id);
}

export function getFeaturedGame(): GameEntry {
  return GAMES_REGISTRY.find((g) => g.featured) || GAMES_REGISTRY[0];
}

export function getPlayableGames(): GameEntry[] {
  return GAMES_REGISTRY.filter((g) => g.status === 'playable');
}
