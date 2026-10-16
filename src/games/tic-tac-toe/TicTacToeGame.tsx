/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Gamepad2, Volume2, VolumeX, Sparkles, Users, Grid } from 'lucide-react';
import { GameSettings, GameState, RecentPointEvent } from '../../types/game';
import { initializeGameState, makeMove, undoMove } from '../../engine/gameEngine';
import {
  clearHistoryAndStats,
  DEFAULT_SETTINGS,
  loadAggregateStats,
  loadMatchHistory,
  loadSettings,
  recordCompletedMatch,
  saveSettings,
} from '../../utils/storage';
import { sound } from '../../utils/soundEngine';
import { HomeScreen } from '../../components/HomeScreen';
import { GameSetup } from '../../components/GameSetup';
import { ScoreBoard } from '../../components/ScoreBoard';
import { GameBoard } from '../../components/GameBoard';
import { GameControls } from '../../components/GameControls';
import { GameOverModal } from '../../components/GameOverModal';
import { RulesModal } from '../../components/RulesModal';
import { MatchHistoryModal } from '../../components/MatchHistoryModal';
import { SettingsModal } from '../../components/SettingsModal';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';

type CurrentScreen = 'home' | 'setup' | 'game';

interface TicTacToeGameProps {
  onBackToHub: () => void;
}

export const TicTacToeGame: React.FC<TicTacToeGameProps> = ({ onBackToHub }) => {
  const [screen, setScreen] = useState<CurrentScreen>('setup'); // default directly to setup or home
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState(() => loadMatchHistory());
  const [stats, setStats] = useState(() => loadAggregateStats());

  // Game state
  const [gameState, setGameState] = useState<GameState>(() =>
    initializeGameState(DEFAULT_SETTINGS.boardSize)
  );
  const [recentPointEvent, setRecentPointEvent] = useState<RecentPointEvent | null>(null);

  // Dialog & Modal states
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    isDestructive?: boolean;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    action: () => {},
  });

  // Load saved preferences on initial mount
  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    sound.setMuted(!loaded.soundEnabled);
    sound.setVolume(loaded.volume);
    if (loaded.musicEnabled && loaded.soundEnabled) {
      sound.startAmbientMusic();
    }
  }, []);

  // Sync sound settings whenever settings change
  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    sound.setMuted(!newSettings.soundEnabled);
    sound.setVolume(newSettings.volume);

    if (newSettings.musicEnabled && newSettings.soundEnabled) {
      sound.startAmbientMusic();
    } else {
      sound.stopAmbientMusic();
    }
  };

  const handleToggleSound = () => {
    const nextSoundEnabled = !settings.soundEnabled;
    handleUpdateSettings({ ...settings, soundEnabled: nextSoundEnabled });
    if (nextSoundEnabled) {
      sound.playButtonClick();
    }
  };

  // Start fresh game with settings
  const handleStartGame = (configuredSettings: GameSettings) => {
    handleUpdateSettings(configuredSettings);
    sound.playGameStart();
    setGameState(initializeGameState(configuredSettings.boardSize));
    setRecentPointEvent(null);
    setScreen('game');
  };

  // Play again with same settings
  const handlePlayAgain = () => {
    sound.playGameStart();
    setGameState(initializeGameState(settings.boardSize));
    setRecentPointEvent(null);
  };

  // Cell click handler in active game
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameState.isGameOver) return;

      const player = gameState.currentPlayer;
      const result = makeMove(gameState, row, col);
      if (!result) {
        sound.playInvalid();
        return;
      }

      const { nextState, pointsEarned } = result;

      // Play move sound
      if (player === 1) {
        sound.playXMove();
      } else {
        sound.playOMove();
      }

      // Handle scoring feedback
      if (pointsEarned > 0) {
        if (pointsEarned === 1) {
          sound.playScorePoint();
        } else {
          sound.playScoreCombo(pointsEarned);
        }

        setRecentPointEvent({
          id: Date.now(),
          player,
          points: pointsEarned,
          message: `+${pointsEarned} ${pointsEarned === 1 ? 'POINT' : 'POINTS'}!`,
          timestamp: Date.now(),
        });
      }

      // Handle Game Completion
      if (nextState.isGameOver) {
        const isTie = nextState.winner === 'draw';
        if (isTie) {
          sound.playDraw();
        } else {
          sound.playVictory();
        }

        // Record to persistent storage
        const durationSeconds = Math.max(
          1,
          Math.round(((nextState.endTime || Date.now()) - nextState.startTime) / 1000)
        );

        const updated = recordCompletedMatch(
          {
            date: new Date().toISOString(),
            boardSize: nextState.size,
            player1Name: settings.player1.name,
            player2Name: settings.player2.name,
            player1Score: nextState.player1Score,
            player2Score: nextState.player2Score,
            winner: nextState.winner!,
            totalMoves: nextState.moveHistory.length,
            durationSeconds,
          },
          nextState.scoredGroups.length
        );

        setHistory(updated.history);
        setStats(updated.stats);
      }

      setGameState(nextState);
    },
    [gameState, settings]
  );

  // Undo move
  const handleUndo = () => {
    if (gameState.moveHistory.length === 0 || gameState.isGameOver) return;
    sound.playButtonClick();
    const previous = undoMove(gameState);
    setGameState(previous);
    setRecentPointEvent(null);
  };

  // Restart match with confirmation
  const handleRequestRestart = () => {
    if (gameState.moveHistory.length === 0) {
      handlePlayAgain();
      return;
    }
    sound.playButtonClick();
    setConfirmDialog({
      isOpen: true,
      title: 'Restart Match?',
      message: 'Are you sure you want to restart this match? All current progress will be lost.',
      confirmLabel: 'Restart Match',
      isDestructive: false,
      action: () => {
        handlePlayAgain();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Exit to game home or hub
  const handleRequestHome = () => {
    if (gameState.moveHistory.length === 0 || gameState.isGameOver) {
      sound.playButtonClick();
      setGameState(initializeGameState(settings.boardSize));
      setRecentPointEvent(null);
      setScreen('home');
      return;
    }
    sound.playButtonClick();
    setConfirmDialog({
      isOpen: true,
      title: 'Exit Match?',
      message: 'Leave current match and return to the game menu?',
      confirmLabel: 'Exit to Menu',
      isDestructive: true,
      action: () => {
        sound.playButtonClick();
        setGameState(initializeGameState(settings.boardSize));
        setRecentPointEvent(null);
        setScreen('home');
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Safe navigation back to NEONVERSE Hub
  const handleSafeBackToHub = () => {
    if (screen === 'game' && gameState.moveHistory.length > 0 && !gameState.isGameOver) {
      setConfirmDialog({
        isOpen: true,
        title: 'Return to NEONVERSE?',
        message: 'You have a match in progress. Are you sure you want to return to the Hub?',
        confirmLabel: 'Return to Hub',
        isDestructive: true,
        action: () => {
          sound.playButtonClick();
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          onBackToHub();
        },
      });
    } else {
      sound.playButtonClick();
      onBackToHub();
    }
  };

  // Clear history and stats
  const handleClearHistory = () => {
    sound.playButtonClick();
    clearHistoryAndStats();
    setHistory([]);
    setStats(loadAggregateStats());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between arcade-grid-bg relative overflow-x-hidden">
      {/* Background ambient lighting glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Universal NEONVERSE Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/90 border-b border-cyan-500/30 px-4 py-3 flex items-center justify-between shadow-lg">
        <button
          type="button"
          onClick={handleSafeBackToHub}
          onMouseEnter={() => sound.playHoverChirp()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-400/80 transition-all text-xs font-mono font-bold shadow-md cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-cyan-400" />
          <span>BACK TO NEONVERSE</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-[11px] font-mono font-bold text-cyan-300 shadow-[0_0_10px_rgba(0,245,255,0.25)]">
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            <span>TIC-TAC-TOE UNLIMITED</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-cyan-400/60 text-[10px] sm:text-[11px] font-mono font-black text-cyan-300 shadow-[0_0_12px_rgba(0,245,255,0.3)]">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>TWO PLAYERS REQUIRED (LOCAL 2P)</span>
          </div>

          <button
            type="button"
            onClick={handleToggleSound}
            title={settings.soundEnabled ? 'Mute' : 'Unmute'}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full flex-1 flex flex-col justify-center">
        {screen === 'home' && (
          <div className="relative">
            <HomeScreen
              onPlayNow={() => {
                sound.playButtonClick();
                setScreen('setup');
              }}
              onOpenRules={() => {
                sound.playButtonClick();
                setIsRulesOpen(true);
              }}
              onOpenHistory={() => {
                sound.playButtonClick();
                setIsHistoryOpen(true);
              }}
              onOpenSettings={() => {
                sound.playButtonClick();
                setIsSettingsOpen(true);
              }}
              soundEnabled={settings.soundEnabled}
              onToggleSound={handleToggleSound}
            />
          </div>
        )}

        {screen === 'setup' && (
          <GameSetup
            initialSettings={settings}
            onStartGame={handleStartGame}
            onBackToHome={() => {
              sound.playButtonClick();
              setScreen('home');
            }}
          />
        )}

        {screen === 'game' && (
          <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col justify-center animate-fade-in">
            {/* Persistent Live Scoreboard - ALWAYS visible throughout match */}
            <ScoreBoard
              player1={settings.player1}
              player2={settings.player2}
              player1Score={gameState.player1Score}
              player2Score={gameState.player2Score}
              currentPlayer={gameState.currentPlayer}
              recentPointEvent={recentPointEvent}
              reducedMotion={settings.reducedMotion}
            />

            {/* Game Controls Bar */}
            <GameControls
              moveCount={gameState.moveHistory.length}
              filledCells={gameState.filledCells}
              totalCells={gameState.totalCells}
              soundEnabled={settings.soundEnabled}
              canUndo={gameState.moveHistory.length > 0 && !gameState.isGameOver}
              onUndo={handleUndo}
              onToggleSound={handleToggleSound}
              onOpenRules={() => {
                sound.playButtonClick();
                setIsRulesOpen(true);
              }}
              onRestart={handleRequestRestart}
              onGoHome={handleRequestHome}
            />

            {/* Responsive Game Board with Animated SVG Strike-through Lines */}
            <GameBoard
              board={gameState.board}
              size={gameState.size}
              currentPlayer={gameState.currentPlayer}
              player1={settings.player1}
              player2={settings.player2}
              scoredGroups={gameState.scoredGroups}
              isGameOver={gameState.isGameOver}
              onCellClick={handleCellClick}
              reducedMotion={settings.reducedMotion}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-3 text-center text-[11px] text-slate-500 font-medium">
        NEONVERSE Arcade · Tic Tac Toe Unlimited · Play until full
      </footer>

      {/* Game Over Screen - rendered only in active game screen */}
      {screen === 'game' && gameState.isGameOver && (
        <GameOverModal
          gameState={gameState}
          player1={settings.player1}
          player2={settings.player2}
          reducedMotion={settings.reducedMotion}
          onPlayAgain={handlePlayAgain}
          onChangeSettings={() => {
            sound.playButtonClick();
            setGameState(initializeGameState(settings.boardSize));
            setRecentPointEvent(null);
            setScreen('setup');
          }}
          onGoHome={() => {
            sound.playButtonClick();
            setGameState(initializeGameState(settings.boardSize));
            setRecentPointEvent(null);
            setScreen('home');
          }}
        />
      )}

      {/* Rules Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      {/* Match Records & Statistics Modal */}
      <MatchHistoryModal
        isOpen={isHistoryOpen}
        history={history}
        stats={stats}
        onClose={() => setIsHistoryOpen(false)}
        onClearHistory={handleClearHistory}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        isDestructive={confirmDialog.isDestructive}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
