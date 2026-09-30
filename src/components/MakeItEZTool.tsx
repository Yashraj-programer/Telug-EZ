import React, { useState } from 'react';
import { requestMakeEz } from '../services/aiClient';
import { MakeEzResponse } from '../server/aiService';
import { KeywordChip } from './ui/KeywordChip';
import { Wand2, Sparkles, Copy, Check, Loader2, Compass, Tag, Award } from 'lucide-react';

const PRESET_LINES = [
  {
    title: 'తామరపువ్వు కర్ణిక ఉపమానం (Lotus Petal Simile)',
    text: 'కుండలి పద్మ కర్ణికకుఁ గూడిన పత్రములట్లు తోచినన్ శ్రీకృష్ణుడు మధ్యలో నిలబడెను.',
  },
  {
    title: 'చల్దుల ఆరగించుట (Relishing Curd Rice)',
    text: 'గోపబాలురందరూ మోదుగాకుల విస్తళ్ళలో చల్దులను పంచుకుంటూ అమృతం వలె తిన్నారు.',
  },
  {
    title: 'ఎండ తీవ్రత & ఆకలి (Midday Sun & Hunger)',
    text: 'మధ్యాహ్న సమయానికి ఎండ తీవ్రమై బాలురందరికీ విపరీతమైన ఆకలి వేసింది.',
  },
  {
    title: 'స్నేహ సమభావం (Equality in Friendship)',
    text: 'స్నేహంలో పేద, గొప్ప అనే భేదం లేకుండా ఒకరికొకరు ప్రేమతో ముద్దలు తినిపించుకున్నారు.',
  },
];

export const MakeItEZTool: React.FC = () => {
  const [inputText, setInputText] = useState(PRESET_LINES[0].text);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<MakeEzResponse | null>({
    originalTelugu: PRESET_LINES[0].text,
    teenglish:
      'Krishna madhyalo undaga, gopabaaluru taamarapuvvu rekula vale chuttoo koorchunnaru. Prathee okkariki Krishna tana munde unnattu kanipinchaadu.',
    englishMeaning:
      'Krishna stood in the center like a lotus seed-pod (karnika) while all his cowherd friends sat encircling him like tender petals.',
    coreIdea:
      'కృష్ణుడు తామరపువ్వు కర్ణిక వలె మధ్యలో ఉండగా, మిత్రులందరూ రేకుల వలె చుట్టూ సమానంగా కూర్చోవడం.',
    keywords: ['తామరపువ్వు (Lotus)', 'కర్ణిక (Center pod)', 'రేకులు (Petals)', 'సమానత్వం (Equality)'],
    examMeaning:
      'పరీక్షలో తామరపువ్వు ఉపమానం (ఉపమాలంకారం) గురించి తప్పనిసరిగా రాసి 4 మార్కులు సాధించండి.',
    isAiGenerated: false,
  });

  const handleTransform = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const data = await requestMakeEz(inputText, 'Lesson 1: చల్దులారగించుట (Class 10 Telangana Telugu SL)');
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyExamSummary = () => {
    if (!result) return;
    const textToCopy = `[TELUGU EZ SUMMARY]\nOriginal: ${result.originalTelugu}\nTeenglish: ${result.teenglish}\nEnglish: ${result.englishMeaning}\nCore Idea: ${result.coreIdea}\nExam Focus: ${result.examMeaning}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      {/* Signature Engine Header Banner */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-white via-[#FFFBF6] to-amber-50/50 border-amber-200/80">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black uppercase tracking-wider">
              <Wand2 className="w-3.5 h-3.5 text-amber-600" />
              <span>TELUGU EZ SIGNATURE ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Make Any Telugu Line Crystal Clear
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Turn dense, complex Telugu sentences into crisp Teenglish, simple English, core ideas, and instant keyword chains for board exams.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-amber-200/90 shadow-2xs max-w-xs space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-stone-400">
              The 6-Step Transformation
            </div>
            <div className="text-xs font-bold text-stone-800">
              Telugu → Teenglish → English → Core Idea → Memory Chain → Exam Meaning
            </div>
          </div>
        </div>
      </div>

      {/* Input / Presets Card */}
      <div className="surface-card rounded-3xl p-6 sm:p-7 space-y-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-2">
            SELECT A PRESET TEXTBOOK SENTENCE OR PASTE YOUR OWN:
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_LINES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(preset.text)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  inputText === preset.text
                    ? 'bg-amber-100 text-amber-950 border-amber-300 font-extrabold shadow-2xs'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {preset.title}
              </button>
            ))}
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder="ఇక్కడ తెలుగు వాక్యం టైప్ చేయండి..."
            className="w-full p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-stone-900 font-telugu text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-stone-400 font-medium hidden sm:inline">
            ⚡ Instant cognitive compression designed for 10th class brains
          </span>
          <button
            onClick={handleTransform}
            disabled={loading || !inputText.trim()}
            className="px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 active:scale-95 text-white font-black text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer ml-auto disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Making this easier…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>MAKE IT EZ NOW</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 6-Part Transformation Result */}
      {result && (
        <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-6 animate-pop border-amber-200">
          <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-800">
                EZ Transformation Breakdown
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  result.isAiGenerated
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-stone-100 text-stone-600 border-stone-200'
                }`}
              >
                {result.isAiGenerated ? '✨ Dynamically synthesised by AI' : 'Verified Textbook Canonical'}
              </span>
            </div>
            <button
              onClick={copyExamSummary}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 p-1.5 rounded-xl hover:bg-stone-100 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Original Telugu */}
            <div className="p-4.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                1. ORIGINAL TELUGU (టెక్స్ట్‌బుక్ వాక్యం)
              </div>
              <p className="text-base sm:text-lg font-telugu text-stone-900 font-bold leading-relaxed">
                {result.originalTelugu}
              </p>
            </div>

            {/* 2. Teenglish */}
            <div className="p-4.5 rounded-2xl bg-sky-50/50 border border-sky-200/70 space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-sky-800">
                2. TEENGLISH (ROMANIZED SPOKEN TELUGU)
              </div>
              <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                {result.teenglish}
              </p>
            </div>

            {/* 3. Simple English */}
            <div className="p-4.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-stone-600">
                3. SIMPLE ENGLISH MEANING
              </div>
              <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                {result.englishMeaning}
              </p>
            </div>

            {/* 4. Core Idea */}
            <div className="p-4.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                4. CORE IDEA (ముఖ్య భావన)
              </div>
              <p className="text-xs sm:text-sm font-telugu text-stone-900 font-bold leading-relaxed">
                {result.coreIdea}
              </p>
            </div>
          </div>

          {/* 5. Memory Triggers & Keywords */}
          <div className="space-y-2.5 pt-1">
            <div className="text-[11px] font-black uppercase tracking-wider text-stone-500">
              5. KEYWORD MEMORY CHAIN
            </div>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((kw, i) => (
                <KeywordChip key={i} keyword={kw} />
              ))}
            </div>
          </div>

          {/* 6. What this means in the exam */}
          <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-amber-300 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-950">
              <Award className="w-4 h-4 text-amber-600" />
              <span>6. WHAT THIS MEANS IN THE EXAM (పరీక్షలో ఎలా రాయాలి?)</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-stone-800 font-telugu leading-relaxed">
              {result.examMeaning}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
