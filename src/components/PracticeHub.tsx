import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { AnswerRebuildSystem } from './AnswerRebuildSystem';
import { QuestionDecoder } from './QuestionDecoder';
import { RecallEngine } from './RecallEngine';
import {
  PenTool,
  Search,
  RotateCcw,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';

type PracticeSubView = 'answer_builder' | 'decoder' | 'recall' | 'exam_mode' | 'vocab_grammar';

export const PracticeHub: React.FC = () => {
  const { lesson, activeTab, setActiveTab } = useStudy();

  const [subView, setSubView] = useState<PracticeSubView>(() => {
    if (activeTab === 'decoder') return 'decoder';
    if (activeTab === 'answer_builder') return 'answer_builder';
    return 'answer_builder';
  });

  const [timedQuizActive, setTimedQuizActive] = useState(false);
  const [timedQuizScore, setTimedQuizScore] = useState<number | null>(null);
  const [userSelectedAnswers, setUserSelectedAnswers] = useState<Record<number, number>>({});

  const TIMED_EXAM_QUESTIONS = [
    {
      question: 'శ్రీకృష్ణుడు మరియు గోపబాలురు చల్దులు ఎక్కడ ఆరగించారు?',
      options: ['యమునా నదీ తీరంలో', 'గంగా నదీ తీరంలో', 'బృందావన గృహంలో', 'రాజాస్థానంలో'],
      correctIndex: 0,
    },
    {
      question: 'కృష్ణుడు మధ్యలో కర్ణిక వలె ఉండగా బాలురు ఏ విధంగా కూర్చున్నారు?',
      options: ['తామరపువ్వు రేకుల వలె', 'చతురస్రంగా', 'ఒకరి వెనుక ఒకరు', 'చెట్ల కొమ్మలపై'],
      correctIndex: 0,
    },
    {
      question: 'బమ్మెర పోతన రచనలలో మొదటి దండకం ఏది?',
      options: ['భోగినీ దండకం', 'వీరభద్ర విజయం', 'నారాయణ శతకం', 'భాగవతం'],
      correctIndex: 0,
    },
    {
      question: '“ఆరగించుట” అను పదానికి అర్థం ఏమిటి?',
      options: ['భోజనం చేయుట / తినుట', 'ఆటలాడుట', 'విశ్రమించుట', 'పాట పాడుట'],
      correctIndex: 0,
    },
  ];

  const handleFinishTimedQuiz = () => {
    let sc = 0;
    TIMED_EXAM_QUESTIONS.forEach((q, idx) => {
      if (userSelectedAnswers[idx] === q.correctIndex) sc++;
    });
    setTimedQuizScore(sc);
    setTimedQuizActive(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Segmented Control */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none select-none">
        <button
          onClick={() => setSubView('answer_builder')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            subView === 'answer_builder'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'surface-card text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Answer Rebuild (AI Checker)</span>
        </button>

        <button
          onClick={() => setSubView('decoder')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            subView === 'decoder'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'surface-card text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Question Decoder</span>
        </button>

        <button
          onClick={() => setSubView('recall')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            subView === 'recall'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'surface-card text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Recall Engine (Brain Mode)</span>
        </button>

        <button
          onClick={() => setSubView('exam_mode')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            subView === 'exam_mode'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'surface-card text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Exam Mode (Timed Test)</span>
        </button>

        <button
          onClick={() => setSubView('vocab_grammar')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            subView === 'vocab_grammar'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'surface-card text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Vocab &amp; Grammar</span>
        </button>
      </div>

      {/* Render Active Sub-View */}
      {subView === 'answer_builder' && <AnswerRebuildSystem />}
      {subView === 'decoder' && <QuestionDecoder />}
      {subView === 'recall' && <RecallEngine />}

      {/* EXAM MODE: TIMED TEST */}
      {subView === 'exam_mode' && (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
          <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                  EXAM MODE: TIMED DRILL
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-0.5">
                  10-Minute High-Impact Exam Simulation
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-mono-numbers font-black">
                4 Questions • Board Aligned
              </span>
            </div>

            {!timedQuizActive && timedQuizScore === null && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="text-lg font-black text-stone-900">
                    Ready to test your Lesson 1 retention?
                  </h4>
                  <p className="text-xs text-stone-500 font-medium">
                    Strict timed conditions simulating real Telugu SL board examination questions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTimedQuizActive(true);
                    setUserSelectedAnswers({});
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>START TIMED TEST</span>
                </button>
              </div>
            )}

            {timedQuizActive && (
              <div className="space-y-6 animate-fade-in">
                {TIMED_EXAM_QUESTIONS.map((q, idx) => (
                  <div key={idx} className="p-4.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <p className="text-sm font-bold text-stone-900 font-telugu">
                      {idx + 1}. {q.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = userSelectedAnswers[idx] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() =>
                              setUserSelectedAnswers((prev) => ({ ...prev, [idx]: oIdx }))
                            }
                            className={`p-3.5 rounded-xl border text-xs text-left font-medium transition-all cursor-pointer font-telugu ${
                              isSelected
                                ? 'bg-stone-900 text-white border-stone-900 font-bold'
                                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleFinishTimedQuiz}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer text-center active:scale-95"
                >
                  SUBMIT &amp; EVALUATE TEST
                </button>
              </div>
            )}

            {timedQuizScore !== null && (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3 animate-pop">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-emerald-950 font-mono-numbers">
                  Test Score: {timedQuizScore} / {TIMED_EXAM_QUESTIONS.length}
                </h4>
                <p className="text-xs text-emerald-800 font-medium">
                  {timedQuizScore >= 3
                    ? 'Superb! You have high cognitive retention of Lesson 1 concepts.'
                    : 'Good attempt! Review the Padyam and Kavi sections to strengthen weak spots.'}
                </p>
                <button
                  onClick={() => {
                    setTimedQuizScore(null);
                    setTimedQuizActive(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Retake Test
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VOCAB & GRAMMAR EXPLORER */}
      {subView === 'vocab_grammar' && (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
          {/* Vocabulary Card */}
          <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-800">
              Lesson 1 Vocabulary &amp; Word Meanings ({lesson.vocabulary.length} Words)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lesson.vocabulary.map((v) => (
                <div key={v.id} className="p-4 rounded-2xl bg-[#FFFDF9] border border-stone-200/90 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-stone-900 font-telugu">
                      {v.word}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700">
                      {v.category}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-amber-950 font-telugu">
                    అర్థం: {v.teluguMeaning}
                  </p>
                  <p className="text-xs text-stone-600 font-medium">{v.englishMeaning}</p>
                  {v.vikruthiOrSynonym && (
                    <p className="text-[11px] font-semibold text-purple-800 pt-1 border-t border-stone-100">
                      {v.vikruthiOrSynonym}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Grammar Card */}
          <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-800">
              Class 10 Grammar Rules ({lesson.grammar.length} Topics)
            </h3>
            <div className="space-y-3">
              {lesson.grammar.map((g) => (
                <div key={g.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-stone-950 font-telugu">{g.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-800">
                      {g.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-telugu font-semibold text-stone-800">
                    సూత్రం: {g.ruleTelugu}
                  </p>
                  <p className="text-xs text-stone-500 font-medium">
                    Teenglish Rule: {g.teenglishRule}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    {g.examples.map((ex, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 font-telugu">
                        <span className="font-bold">{ex.word}</span> = {ex.split} ({ex.explanation})
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
