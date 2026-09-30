import React from 'react';

interface RadialReadinessGaugeProps {
  percentage: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const RadialReadinessGauge: React.FC<RadialReadinessGaugeProps> = ({
  percentage,
  size = 180,
  strokeWidth = 14,
  label = 'TELUGU READY',
  sublabel = 'Class 10 SL Target',
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  // 240 degree gauge (from 150deg to 390deg)
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  
  // Total arc length for 240 degrees (2/3 of a circle)
  const arcLength = (240 / 360) * 2 * Math.PI * radius;
  const strokeDashoffset = arcLength - (clamped / 100) * arcLength;

  return (
    <div className="relative inline-flex flex-col items-center justify-center select-none" style={{ width: size, height: size * 0.9 }}>
      <svg width={size} height={size * 0.9} viewBox={`0 0 ${size} ${size * 0.9}`} className="overflow-visible">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#EA580C" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Track Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E7E5E4"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${2 * Math.PI * radius}`}
          transform={`rotate(150 ${center} ${center})`}
        />

        {/* Filled Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${2 * Math.PI * radius}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(150 ${center} ${center})`}
          filter="url(#gaugeGlow)"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 text-center pointer-events-none">
        <span className="font-mono-numbers text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          {clamped}%
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 mt-0.5">
          {label}
        </span>
        {sublabel && (
          <span className="text-[11px] font-semibold text-emerald-700 mt-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
            {clamped >= 75 ? 'Exam Distinction' : clamped >= 50 ? 'Strong Progress' : 'Revision Underway'}
          </span>
        )}
      </div>
    </div>
  );
};
