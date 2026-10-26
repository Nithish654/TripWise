import React, { useState } from 'react';

interface BarItem {
  label: string;
  value: number;
  secondaryValue?: number;
  capacity?: number;
  category?: string;
  color?: string;
}

interface BarChartProps {
  items: BarItem[];
  height?: number;
  valueSuffix?: string;
  showCapacityLine?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  items,
  height = 200,
  valueSuffix = '',
  showCapacityLine = true,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  const maxVal = Math.max(...items.map((it) => Math.max(it.value, it.capacity || 0))) * 1.15 || 100;
  const chartHeight = height;
  const paddingBottom = 36;
  const paddingTop = 20;
  const innerHeight = chartHeight - paddingBottom - paddingTop;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <div className="flex items-end justify-between gap-3 h-[200px] pt-4 pb-8 px-2 border-b border-slate-200">
        {items.map((item, idx) => {
          const heightPct = Math.min(100, Math.max(4, (item.value / maxVal) * 100));
          const capacityPct = item.capacity ? Math.min(100, (item.capacity / maxVal) * 100) : null;
          const isHovered = hoveredIdx === idx;
          const isOverCapacity = item.capacity && item.value > item.capacity;

          return (
            <div
              key={idx}
              className="relative flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Capacity limit marker line */}
              {showCapacityLine && capacityPct && (
                <div
                  className="absolute w-full border-t border-dashed border-rose-400 z-10 pointer-events-none"
                  style={{ bottom: `${capacityPct}%` }}
                />
              )}

              {/* Bar container */}
              <div className="w-full max-w-[44px] bg-slate-100 rounded-t-md relative flex items-end justify-center overflow-hidden h-full">
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    item.color ||
                    (isOverCapacity
                      ? 'bg-rose-500'
                      : isHovered
                      ? 'bg-indigo-600'
                      : 'bg-indigo-500/85')
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>

              {/* Bottom Label */}
              <div className="absolute -bottom-7 w-full text-center">
                <span className="text-[11px] font-medium text-slate-600 truncate block px-0.5">
                  {item.label}
                </span>
              </div>

              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute -top-12 z-30 bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded shadow-lg whitespace-nowrap pointer-events-none font-mono tabular-nums">
                  <div className="font-sans font-semibold text-slate-200">{item.label}</div>
                  <div className="text-indigo-300">
                    Load: {item.value.toLocaleString('en-IN')}{valueSuffix}
                  </div>
                  {item.capacity && (
                    <div className="text-[10px] text-slate-400">
                      Cap: {item.capacity.toLocaleString('en-IN')}{valueSuffix} ({Math.round((item.value / item.capacity) * 100)}%)
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
