import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'yellow' | 'green' | 'red' | 'purple';
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  onClick,
}) => {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50/80 hover:bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-600 text-white',
      accent: 'text-blue-700',
    },
    yellow: {
      bg: 'bg-amber-50/80 hover:bg-amber-50 border-amber-200',
      iconBg: 'bg-amber-500 text-slate-950',
      accent: 'text-amber-700',
    },
    green: {
      bg: 'bg-emerald-50/80 hover:bg-emerald-50 border-emerald-200',
      iconBg: 'bg-emerald-600 text-white',
      accent: 'text-emerald-700',
    },
    red: {
      bg: 'bg-rose-50/80 hover:bg-rose-50 border-rose-200',
      iconBg: 'bg-rose-600 text-white',
      accent: 'text-rose-700',
    },
    purple: {
      bg: 'bg-indigo-50/80 hover:bg-indigo-50 border-indigo-200',
      iconBg: 'bg-indigo-600 text-white',
      accent: 'text-indigo-700',
    },
  };

  const style = colorStyles[color];

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4.5 transition-all shadow-xs ${style.bg} ${
        onClick ? 'cursor-pointer hover:shadow-md transform hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-600 tracking-wide uppercase">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {value}
          </p>
          {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${style.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-medium">
          <span className={trend.isPositive ? 'text-emerald-600' : 'text-slate-600'}>
            {trend.value}
          </span>
          <span className="text-slate-400">• Current state</span>
        </div>
      )}
    </div>
  );
};

interface BarChartItem {
  label: string;
  value: number;
  secondaryLabel?: string;
  color?: string;
}

export const HorizontalBarChart: React.FC<{
  data: BarChartItem[];
  title?: string;
  subtitle?: string;
  maxBars?: number;
  onBarClick?: (item: BarChartItem) => void;
}> = ({ data, title, subtitle, maxBars = 10, onBarClick }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const displayData = data.slice(0, maxBars);
  const maxValue = Math.max(...displayData.map((d) => d.value), 1);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
      {title && (
        <div className="mb-4">
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">{title}</h4>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="space-y-3">
        {displayData.map((item, idx) => {
          const percentage = Math.round((item.value / maxValue) * 100);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => onBarClick && onBarClick(item)}
              className={`group transition-all ${onBarClick ? 'cursor-pointer' : ''}`}
            >
              <div className="flex justify-between items-center text-xs mb-1 font-medium">
                <span className="text-slate-700 truncate max-w-[200px] sm:max-w-[260px] group-hover:text-blue-700">
                  {item.label}
                  {item.secondaryLabel && (
                    <span className="text-slate-400 font-normal ml-1">({item.secondaryLabel})</span>
                  )}
                </span>
                <span className="text-slate-900 font-bold ml-2 shrink-0">{item.value}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.color || (isHovered ? 'bg-amber-500' : 'bg-blue-600')
                  }`}
                  style={{ width: `${Math.max(percentage, 4)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface DonutChartSegment {
  label: string;
  value: number;
  color: string;
}

export const DonutChart: React.FC<{
  data: DonutChartSegment[];
  title?: string;
  subtitle?: string;
}> = ({ data, title, subtitle }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  // Calculate SVG arc segments
  let cumulativeAngle = 0;
  const radius = 60;
  const strokeWidth = 24;
  const center = 80;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
      {title && (
        <div className="mb-4">
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">{title}</h4>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
        {/* SVG Donut */}
        <div className="relative w-40 h-40 shrink-0">
          <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
            {total === 0 ? (
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
              />
            ) : (
              data.map((segment, idx) => {
                const fraction = segment.value / total;
                const strokeDasharray = `${fraction * circumference} ${circumference}`;
                const strokeDashoffset = -cumulativeAngle * circumference;
                cumulativeAngle += fraction;

                return (
                  <circle
                    key={idx}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={segment.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 hover:opacity-85"
                  />
                );
              })
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-slate-900">{total}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-xs w-full max-w-[200px]">
          {data.map((seg, idx) => {
            const percentage = total > 0 ? Math.round((seg.value / total) * 100) : 0;
            return (
              <div key={idx} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-slate-700 truncate font-medium">{seg.label}</span>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  {seg.value} <span className="text-slate-400 font-normal">({percentage}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
