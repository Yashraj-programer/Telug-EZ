import React, { useState } from 'react';

interface DayData {
  day: string;
  short: string;
  xp: number;
  itemsReviewed: number;
}

const WEEK_DATA: DayData[] = [
  { day: 'Monday', short: 'Mon', xp: 45, itemsReviewed: 6 },
  { day: 'Tuesday', short: 'Tue', xp: 75, itemsReviewed: 10 },
  { day: 'Wednesday', short: 'Wed', xp: 60, itemsReviewed: 8 },
  { day: 'Thursday', short: 'Thu', xp: 110, itemsReviewed: 14 },
  { day: 'Friday', short: 'Fri', xp: 95, itemsReviewed: 12 },
  { day: 'Saturday', short: 'Sat', xp: 140, itemsReviewed: 18 },
  { day: 'Sunday', short: 'Sun', xp: 165, itemsReviewed: 22 },
];

export const WeeklyActivityChart: React.FC<{ data?: DayData[] }> = ({ data = WEEK_DATA }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(6);

  const width = 480;
  const height = 160;
  const paddingX = 35;
  const paddingY = 25;

  const maxY = Math.max(...data.map((d) => d.xp), 180);

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (d.xp / maxY) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  // Generate cubic bezier curve path through points
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx1 = p0.x + (p1.x - p0.x) * 0.45;
    const cy1 = p0.y;
    const cx2 = p0.x + (p1.x - p0.x) * 0.55;
    const cy2 = p1.y;
    pathD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
  }

  // Area path for gradient fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
          Weekly Study Momentum
        </div>
        {hoveredIdx !== null && (
          <div className="text-xs font-semibold text-stone-700 flex items-center gap-2">
            <span>{data[hoveredIdx].day}:</span>
            <span className="font-mono-numbers font-black text-amber-700">
              +{data[hoveredIdx].xp} XP
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-500 font-medium">
              {data[hoveredIdx].itemsReviewed} items reviewed
            </span>
          </div>
        )}
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>

          {/* Horizontal Reference Grid Lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#F5F5F4"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="#F5F5F4"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#E7E5E4"
          />

          {/* Area Fill */}
          <path d={areaD} fill="url(#curveGradient)" />

          {/* Stroke Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineStroke)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {/* Point Markers & Bottom Day Labels */}
          {points.map((pt, i) => {
            const isHovered = hoveredIdx === i;

            return (
              <g
                key={i}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredIdx(i)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill="#FFFFFF"
                  stroke="#EA580C"
                  strokeWidth={isHovered ? 2.5 : 2}
                  className="transition-all duration-150"
                />
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  className={`text-[11px] font-semibold transition-colors ${
                    isHovered ? 'fill-amber-700 font-bold' : 'fill-stone-400'
                  }`}
                >
                  {pt.short}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
