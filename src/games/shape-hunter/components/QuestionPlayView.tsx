import React, { useEffect, useMemo, useState } from 'react';
import {
  Lightbulb,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  Eye,
  Info,
  Triangle,
  Square,
  RectangleHorizontal,
} from 'lucide-react';
import { GeometryQuestion, LevelConfig } from '../types';
import { ShapeSVGDiagram } from './ShapeSVGDiagram';
import { validatePuzzleGeometry } from '../geometryValidator';
import { sound } from '../../../utils/soundEngine';

interface QuestionPlayViewProps {
  question: GeometryQuestion;
  levelConfig: LevelConfig;
  questionNumber: number; // 1..5
  totalQuestions: number; // 5
  isTimedOut: boolean;
  hasAnswered: boolean;
  selectedOption: number | null;
  onSelectOption: (option: number) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export const QuestionPlayView: React.FC<QuestionPlayViewProps> = ({
  question,
  levelConfig,
  questionNumber,
  totalQuestions,
  isTimedOut,
  hasAnswered,
  selectedOption,
  onSelectOption,
  onNextQuestion,
  isLastQuestion,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Robust mathematical geometry validation before puzzle rendering
  const validation = useMemo(() => {
    return validatePuzzleGeometry(
      question.svgData,
      question.targetShape,
      question.correctCount
    );
  }, [question]);

  // Reset local state on new question
  useEffect(() => {
    setShowHint(false);
    setShowExplanation(false);
  }, [question.id]);

  // If question is answered or timed out, make explanation available
  useEffect(() => {
    if (hasAnswered || isTimedOut) {
      setShowExplanation(true);
    }
  }, [hasAnswered, isTimedOut]);

  // Support hotkeys 1, 2, 3, 4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasAnswered || isTimedOut) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNextQuestion();
        }
        return;
      }

      const key = e.key;
      if (['1', '2', '3', '4'].includes(key)) {
        const index = parseInt(key, 10) - 1;
        if (index >= 0 && index < question.options.length) {
          onSelectOption(question.options[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswered, isTimedOut, onSelectOption, onNextQuestion, question.options]);

  // Target shape icon
  const renderShapeIcon = () => {
    switch (question.targetShape) {
      case 'triangles':
        return <Triangle className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />;
      case 'squares':
        return <Square className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />;
      case 'rectangles':
        return <RectangleHorizontal className="w-4 h-4 text-amber-400 fill-amber-400/20" />;
      case 'parallelograms':
      case 'rhombuses':
      default:
        return <Square className="w-4 h-4 text-pink-400 transform skew-x-[-14deg]" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-8 flex flex-col items-center animate-fade-in select-none">
      {/* Target Question Instruction Banner */}
      <div className="w-full mb-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono font-bold tracking-wider uppercase mb-2 shadow-sm">
          {renderShapeIcon()}
          <span className="text-slate-300">TARGET:</span>
          <span className="text-cyan-400 font-black">{question.targetShape}</span>
          {validation.isValid && (
            <>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                VERIFIED
              </span>
            </>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide max-w-xl mx-auto">
          {question.targetPrompt}
        </h2>
      </div>

      {/* Main Diagram Area with Side Hint / Explanation */}
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
        {/* SVG Diagram Canvas */}
        <div className="flex-1 w-full flex justify-center">
          <ShapeSVGDiagram
            svgData={question.svgData}
            accentColor={levelConfig.accentColor}
            glowColor={levelConfig.glowColor}
          />
        </div>

        {/* Options & Controls Column */}
        <div className="w-full md:w-80 flex flex-col gap-3">
          {/* Multiple Choice Options Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {question.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              const isCorrectOption = option === question.correctCount;
              const isUserChoice = selectedOption === option;

              let buttonStyle =
                'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,245,255,0.3)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer';

              if (hasAnswered || isTimedOut) {
                if (isCorrectOption) {
                  // Reveal green for correct answer
                  buttonStyle =
                    'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.02] ring-2 ring-emerald-400/40 cursor-default';
                } else if (isUserChoice && !isCorrectOption) {
                  // User picked wrong
                  buttonStyle =
                    'bg-rose-950/90 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)] cursor-default opacity-85';
                } else {
                  // Other unselected choices
                  buttonStyle =
                    'bg-slate-950/70 border-slate-800/80 text-slate-500 cursor-default opacity-40';
                }
              }

              return (
                <button
                  key={`${question.id}-opt-${idx}`}
                  type="button"
                  disabled={hasAnswered || isTimedOut}
                  onClick={() => onSelectOption(option)}
                  onMouseEnter={() => {
                    if (!hasAnswered && !isTimedOut) sound.playHoverChirp();
                  }}
                  className={`
                    relative p-3 sm:p-4 rounded-2xl border-2 font-mono flex items-center justify-between transition-all duration-200 group
                    ${buttonStyle}
                  `}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-cyan-300">
                    {letter}
                  </span>

                  <span className="text-xl sm:text-2xl font-black tracking-tight mx-auto font-mono">
                    {option}
                  </span>

                  {/* Status Indicator Icon */}
                  {(hasAnswered || isTimedOut) && isCorrectOption && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
                  )}
                  {(hasAnswered || isTimedOut) && isUserChoice && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  {!hasAnswered && !isTimedOut && <span className="w-5 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Timeout Alert Notification */}
          {isTimedOut && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/70 text-rose-300 text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>TIME'S UP! 0 points awarded.</span>
            </div>
          )}

          {/* Correct / Incorrect Feedback Alert */}
          {hasAnswered && !isTimedOut && (
            <div
              className={`p-3 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 shadow-md ${
                selectedOption === question.correctCount
                  ? 'bg-emerald-950/80 border-emerald-500/70 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-rose-950/80 border-rose-500/70 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
              }`}
            >
              {selectedOption === question.correctCount ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>EXCELLENT! +100 Points</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>INCORRECT. The answer is {question.correctCount}.</span>
                </>
              )}
            </div>
          )}

          {/* Hint & Strategy Toggle Button */}
          {!hasAnswered && !isTimedOut && (
            <button
              type="button"
              onClick={() => {
                sound.playCyberBlip();
                setShowHint(!showHint);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-400 hover:text-amber-300 transition-colors text-xs font-mono flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHint ? 'HIDE HINT' : 'GEOMETRIC HINT / FORMULA'}</span>
            </button>
          )}

          {/* Hint Drawer */}
          {showHint && !hasAnswered && !isTimedOut && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-mono leading-relaxed animate-fade-in">
              <span className="font-bold text-amber-400 block mb-1">STRATEGY TIP:</span>
              {question.hint}
            </div>
          )}

          {/* Next Question / Continue Action Button (when answered or timed out) */}
          {(hasAnswered || isTimedOut) && (
            <button
              type="button"
              onClick={() => {
                sound.playButtonClick();
                onNextQuestion();
              }}
              onMouseEnter={() => sound.playHoverChirp()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black font-mono tracking-widest text-xs shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>{isLastQuestion ? 'FINISH LEVEL REVIEW' : 'NEXT QUESTION'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>

      {/* Mathematical Breakdown / Explanation Drawer */}
      {showExplanation && (
        <div className="w-full p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-xl backdrop-blur-md animate-fade-in text-left">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Info className="w-4 h-4" />
            <span>MATHEMATICAL EXPLANATION & COUNT BREAKDOWN</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-mono leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
