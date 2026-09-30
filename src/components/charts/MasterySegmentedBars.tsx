import React from 'react';

export interface MasteryItem {
  id: string;
  name: string;
  telugu: string;
  percentage: number;
  category: string;
}

interface MasterySegmentedBarsProps {
  items: MasteryItem[];
}

export const MasterySegmentedBars: React.FC<MasterySegmentedBarsProps> = ({ items }) => {
  return (
    <div className="space-y-3.5">
      {items.map((item) => {
        // 5 segments (each represents 20%)
        const filledSegments = Math.round((item.percentage / 100) * 5);

        return (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/60 hover:bg-stone-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
          >
            <div className="min-w-[190px]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-stone-900 font-telugu">
                  {item.name}
                </span>
                <span className="text-[10px] font-semibold text-stone-400">
                  {item.telugu}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                {item.category}
              </span>
            </div>

            {/* Segmented Pillars */}
            <div className="flex items-center gap-1.5 flex-1 max-w-[240px]">
              {[1, 2, 3, 4, 5].map((seg) => {
                const isFilled = seg <= filledSegments;
                return (
                  <div
                    key={seg}
                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                      isFilled
                        ? seg === 5
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                        : 'bg-stone-200'
                    }`}
                  />
                );
              })}
            </div>

            {/* Percentage Badge */}
            <div className="flex items-center justify-between sm:justify-end gap-2 text-right">
              <span className="font-mono-numbers text-xs font-black text-stone-800">
                {item.percentage}%
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  item.percentage >= 80
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.percentage >= 60
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {item.percentage >= 80 ? 'Mastered' : item.percentage >= 60 ? 'Good' : 'Needs Work'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
