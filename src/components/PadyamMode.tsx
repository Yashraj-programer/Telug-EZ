import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { MemoryChainView } from './ui/MemoryChainView';
import { KeywordChip } from './ui/KeywordChip';
import { Confetti } from './ui/Confetti';
import {
  Scroll,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  HelpCircle,
  Volume2,
  Check,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export const PadyamMode: React.FC = () => {
  const {
    lesson,
    selectedPadyamId,
    setSelectedPadyamId,
    completedPadyams,
    markPadyamCompleted,
    openAiModal,
    addXP,
  } = useStudy();

  const [activeTabLayer, setActiveTabLayer] = useState<'bhavam' | 'teenglish' | 'english' | 'chain'>('bhavam');
  const [recallModeActive, setRecallModeActive] = useState(false);
  const [revealedBlanks, setRevealedBlanks] = useState<Record<number, boolean>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [userGuessInput, setUserGuessInput] = useState('');

  const currentPadyam =
    lesson.padyams.find((p) => p.id === selectedPadyamId) || lesson.padyams[0];

  const handleRevealBlank = (index: number) => {
    setRevealedBlanks((prev) => ({ ...prev, [index]: true }));
    addXP(5, 'పద్యం ట్రిగ్గర్ గుర్తుచేసుకున్నారు! (+5 XP)');
  };

  const handleCompleteRecall = () => {
    markPadyamCompleted(currentPadyam.id);
    setShowConfetti(true);
  };

  const speakTelugu = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.lang = 'te-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header & Padyam Switcher */}
      <div className="surface-card rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-amber-800">
            <Scroll className="w-3.5 h-3.5" />
            <span>POEM &amp; PADYAM MODE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 font-telugu">
            {currentPadyam.title}
          </h2>
          <span className="inline-block mt-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            ఛందస్సు: {currentPadyam.meter}
          </span>
        </div>

        {/* Padyam Switcher Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {lesson.padyams.map((p) => {
            const isSelected = p.id === currentPadyam.id;
            const isCompleted = completedPadyams.includes(p.id);

            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPadyamId(p.id);
                  setRecallModeActive(false);
                  setRevealedBlanks({});
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>పద్యం {p.number}</span>
                {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Original Metric Padyam Card */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 space-y-5 border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 border border-stone-200">
            A. ORIGINAL TEXTBOOK PADYAM ({currentPadyam.meter})
          </span>
          <button
            onClick={() => speakTelugu(currentPadyam.originalPadyam)}
            className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Chant Padyam</span>
          </button>
        </div>

        {/* Formatted Metric Padyam Text with Verse Lines */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#FFFDF9] border border-stone-200/90 font-telugu text-lg sm:text-xl font-bold text-stone-900 leading-loose whitespace-pre-line text-center sm:text-left shadow-2xs">
          {currentPadyam.originalPadyam}
        </div>

        {/* Mode Toggle: Normal Exploration vs Recall Mode */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-200/70">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
            UNDERSTAND → COMPRESS → RECALL
          </span>
          <button
            onClick={() => setRecallModeActive(!recallModeActive)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              recallModeActive
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
            }`}
          >
            {recallModeActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{recallModeActive ? 'Exit Recall Mode' : 'Enter Recall Mode (G)'}</span>
          </button>
        </div>
      </div>

      {/* RECALL MODE VIEW */}
      {recallModeActive ? (
        <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in border-2 border-amber-400">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                G. ACTIVE RECALL PRACTICE
              </span>
              <h3 className="text-lg font-black text-stone-900 mt-0.5">
                Reconstruct the poem idea from memory triggers!
              </h3>
            </div>
            <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
              Hide &amp; Recall
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            {currentPadyam.recallTriggers.prompt} Say the missing trigger aloud before tapping reveal!
          </p>

          {/* Trigger Chain with Clickable Blanks */}
          <div className="flex flex-wrap items-center gap-2.5 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            {currentPadyam.recallTriggers.blanks.map((b, idx) => {
              const isRevealed = revealedBlanks[idx];

              if (!b.isBlank) {
                return (
                  <div
                    key={idx}
                    className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 font-bold text-xs sm:text-sm text-stone-800 shadow-2xs font-telugu"
                  >
                    {b.trigger}
                  </div>
                );
              }

              return isRevealed ? (
                <div
                  key={idx}
                  className="px-3.5 py-2 rounded-xl bg-emerald-100 border border-emerald-300 font-bold text-xs sm:text-sm text-emerald-950 animate-pop font-telugu"
                >
                  ✅ {b.trigger}
                </div>
              ) : (
                <button
                  key={idx}
                  onClick={() => handleRevealBlank(idx)}
                  className="px-4 py-2 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-xs transition-all cursor-pointer border border-dashed border-amber-400 animate-pulse"
                >
                  [ ? TAP TO REVEAL ]
                </button>
              );
            })}
          </div>

          {/* Practice Typing the Bhavam */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-stone-700 block">
              RECONSTRUCT BHAVAM IN YOUR OWN WORDS:
            </label>
            <textarea
              value={userGuessInput}
              onChange={(e) => setUserGuessInput(e.target.value)}
              rows={3}
              placeholder="గోపబాలురు కృష్ణుడి చుట్టూ తామరపువ్వు రేకుల వలె కూర్చున్నారు..."
              className="w-full p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-stone-900 font-telugu text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              onClick={() => {
                setRevealedBlanks({ 1: true, 3: true });
                handleCompleteRecall();
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I Reconstructed the Padyam! (+25 XP)</span>
            </button>
          </div>
        </div>
      ) : (
        /* NORMAL EXPLORATION VIEW */
        <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-6">
          {/* Sub Navigation for Layers */}
          <div className="flex items-center gap-1.5 border-b border-stone-200/80 pb-3 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTabLayer('bhavam')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTabLayer === 'bhavam'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              B. Simple Meaning (సరళ భావం)
            </button>
            <button
              onClick={() => setActiveTabLayer('teenglish')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTabLayer === 'teenglish'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              C. Teenglish Breakdown
            </button>
            <button
              onClick={() => setActiveTabLayer('english')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTabLayer === 'english'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              D. English Translation
            </button>
            <button
              onClick={() => setActiveTabLayer('chain')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTabLayer === 'chain'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              E &amp; F. Keywords &amp; Memory Chain
            </button>
          </div>

          {/* Layer Contents */}
          <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/80 min-h-[140px]">
            {activeTabLayer === 'bhavam' && (
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                  B. SARALA BHAVAM (సరళమైన పరీక్షార్థ భావం)
                </span>
                <p className="text-base sm:text-lg font-telugu text-stone-900 font-medium leading-relaxed">
                  {currentPadyam.simpleMeaning}
                </p>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950">
                  💡 {currentPadyam.examMeaning}
                </div>
              </div>
            )}

            {activeTabLayer === 'teenglish' && (
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
                  C. TEENGLISH PHONETIC &amp; MEANING BREAKDOWN
                </span>
                <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-medium whitespace-pre-line">
                  {currentPadyam.teenglish}
                </p>
              </div>
            )}

            {activeTabLayer === 'english' && (
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
                  D. SIMPLE ENGLISH TRANSLATION
                </span>
                <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-normal">
                  {currentPadyam.englishMeaning}
                </p>
              </div>
            )}

            {activeTabLayer === 'chain' && (
              <div className="space-y-4">
                <MemoryChainView steps={currentPadyam.memoryChain} title="F. Visual Memory Chain" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-2">
                    E. 5-KEYWORD MEMORY TRIGGERS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentPadyam.keywords.map((kw, i) => (
                      <KeywordChip key={i} keyword={kw} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => openAiModal(currentPadyam.originalPadyam, 'Please explain this poem with a simple real-life story')}
              className="text-xs font-bold text-stone-500 hover:text-amber-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Ask Doubt about this Padyam</span>
            </button>
            <button
              onClick={() => setRecallModeActive(true)}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Test with Recall Mode</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
