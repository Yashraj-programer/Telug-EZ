import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { DifficultyLevel } from '../types';
import { Confetti } from './ui/Confetti';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronRight,
  Brain,
} from 'lucide-react';

interface DrillQuestion {
  id: string;
  difficulty: DifficultyLevel;
  type: 'keyword' | 'meaning' | 'event' | 'grammar' | 'vocab';
  prompt: string;
  promptTeenglish?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  weakTag: string;
}

const DRILL_QUESTIONS: DrillQuestion[] = [
  // EASY
  {
    id: 'd-1',
    difficulty: 'easy',
    type: 'meaning',
    prompt: 'పాఠం పేరు “చల్దులారగించుట” లో "చల్ది" అంటే ఏమిటి?',
    promptTeenglish: 'In the title "Chaldularaginchuta", what does "Chaldi" mean?',
    options: ['రాత్రి మిగిలిన చద్దన్నం / పెరుగు అన్నం', 'వేడి పాలు', 'అడవి తేనె', 'మొక్కజొన్న కంకి'],
    correctAnswer: 'రాత్రి మిగిలిన చద్దన్నం / పెరుగు అన్నం',
    explanation: 'చల్ది అంటే ఇళ్ల నుంచి తెచ్చుకున్న చద్దన్నము (రాత్రి తోడుపెట్టిన పెరుగు అన్నం).',
    weakTag: 'చల్ది అర్థం',
  },
  {
    id: 'd-2',
    difficulty: 'easy',
    type: 'event',
    prompt: 'బాలురందరూ ఎవరి చుట్టూ గుండ్రంగా కూర్చున్నారు?',
    promptTeenglish: 'Around whom did the boys sit in concentric circles?',
    options: ['శ్రీకృష్ణుడు', 'బలరాముడు మాత్రమే', 'పెద్ద ఆవు', 'వృక్షము కింద ముని'],
    correctAnswer: 'శ్రీకృష్ణుడు',
    explanation: 'శ్రీకృష్ణుడు తామర కర్ణిక వలె మధ్యలో ఉండగా అందరూ చుట్టూ కూర్చున్నారు.',
    weakTag: 'కృష్ణుడు మధ్యలో కూర్చోవడం',
  },
  // MEDIUM
  {
    id: 'd-3',
    difficulty: 'medium',
    type: 'meaning',
    prompt: 'గోపబాలురు కృష్ణుడి చుట్టూ కూర్చున్న విధానాన్ని కవి దేనితో పోల్చారు?',
    promptTeenglish: 'What did the poet compare the seating arrangement to?',
    options: [
      'తామరపువ్వు కర్ణిక చుట్టూ ఉన్న రేకులతో',
      'చంద్రుడి చుట్టూ ఉన్న నక్షత్రాలతో',
      'రావణుడి సభలోని సైనికులతో',
      'సముద్రపు అలలతో',
    ],
    correctAnswer: 'తామరపువ్వు కర్ణిక చుట్టూ ఉన్న రేకులతో',
    explanation: 'కృష్ణుడు తామర కర్ణిక (మధ్య భాగం) వలె ఉండగా, బాలురు రేకుల వలె ఒద్దికగా కూర్చున్నారు.',
    weakTag: 'తామరపువ్వు కర్ణిక ఉపమానం',
  },
  {
    id: 'd-4',
    difficulty: 'medium',
    type: 'grammar',
    prompt: '‘యమునాతీరము’ ఏ సమాసము?',
    promptTeenglish: 'Which Samasam is "Yamunatheeramu"?',
    options: [
      'షష్ఠీ తత్పురుష సమాసము (యమున యొక్క తీరము)',
      'ద్వంద్వ సమాసము',
      'ద్విగు సమాసము',
      'బహువ్రీహి సమాసము',
    ],
    correctAnswer: 'షష్ఠీ తత్పురుష సమాసము (యమున యొక్క తీరము)',
    explanation: 'ఉత్తర పదార్థ ప్రాధాన్యం ఉండి "యొక్క" విభక్తి ప్రత్యయం వచ్చింది కాబట్టి షష్ఠీ తత్పురుష.',
    weakTag: 'తత్పురుష సమాసాలు',
  },
  // HARD
  {
    id: 'd-5',
    difficulty: 'hard',
    type: 'vocab',
    prompt: '“కర్ణిక” అను పదానికి సరైన అర్థం గుర్తించండి:',
    promptTeenglish: 'Identify the exact literary meaning of "Karnika":',
    options: [
      'తామరపువ్వు మధ్యలో ఉండే గింజల తిత్తి / గుండ్రని భాగం',
      'చెవికి పెట్టుకునే బంగారు ఆభరణం మాత్రమే',
      'చేతిలోని వేణువు',
      'నదీ ప్రవాహ వేగం',
    ],
    correctAnswer: 'తామరపువ్వు మధ్యలో ఉండే గింజల తిత్తి / గుండ్రని భాగం',
    explanation: 'పద్మ కర్ణిక అంటే తామరపువ్వు మధ్యభాగం (Seed-pod).',
    weakTag: 'కర్ణిక భావం',
  },
  {
    id: 'd-6',
    difficulty: 'hard',
    type: 'grammar',
    prompt: '‘దేవేంద్రుడు’ పదాన్ని విడదీస్తే సంధి నియమం ఏమిటి?',
    promptTeenglish: 'Split "Devendrudu" and identify the Sandhi rule:',
    options: [
      'దేవ + ఇంద్రుడు (గుణ సంధి - అ + ఇ = ఏ)',
      'దేవ + ఈంద్రుడు (సవర్ణదీర్ఘ సంధి)',
      'దేవుడు + ఇంద్రుడు (ఉత్వ సంధి)',
      'దేవీ + ఇంద్రుడు (యణాదేశ సంధి)',
    ],
    correctAnswer: 'దేవ + ఇంద్రుడు (గుణ సంధి - అ + ఇ = ఏ)',
    explanation: 'అ-కారమునకు ఇ పరమైనప్పుడు "ఏ" గుణ సంధి ఆదేశంగా వస్తుంది.',
    weakTag: 'గుణ సంధి నియమం',
  },
];

export const RecallEngine: React.FC = () => {
  const { addXP, addWeakTopic, removeWeakTopic } = useStudy();

  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel>('easy');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);

  const filteredQuestions = DRILL_QUESTIONS.filter((q) => q.difficulty === activeDifficulty);
  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      addXP(15, 'రీకాల్ సరైన సమాధానం! (+15 XP)');
      removeWeakTopic(currentQ.weakTag);
      setShowConfetti(true);
    } else {
      addXP(5, 'ప్రయత్నించినందుకు (+5 XP)');
      addWeakTopic(currentQ.weakTag);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header with Brain Mode Indicator */}
      <div className="surface-card rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-teal-700">
            <Brain className="w-3.5 h-3.5" />
            <span>BRAIN MODE • ACTIVE RETRIEVAL PRACTICE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            Zero-Distraction Recall Drill
          </h2>
          <p className="text-xs font-semibold text-stone-400 mt-0.5">
            Test yourself before glancing at answers to solidify recall for the board exam.
          </p>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
          {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setActiveDifficulty(lvl);
                setCurrentIndex(0);
                setSelectedOption(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeDifficulty === lvl
                  ? lvl === 'easy'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : lvl === 'medium'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Focused Retrieval Card */}
      {currentQ && (
        <div className="surface-elevated rounded-3xl p-6 sm:p-8 space-y-6 animate-pop border-stone-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700">
                {currentQ.type.toUpperCase()} DRILL
              </span>
              <span className="text-xs font-mono-numbers font-bold text-stone-400">
                #{currentIndex + 1} of {filteredQuestions.length}
              </span>
            </div>

            <div className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Score: <span className="font-mono-numbers font-black">{score}</span> Correct
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-2xl font-black font-telugu text-stone-900 leading-snug">
              {currentQ.prompt}
            </h3>
            {currentQ.promptTeenglish && (
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
                {currentQ.promptTeenglish}
              </p>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let style =
                'bg-white border-stone-200 text-stone-800 hover:border-teal-400 hover:bg-stone-50';

              if (selectedOption) {
                if (isCorrect) {
                  style = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                } else if (isSelected) {
                  style = 'bg-rose-100 border-rose-400 text-rose-950 line-through';
                } else {
                  style = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
                }
              }

              return (
                <button
                  key={opt}
                  disabled={Boolean(selectedOption)}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer font-telugu flex items-start gap-3 ${style}`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    {selectedOption && isCorrect ? '✓' : selectedOption && isSelected ? '✕' : '•'}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Box */}
          {selectedOption && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1 animate-fade-in ${
                selectedOption === currentQ.correctAnswer
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="font-black uppercase tracking-wider flex items-center gap-1.5">
                {selectedOption === currentQ.correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>EXCELLENT! CONCEPT RETRIEVED (+15 XP)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>CONCEPT LOGGED TO WEAK AREAS FOR SPACED REVIEW</span>
                  </>
                )}
              </div>
              <p className="font-medium font-telugu">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {selectedOption && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 active:scale-95 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>NEXT RECALL QUESTION</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
