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
      <div className="relative h-4 rounded-full bg-gray-200">
        <div
          className="absolute top-0 left-0 h-4 rounded-full bg-gray-400"
          style={{ width: `${rating}%` }}
        />
        <div
          className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-black shadow-md"
          style={{ left: `${rating}%`, transform: "translate(-50%, -50%)" }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={rating}
          onChange={(e) => handleRatingChange(Number(e.target.value))}
          className="absolute top-0 left-0 z-10 h-4 w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
};
