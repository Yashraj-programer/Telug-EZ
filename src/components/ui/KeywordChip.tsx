import React from 'react';
import { Tag } from 'lucide-react';

interface KeywordChipProps {
  keyword: string;
  onClick?: () => void;
  selected?: boolean;
}

export const KeywordChip: React.FC<KeywordChipProps> = ({ keyword, onClick, selected = false }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer active:scale-95 ${
        selected
          ? 'bg-stone-900 text-white shadow-sm ring-2 ring-amber-500/50'
          : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/90 shadow-2xs hover:border-amber-400 hover:text-stone-900'
      }`}
    >
      <Tag className="w-3 h-3 text-amber-600 opacity-80" />
      <span className="font-telugu">{keyword}</span>
    </button>
  );
};
