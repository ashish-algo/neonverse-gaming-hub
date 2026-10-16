import React, { useState, useMemo } from 'react';
import { Search, X, Layers, Filter, ArrowUpDown } from 'lucide-react';
import { GameCategory, GameEntry } from '../../types/hub';
import { CATEGORIES, GAMES_REGISTRY } from '../../registry/gameRegistry';
import { GameCard } from './GameCard';
import { sound } from '../../utils/soundEngine';

interface GameLibraryProps {
  onLaunchGame: (gameId: string) => void;
  favoriteGames: string[];
  onToggleFavorite: (gameId: string) => void;
  initialSearchQuery?: string;
  onClearInitialSearch?: () => void;
}

type SortOption = 'featured' | 'alphabetical' | 'playable';

export const GameLibrary: React.FC<GameLibraryProps> = ({
  onLaunchGame,
  favoriteGames,
  onToggleFavorite,
  initialSearchQuery = '',
  onClearInitialSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);

  // Filtered & sorted games calculation
  const displayedGames = useMemo(() => {
    let result = [...GAMES_REGISTRY];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.subtitle.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((g) => g.category === selectedCategory);
    }

    // Filter by favorites
    if (filterFavoritesOnly) {
      result = result.filter((g) => favoriteGames.includes(g.id));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.status === 'playable' && b.status !== 'playable') return -1;
        if (a.status !== 'playable' && b.status === 'playable') return 1;
        return 0;
      }
      if (sortBy === 'playable') {
        if (a.status === 'playable' && b.status !== 'playable') return -1;
        if (a.status !== 'playable' && b.status === 'playable') return 1;
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [searchQuery, selectedCategory, sortBy, filterFavoritesOnly, favoriteGames]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('featured');
    setFilterFavoritesOnly(false);
    if (onClearInitialSearch) onClearInitialSearch();
  };

  return (
    <section id="vault" className="py-12 sm:py-16 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-1">
              <Layers className="w-4 h-4" />
              <span>THE GAME VAULT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
              DISCOVER & PLAY
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Choose your next adventure.
            </p>
          </div>

          {/* Search Box Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, tag, or genre..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters and Sorting Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-800/80">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onMouseEnter={() => sound.playHoverChirp()}
                  onClick={() => {
                    sound.playCyberBlip();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(0,245,255,0.4)]'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sort By & Favorites Toggle */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onMouseEnter={() => sound.playHoverChirp()}
              onClick={() => {
                sound.playCyberBlip();
                setFilterFavoritesOnly(!filterFavoritesOnly);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                filterFavoritesOnly
                  ? 'bg-pink-500/25 text-pink-300 border-pink-400 shadow-[0_0_15px_rgba(255,45,170,0.4)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              ★ FAVORITES
            </button>

            <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={sortBy}
                onChange={(e) => {
                  sound.playCyberBlip();
                  setSortBy(e.target.value as SortOption);
                }}
                className="bg-transparent text-slate-300 font-mono font-semibold outline-none cursor-pointer"
              >
                <option value="featured" className="bg-slate-900 text-white">FEATURED</option>
                <option value="playable" className="bg-slate-900 text-white">PLAYABLE FIRST</option>
                <option value="alphabetical" className="bg-slate-900 text-white">A — Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Games Grid Display */}
        {displayedGames.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 p-8 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-3">
              <Filter className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No Games Match Your Filters</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
              We couldn't find any games matching "{searchQuery}" in category "{selectedCategory}".
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs tracking-wider transition-colors border border-slate-700 cursor-pointer"
            >
              RESET SEARCH & FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onLaunchGame={onLaunchGame}
                isFavorite={favoriteGames.includes(game.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
