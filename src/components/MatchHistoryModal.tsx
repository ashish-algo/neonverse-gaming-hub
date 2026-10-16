import React, { useState } from 'react';
import { X, Trophy, History, Trash2, Calendar, Hash, Target, Sparkles } from 'lucide-react';
import { AggregateStats, MatchHistoryEntry } from '../types/game';
import { ConfirmationDialog } from './ConfirmationDialog';

interface MatchHistoryModalProps {
  isOpen: boolean;
  history: MatchHistoryEntry[];
  stats: AggregateStats;
  onClose: () => void;
  onClearHistory: () => void;
}

export const MatchHistoryModal: React.FC<MatchHistoryModalProps> = ({
  isOpen,
  history,
  stats,
  onClose,
  onClearHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'stats'>('history');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl flex flex-col gap-4 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide">MATCH RECORDS</h2>
              <p className="text-xs text-slate-400">History & Game Statistics</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Match History ({history.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'stats'
                ? 'bg-slate-800 text-pink-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Career Statistics
          </button>
        </div>

        {/* Tab Content: History */}
        {activeTab === 'history' && (
          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[50vh] pr-1">
            {history.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <History className="w-8 h-8 text-slate-600" />
                <p>No matches recorded yet.</p>
                <p className="text-[11px] text-slate-500">Play your first match to see records here!</p>
              </div>
            ) : (
              history.map((m) => {
                const isDraw = m.winner === 'draw';
                const winnerName = isDraw ? 'Draw' : m.winner === 1 ? m.player1Name : m.player2Name;

                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Calendar className="w-3 h-3" />
                        {new Date(m.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono font-bold text-slate-300 border border-slate-700">
                        {m.boardSize}×{m.boardSize} Grid
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-cyan-400">X</span>
                        <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                          {m.player1Name}
                        </span>
                        <span className="text-base font-black text-white font-mono ml-1">
                          {m.player1Score}
                        </span>
                      </div>

                      <span className="text-slate-600 font-bold text-xs">vs</span>

                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white font-mono mr-1">
                          {m.player2Score}
                        </span>
                        <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                          {m.player2Name}
                        </span>
                        <span className="font-bold text-xs text-pink-400">O</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[11px]">
                      <span className="text-slate-500">
                        {m.totalMoves} moves · {Math.round(m.durationSeconds)}s
                      </span>
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          isDraw ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {!isDraw && <Trophy className="w-3 h-3" />}
                        {isDraw ? 'Tie Match' : `${winnerName} Won`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab Content: Stats */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                TOTAL MATCHES
              </div>
              <div className="text-2xl font-black text-white font-mono">{stats.matchesPlayed}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                HIGH SCORE
              </div>
              <div className="text-2xl font-black text-amber-300 font-mono">
                {stats.highestSingleGameScore} <span className="text-xs font-normal text-slate-400">pts</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                PLAYER 1 (X) WINS
              </div>
              <div className="text-2xl font-black text-cyan-300 font-mono">{stats.player1Wins}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                <Trophy className="w-3.5 h-3.5 text-pink-400" />
                PLAYER 2 (O) WINS
              </div>
              <div className="text-2xl font-black text-pink-300 font-mono">{stats.player2Wins}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                <Target className="w-3.5 h-3.5 text-purple-400" />
                TRIPLETS SCORED
              </div>
              <div className="text-2xl font-black text-purple-300 font-mono">
                {stats.totalTripletsScored}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                <span className="text-amber-400 font-bold">=</span>
                DRAWS / TIES
              </div>
              <div className="text-2xl font-black text-slate-300 font-mono">{stats.draws}</div>
            </div>
          </div>
        )}

        {/* Clear History Button */}
        {history.length > 0 && (
          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Match Records & Stats
            </button>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={showClearConfirm}
        title="Reset All Records?"
        message="This will permanently delete all stored match history and reset career statistics to zero. This action cannot be undone."
        confirmLabel="Reset Everything"
        isDestructive={true}
        onConfirm={() => {
          onClearHistory();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
