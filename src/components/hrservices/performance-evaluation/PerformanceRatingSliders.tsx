import React, { useState } from "react";

interface PerformanceRatingSliderProps {
  category: string;
  value: number;
  onChange: (rating: number) => void;
}

export const PerformanceRatingSlider: React.FC<PerformanceRatingSliderProps> = ({
  category,
  value,
  onChange,
}) => {
  const [rating, setRating] = useState(value);

  const handleRatingChange = (value: number) => {
    setRating(value);
    onChange?.(value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">{category}</div>
        <div className="text-sm text-gray-600">{rating}%</div>
      </div>

      {/* Track container is taller so the thumb can sit centered on the bar */}
      <div className="relative h-6">
        {/* Centered track */}
        <div className="absolute inset-0 flex items-center">
          <div className="h-4 w-full rounded-full bg-gray-200" />
          <div
            className="absolute left-0 h-4 rounded-full bg-gray-400"
            style={{ width: `${rating}%`, top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>

        {/* Thumb - vertically centered relative to the container */}
        <div
          className="absolute h-6 w-6 rounded-full bg-black shadow-md"
          style={{ left: `${rating}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
        />

        {/* Invisible native range for interaction */}
        <input
          type="range"
          min="0"
          max="100"
          value={rating}
          onChange={(e) => handleRatingChange(Number(e.target.value))}
          className="absolute inset-0 z-10 w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
};
