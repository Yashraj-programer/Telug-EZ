import React from 'react';
import { useStudy, ActiveTab } from '../context/StudyContext';
import { Home, BookOpen, Repeat, PenTool, BarChart3 } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, spacedQueue } = useStudy();

  const dueCount = spacedQueue.filter((item) => item.intervalStage === 'today' || item.isWeak).length;

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      tab: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      tab: 'learn',
      label: 'Learn',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      tab: 'revise',
      label: 'Revise',
      icon: <Repeat className="w-5 h-5" />,
      badge: dueCount > 0 ? dueCount : undefined,
    },
    {
      tab: 'practice',
      label: 'Practice',
      icon: <PenTool className="w-5 h-5" />,
    },
    {
      tab: 'progress',
      label: 'Readiness',
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-2 py-1.5 shadow-lg select-none">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            activeTab === item.tab ||
            (item.tab === 'learn' && (activeTab === 'padyam' || activeTab === 'kavi')) ||
            (item.tab === 'practice' && (activeTab === 'answer_builder' || activeTab === 'decoder'));

          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                isActive ? 'text-amber-600 font-extrabold' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-black' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
