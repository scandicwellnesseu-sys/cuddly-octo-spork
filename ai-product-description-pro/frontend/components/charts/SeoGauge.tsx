'use client';

import { motion } from 'framer-motion';

interface SeoGaugeProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export function SeoGauge({ score, size = 'medium', showLabel = true }: SeoGaugeProps) {
  const getColor = (score: number) => {
    if (score >= 80) return '#22C55E'; // Green
    if (score >= 60) return '#EAB308'; // Yellow
    if (score >= 40) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const color = getColor(score);
  const grade = getGrade(score);

  const dimensions = {
    small: { width: 60, height: 30, strokeWidth: 6, fontSize: 12 },
    medium: { width: 120, height: 60, strokeWidth: 12, fontSize: 24 },
    large: { width: 180, height: 90, strokeWidth: 16, fontSize: 36 },
  };

  const { width, height, strokeWidth, fontSize } = dimensions[size];
  const radius = width / 2 - strokeWidth;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative" style={{ width, height: height + (showLabel ? 20 : 0) }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="transform -rotate-0"
      >
        {/* Background arc */}
        <path
          d={`M ${strokeWidth} ${height} A ${radius} ${radius} 0 0 1 ${width - strokeWidth} ${height}`}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <motion.path
          d={`M ${strokeWidth} ${height} A ${radius} ${radius} 0 0 1 ${width - strokeWidth} ${height}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      {/* Score text */}
      <div
        className="absolute inset-0 flex items-end justify-center"
        style={{ paddingBottom: size === 'small' ? 4 : 8 }}
      >
        <span
          className="font-bold"
          style={{ fontSize, color }}
        >
          {score}
        </span>
      </div>
      {/* Label */}
      {showLabel && (
        <div className="text-center mt-1">
          <span className="text-xs text-gray-500">Betyg: {grade}</span>
        </div>
      )}
    </div>
  );
}
