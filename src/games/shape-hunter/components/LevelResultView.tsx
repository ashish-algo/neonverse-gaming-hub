import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Grid,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { DifficultyLevel, GeometryQuestion, LevelAttemptResult, LevelConfig } from '../types';
import { ShapeSVGDiagram } from './ShapeSVGDiagram';
import { sound } from '../../../utils/soundEngine';

interface LevelResultViewProps {
  result: LevelAttemptResult;
  questions: GeometryQuestion[];
  levelConfig: LevelConfig;
  onNextLevel: () => void;
  onRetryLevel: () => void;
  onLevelSelect: () => void;
  onBackToHub: () => void;
  hasUnlockedNextLevel: boolean;
  isGameComplete: boolean; // Passed Level 5
}

export const LevelResultView: React.FC<LevelResultViewProps> = ({
  result,
  questions,
  levelConfig,
  onNextLevel,
  onRetryLevel,
  onLevelSelect,
  onBackToHub,
  hasUnlockedNextLevel,
  isGameComplete,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    if (result.isPassed) {
      sound.playLevelVictory();
      try {
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#00F5FF', '#39FF14', '#FFE600', '#FF2DAA'],
        });
      } catch {}
    } else {
      sound.playWrongGeometry();
    }
  }, [result.isPassed]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center animate-fade-in select-none text-center">
      {/* Upper-Left Navigation: Back to Neonverse Hub */}
      <div className="w-full flex items-center justify-start mb-4">
        <button
          type="button"
          onClick={() => {
            sound.playButtonClick();
            onBackToHub();
          }}
          onMouseEnter={() => sound.playHoverChirp()}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/80 hover:border-cyan-500/50 transition-all text-xs font-mono font-bold shadow-md cursor-pointer group uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-cyan-400" />
          <span>BACK TO NEONVERSE HUB</span>
        </button>
      </div>

      {/* Result Status Emblem */}
      <div className="relative mb-6">
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center border-2 shadow-2xl transition-transform ${
            result.isPassed
              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.5)]'
              : 'bg-rose-950/80 border-rose-500 text-rose-400 shadow-[0_0_35px_rgba(244,63,94,0.4)]'
          }`}
        >
          {result.isPassed ? (
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce" />
          ) : (
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12" />
          )}
        </div>
      </div>

      {/* Main Title & Supportive / Congratulatory Heading */}
      <div className="mb-6">
        <span
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-black uppercase tracking-widest mb-2 border shadow-sm"
          style={{
            backgroundColor: `${levelConfig.accentColor}18`,
            borderColor: `${levelConfig.accentColor}50`,
            color: levelConfig.accentColor,
          }}
        >
          <span>LEVEL {levelConfig.level}: {levelConfig.astraName.toUpperCase()}</span>
          <span className="text-amber-300 font-sans font-medium">({levelConfig.sanskritName})</span>
        </span>

        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wide mb-2">
          {result.isPassed ? `${levelConfig.astraName.toUpperCase()} MASTERED!` : `${levelConfig.astraName.toUpperCase()} UNCONQUERED`}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          {result.isPassed
            ? result.score === (levelConfig.maxScore ?? 700)
              ? `Divine Perfection! You correctly identified all ${levelConfig.questionCount ?? 7} geometric formations without a flaw.`
              : `Astra Mastery Acquired! You answered ${result.correctCount} out of ${levelConfig.questionCount ?? 7} correctly and unlocked the next celestial tier.`
            : `You need at least ${levelConfig.passThreshold ?? 4} correct answers out of ${levelConfig.questionCount ?? 7} to advance. Review the solutions below and re-engage!`}
        </p>
      </div>

      {/* Summary Score Card */}
      <div className="w-full p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl mb-8 hud-corner">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
              SCORE
            </span>
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
              {result.score}
              <span className="text-xs text-slate-500 font-normal">/{levelConfig.maxScore ?? 700}</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
              ACCURACY
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {result.accuracy}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
              CORRECT
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{result.correctCount}</span>
              <span className="text-xs text-slate-500 font-normal">/{levelConfig.questionCount ?? 7}</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
              MISS / TIMEOUT
            </span>
            <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
              {result.incorrectCount + result.timeoutCount}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {result.isPassed && !isGameComplete && (
            <button
              type="button"
              onClick={() => {
                sound.playButtonClick();
                onNextLevel();
              }}
              onMouseEnter={() => sound.playHoverChirp()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black font-mono text-xs tracking-wider shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>CONTINUE TO NEXT LEVEL</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}

          {result.isPassed && isGameComplete && (
            <button
              type="button"
              onClick={() => {
                sound.playButtonClick();
                onNextLevel(); // goes to grand victory
              }}
              onMouseEnter={() => sound.playHoverChirp()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black font-mono text-xs tracking-wider shadow-[0_0_20px_rgba(255,45,170,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4" />
              <span>VIEW GRAND VICTORY CEREMONY</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              sound.playButtonClick();
              onRetryLevel();
            }}
            onMouseEnter={() => sound.playHoverChirp()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-mono text-xs tracking-wider border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{result.isPassed ? 'REPLAY LEVEL' : 'RETRY LEVEL'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playButtonClick();
              onLevelSelect();
            }}
            onMouseEnter={() => sound.playHoverChirp()}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold font-mono text-xs tracking-wider border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Grid className="w-4 h-4" />
            <span>LEVEL SELECT</span>
          </button>
        </div>
      </div>

      {/* Question by Question Review Accordion */}
      <div className="w-full text-left">
        <h3 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span>QUESTION REVIEW & MATHEMATICAL SOLUTIONS</span>
        </h3>

        <div className="flex flex-col gap-3">
          {result.questionResults.map((qr, idx) => {
            const qData = questions[idx];
            if (!qData) return null;
            const isExpanded = expandedQuestionId === qr.questionId;

            return (
              <div
                key={qr.questionId}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedQuestionId(isExpanded ? null : qr.questionId)
                  }
                  className="w-full p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-850 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                        qr.isCorrect
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/50'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-bold text-slate-200">
                        {qData.targetPrompt}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {qr.isCorrect
                          ? `Correctly identified ${qr.correctAnswer} ${qr.targetShape}`
                          : qr.isTimeout
                          ? `Timed out (Answer was ${qr.correctAnswer})`
                          : `Selected ${qr.userAnswer} (Correct: ${qr.correctAnswer})`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {qr.isCorrect ? (
                      <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">+100 PTS</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 text-xs font-mono font-bold flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">0 PTS</span>
                      </span>
                    )}

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex flex-col md:flex-row items-center gap-4 animate-fade-in">
                    <div className="w-44 h-44 shrink-0">
                      <ShapeSVGDiagram
                        svgData={qData.svgData}
                        accentColor={levelConfig.accentColor}
                        glowColor={levelConfig.glowColor}
                      />
                    </div>
                    <div className="flex-1 text-xs font-mono text-slate-300 leading-relaxed">
                      <span className="text-cyan-400 font-bold block mb-1">
                        EXPLANATION:
                      </span>
                      {qData.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Back to NEONVERSE Hub Link */}
      <div className="mt-8">
        <button
          type="button"
          onClick={() => {
            sound.playButtonClick();
            onBackToHub();
          }}
          className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest cursor-pointer"
        >
          &larr; BACK TO NEONVERSE HUB
        </button>
      </div>
    </div>
  );
};
