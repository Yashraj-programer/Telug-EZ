import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { MemoryChainView } from './ui/MemoryChainView';
import { KeywordChip } from './ui/KeywordChip';
import { Confetti } from './ui/Confetti';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Wand2,
  Check,
  Volume2,
  BookOpen,
  ArrowRight,
  Layers,
  Lightbulb,
} from 'lucide-react';

export const LessonFlow: React.FC = () => {
  const {
    lesson,
    currentPageIndex,
    setCurrentPageIndex,
    pageRatings,
    setPageRating,
    completedPages,
    markPageCompleted,
    openAiModal,
    setActiveTab,
  } = useStudy();

  const [activeLayer, setActiveLayer] = useState<'meaning' | 'teenglish' | 'english' | 'chain'>('meaning');
  const [selectedRecallAnswers, setSelectedRecallAnswers] = useState<Record<string, string>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);
  const [ezExpanded, setEzExpanded] = useState(false);

  const currentPage = lesson.pages[currentPageIndex] || lesson.pages[0];
  const currentRating = pageRatings[currentPage.pageNumber];
  const isPageDone = completedPages.includes(currentPage.pageNumber);

  const handleNextPage = () => {
    markPageCompleted(currentPage.pageNumber);
    if (currentPageIndex < lesson.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      setEzExpanded(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowConfetti(true);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      setEzExpanded(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRatingSelect = (rating: 'got_it' | 'kinda' | 'dont_get_it') => {
    setPageRating(currentPage.pageNumber, rating);
    if (rating === 'got_it') {
      markPageCompleted(currentPage.pageNumber);
    }
  };

  const handleAnswerSelect = (qId: string, option: string) => {
    setSelectedRecallAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const speakTelugu = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.lang = 'te-IN';
      setSpeechActive(true);
      utterance.onend = () => setSpeechActive(false);
      utterance.onerror = () => setSpeechActive(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Top Stepper & Lesson Header */}
      <div className="surface-card rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-amber-800">
            <span>LESSON 1</span>
            <span className="text-stone-300">•</span>
            <span className="font-telugu">{lesson.title}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mt-1 font-telugu">
            పుట {currentPage.pageNumber}: {currentPage.title}
          </h2>
        </div>

        {/* Stepped Progress Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {lesson.pages.map((p, idx) => {
            const isCompleted = completedPages.includes(p.pageNumber);
            const isCurrent = idx === currentPageIndex;

            return (
              <button
                key={p.pageNumber}
                onClick={() => setCurrentPageIndex(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  isCurrent
                    ? 'w-9 bg-amber-600 shadow-xs'
                    : isCompleted
                    ? 'w-5 bg-emerald-500'
                    : 'w-4 bg-stone-200 hover:bg-stone-300'
                }`}
                title={`Go to Page ${p.pageNumber}`}
              />
            );
          })}
        </div>
      </div>

      {/* LAYER 1: ORIGINAL TEXTBOOK SANCTUARY CARD */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 space-y-5 border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 border border-stone-200">
              ORIGINAL TELUGU TEXT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => speakTelugu(currentPage.originalText)}
              className={`p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                speechActive ? 'text-amber-600 border-amber-300 bg-amber-50' : ''
              }`}
              title="Listen to pronunciation"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Chant</span>
            </button>

            <button
              onClick={() => setEzExpanded(!ezExpanded)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-200" />
              <span>{ezExpanded ? 'Collapse EZ' : '✨ Make It EZ'}</span>
            </button>
          </div>
        </div>

        {/* Large, Beautifully Formatted Telugu Reading Typography */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#FFFDF9] border border-stone-200/90 text-stone-900 text-lg sm:text-xl font-telugu leading-loose font-medium shadow-2xs">
          {currentPage.originalText}
        </div>
      </div>

      {/* LAYER 2: “MAKE IT EZ” INLINE REVEAL (WHEN ACTIVATED) */}
      {ezExpanded && (
        <div className="surface-card rounded-3xl p-6 border-2 border-amber-400 space-y-4 animate-pop shadow-md bg-gradient-to-b from-[#FFFDF8] to-white">
          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-950">
                MAKE IT EZ • COGNITIVE COMPRESSION
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              Instant Mental Model
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-800">
                TEENGLISH BREAKDOWN
              </span>
              <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                {currentPage.teenglish}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900">
                SIMPLE ENGLISH MEANING
              </span>
              <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                {currentPage.englishMeaning}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900">
              CORE EXAM TAKEAWAY
            </span>
            <p className="text-xs sm:text-sm font-bold text-stone-900 font-telugu leading-relaxed">
              {currentPage.coreIdea}
            </p>
          </div>
        </div>
      )}

      {/* LAYER 3: MULTI-LAYER UNDERSTANDING (MEANING / TEENGLISH / ENGLISH / CHAIN) */}
      <div className="surface-card rounded-3xl p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveLayer('meaning')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeLayer === 'meaning'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Simple Meaning (సరళ భావం)
            </button>
            <button
              onClick={() => setActiveLayer('teenglish')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeLayer === 'teenglish'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Teenglish
            </button>
            <button
              onClick={() => setActiveLayer('english')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeLayer === 'english'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setActiveLayer('chain')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeLayer === 'chain'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Memory Chain &amp; Keywords
            </button>
          </div>
        </div>

        {/* Content of the Active Understanding Layer */}
        <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/80 min-h-[130px]">
          {activeLayer === 'meaning' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-amber-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>CORE IDEA (ముఖ్య భావం)</span>
              </div>
              <p className="text-base sm:text-lg font-telugu text-stone-900 font-bold leading-relaxed">
                {currentPage.coreIdea}
              </p>
              <p className="text-xs sm:text-sm text-stone-600 pt-2 border-t border-stone-200 font-medium">
                {currentPage.englishMeaning}
              </p>
            </div>
          )}

          {activeLayer === 'teenglish' && (
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                SPOKEN TEENGLISH PHONETICS
              </span>
              <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-medium">
                {currentPage.teenglish}
              </p>
            </div>
          )}

          {activeLayer === 'english' && (
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                CRYSTAL CLEAR ENGLISH MEANING
              </span>
              <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-medium">
                {currentPage.englishMeaning}
              </p>
            </div>
          )}

          {activeLayer === 'chain' && (
            <div className="space-y-4">
              <MemoryChainView steps={currentPage.memoryChain} title="Page Memory Chain" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-2">
                  IMPORTANT EXAM KEYWORDS
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentPage.keywords.map((kw, i) => (
                    <KeywordChip key={i} keyword={kw} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FEEDBACK INTERACTION: How did that feel? */}
        <div className="pt-4 border-t border-stone-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-900">
                How did this page feel?
              </h4>
              <p className="text-[11px] text-stone-500 font-medium">
                Telugu EZ adapts its explanations based on your immediate cognitive response.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Got It */}
            <button
              onClick={() => handleRatingSelect('got_it')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group active:scale-95 ${
                currentRating === 'got_it'
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300'
                  : 'bg-white border-stone-200/90 hover:border-emerald-300 hover:bg-emerald-50/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                    currentRating === 'got_it'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-xs sm:text-sm text-stone-900">I GOT IT</div>
                  <div className="text-[10px] text-stone-500 font-medium">Advance to next page</div>
                </div>
              </div>
              <span className="text-xs font-mono-numbers font-black text-emerald-700">+15 XP</span>
            </button>

            {/* Kinda */}
            <button
              onClick={() => handleRatingSelect('kinda')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group active:scale-95 ${
                currentRating === 'kinda'
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                  : 'bg-white border-stone-200/90 hover:border-amber-300 hover:bg-amber-50/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                    currentRating === 'kinda'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-xs sm:text-sm text-stone-900">KINDA</div>
                  <div className="text-[10px] text-stone-500 font-medium">Quick 1-question check</div>
                </div>
              </div>
              <span className="text-xs font-mono-numbers font-black text-amber-700">+10 XP</span>
            </button>

            {/* Don't Get It */}
            <button
              onClick={() => handleRatingSelect('dont_get_it')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group active:scale-95 ${
                currentRating === 'dont_get_it'
                  ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300'
                  : 'bg-white border-stone-200/90 hover:border-rose-300 hover:bg-rose-50/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                    currentRating === 'dont_get_it'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-xs sm:text-sm text-stone-900">I DON'T GET IT</div>
                  <div className="text-[10px] text-stone-500 font-medium">Ultra-simple analogy</div>
                </div>
              </div>
              <span className="text-xs font-mono-numbers font-black text-rose-700">+5 XP</span>
            </button>
          </div>

          {/* Conditional Adaptive Explanation: KINDA */}
          {currentRating === 'kinda' && currentPage.kindaExplanation && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-stone-800 space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-[10px] font-black text-amber-900 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Quick Reinforcement (సమీక్ష)</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-stone-700">
                {currentPage.kindaExplanation.simpleNote}
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-xs font-semibold text-amber-950">
                💡 Quick Check: {currentPage.kindaExplanation.quickCheck}
              </div>
            </div>
          )}

          {/* Conditional Adaptive Explanation: DON'T GET IT */}
          {currentRating === 'dont_get_it' && currentPage.dontGetItExplanation && (
            <div className="p-5 rounded-2xl bg-rose-50/80 border border-rose-300 text-stone-800 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-rose-900 uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Breakdown in Ultra Simple Language</span>
                </div>
                <button
                  onClick={() =>
                    openAiModal(
                      currentPage.originalText,
                      'Can you explain this Telugu page in simple Teenglish with a fun school analogy?'
                    )
                  }
                  className="px-3 py-1 rounded-xl bg-rose-600 text-white text-[11px] font-black hover:bg-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Explain Again with AI</span>
                </button>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="bg-white p-3 rounded-xl border border-rose-200">
                  <span className="font-black text-[10px] uppercase text-rose-800 block">
                    SUPER SIMPLE TELUGU:
                  </span>
                  <p className="font-telugu text-stone-800 mt-1 font-medium">
                    {currentPage.dontGetItExplanation.simplifiedTelugu}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-rose-200">
                  <span className="font-black text-[10px] uppercase text-rose-800 block">
                    TEENGLISH LOGIC:
                  </span>
                  <p className="text-stone-700 mt-1 font-medium">
                    {currentPage.dontGetItExplanation.teenglishBreakdown}
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <span className="font-black text-[10px] uppercase text-amber-800 block">
                    REAL-LIFE ANALOGY:
                  </span>
                  <p className="text-stone-700 mt-1 font-medium">
                    {currentPage.dontGetItExplanation.realLifeAnalogy}
                  </p>
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-950">
                  🎯 Exam Secret: {currentPage.dontGetItExplanation.examTip}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 10-Second Recall Practice */}
        {currentPage.recallQuestions.length > 0 && (
          <div className="pt-4 border-t border-stone-200/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
                10-Second Recall Practice
              </h4>
              <span className="text-[11px] font-semibold text-stone-400">Lock it before turning the page</span>
            </div>

            <div className="space-y-3">
              {currentPage.recallQuestions.map((rq, qIdx) => {
                const userChoice = selectedRecallAnswers[rq.id];
                const isSelected = Boolean(userChoice);
                const isCorrect = userChoice === rq.correctAnswer;

                return (
                  <div key={rq.id} className="p-4 rounded-2xl bg-[#FFFDF9] border border-stone-200/80 space-y-2.5">
                    <p className="text-xs sm:text-sm font-bold text-stone-900 font-telugu">
                      {qIdx + 1}. {rq.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {rq.options?.map((opt) => {
                        const optSelected = userChoice === opt;
                        const optIsCorrect = opt === rq.correctAnswer;

                        let btnClass = 'bg-white border-stone-200 text-stone-700 hover:border-amber-300';
                        if (isSelected) {
                          if (optIsCorrect) {
                            btnClass = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                          } else if (optSelected) {
                            btnClass = 'bg-rose-100 border-rose-400 text-rose-900 line-through';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            disabled={isSelected}
                            onClick={() => handleAnswerSelect(rq.id, opt)}
                            className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer font-medium ${btnClass}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isSelected && (
                      <div
                        className={`p-2.5 rounded-xl text-xs font-medium animate-fade-in ${
                          isCorrect
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isCorrect ? '✅ శభాష్! ' : '💡 గమనిక: '}
                        {rq.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky-Feeling Controls: Prev & Next Page */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPageIndex === 0}
          className={`px-5 py-3 rounded-2xl border font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
            currentPageIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-stone-100 border-stone-200 text-stone-400'
              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Page</span>
        </button>

        <div className="flex items-center gap-2">
          {currentPageIndex === lesson.pages.length - 1 ? (
            <button
              onClick={() => setActiveTab('padyam')}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lesson Complete! Go to Padyams</span>
            </button>
          ) : (
            <button
              onClick={handleNextPage}
              className="px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>NEXT PAGE ({currentPageIndex + 2}/{lesson.pages.length})</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
