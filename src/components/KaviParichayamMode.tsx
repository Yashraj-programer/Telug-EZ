import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { Confetti } from './ui/Confetti';
import {
  UserCheck,
  Sparkles,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Award,
  Scroll,
} from 'lucide-react';

export const KaviParichayamMode: React.FC = () => {
  const { lesson, kaviQuizCompleted, setKaviQuizCompleted, addXP } = useStudy();
  const kavi = lesson.kaviParichayam;

  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timerSeconds, setTimerSeconds] = useState(10);
  const [showFullAnswer, setShowFullAnswer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!quizActive || kaviQuizCompleted) return;

    if (timerSeconds <= 0) {
      if (currentQuestionIndex < kavi.quizQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimerSeconds(10);
      } else {
        finishQuiz();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [quizActive, timerSeconds, currentQuestionIndex, kaviQuizCompleted]);

  const handleSelectQuizOption = (optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: optIndex }));

    setTimeout(() => {
      if (currentQuestionIndex < kavi.quizQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimerSeconds(10);
      } else {
        finishQuiz();
      }
    }, 450);
  };

  const finishQuiz = () => {
    setQuizActive(false);
    setKaviQuizCompleted(true);
    setShowConfetti(true);
    addXP(25, 'కవి పరిచయం క్విజ్ పూర్తి! (+25 XP)');
  };

  const restartQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setTimerSeconds(10);
    setQuizActive(true);
    setKaviQuizCompleted(false);
  };

  const copyFullAnswer = () => {
    navigator.clipboard.writeText(kavi.fullExamAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentQ = kavi.quizQuestions[currentQuestionIndex];
  const totalCorrect = Object.entries(selectedAnswers).filter(
    ([qIdx, ansIdx]) => kavi.quizQuestions[parseInt(qIdx, 10)].correctIndex === ansIdx
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Profile Dossier Hero */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-white via-[#FFFDF8] to-purple-50/30 border-purple-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 to-purple-500 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-purple-600/20 font-telugu flex-shrink-0">
              పో
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200">
                  KAVI PROFILE DOSSIER
                </span>
                <span className="text-xs font-bold text-stone-400">Class 10 TS Board</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-telugu">
                {kavi.kaviName}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                15వ శతాబ్దం • తెలంగాణ ప్రజా కవి • సహజ పండితుడు
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowFullAnswer(!showFullAnswer)}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 text-xs font-black transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-2xs active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>{showFullAnswer ? 'Show Memory Cards' : 'Show Full Exam Answer (4M)'}</span>
          </button>
        </div>
      </div>

      {/* FULL EXAM ANSWER VIEW */}
      {showFullAnswer ? (
        <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-5 animate-fade-in border-purple-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-purple-900">
              <Award className="w-4 h-4 text-purple-600" />
              <span>Full 4-Mark Board Exam Answer Sheet</span>
            </div>
            <button
              onClick={copyFullAnswer}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 p-1.5 rounded-xl hover:bg-stone-100 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Answer'}</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 font-telugu text-base sm:text-lg text-stone-900 leading-loose whitespace-pre-line font-medium">
            {kavi.fullExamAnswer}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950">
            🎯 Scoring Secret: Writing these exact 6 points in distinct bullet points guarantees full 4/4 marks in the Telugu Second Language exam!
          </div>
        </div>
      ) : (
        /* VISUAL MEMORY CARDS VIEW */
        <div className="space-y-6">
          {/* 6 Memory Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {kavi.memoryCode.map((item, idx) => (
              <div
                key={idx}
                className="surface-card rounded-2xl p-5 hover:border-purple-300 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-100">
                    {item.label}
                  </span>
                  <span className="font-mono-numbers text-xs font-bold text-stone-300">#{idx + 1}</span>
                </div>
                <div className="text-lg font-black font-telugu text-stone-900 leading-snug group-hover:text-purple-950 transition-colors">
                  {item.value}
                </div>
                <div className="text-xs text-stone-400 font-medium">
                  {item.teenglish}
                </div>
              </div>
            ))}
          </div>

          {/* Visual Memory Chain Code Bar */}
          <div className="p-5 rounded-3xl bg-stone-900 text-white space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE 6-STEP POET MEMORY CODE</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-black text-stone-200">
              <span className="bg-white/10 px-3 py-1.5 rounded-xl font-telugu">పోతన</span>
              <span className="text-amber-400">→</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-xl">15వ శతాబ్దం</span>
              <span className="text-amber-400">→</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-xl font-telugu">బమ్మెర గ్రామం</span>
              <span className="text-amber-400">→</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-xl font-telugu">లక్కమాంబ-కేసన</span>
              <span className="text-amber-400">→</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-xl font-telugu">భాగవతం</span>
              <span className="text-amber-400">→</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-xl font-telugu">సహజ పండితుడు</span>
            </div>
          </div>

          {/* 10-Second Recall Quiz Section */}
          <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-800">
                  RAPID RETRIEVAL DRILL
                </span>
                <h3 className="text-lg font-black text-stone-900 mt-0.5">
                  10-Second Kavi Recall Quiz
                </h3>
              </div>
              {quizActive && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-mono-numbers font-black animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timerSeconds}s</span>
                </div>
              )}
            </div>

            {!quizActive && !kaviQuizCompleted && (
              <div className="text-center py-6 space-y-3">
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto font-medium">
                  Test your active memory of Bammera Pothana with 4 rapid 10-second recall questions before looking at the full answer.
                </p>
                <button
                  onClick={() => setQuizActive(true)}
                  className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-black text-xs shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>START 10-SECOND QUIZ</span>
                </button>
              </div>
            )}

            {quizActive && currentQ && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-stone-400">
                  <span>
                    Question {currentQuestionIndex + 1} of {kavi.quizQuestions.length}
                  </span>
                  <span>10s Speed Quiz</span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-stone-900 font-telugu">
                  {currentQ.question}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectQuizOption(oIdx)}
                        className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer font-telugu ${
                          isSelected
                            ? 'bg-purple-100 border-purple-400 text-purple-950 font-bold'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-purple-50/50 hover:border-purple-200'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {kaviQuizCompleted && (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-pop">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-emerald-950">
                    Kavi Parichayam Mastered!
                  </h4>
                  <p className="text-xs font-semibold text-emerald-800 mt-1">
                    You scored {totalCorrect} / {kavi.quizQuestions.length} in rapid recall.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={restartQuiz}
                    className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                  <button
                    onClick={() => setShowFullAnswer(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    View Exam Answer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
