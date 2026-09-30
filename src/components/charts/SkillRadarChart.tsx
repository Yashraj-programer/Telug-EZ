import React from 'react';

export interface SkillPoint {
  label: string;
  telugu: string;
  value: number; // 0 to 100
}

interface SkillRadarChartProps {
  skills?: SkillPoint[];
  size?: number;
}

const DEFAULT_SKILLS: SkillPoint[] = [
  { label: 'Understanding', telugu: 'అవగాహన', value: 85 },
  { label: 'Recall', telugu: 'రీకాల్', value: 78 },
  { label: 'Poems', telugu: 'పద్యాలు', value: 72 },
  { label: 'Vocabulary', telugu: 'పదజాలం', value: 90 },
  { label: 'Grammar', telugu: 'వ్యాకరణం', value: 68 },
  { label: 'Writing', telugu: 'సమాధానం', value: 82 },
];

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  skills = DEFAULT_SKILLS,
  size = 280,
}) => {
  const center = size / 2;
  const radius = size * 0.38;
  const count = skills.length;

  // Calculate coordinates for a given fraction and index
  const getCoordinates = (fraction: number, index: number) => {
    const angle = (index * 2 * Math.PI) / count - Math.PI / 2;
    const r = radius * fraction;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate web polygon points for levels 0.33, 0.66, 1.0
  const levels = [0.33, 0.66, 1.0];
  const gridPolygons = levels.map((lvl) => {
    return skills
      .map((_, i) => {
        const { x, y } = getCoordinates(lvl, i);
        return `${x},${y}`;
      })
      .join(' ');
  });

  // User skill polygon
  const skillPolygonPoints = skills
    .map((s, i) => {
      const fraction = Math.min(100, Math.max(10, s.value)) / 100;
      const { x, y } = getCoordinates(fraction, i);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative inline-flex items-center justify-center select-none">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* Concentric Web Rings */}
        {gridPolygons.map((pts, idx) => (
          <polygon
            key={idx}
            points={pts}
            fill="none"
            stroke="#E7E5E4"
            strokeWidth={1}
            strokeDasharray={idx === 2 ? 'none' : '2,2'}
          />
        ))}

        {/* Axis Lines from Center to Edges */}
        {skills.map((_, i) => {
          const { x, y } = getCoordinates(1.0, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#E7E5E4"
              strokeWidth={1}
            />
          );
        })}

        {/* Filled Data Polygon */}
        <polygon
          points={skillPolygonPoints}
          fill="url(#radarFill)"
          stroke="#EA580C"
          strokeWidth={2}
          strokeLinejoin="round"
          className="transition-all duration-700 ease-out"
        />

        {/* Vertex Points & Labels */}
        {skills.map((s, i) => {
          const fraction = Math.min(100, Math.max(10, s.value)) / 100;
          const pt = getCoordinates(fraction, i);
          const labelPt = getCoordinates(1.22, i);

          return (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={4}
                fill="#FFFFFF"
                stroke="#EA580C"
                strokeWidth={2}
                className="transition-all duration-700"
              />
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-stone-600 font-semibold text-[10px] tracking-tight"
              >
                {s.label}
              </text>
              <text
                x={labelPt.x}
                y={labelPt.y + 11}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-stone-400 font-mono-numbers text-[9px] font-bold"
              >
                {s.value}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
