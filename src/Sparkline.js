import React from 'react';

export default function Sparkline({ data, color = '#e84c1e', width = 120, height = 36 }) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const totalLength = 300;

  return (
    <svg
      width={width}
      height={height}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <polygon
        points={areaPoints}
        fill={`url(#grad-${color.replace('#','')})`}
      />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: totalLength,
          animation: 'drawLine 1.2s ease forwards',
        }}
      />

      {/* End dot */}
      <circle
        cx={width}
        cy={parseFloat(points.split(' ').pop().split(',')[1])}
        r="3"
        fill={color}
        style={{ opacity: 0, animation: 'fadeIn 0.3s 1s ease forwards' }}
      />
    </svg>
  );
}
