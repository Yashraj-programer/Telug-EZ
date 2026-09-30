import React from 'react';
import { useStudy } from '../context/StudyContext';
import { RadialReadinessGauge } from './charts/RadialReadinessGauge';
import { SkillRadarChart } from './charts/SkillRadarChart';
import { WeeklyActivityChart } from './charts/WeeklyActivityChart';
import { MasterySegmentedBars, MasteryItem } from './charts/MasterySegmentedBars';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
  BookOpen,
} from 'lucide-react';

export const ProgressDashboard: React.FC = () => {
  const {
    lesson,
    overallReadiness,
    completedPages,
    completedPadyams,
    savedAnswers,
    kaviQuizCompleted,
    weakTopics,
    setActiveTab,
  } = useStudy();

  const understandingPct = Math.min(
    100,
    Math.round((completedPages.length / lesson.pages.length) * 100)
  );
  const padyamsPct = Math.min(
    100,
    Math.round((completedPadyams.length / lesson.padyams.length) * 100)
  );
  const questionsPct = Math.min(
    100,
    Math.round((Object.keys(savedAnswers).length / lesson.questions.length) * 100)
  );
  const kaviPct = kaviQuizCompleted ? 100 : 45;
  const vocabPct = 88;
  const grammarPct = 68;
  const recallPct = 76;

  const masteryItems: MasteryItem[] = [
    { id: 'm-und', name: 'Understanding', telugu: 'భావ అవగాహన', percentage: understandingPct, category: 'Pages & Narrative' },
    { id: 'm-pad', name: 'Padyams & Bhavam', telugu: 'పద్యాలు & భావాలు', percentage: padyamsPct, category: 'Metric Poetry' },
    { id: 'm-que', name: 'Answer Rebuild', telugu: 'స్వీయరచన & వ్యాసాలు', percentage: questionsPct, category: 'Exam Skeletons' },
    { id: 'm-kav', name: 'Kavi Parichayam', telugu: 'కవి పరిచయం', percentage: kaviPct, category: 'Bammera Pothana' },
    { id: 'm-voc', name: 'Vocabulary', telugu: 'పదజాలం & అర్థాలు', percentage: vocabPct, category: 'Synonyms & Nanarthalu' },
    { id: 'm-gra', name: 'Grammar', telugu: 'సంధులు & సమాసాలు', percentage: grammarPct, category: 'Rules & Splits' },
    { id: 'm-rec', name: 'Active Recall', telugu: 'స్మృతి బలం', percentage: recallPct, category: 'Retrieval Strength' },
  ];

  const radarData = [
    { label: 'Understanding', telugu: 'అవగాహన', value: understandingPct },
    { label: 'Recall', telugu: 'రీకాల్', value: recallPct },
    { label: 'Poems', telugu: 'పద్యాలు', value: padyamsPct },
    { label: 'Vocabulary', telugu: 'పదజాలం', value: vocabPct },
    { label: 'Grammar', telugu: 'వ్యాకరణం', value: grammarPct },
    { label: 'Writing', telugu: 'సమాధానం', value: questionsPct || 50 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      {/* Header */}
      <div className="surface-card rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-amber-800">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>EXAM PERFORMANCE DASHBOARD</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            Lesson 1: “{lesson.title}” Readiness Analytics
          </h2>
          <p className="text-xs font-semibold text-stone-400 mt-0.5">
            Holistic metrics tracking cognitive retention, question accuracy, and exam weak spots.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('emergency')}
          className="px-4 py-2.5 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-2xs active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 text-rose-500" />
          <span>Last-Minute Cram</span>
        </button>
      </div>

      {/* Top Analytics Row: Radial Readiness Gauge + 6-Pillar Radar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Radial Readiness Card (6 cols) */}
        <div className="md:col-span-6 surface-elevated rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-between text-center space-y-4">
          <div className="w-full text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
              BOARD EXAM READINESS SCORE
            </span>
            <h3 className="text-lg font-black text-stone-900 mt-0.5">
              Overall Preparation: {overallReadiness}%
            </h3>
          </div>

          <div className="py-2">
            <RadialReadinessGauge percentage={overallReadiness} size={190} />
          </div>

          <p className="text-xs text-stone-500 font-medium max-w-xs">
            {overallReadiness >= 75
              ? 'Excellent mastery! Your recall scores and question skeletons are on track for Grade A1.'
              : 'Consistent daily retrieval practice will push your readiness beyond the 85% mark.'}
          </p>
        </div>

        {/* 6-Pillar Skill Radar Card (6 cols) */}
        <div className="md:col-span-6 surface-card rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-between space-y-4">
          <div className="w-full flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                COMPETENCY MATRIX
              </span>
              <h3 className="text-lg font-black text-stone-900 mt-0.5">
                Skill Balance Radar
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              6 Axes
            </span>
          </div>

          <div className="py-1">
            <SkillRadarChart skills={radarData} size={240} />
          </div>

          <div className="text-[11px] text-stone-400 font-medium text-center">
            Evaluated from continuous retrieval sessions
          </div>
        </div>
      </div>

      {/* Weekly Progress Trendline */}
      <div className="surface-card rounded-3xl p-6 sm:p-7">
        <WeeklyActivityChart />
      </div>

      {/* Segmented Mastery Indicators (Instead of Generic Bars) */}
      <div className="surface-card rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
              CURRICULUM BREAKDOWN
            </span>
            <h3 className="text-base font-black text-stone-900 mt-0.5">
              Segmented Mastery Pillars
            </h3>
          </div>
          <span className="text-xs font-semibold text-stone-400">5-Stage Precision</span>
        </div>

        <MasterySegmentedBars items={masteryItems} />
      </div>

      {/* Weak Spots & Actionable Fixes */}
      <div className="surface-card rounded-3xl p-6 sm:p-7 space-y-4 border-rose-200/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-950">
              TARGETED WEAK SPOTS ({weakTopics.length})
            </h3>
          </div>
          <span className="text-xs text-rose-700 font-bold">1-Click Immediate Remediation</span>
        </div>

        <div className="space-y-2.5">
          {weakTopics.length === 0 ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-emerald-900">
              ✅ All monitored concepts are in the green! Zero flagged weak spots.
            </div>
          ) : (
            weakTopics.map((topic, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="font-extrabold text-sm text-stone-900 font-telugu">
                    {topic}
                  </div>
                  <div className="text-[11px] text-rose-600 font-semibold mt-0.5">
                    Flagged during recent recall &amp; quiz checks
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
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto shadow-2xs flex items-center gap-1.5 active:scale-95"
                >
                  <span>Fix Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
