import React, { useState } from 'react';
import { ArrowRight, Sparkles, Check, HelpCircle, Eye } from 'lucide-react';

interface NodeDetail {
  text: string;
  meaning?: string;
  relation?: string;
  isBlank?: boolean;
}

interface MemoryChainViewProps {
  steps: (string | NodeDetail)[];
  title?: string;
  recallMode?: boolean;
  onRevealBlank?: (index: number) => void;
}

export const MemoryChainView: React.FC<MemoryChainViewProps> = ({
  steps,
  title = 'Memory Trigger Chain',
  recallMode = false,
  onRevealBlank,
}) => {
  const [activeNodeIdx, setActiveNodeIdx] = useState<number | null>(null);
  const [revealedBlanks, setRevealedBlanks] = useState<Record<number, boolean>>({});

  const normalizedSteps: NodeDetail[] = steps.map((s, idx) => {
    if (typeof s === 'string') {
      // If contains parentheses like "యమునా తీరం (Riverbank)", parse it
      const match = s.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        return {
          text: match[1].trim(),
          meaning: match[2].trim(),
          relation: `Step ${idx + 1} trigger in the lesson narrative`,
          isBlank: recallMode && idx % 2 === 1,
        };
      }
      return {
        text: s,
        meaning: 'Key memory node',
        relation: `Step ${idx + 1} in memory sequence`,
        isBlank: recallMode && idx % 2 === 1,
      };
    }
    return s;
  });

  const handleNodeClick = (idx: number, isBlank: boolean) => {
    if (isBlank && !revealedBlanks[idx]) {
      setRevealedBlanks((prev) => ({ ...prev, [idx]: true }));
      if (onRevealBlank) onRevealBlank(idx);
    } else {
      setActiveNodeIdx(activeNodeIdx === idx ? null : idx);
    }
  };

  return (
    <div className="surface-card rounded-3xl p-5 sm:p-6 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-stone-700 text-xs font-black uppercase tracking-wider">
          <div className="w-5 h-5 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span>{title}</span>
        </div>
        <span className="text-[11px] font-semibold text-stone-400">
          {recallMode ? 'Tap [ ? ] to recall node' : 'Click nodes to inspect meaning'}
        </span>
      </div>

      {/* Horizontal Scrollable Connected Nodes */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
        {normalizedSteps.map((node, idx) => {
          const isHiddenBlank = recallMode && node.isBlank && !revealedBlanks[idx];
          const isSelected = activeNodeIdx === idx;

          return (
            <React.Fragment key={idx}>
              <div
                onClick={() => handleNodeClick(idx, Boolean(node.isBlank))}
                className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl cursor-pointer transition-all select-none flex-shrink-0 group ${
                  isHiddenBlank
                    ? 'bg-amber-100/70 hover:bg-amber-200/90 text-amber-950 border border-dashed border-amber-400 shadow-xs animate-pulse'
                    : isSelected
                    ? 'bg-stone-900 text-white shadow-md ring-2 ring-amber-500/50 scale-[1.02]'
                    : 'bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/80 shadow-xs'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-xl text-xs font-black flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 font-mono-numbers'
                      : isHiddenBlank
                      ? 'bg-amber-300 text-amber-950 font-bold'
                      : 'bg-stone-100 text-stone-600 font-mono-numbers group-hover:bg-stone-200'
                  }`}
                >
                  {idx + 1}
                </span>

                <div className="text-left">
                  <div className="text-xs sm:text-sm font-black font-telugu leading-tight">
                    {isHiddenBlank ? '??? (Tap to Reveal)' : node.text}
                  </div>
                  {node.meaning && !isHiddenBlank && (
                    <div
                      className={`text-[10px] font-medium leading-none mt-0.5 truncate max-w-[120px] ${
                        isSelected ? 'text-stone-300' : 'text-stone-400'
                      }`}
                    >
                      {node.meaning}
                    </div>
                  )}
                </div>
              </div>

              {idx < normalizedSteps.length - 1 && (
                <div className="text-stone-300 font-bold flex items-center justify-center flex-shrink-0 px-0.5">
                  <ArrowRight className="w-4 h-4 text-amber-500/70" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Expanded Active Node Inspector Drawer */}
      {activeNodeIdx !== null && normalizedSteps[activeNodeIdx] && (
        <div className="mt-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-black uppercase tracking-wider text-amber-800 text-[10px]">
              NODE {activeNodeIdx + 1} DETAILS
            </span>
            <button
              onClick={() => setActiveNodeIdx(null)}
              className="text-stone-400 hover:text-stone-600 font-bold text-[10px]"
            >
              Close
            </button>
          </div>
          <div className="text-sm font-black text-stone-900 font-telugu">
            {normalizedSteps[activeNodeIdx].text}
          </div>
          {normalizedSteps[activeNodeIdx].meaning && (
            <p className="text-stone-600 font-medium">
              Meaning: <span className="font-semibold text-stone-800">{normalizedSteps[activeNodeIdx].meaning}</span>
            </p>
          )}
          {normalizedSteps[activeNodeIdx].relation && (
            <p className="text-stone-500 text-[11px]">
              Sequence role: {normalizedSteps[activeNodeIdx].relation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
