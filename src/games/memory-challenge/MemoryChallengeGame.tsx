import React, { useState, useEffect } from 'react';
import { DifficultyTier, MemoryGameResult, MemoryMode } from './types';
import {
  loadMemoryProgress,
  recordGameSession,
  resetAllMemoryStats,
  saveMemoryProgress,
} from './utils/memoryStorage';
import { MemoryModeSelector } from './components/MemoryModeSelector';
import { MemoryGameInstructionsModal } from './components/MemoryGameInstructionsModal';
import { MemoryGameResultsView } from './components/MemoryGameResultsView';
import { MemoryStatsModal } from './components/MemoryStatsModal';
import { MemorySequenceGame } from './components/MemorySequenceGame';
import { MemoryMatchGame } from './components/MemoryMatchGame';
import { PatternRecallGame } from './components/PatternRecallGame';
import { NumberMemoryGame } from './components/NumberMemoryGame';
import { sound } from '../../utils/soundEngine';

interface MemoryChallengeGameProps {
  onBackToHub: () => void;
}

type ScreenState = 'mode-select' | 'playing' | 'result';

export const MemoryChallengeGame: React.FC<MemoryChallengeGameProps> = ({ onBackToHub }) => {
  const [saveData, setSaveData] = useState(() => loadMemoryProgress());
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('mode-select');
  const [selectedMode, setSelectedMode] = useState<MemoryMode>(
    saveData.preferredMode || 'sequence'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyTier>(
    saveData.preferredDifficulty || 'beginner'
  );

  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [lastResult, setLastResult] = useState<MemoryGameResult | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync sound settings
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setMuted(!next);
  };

  // When user selects a mode from the mode cards
  const handleSelectMode = (mode: MemoryMode) => {
    setSelectedMode(mode);
    setIsInstructionsOpen(true);
  };

  // When user starts game from the instructions modal
  const handleStartGame = (chosenDifficulty: DifficultyTier) => {
    setSelectedDifficulty(chosenDifficulty);
    setIsInstructionsOpen(false);
    setCurrentScreen('playing');
  };

  // Handle game completion from any mode
  const handleGameComplete = (result: MemoryGameResult) => {
    const { updatedSave, isNewBest } = recordGameSession(saveData, result);
    setSaveData(updatedSave);

    const enrichedResult: MemoryGameResult = {
      ...result,
      isNewRecord: isNewBest,
    };

    setLastResult(enrichedResult);
    setCurrentScreen('result');
  };

  // Results screen action handlers
  const handlePlayAgain = () => {
    setCurrentScreen('playing');
  };

  const handleChangeDifficulty = () => {
    setIsInstructionsOpen(true);
  };

  const handleChooseMode = () => {
    setCurrentScreen('mode-select');
  };

  // Reset stats handler
  const handleResetStats = () => {
    const reset = resetAllMemoryStats();
    setSaveData(reset);
  };

  // Change global difficulty from mode select
  const handleChangeDifficultyLevel = (diff: DifficultyTier) => {
    setSelectedDifficulty(diff);
    const updated = { ...saveData, preferredDifficulty: diff };
    setSaveData(updated);
    saveMemoryProgress(updated);
  };

  const modeBestScore = saveData.statsByMode[selectedMode]?.bestScore || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between arcade-grid-bg relative selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20 bg-cyan-500" />
      <div className="fixed bottom-10 right-10 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Screen 1: Mode Selector */}
      {currentScreen === 'mode-select' && (
        <MemoryModeSelector
          saveData={saveData}
          selectedDifficulty={selectedDifficulty}
          onChangeDifficulty={handleChangeDifficultyLevel}
          onSelectMode={handleSelectMode}
          onOpenStats={() => setIsStatsOpen(true)}
          onBackToHub={onBackToHub}
        />
      )}

      {/* Screen 2: Active Gameplay */}
      {currentScreen === 'playing' && (
        <>
          {selectedMode === 'sequence' && (
            <MemorySequenceGame
              difficulty={selectedDifficulty}
              bestScore={modeBestScore}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onCompleteGame={handleGameComplete}
              onExit={() => setCurrentScreen('mode-select')}
            />
          )}

          {selectedMode === 'match' && (
            <MemoryMatchGame
              difficulty={selectedDifficulty}
              bestScore={modeBestScore}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onCompleteGame={handleGameComplete}
              onExit={() => setCurrentScreen('mode-select')}
            />
          )}

          {selectedMode === 'pattern' && (
            <PatternRecallGame
              difficulty={selectedDifficulty}
              bestScore={modeBestScore}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onCompleteGame={handleGameComplete}
              onExit={() => setCurrentScreen('mode-select')}
            />
          )}

          {selectedMode === 'numbers' && (
            <NumberMemoryGame
              difficulty={selectedDifficulty}
              bestScore={modeBestScore}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onCompleteGame={handleGameComplete}
              onExit={() => setCurrentScreen('mode-select')}
            />
          )}
        </>
      )}

      {/* Screen 3: Results View */}
      {currentScreen === 'result' && lastResult && (
        <MemoryGameResultsView
          result={lastResult}
          onPlayAgain={handlePlayAgain}
          onChangeDifficulty={handleChangeDifficulty}
          onChooseMode={handleChooseMode}
          onBackToHub={onBackToHub}
        />
      )}

      {/* Pre-game Instructions & Difficulty Modal */}
      <MemoryGameInstructionsModal
        isOpen={isInstructionsOpen}
        mode={selectedMode}
        initialDifficulty={selectedDifficulty}
        onClose={() => setIsInstructionsOpen(false)}
        onStart={handleStartGame}
      />

      {/* Stats & Records Modal */}
      <MemoryStatsModal
        isOpen={isStatsOpen}
        saveData={saveData}
        onClose={() => setIsStatsOpen(false)}
        onResetStats={handleResetStats}
      />
    </div>
  );
};
