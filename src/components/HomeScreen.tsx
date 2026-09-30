import React from 'react';
import { useStudy } from '../context/StudyContext';
import { RadialReadinessGauge } from './charts/RadialReadinessGauge';
import { SkillRadarChart } from './charts/SkillRadarChart';
import { WeeklyActivityChart } from './charts/WeeklyActivityChart';
import {
  BookOpen,
  Wand2,
  Repeat,
  PenTool,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Flame,
  Zap,
  Scroll,
  UserCheck,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    lesson,
    setActiveTab,
    setCurrentPageIndex,
    completedPages,
    overallReadiness,
    weakTopics,
    streak,
    openAiModal,
    xp,
  } = useStudy();

  const nextUnfinishedPage =
    lesson.pages.find((p) => !completedPages.includes(p.pageNumber))?.pageNumber || 1;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Greeting & Mission Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
            <span>Good morning 👋</span>
            <span className="text-stone-300">•</span>
            <span className="inline-flex items-center gap-1 text-orange-600 font-extrabold">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              {streak}-DAY STREAK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
            Your Telugu mission today
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            Class 10 Telangana Telugu Second Language (SL) • Lesson 1: “{lesson.title}”
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('emergency')}
            className="px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-rose-500" />
            <span>Emergency Mode</span>
          </button>
        </div>
      </div>

      {/* Primary Command Center Grid: Readiness + Today's Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Telugu Readiness Gauge & Today's Mission (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main TELUGU READINESS Card */}
          <div className="surface-elevated rounded-3xl p-6 sm:p-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-black uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                  <span>TELUGU READINESS</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-snug">
                  You are {overallReadiness}% exam ready for Lesson 1
                </h2>

                <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
                  Based on your completed pages, poem memory blanks, kavi quiz, and answer reconstruction accuracy.
                </p>

                <div className="pt-1 flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('progress')}
                    className="text-xs font-black text-amber-800 hover:text-amber-900 flex items-center gap-1 group cursor-pointer"
                  >
                    <span>View Detailed Mastery Breakdown</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Custom SVG Radial Readiness Gauge */}
              <div className="flex items-center justify-center sm:self-center">
                <RadialReadinessGauge percentage={overallReadiness} size={170} />
              </div>
            </div>
          </div>

          {/* TODAY'S MISSION Card */}
          <div className="surface-card rounded-3xl p-6 sm:p-7 space-y-4 border-amber-200/90 relative group hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                  TODAY'S MISSION
                </span>
              </div>
              <span className="text-xs font-mono-numbers font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                Step {nextUnfinishedPage} of {lesson.pages.length}
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Lesson 1 • చల్దులారగించుట
              </div>
              <h3 className="text-lg sm:text-xl font-black text-stone-900 font-telugu mt-0.5">
                {lesson.pages[nextUnfinishedPage - 1]?.title || 'పుట భావ అవగాహన'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 mt-1.5 font-telugu font-medium">
                {lesson.pages[nextUnfinishedPage - 1]?.coreIdea}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Takes ~4 minutes</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('make_ez')}
                  className="px-3.5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Make It EZ</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentPageIndex(nextUnfinishedPage - 1);
                    setActiveTab('learn');
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>CONTINUE LEARNING</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Custom Skill Radar & Weekly Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Custom SVG Skill Radar */}
          <div className="surface-card rounded-3xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-stone-500">
                  EXAM SKILL RADAR
                </span>
                <h3 className="text-base font-black text-stone-900 mt-0.5">
                  6-Pillar Competency
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Balanced
              </span>
            </div>

            <div className="flex items-center justify-center py-1">
              <SkillRadarChart size={250} />
            </div>
          </div>

          {/* Smooth Weekly Progress Line Chart */}
          <div className="surface-card rounded-3xl p-5 sm:p-6">
            <WeeklyActivityChart />
          </div>
        </div>
      </div>

      {/* WEAK AREAS: Compact & Distinct */}
      <div className="surface-card rounded-3xl p-5 sm:p-6 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-stone-900">
              WEAK CONCEPTS NEEDING ATTENTION ({weakTopics.length})
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('revise')}
            className="text-xs font-extrabold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Review All in Spaced Repetition</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {weakTopics.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center text-xs font-bold text-emerald-900">
            ✨ You are all caught up! No active weak concepts flagged right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {weakTopics.map((topic, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#FFFBF8] border border-rose-200/90 flex items-center justify-between gap-3 hover:border-rose-400 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-stone-900 font-telugu truncate">
                    {topic}
                  </div>
                  <div className="text-[10px] text-rose-600 font-semibold">
                    Flagged during recent recall
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (topic.includes('పద్యం') || topic.includes('తామర')) {
                      setActiveTab('padyam');
                    } else if (topic.includes('సంధి')) {
                      setActiveTab('practice');
                    } else {
                      setActiveTab('learn');
                    }
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-black cursor-pointer whitespace-nowrap shadow-2xs"
                >
                  Drill
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QUICK ACTIONS: Modern Product Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-stone-500">
            QUICK LEARNING ACTIONS
          </h3>
          <span className="text-xs font-semibold text-stone-400">Tactile modules</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Action 1: Learn */}
          <div
            onClick={() => setActiveTab('learn')}
            className="surface-card hover:surface-elevated rounded-3xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-stone-900 group-hover:text-amber-700 transition-colors">
                Page-by-Page
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Step-by-step reading flow with Teenglish &amp; analogies
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-amber-700">
              <span>{completedPages.length}/{lesson.pages.length} Pages</span>
              <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Action 2: Revise */}
          <div
            onClick={() => setActiveTab('revise')}
            className="surface-card hover:surface-elevated rounded-3xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-stone-900 group-hover:text-teal-700 transition-colors">
                Spaced Revision
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Automated memory intervals: Today → 3 Days → Exam
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-teal-700">
              <span>Daily Retrieval</span>
              <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Action 3: Practice */}
          <div
            onClick={() => setActiveTab('practice')}
            className="surface-card hover:surface-elevated rounded-3xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-stone-900 group-hover:text-emerald-700 transition-colors">
                Answer Rebuild
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Question → Keywords → Skeleton → AI Answer Checker
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <span>Exam Skeletons</span>
              <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Action 4: Ask AI */}
          <div
            onClick={() => openAiModal()}
            className="surface-card hover:surface-elevated rounded-3xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-stone-900 group-hover:text-purple-700 transition-colors">
                Ask AI Doubt
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                “Naku idi ardham kaaledu” — Instant Teenglish tutor
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-purple-700">
              <span>Contextual Tutor</span>
              <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
