/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Brain, Volume2, VolumeX, Sparkles, User } from 'lucide-react';
import { GamePhase, RangeOption } from './types';
import {
  RANGE_OPTIONS,
  calculateGuessedNumber,
  generateNumberCards,
} from './engine/mathEngine';
import { sound } from '../../utils/soundEngine';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RangeSelector } from './components/RangeSelector';
import { PreGameInstructions } from './components/PreGameInstructions';
import { NumberCardView } from './components/NumberCardView';
import { NumberRevealView } from './components/NumberRevealView';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';
import { loadHubSettings, saveHubSettings } from '../../utils/hubStorage';

interface ThinkANumberGameProps {
  onBackToHub: () => void;
}

export const ThinkANumberGame: React.FC<ThinkANumberGameProps> = ({ onBackToHub }) => {
  const [hubSettings, setHubSettings] = useState(() => loadHubSettings());
  const [phase, setPhase] = useState<GamePhase>('welcome');
  const [selectedRange, setSelectedRange] = useState<RangeOption>(RANGE_OPTIONS[1]); // Default 1-63
  const [cards, setCards] = useState(() => generateNumberCards(RANGE_OPTIONS[1].max));
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(() =>
    new Array(RANGE_OPTIONS[1].cardCount).fill(null)
  );
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const toggleSound = () => {
    const nextSound = !hubSettings.soundEnabled;
    const updated = { ...hubSettings, soundEnabled: nextSound };
    setHubSettings(updated);
    saveHubSettings(updated);
    sound.setMuted(!nextSound);
    if (nextSound) {
      sound.playButtonClick();
    }
  };

  const handleSelectRange = (range: RangeOption) => {
    setSelectedRange(range);
    const newCards = generateNumberCards(range.max);
    setCards(newCards);
    setAnswers(new Array(newCards.length).fill(null));
    setCurrentCardIndex(0);
    setPhase('instructions');
  };

  const handleStartGame = () => {
    setCurrentCardIndex(0);
    setAnswers(new Array(cards.length).fill(null));
    setPhase('playing');
  };

  const handleAnswerCard = (answer: boolean) => {
    const nextAnswers = [...answers];
    nextAnswers[currentCardIndex] = answer;
    setAnswers(nextAnswers);

    if (currentCardIndex + 1 < cards.length) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      // All cards completed -> proceed to reveal
      setPhase('result');
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      const nextAnswers = [...answers];
      nextAnswers[currentCardIndex - 1] = null;
      setAnswers(nextAnswers);
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  const handleJumpToCard = (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < cards.length && targetIndex !== currentCardIndex) {
      setCurrentCardIndex(targetIndex);
    }
  };

  const handlePlayAgainSameRange = () => {
    setAnswers(new Array(cards.length).fill(null));
    setCurrentCardIndex(0);
    setPhase('instructions');
  };

  const handleChangeRange = () => {
    setPhase('range-selection');
  };

  const handleSafeBackToHub = () => {
    if (phase === 'playing') {
      setShowExitConfirm(true);
    } else {
      sound.playButtonClick();
      onBackToHub();
    }
  };

  const currentGuessedNumber =
    phase === 'result' ? calculateGuessedNumber(answers, cards) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between arcade-grid-bg relative overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* Background ambient lighting glows */}
      <div className="fixed top-0 left-1/4 w-[450px] h-[450px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 left-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Universal NEONVERSE Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/90 border-b border-pink-500/30 px-4 py-3 flex items-center justify-between shadow-lg">
        <button
          type="button"
          onClick={handleSafeBackToHub}
          onMouseEnter={() => sound.playHoverChirp()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-pink-300 border border-slate-700/80 hover:border-pink-500/70 transition-all text-xs font-mono font-bold shadow-md cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-pink-400" />
          <span>BACK TO NEONVERSE</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-950/60 border border-pink-500/40 text-[11px] font-mono font-bold text-pink-300">
            <Brain className="w-3.5 h-3.5 text-pink-400" />
            <span>THINK A NUMBER</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-pink-400/60 text-[10px] sm:text-[11px] font-mono font-black text-pink-300 shadow-[0_0_12px_rgba(255,45,170,0.3)]">
            <User className="w-3.5 h-3.5 text-pink-400" />
            <span>SINGLE PLAYER REQUIRED</span>
          </div>

          <button
            type="button"
            onClick={toggleSound}
            onMouseEnter={() => sound.playHoverChirp()}
            title={hubSettings.soundEnabled ? 'Mute' : 'Unmute'}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            {hubSettings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-pink-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </header>

      {/* Main Game Phase Viewport */}
      <main className="relative z-10 w-full flex-1 flex flex-col justify-center">
        {phase === 'welcome' && (
          <WelcomeScreen
            onStart={() => setPhase('range-selection')}
            onBackToHub={onBackToHub}
          />
        )}

        {phase === 'range-selection' && (
          <RangeSelector
            onSelectRange={handleSelectRange}
            onBack={() => setPhase('welcome')}
          />
        )}

        {phase === 'instructions' && (
          <PreGameInstructions
            selectedRange={selectedRange}
            onConfirmAndStart={handleStartGame}
            onBackToRange={() => setPhase('range-selection')}
          />
        )}

        {phase === 'playing' && cards[currentCardIndex] && (
          <NumberCardView
            card={cards[currentCardIndex]}
            cardIndex={currentCardIndex}
            totalCards={cards.length}
            selectedRange={selectedRange}
            answers={answers}
            cards={cards}
            onAnswer={handleAnswerCard}
            onPreviousCard={handlePreviousCard}
            onJumpToCard={handleJumpToCard}
            canGoBack={currentCardIndex > 0}
            onRestart={() => setShowRestartConfirm(true)}
            soundEnabled={hubSettings.soundEnabled}
            onToggleSound={toggleSound}
          />
        )}

        {phase === 'result' && (
          <NumberRevealView
            guessedNumber={currentGuessedNumber}
            selectedRange={selectedRange}
            answers={answers}
            cards={cards}
            onPlayAgain={handlePlayAgainSameRange}
            onChangeRange={handleChangeRange}
            onBackToHub={onBackToHub}
            reducedMotion={hubSettings.reducedMotion}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-3 text-center text-[11px] text-slate-500 font-mono">
        NEONVERSE Arcade · Think a Number · Binary Decomposition Engine
      </footer>

      {/* Restart Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showRestartConfirm}
        title="Restart Round?"
        message="Are you sure you want to abandon this round and start fresh?"
        confirmLabel="Restart Round"
        isDestructive={false}
        onConfirm={() => {
          sound.playButtonClick();
          setShowRestartConfirm(false);
          handleStartGame();
        }}
        onCancel={() => setShowRestartConfirm(false)}
      />

      {/* Exit Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showExitConfirm}
        title="Exit to Hub?"
        message="You have a mind-reading round in progress. Return to the NEONVERSE dashboard?"
        confirmLabel="Return to Hub"
        isDestructive={true}
        onConfirm={() => {
          sound.playButtonClick();
          setShowExitConfirm(false);
          onBackToHub();
        }}
        onCancel={() => setShowExitConfirm(false)}
      />
    </div>
  );
};
