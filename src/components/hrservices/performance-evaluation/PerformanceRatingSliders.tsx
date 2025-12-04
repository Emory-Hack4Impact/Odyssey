import React from "react";

interface PerformanceRatingSliderProps {
  category: string;
  value: number;
  onChange: (rating: number) => void;
}

export const PerformanceRatingSlider = ({
  category,
  value,
  onChange,
}: PerformanceRatingSliderProps) => {
  // Treat `value` as the single source of truth so parent updates (e.g. from
  // loaded data) immediately move the slider. Call `onChange` when user
  // interacts.
  const handleRatingChange = (newVal: number) => {
    onChange?.(newVal);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">{category}</div>
        <div className="text-sm text-gray-600">{value}%</div>
      </div>

      {/* Track container is taller so the thumb can sit centered on the bar */}
      <div className="relative h-6">
        {/* Centered track */}
        <div className="absolute inset-0 flex items-center">
          <div className="h-4 w-full rounded-full bg-gray-200" />
          <div
            className="absolute left-0 h-4 rounded-full bg-gray-400"
            style={{ width: `${value}%`, top: "50%", transform: "translateY(-50%)" }}
          />
        </div>

        {/* Thumb - vertically centered relative to the container */}
        <div
          className="absolute h-6 w-6 rounded-full bg-black shadow-md"
          style={{ left: `${value}%`, top: "50%", transform: "translate(-50%, -50%)" }}
        />

        {/* Invisible native range for interaction */}
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => handleRatingChange(Number(e.target.value))}
          className="absolute inset-0 z-10 w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
};
