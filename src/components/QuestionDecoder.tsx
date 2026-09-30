import React, { useState } from 'react';
import { requestQuestionDecoder } from '../services/aiClient';
import { QuestionDecoderResponse } from '../server/aiService';
import { Search, Sparkles, Target, Award, ArrowRight, Loader2, Lightbulb } from 'lucide-react';

const SAMPLE_QUESTIONS = [
  'శ్రీకృష్ణుడు తన మిత్రులను భోజనానికి ఎందుకు పిలిచాడు?',
  'యమునాతీరంలో గోపబాలురు చల్దులు ఆరగించిన విధానాన్ని వర్ణించండి.',
  'బమ్మెర పోతన కవిపరిచయం రాయండి.',
  'ఈ పాఠం ద్వారా కవి సమాజానికి ఇచ్చిన సందేశం ఏమిటి?',
  'తామరపువ్వుతో గోపబాలుర అమరికను ఎలా పోల్చారో వివరించండి.',
];

const TRIGGER_BADGES: { word: string; meaning: string; type: string }[] = [
  { word: 'ఎందుకు?', meaning: 'Reason / Cause', type: 'కారణం' },
  { word: 'ఎలా?', meaning: 'Method / Process', type: 'విధానం' },
  { word: 'వర్ణించండి', meaning: 'Vivid imagery & scene', type: 'వర్ణన' },
  { word: 'వివరించండి', meaning: 'Elaborate background & takeaway', type: 'వివరణ' },
  { word: 'కవిపరిచయం', meaning: 'Name, Era, Place, Works', type: 'కవి ప్రొఫైల్' },
  { word: 'తాత్పర్యం / భావం', meaning: 'Simple & deeper meaning', type: 'భావార్థం' },
  { word: 'సందేశం', meaning: 'Moral & social message', type: 'నీతి / సందేశం' },
  { word: 'లక్షణాలు', meaning: 'Distinctive qualities', type: 'లక్షణాలు' },
];

export const QuestionDecoder: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_QUESTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuestionDecoderResponse | null>({
    originalQuestion: SAMPLE_QUESTIONS[0],
    triggerWord: 'ఎందుకు? (Why? / Reasons)',
    questionType: 'కారణాలు తెలపడం (State Reasons)',
    meaningInEnglish: 'The examiner wants specific causes or reasons that led to an event.',
    teenglishExplanation:
      'Question is asking WHY Krishna called his friends. Give 2 solid reasons: 1. Midday sun heat (Enda teevratha), 2. Extreme hunger (Aakali).',
    examinerExpectation: [
      'మధ్యాహ్న సమయానికి ఎండ తీవ్రమవడం',
      'గోపబాలురకు విపరీతమైన ఆకలి వేయడం',
      'యమునా తీరంలోని చల్లని చెట్ల నీడకు ఆహ్వానించడం',
    ],
    recommendedMarksStrategy:
      'కారణం 1, కారణం 2 అని స్పష్టంగా పాయింట్ల రూపంలో రాస్తే 4/4 మార్కులు పడతాయి.',
    isAiGenerated: false,
  });

  const handleDecode = async (queryText?: string) => {
    const text = queryText || inputText;
    if (!text.trim()) return;
    setLoading(true);
    try {
      const data = await requestQuestionDecoder(text);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      {/* Header */}
      <div className="surface-card rounded-3xl p-6 sm:p-7 space-y-2 border-indigo-200/80 bg-gradient-to-br from-white to-indigo-50/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-black uppercase tracking-wider">
          <Search className="w-3.5 h-3.5 text-indigo-700" />
          <span>QUESTION INTENT DECODER</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Decode Exactly What the Examiner is Asking
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-2xl">
          Instantly recognize trigger words like “ఎందుకు?”, “ఎలా?”, “వర్ణించండి” so you never write the wrong answer type in the exam.
        </p>
      </div>

      {/* 8 Trigger Badges Quick Matrix */}
      <div className="surface-card rounded-3xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-stone-700">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>8 Core Board Exam Trigger Words</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TRIGGER_BADGES.map((b, idx) => (
            <button
              key={idx}
              onClick={() => {
                const sample = SAMPLE_QUESTIONS.find((q) => q.includes(b.word.replace('?', ''))) || `ఈ విషయాన్ని ${b.word}`;
                setInputText(sample);
                handleDecode(sample);
              }}
              className="p-3 rounded-2xl border border-stone-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all cursor-pointer group active:scale-95"
            >
              <div className="text-sm font-black text-stone-900 font-telugu group-hover:text-indigo-900">
                {b.word}
              </div>
              <div className="text-[10px] text-stone-500 font-medium">{b.meaning}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Card */}
      <div className="surface-card rounded-3xl p-6 sm:p-7 space-y-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-2">
            PASTE OR SELECT AN EXAM QUESTION:
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {SAMPLE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(q);
                  handleDecode(q);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border truncate max-w-xs ${
                  inputText === q
                    ? 'bg-indigo-100 text-indigo-950 border-indigo-300 font-black shadow-2xs'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="ప్రశ్నను ఇక్కడ టైప్ లేదా పేస్ట్ చేయండి..."
              className="w-full p-4 pr-12 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-stone-900 font-telugu text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
            />
            <Search className="w-5 h-5 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={() => handleDecode()}
            disabled={loading || !inputText.trim()}
            className="px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 active:scale-95 text-white font-black text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Decoding Question...</span>
              </>
            ) : (
              <>
                <Target className="w-4 h-4 text-amber-400" />
                <span>DECODE QUESTION NOW</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Decoding Results */}
      {result && (
        <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-5 animate-pop border-indigo-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-900">
                Decoder Analysis &amp; Marks Strategy
              </h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 font-bold text-xs border border-indigo-200">
              Trigger: {result.triggerWord}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-indigo-900 tracking-wider">
                TRIGGER INTENT &amp; QUESTION TYPE
              </span>
              <div className="text-base sm:text-lg font-black text-indigo-950 font-telugu">
                {result.questionType}
              </div>
              <p className="text-xs text-indigo-800 font-medium">
                {result.meaningInEnglish}
              </p>
            </div>

            <div className="p-4.5 rounded-2xl bg-[#FFFDF9] border border-amber-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider">
                TEENGLISH MENTAL MODEL
              </span>
              <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                {result.teenglishExplanation}
              </p>
            </div>
          </div>

          {/* Examiner Expectations Checklist */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-stone-800">
              <Target className="w-4 h-4 text-emerald-600" />
              <span>WHAT THE EXAMINER EXPECTS (పరీక్షకుడు ఆశించే ముఖ్య పాయింట్లు):</span>
            </div>
            <div className="space-y-2">
              {result.examinerExpectation.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-semibold text-stone-800 flex items-start gap-2.5 font-telugu"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono-numbers font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{exp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Max Marks Scoring Strategy */}
          <div className="p-4.5 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-950">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>MAX MARKS SCORING SECRET</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-emerald-950 font-telugu leading-relaxed">
              {result.recommendedMarksStrategy}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
