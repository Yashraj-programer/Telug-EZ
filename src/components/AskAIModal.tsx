import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { requestDoubt } from '../services/aiClient';
import { DoubtResponse } from '../server/aiService';
import {
  X,
  Sparkles,
  Loader2,
  Send,
  BookOpen,
  Wand2,
  Lightbulb,
} from 'lucide-react';

const COMMON_DOUBTS = [
  'Explain in simple Teenglish',
  'Give me a real-life analogy',
  'Why is this lotus comparison important in the exam?',
  'Give me a memory trick',
  'Naku idi ardham kaaledu (I don’t understand this)',
];

export const AskAIModal: React.FC = () => {
  const { aiModalOpen, closeAiModal, aiModalContext } = useStudy();

  const [question, setQuestion] = useState(aiModalContext.initialQuestion || '');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<DoubtResponse | null>(null);

  useEffect(() => {
    if (aiModalContext.initialQuestion) {
      setQuestion(aiModalContext.initialQuestion);
    } else {
      setQuestion('');
    }
    setResponse(null);
  }, [aiModalContext]);

  if (!aiModalOpen) return null;

  const handleAsk = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const data = await requestDoubt(q, aiModalContext.contextText);
      setResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-fade-in select-none">
      <div className="surface-elevated rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-5 animate-pop">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                TELUGU EZ CONTEXT TUTOR
              </h3>
              <p className="text-[11px] font-semibold text-stone-400">
                Contextual doubts in simple Teenglish &amp; exam Telugu
              </p>
            </div>
          </div>
          <button
            onClick={closeAiModal}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Study Snippet Payload */}
        {aiModalContext.contextText && (
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-stone-700 space-y-1">
            <span className="font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5 text-[10px]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>ACTIVE STUDY CONTEXT:</span>
            </span>
            <p className="font-telugu line-clamp-2 font-medium">
              "{aiModalContext.contextText}"
            </p>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
            ONE-CLICK STUDENT QUESTIONS:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_DOUBTS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(chip);
                  handleAsk(chip);
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-950 text-xs font-semibold transition-all cursor-pointer border border-stone-200"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input Field */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Ask anything in English, Telugu, or Teenglish..."
              className="flex-1 p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading || !question.trim()}
              className="p-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center shadow-xs active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-amber-400" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Loading state indicator */}
        {loading && (
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2 animate-fade-in">
            <Loader2 className="w-6 h-6 animate-spin text-amber-600 mx-auto" />
            <p className="text-xs font-bold text-stone-600">Making this easier for your brain…</p>
          </div>
        )}

        {/* Layered Response Presentation */}
        {response && !loading && (
          <div className="space-y-3.5 pt-2 border-t border-stone-100 animate-fade-in">
            {/* Simple Telugu */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider">
                1. SIMPLE TELUGU EXPLANATION (సరళ వివరణ)
              </span>
              <p className="text-sm sm:text-base font-telugu text-stone-900 font-medium leading-relaxed">
                {response.answerTelugu}
              </p>
            </div>

            {/* Teenglish */}
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-sky-900 tracking-wider">
                2. TEENGLISH LOGIC (ROMANIZED)
              </span>
              <p className="text-xs sm:text-sm font-medium text-stone-800 leading-relaxed">
                {response.answerTeenglish}
              </p>
            </div>

            {/* English */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-stone-600 tracking-wider">
                3. ENGLISH MEANING &amp; ANALOGY
              </span>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                {response.answerEnglish}
              </p>
            </div>

            {/* Takeaway */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-950 font-telugu">
              🎯 {response.quickTakeaway}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
