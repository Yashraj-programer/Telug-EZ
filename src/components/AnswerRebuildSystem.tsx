import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { requestCheckAnswer } from '../services/aiClient';
import { AnswerEvaluation } from '../types';
import { KeywordChip } from './ui/KeywordChip';
import { Confetti } from './ui/Confetti';
import {
  PenTool,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Loader2,
  Award,
  BookOpen,
} from 'lucide-react';

export const AnswerRebuildSystem: React.FC = () => {
  const {
    lesson,
    selectedQuestionId,
    setSelectedQuestionId,
    savedAnswers,
    saveStudentAnswer,
    openAiModal,
  } = useStudy();

  const currentQ =
    lesson.questions.find((q) => q.id === selectedQuestionId) || lesson.questions[0];

  const [studentInput, setStudentInput] = useState(
    savedAnswers[currentQ.id]?.answer || ''
  );
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectQuestion = (id: string) => {
    setSelectedQuestionId(id);
    setStudentInput(savedAnswers[id]?.answer || '');
    setEvaluation(null);
    setShowModelAnswer(false);
  };

  const handleCheckAnswer = async () => {
    if (!studentInput.trim()) return;
    setIsEvaluating(true);
    try {
      const result = await requestCheckAnswer({
        questionTelugu: currentQ.questionTelugu,
        expectedKeyPoints: currentQ.expectedKeyPoints,
        studentAnswer: studentInput,
        marks: currentQ.marks,
      });

      setEvaluation(result);
      saveStudentAnswer(currentQ.id, studentInput, result.scoreEstimate);
      if (result.mainIdea.status === 'correct') {
        setShowConfetti(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const insertKeyTrigger = (trigger: string) => {
    setStudentInput((prev) => (prev ? `${prev} ${trigger}` : trigger));
  };

  const copyModelAnswer = () => {
    navigator.clipboard.writeText(currentQ.modelAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSemanticLabel = () => {
    if (currentQ.questionTelugu.includes('ఎందుకు')) return { label: 'WHY / REASON', color: 'bg-amber-100 text-amber-900 border-amber-200' };
    if (currentQ.questionTelugu.includes('వర్ణించండి')) return { label: 'DESCRIBE / IMAGERY', color: 'bg-sky-100 text-sky-900 border-sky-200' };
    if (currentQ.questionTelugu.includes('కవి పరిచయం') || currentQ.questionTelugu.includes('కవిపరిచయం')) return { label: 'POET BIO', color: 'bg-purple-100 text-purple-900 border-purple-200' };
    return { label: 'EXPLAIN / ANALYZE', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' };
  };

  const semantic = getSemanticLabel();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header & Question Picker */}
      <div className="surface-card rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-emerald-700">
            <PenTool className="w-3.5 h-3.5" />
            <span>ANSWER REBUILD ENGINE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 font-telugu">
            Concept-Driven Answer Builder
          </h2>
          <p className="text-xs font-semibold text-stone-400 mt-0.5">
            Never memorize paragraphs blindly — reconstruct answers with keyword roadmaps!
          </p>
        </div>

        {/* Question Selector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {lesson.questions.map((q, idx) => {
            const isSelected = q.id === currentQ.id;
            const hasSaved = Boolean(savedAnswers[q.id]);

            return (
              <button
                key={q.id}
                onClick={() => handleSelectQuestion(q.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : hasSaved
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>ప్రశ్న {idx + 1} ({q.marks}M)</span>
                {hasSaved && <Check className="w-3.5 h-3.5 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Question Breakdown Card */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 space-y-5 border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${semantic.color}`}>
              {semantic.label}
            </span>
            <span className="text-[11px] font-mono-numbers font-extrabold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
              {currentQ.marks} Marks
            </span>
          </div>

          <button
            onClick={() => setShowModelAnswer(!showModelAnswer)}
            className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer transition-colors"
          >
            {showModelAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showModelAnswer ? 'Hide Model Answer' : 'Peek Model Answer'}</span>
          </button>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-black font-telugu text-stone-900 leading-snug">
            {currentQ.questionTelugu}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            {currentQ.questionEnglish}
          </p>
        </div>

        {/* Peek Model Answer Drawer */}
        {showModelAnswer && (
          <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-amber-300 space-y-3 animate-fade-in shadow-2xs">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <span className="text-[10px] font-black uppercase text-amber-950 tracking-wider">
                Official Model Answer (ఆదర్శ సమాధానం)
              </span>
              <button
                onClick={copyModelAnswer}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 p-1 rounded hover:bg-amber-100"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="font-telugu text-stone-900 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
              {currentQ.modelAnswer}
            </p>
          </div>
        )}

        {/* Answer Skeleton Roadmap Accordion */}
        <div className="surface-card rounded-2xl p-4.5 space-y-3 border-stone-200">
          <div
            onClick={() => setShowSkeleton(!showSkeleton)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-black uppercase tracking-wider text-stone-800">
                Answer Skeleton &amp; Key Points ({currentQ.expectedKeyPoints.length} Points)
              </span>
            </div>
            {showSkeleton ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
          </div>

          {showSkeleton && (
            <div className="space-y-3 pt-2 border-t border-stone-100 animate-fade-in">
              <div className="space-y-1.5">
                {currentQ.answerSkeleton.map((step, idx) => (
                  <div key={idx} className="text-xs sm:text-sm font-semibold text-stone-700 flex items-start gap-2 font-telugu">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono-numbers font-bold flex items-center justify-center flex-shrink-0 mt-1">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1.5">
                  Tap keywords to insert into your answer:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentQ.keywords.map((kw, idx) => (
                    <KeywordChip key={idx} keyword={kw} onClick={() => insertKeyTrigger(kw)} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Student Workspace */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-stone-800 block">
              REBUILD ANSWER IN YOUR OWN WORDS (మీ సొంత మాటల్లో రాయండి):
            </label>
            <span className="font-mono-numbers text-[11px] text-stone-400 font-semibold">
              {studentInput.length} chars
            </span>
          </div>

          <textarea
            value={studentInput}
            onChange={(e) => setStudentInput(e.target.value)}
            rows={5}
            placeholder="గోపబాలురు ఎండ తీవ్రత వల్ల అలసిపోయారు. కృష్ణుడు వారందరినీ చెట్ల నీడకు పిలిచి..."
            className="w-full p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-stone-900 font-telugu text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              onClick={() =>
                openAiModal(
                  currentQ.questionTelugu,
                  'How can I structure this Telugu answer to get full marks in 4 points?'
                )
              }
              className="text-xs font-bold text-stone-500 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Ask Doubt on Answer Strategy</span>
            </button>

            <button
              onClick={handleCheckAnswer}
              disabled={isEvaluating || !studentInput.trim()}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Concepts…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CHECK MY ANSWER (+30 XP)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Structured Critique Report Card */}
      {evaluation && (
        <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-5 animate-pop border-2 border-emerald-400">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="text-base font-black text-stone-900">
                Evaluation Report &amp; Marks Estimate
              </h3>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-300">
              Estimated Score: {evaluation.scoreEstimate}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-stone-700">
                {evaluation.mainIdea.status === 'correct' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                <span>MAIN IDEA: {evaluation.mainIdea.status.toUpperCase()}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 font-medium">
                {evaluation.mainIdea.comment}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>LANGUAGE &amp; STYLE: {evaluation.language.status.toUpperCase()}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 font-medium">
                {evaluation.language.comment}
              </p>
            </div>
          </div>

          {/* Key Points Matched vs Missing */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
              RUBRIC KEY POINTS HIT:
            </span>
            <div className="space-y-2">
              {evaluation.keyPoints.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 font-medium ${
                    item.matched
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50/70 border-rose-300 text-rose-950'
                  }`}
                >
                  {item.matched ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="font-telugu">{item.point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Improvement */}
          <div className="p-4.5 rounded-2xl bg-[#FFFDF8] border border-amber-300 space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>EXAM-READY SUGGESTED IMPROVEMENT</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-stone-800 font-telugu leading-relaxed">
              {evaluation.suggestedImprovement}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
