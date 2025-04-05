import React, { useState } from 'react';

interface PerformanceRatingSliderProps {
  category: string;
  onChange: (rating: number) => void;
}

export const PerformanceRatingSlider: React.FC<PerformanceRatingSliderProps> = ({ category, onChange }) => {
  const [rating, setRating] = useState(50);

  const handleRatingChange = (value: number) => {
    setRating(value);
    onChange?.(value);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">{category}</div>
        <div className="text-sm text-gray-600">{rating}%</div>
      </div>
      <div className="relative h-4 bg-gray-200 rounded-full">
        <div 
          className="absolute top-0 left-0 h-4 bg-gray-400 rounded-full" 
          style={{ width: `${rating}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full shadow-md" 
          style={{ left: `${rating}%`, transform: 'translate(-50%, -50%)' }}
        />
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={rating}
          onChange={(e) => handleRatingChange(Number(e.target.value))}
          className="absolute top-0 left-0 w-full h-4 opacity-0 cursor-pointer z-10"
        />
      </div>
    </div>
  );
};