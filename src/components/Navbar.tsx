import React from 'react';
import { useStudy } from '../context/StudyContext';
import { Flame, Sparkles, Wand2, Zap, HelpCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { xp, streak, activeTab, setActiveTab, openAiModal } = useStudy();

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Student Command Center';
      case 'learn':
        return 'Lesson 1: చల్దులారగించుట (Page-by-Page)';
      case 'padyam':
        return 'Poem & Padyam Mode';
      case 'kavi':
        return 'Kavi Parichayam (బమ్మెర పోతన)';
      case 'make_ez':
        return 'MAKE IT EZ Signature Engine';
      case 'practice':
      case 'answer_builder':
        return 'Answer Rebuild & AI Checker';
      case 'decoder':
        return 'Exam Question Decoder';
      case 'revise':
        return 'Spaced Memory Revision';
      case 'progress':
        return 'Exam Readiness Analytics';
      case 'emergency':
        return 'Last-Minute Emergency Cram';
      default:
        return 'Telugu EZ';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-3">
        {/* Mobile Brand (visible only on mobile) */}
        <div
          onClick={() => setActiveTab('home')}
          className="lg:hidden flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-black text-sm flex items-center justify-center shadow-xs font-telugu">
            తె
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-base tracking-tight text-stone-900">
                TELUGU <span className="text-amber-600">EZ</span>
              </span>
              <span className="text-[9px] font-black uppercase px-1 py-0.5 rounded bg-stone-100 text-stone-700">
                10 SL
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Breadcrumb / Context Tracker */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Current Module:
          </span>
          <span className="text-xs font-extrabold text-stone-800 bg-stone-100/80 px-2.5 py-1 rounded-lg border border-stone-200/60 font-telugu">
            {getBreadcrumbTitle()}
          </span>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Make It EZ shortcut on desktop */}
          <button
            onClick={() => setActiveTab('make_ez')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'make_ez'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100/80 border border-amber-200/80'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-500" />
            <span>MAKE IT EZ</span>
          </button>

          {/* Streak Badge */}
          <div
            title="3 Day Study Streak"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span className="font-mono-numbers">{streak}d</span>
          </div>

          {/* XP Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-800 text-xs font-mono-numbers font-black shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>{xp} XP</span>
          </div>

          {/* Ask AI Trigger */}
          <button
            onClick={() => openAiModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ask Doubt</span>
          </button>
        </div>
      </div>
    </header>
  );
};
