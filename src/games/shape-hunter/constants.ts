import { Achievement, DifficultyLevel, LevelConfig } from './types';

export const LEVEL_CONFIGS: Record<DifficultyLevel, LevelConfig> = {
  1: {
    level: 1,
    astraName: 'Agneyastra',
    sanskritName: 'आग्नेयास्त्र',
    title: 'LEVEL 1: AGNEYASTRA',
    difficultyLabel: 'AGNEYASTRA (FIRE WEAPON)',
    timePerQuestion: 60, // 1 minute
    questionCount: 7,
    passThreshold: 4,
    maxScore: 700,
    accentColor: '#FF6B00', // Fiery Amber
    glowColor: 'rgba(255, 107, 0, 0.45)',
    description: 'Fundamental fiery shapes, clean line intersections, and quick visual recognition.',
    lore: 'The elemental weapon of Agni Dev. Widely invoked by warriors in both epics as the starting celestial weapon, readily countered by water.',
  },
  2: {
    level: 2,
    astraName: 'Varunastra',
    sanskritName: 'वरुणास्त्र',
    title: 'LEVEL 2: VARUNASTRA',
    difficultyLabel: 'VARUNASTRA (WATER WEAPON)',
    timePerQuestion: 75, // 1m 15s
    questionCount: 7,
    passThreshold: 4,
    maxScore: 700,
    accentColor: '#00E5FF', // Ocean Cyan
    glowColor: 'rgba(0, 229, 255, 0.45)',
    description: 'Tiered grids, multi-interval triangles, and fluid non-square rectangle detection.',
    lore: 'The torrential weapon of Varuna, Lord of Waters. Summoned to extinguish blazing fires and cleanse battlefield obstacles.',
  },
  3: {
    level: 3,
    astraName: 'Vayavyastra',
    sanskritName: 'वायव्यास्त्र',
    title: 'LEVEL 3: VAYAVYASTRA',
    difficultyLabel: 'VAYAVYASTRA (WIND WEAPON)',
    timePerQuestion: 90, // 1m 30s
    questionCount: 7,
    passThreshold: 4,
    maxScore: 700,
    accentColor: '#00E676', // Emerald Gale
    glowColor: 'rgba(0, 230, 118, 0.45)',
    description: 'Gale-force diagonal intersections, multi-layer squares, and shifting rhombus networks.',
    lore: 'The mighty weapon of Vayu Dev. Generates hurricane winds capable of lifting chariots and dispersing entire battalions.',
  },
  4: {
    level: 4,
    astraName: 'Suryastra',
    sanskritName: 'सूर्यास्त्र',
    title: 'LEVEL 4: SURYASTRA',
    difficultyLabel: 'SURYASTRA (SOLAR WEAPON)',
    timePerQuestion: 120, // 2 minutes
    questionCount: 7,
    passThreshold: 4,
    maxScore: 700,
    accentColor: '#FFD600', // Radiant Solar Gold
    glowColor: 'rgba(255, 214, 0, 0.45)',
    description: 'Radiant geometric arrays, concentric diamond-in-square layers, and slanted grids.',
    lore: 'The blinding solar astra of Surya Dev. Radiates dazzling brilliance to dispel illusions and illuminate hidden patterns.',
  },
  5: {
    level: 5,
    astraName: 'Indrastra',
    sanskritName: 'ऐन्द्रास्त्र',
    title: 'LEVEL 5: INDRASTRA',
    difficultyLabel: 'INDRASTRA (THUNDER KING)',
    timePerQuestion: 150, // 2m 30s
    questionCount: 7,
    passThreshold: 4,
    maxScore: 700,
    accentColor: '#7C4DFF', // Lightning Violet
    glowColor: 'rgba(124, 77, 255, 0.45)',
    description: 'Torrents of celestial line segments, dual-vertex rays, and truss triangular webs.',
    lore: 'The majestic weapon of Indra, King of Devas. Unleashes a lightning volley of thousands of arrows simultaneously.',
  },
  6: {
    level: 6,
    astraName: 'Nagastra',
    sanskritName: 'नागास्त्र',
    title: 'LEVEL 6: NAGASTRA',
    difficultyLabel: 'NAGASTRA (SERPENT DART)',
    timePerQuestion: 180, // 3 minutes
    questionCount: 7,
    passThreshold: 4,
    maxScore: 700,
    accentColor: '#1DE9B6', // Serpent Teal
    glowColor: 'rgba(29, 233, 182, 0.45)',
    description: 'Venomous nested polygons, interlocking star figures, and deceptive diagonal meshes.',
    lore: 'The dreaded serpentine weapon wielded with deadly precision by Indrajit and Karna, binding targets in venomous constrictions.',
  },
  7: {
    level: 7,
    astraName: 'Narayanastra',
    sanskritName: 'नारायणास्त्र',
    title: 'LEVEL 7: NARAYANASTRA',
    difficultyLabel: 'NARAYANASTRA (LORD VISHNU)',
    timePerQuestion: 210, // 3m 30s
    questionCount: 7,
    passThreshold: 4,
    maxScore: 700,
    accentColor: '#FF9100', // Divine Saffron
    glowColor: 'rgba(255, 145, 0, 0.45)',
    description: 'Combative multi-tiered lattices, dense parallelogram matrices, and Sierpinski medians.',
    lore: 'The supreme invulnerable weapon of Lord Narayana. Rains millions of celestial missiles that intensify with every form of resistance.',
  },
  8: {
    level: 8,
    astraName: 'Brahmastra',
    sanskritName: 'ब्रह्मास्त्र',
    title: 'LEVEL 8: BRAHMASTRA',
    difficultyLabel: 'BRAHMASTRA (CREATOR WEAPON)',
    timePerQuestion: 240, // 4 minutes
    questionCount: 7,
    passThreshold: 4,
    maxScore: 700,
    accentColor: '#FF1744', // Celestial Crimson
    glowColor: 'rgba(255, 23, 68, 0.45)',
    description: 'Supreme apocalyptic complexity, multi-apex rays, and nested combinatorial matrices.',
    lore: 'The legendary weapon forged by Lord Brahma. Capable of piercing any armor and incinerating opposing celestial defenses.',
  },
  9: {
    level: 9,
    astraName: 'Pashupatastra',
    sanskritName: 'पाशुपतास्त्र',
    title: 'LEVEL 9: PASHUPATASTRA',
    difficultyLabel: 'PASHUPATASTRA (LORD SHIVA)',
    timePerQuestion: 270, // 4m 30s
    questionCount: 7,
    passThreshold: 4,
    maxScore: 700,
    accentColor: '#E040FB', // Cosmic Mahadeva Magenta
    glowColor: 'rgba(224, 64, 251, 0.45)',
    description: 'Cosmic scale geometry, high-order trusses, and intersecting multi-quadrilateral webs.',
    lore: 'The irresistible personal destructive weapon of Lord Shiva Mahadeva, which can demolish the entire cosmos if unleashed in anger.',
  },
  10: {
    level: 10,
    astraName: 'Sudarshana',
    sanskritName: 'सुदर्शन चक्र',
    title: 'LEVEL 10: SUDARSHANA',
    difficultyLabel: 'SUDARSHANA CHAKRA (SUPREME)',
    timePerQuestion: 300, // 5 minutes
    questionCount: 7,
    passThreshold: 4,
    maxScore: 700,
    accentColor: '#FFD700', // Supreme Golden Wheel
    glowColor: 'rgba(255, 215, 0, 0.6)',
    description: 'The pinnacle of cosmic geometry: sacred multi-layered mandalas, intricate diamonds, and ultimate spatial mastery.',
    lore: 'The supreme, invincible spinning disc of Lord Vishnu and Krishna. The ultimate celestial weapon of absolute cosmic victory, surpassing all other astras.',
  },
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_clear',
    title: 'ASTRA INITIATE',
    description: 'Pass your first Astra level with at least 4 out of 7 correct answers.',
    iconName: 'Award',
  },
  {
    id: 'perfect_700',
    title: 'PERFECT ASTRA MASTERY',
    description: 'Score a flawless 700/700 (7 out of 7) on any Astra challenge level.',
    iconName: 'Sparkles',
  },
  {
    id: 'speed_hunter',
    title: 'LIGHTNING ACCURACY',
    description: 'Correctly answer any question in under 15 seconds.',
    iconName: 'Zap',
  },
  {
    id: 'triangle_master',
    title: 'TRIANGULATOR',
    description: 'Correctly solve 10 triangle challenge diagrams.',
    iconName: 'Triangle',
  },
  {
    id: 'quad_expert',
    title: 'QUADRILATERAL VIRTUOSO',
    description: 'Correctly solve 10 square, rectangle, parallelogram, or rhombus puzzles.',
    iconName: 'Square',
  },
  {
    id: 'brahmastra_wielder',
    title: 'BRAHMASTRA WIELDER',
    description: 'Conquer Level 8 (Brahmastra) and harness the weapon of the Creator.',
    iconName: 'Shield',
  },
  {
    id: 'grand_champion',
    title: 'SUDARSHANA CONQUEROR',
    description: 'Conquer Level 10 (Sudarshana Chakra) and complete all 10 Divine Astra challenges.',
    iconName: 'Crown',
  },
];
