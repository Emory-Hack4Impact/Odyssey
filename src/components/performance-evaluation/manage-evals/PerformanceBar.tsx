import React from 'react';

interface PerformanceBarProps {
  label: string;
  percentage: number;
}

const PerformanceBar: React.FC<PerformanceBarProps> = ({ label, percentage }) => {

  return (
    <div className="inline-flex flex-col items-start gap-2">
      {/* Label */}
      <div className="font-['Inter'] font-medium text-base">{label}</div>

      {/* Progress bar + Percentage */}
      <div className="flex items-center gap-4">
        {/* Background bar */}
        <div className="relative w-[500px] h-5 bg-zinc-300 rounded-full">
          {/* Filled area */}
          <div
            className="h-5 bg-neutral-400 rounded-full"
            style={{ width: `${percentage}%` }}  // Make the filled area the width of the percentage prop
          />
        </div>
        {/* Percentage label */}
        <span className="font-['Inter'] font-medium text-base">{percentage}%</span>
      </div>
    </div>
  );
};

export default PerformanceBar;
