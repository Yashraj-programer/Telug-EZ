import React from 'react';
import { useStudy, ActiveTab } from '../context/StudyContext';
import {
  Home,
  BookOpen,
  Repeat,
  PenTool,
  BarChart3,
  Flame,
  Zap,
  Sparkles,
  HelpCircle,
  Wand2,
  RefreshCcw,
} from 'lucide-react';

export const DesktopSidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    xp,
    streak,
    overallReadiness,
    spacedQueue,
    openAiModal,
    recentXPGain,
    resetProgress,
  } = useStudy();

  const dueCount = spacedQueue.filter((item) => item.intervalStage === 'today' || item.isWeak).length;

  const navItems: { tab: ActiveTab; label: string; telugu: string; icon: React.ReactNode; badge?: number }[] = [
    {
      tab: 'home',
      label: 'Home',
      telugu: 'ప్రారంభం',
      icon: <Home className="w-4 h-4" />,
    },
    {
      tab: 'learn',
      label: 'Lesson Flow',
      telugu: 'పాఠం (పుటలు)',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      tab: 'revise',
      label: 'Spaced Revise',
      telugu: 'స్మృతి సమీక్ష',
      icon: <Repeat className="w-4 h-4" />,
      badge: dueCount > 0 ? dueCount : undefined,
    },
    {
      tab: 'practice',
      label: 'Practice Hub',
      telugu: 'సమాధాన రచన',
      icon: <PenTool className="w-4 h-4" />,
    },
    {
      tab: 'progress',
      label: 'Readiness & Stats',
      telugu: 'పురోగతి',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-stone-200/80 p-5 select-none justify-between z-30">
      {/* Brand & Top Header */}
      <div className="space-y-6">
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform font-telugu">
            తె
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-stone-900">
                TELUGU <span className="text-amber-600">EZ</span>
              </span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                10 SL
              </span>
            </div>
            <p className="text-[11px] font-medium text-stone-400 -mt-0.5">
              Exam Learning OS
            </p>
          </div>
        </div>

        {/* Student Stat Pill Widget */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono-numbers font-black text-amber-700 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
              <span>{xp} XP</span>
            </div>
          </div>

          {/* Quick Readiness mini bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
              <span>Readiness</span>
              <span className="font-mono-numbers font-bold text-stone-800">{overallReadiness}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-700"
                style={{ width: `${overallReadiness}%` }}
              />
            </div>
          </div>

          {recentXPGain && (
            <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 animate-fade-in truncate">
              +{recentXPGain.amount} XP • {recentXPGain.reason}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              activeTab === item.tab ||
              (item.tab === 'learn' && (activeTab === 'padyam' || activeTab === 'kavi')) ||
              (item.tab === 'practice' && (activeTab === 'answer_builder' || activeTab === 'decoder'));

            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${isActive ? 'text-amber-400' : 'text-stone-400'}`}>
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <div>{item.label}</div>
                    <div className={`text-[10px] font-normal leading-none font-telugu ${isActive ? 'text-stone-400' : 'text-stone-400'}`}>
                      {item.telugu}
                    </div>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Launch Tools */}
        <div className="pt-2 space-y-1.5 border-t border-stone-200/70">
          <div className="px-3 text-[10px] font-black uppercase tracking-wider text-stone-400">
            Smart Tools
          </div>
          <button
            onClick={() => setActiveTab('make_ez')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'make_ez'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-amber-800 hover:bg-amber-50'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-600" />
            <span>MAKE IT EZ Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'emergency'
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-rose-500" />
            <span>Last-Minute Mode</span>
          </button>
        </div>
      </div>

      {/* Bottom Assistant Dock */}
      <div className="space-y-3 pt-4 border-t border-stone-200/70">
        <button
          onClick={() => openAiModal()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Ask Telugu EZ Tutor</span>
        </button>

        <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
          <span>Class 10 TS Board</span>
          <button
            onClick={resetProgress}
            title="Reset progress to default"
            className="hover:text-stone-700 transition-colors p-1"
          >
            <RefreshCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
