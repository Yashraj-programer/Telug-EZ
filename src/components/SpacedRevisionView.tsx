import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { SpacedItem } from '../types';
import { Confetti } from './ui/Confetti';
import {
  Repeat,
  CheckCircle2,
  Clock,
  Sparkles,
  RotateCcw,
  Check,
  AlertTriangle,
  ChevronRight,
  Flame,
  CheckCheck,
} from 'lucide-react';

export const SpacedRevisionView: React.FC = () => {
  const { spacedQueue, markItemReviewed, weakTopics, setActiveTab } = useStudy();

  const [activeQueueTab, setActiveQueueTab] = useState<'today' | 'weak' | 'ready'>('today');
  const [activeReviewItem, setActiveReviewItem] = useState<SpacedItem | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const todayItems = spacedQueue.filter((item) => item.intervalStage === 'today' || item.isWeak);
  const tomorrowItems = spacedQueue.filter((item) => item.intervalStage === 'tomorrow' && !item.isWeak);
  const readyItems = spacedQueue.filter(
    (item) => (item.intervalStage === '3days' || item.intervalStage === 'examReady') && !item.isWeak
  );

  const handleStartReview = (item: SpacedItem) => {
    setActiveReviewItem(item);
    setIsFlipped(false);
  };

  const handleFinishCard = (success: boolean) => {
    if (!activeReviewItem) return;
    markItemReviewed(activeReviewItem.id, success);
    if (success) setShowConfetti(true);
    setActiveReviewItem(null);
    setIsFlipped(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header */}
      <div className="surface-card rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-teal-700">
            <Repeat className="w-3.5 h-3.5" />
            <span>AUTOMATED MEMORY QUEUES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            Spaced Repetition Schedule
          </h2>
          <p className="text-xs font-semibold text-stone-400 mt-0.5">
            Deterministic intervals (Today → Tomorrow → 3 Days → Exam Ready) with zero manual scheduling.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black self-start sm:self-auto">
          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Optimal Spaced Engine</span>
        </div>
      </div>

      {/* 3 Metric Queues Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <button
          onClick={() => setActiveQueueTab('today')}
          className={`p-5 rounded-3xl border text-left transition-all cursor-pointer ${
            activeQueueTab === 'today'
              ? 'bg-stone-900 text-white shadow-md ring-2 ring-amber-500/40'
              : 'surface-card hover:border-stone-300'
          }`}
        >
          <div
            className={`text-[10px] font-black uppercase tracking-wider ${
              activeQueueTab === 'today' ? 'text-amber-400' : 'text-stone-400'
            }`}
          >
            TODAY'S REVISION
          </div>
          <div className="text-3xl font-mono-numbers font-black mt-1">
            {todayItems.length} <span className="text-sm font-sans font-bold">items</span>
          </div>
          <p
            className={`text-xs mt-1 font-medium ${
              activeQueueTab === 'today' ? 'text-stone-300' : 'text-stone-500'
            }`}
          >
            Due for immediate retrieval
          </p>
        </button>

        <button
          onClick={() => setActiveQueueTab('weak')}
          className={`p-5 rounded-3xl border text-left transition-all cursor-pointer ${
            activeQueueTab === 'weak'
              ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300'
              : 'surface-card hover:border-rose-200'
          }`}
        >
          <div
            className={`text-[10px] font-black uppercase tracking-wider ${
              activeQueueTab === 'weak' ? 'text-rose-200' : 'text-stone-400'
            }`}
          >
            WEAK CONCEPTS
          </div>
          <div className="text-3xl font-mono-numbers font-black mt-1">
            {weakTopics.length} <span className="text-sm font-sans font-bold">items</span>
          </div>
          <p
            className={`text-xs mt-1 font-medium ${
              activeQueueTab === 'weak' ? 'text-rose-100' : 'text-stone-500'
            }`}
          >
            Targeted for extra repetitions
          </p>
        </button>

        <button
          onClick={() => setActiveQueueTab('ready')}
          className={`p-5 rounded-3xl border text-left transition-all cursor-pointer ${
            activeQueueTab === 'ready'
              ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
              : 'surface-card hover:border-emerald-200'
          }`}
        >
          <div
            className={`text-[10px] font-black uppercase tracking-wider ${
              activeQueueTab === 'ready' ? 'text-emerald-200' : 'text-stone-400'
            }`}
          >
            EXAM READY
          </div>
          <div className="text-3xl font-mono-numbers font-black mt-1">
            {readyItems.length} <span className="text-sm font-sans font-bold">items</span>
          </div>
          <p
            className={`text-xs mt-1 font-medium ${
              activeQueueTab === 'ready' ? 'text-emerald-100' : 'text-stone-500'
            }`}
          >
            Solidified in long-term memory
          </p>
        </button>
      </div>

      {/* ACTIVE FLASHCARD MODAL */}
      {activeReviewItem && (
        <div className="surface-elevated rounded-3xl p-6 sm:p-8 space-y-6 animate-pop border-2 border-teal-500">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider">
              FLASHCARD RECALL • {activeReviewItem.type.toUpperCase()}
            </span>
            <button
              onClick={() => setActiveReviewItem(null)}
              className="text-xs font-bold text-stone-400 hover:text-stone-700"
            >
              Cancel
            </button>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="p-8 rounded-2xl bg-[#FFFDF9] border border-stone-200 text-center cursor-pointer min-h-[170px] flex flex-col items-center justify-center space-y-3 transition-transform hover:scale-[1.01] select-none"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
              {isFlipped ? 'ANSWER / MEANING' : 'TAP CARD TO FLIP &amp; REVEAL'}
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-telugu">
              {activeReviewItem.title}
            </h3>

            {isFlipped && (
              <p className="text-sm sm:text-base font-medium text-stone-700 font-telugu max-w-lg mx-auto pt-2 border-t border-stone-200 animate-fade-in leading-relaxed">
                {activeReviewItem.description}
              </p>
            )}
          </div>

          {/* Flashcard Response Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleFinishCard(false)}
              className="p-4 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-900 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Still Weak (Review Later)</span>
            </button>

            <button
              onClick={() => handleFinishCard(true)}
              className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Mastered! (+15 XP)</span>
            </button>
          </div>
        </div>
      )}

      {/* Item List View for the Active Tab */}
      <div className="surface-card rounded-3xl p-6 sm:p-7 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-stone-800">
          {activeQueueTab === 'today'
            ? "Today's Queued Concepts"
            : activeQueueTab === 'weak'
            ? 'Concepts Identified as Needing Attention'
            : 'Long-Term Retained Items'}
        </h3>

        {activeQueueTab === 'today' && (
          <div className="space-y-2.5">
            {todayItems.length === 0 ? (
              <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200/80 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-black text-stone-900">You're all caught up for today!</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  All due items have been reviewed. Return tomorrow or practice answer rebuilds.
                </p>
              </div>
            ) : (
              todayItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FFFDF9] border border-stone-200/80 hover:border-amber-300 transition-all flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-black text-stone-900 font-telugu">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium mt-0.5 font-telugu">
                      {item.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartReview(item)}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs cursor-pointer whitespace-nowrap shadow-xs active:scale-95"
                  >
                    Review Now
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeQueueTab === 'weak' && (
          <div className="space-y-2.5">
            {weakTopics.length === 0 ? (
              <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200/80 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-sm font-black text-stone-900">Nothing is currently causing trouble!</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  All weak spots have been drilled and mastered. Keep up the high retention!
                </p>
              </div>
            ) : (
              weakTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-rose-950 font-telugu">{topic}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('practice')}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-black hover:bg-rose-700 transition-colors cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    Drill Topic
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeQueueTab === 'ready' && (
          <div className="space-y-2.5">
            {readyItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-emerald-950 font-telugu">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-emerald-800 font-medium">
                      Mastered after {item.repetitions} repetitions
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded-md">
                  Exam Ready
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
