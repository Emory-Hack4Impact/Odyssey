import React, { useState } from 'react';

interface PerformanceRatingSliderProps {
  categories: string[];
  onChange: (ratings: number[]) => void;
}

export const PerformanceRatingSlider: React.FC<PerformanceRatingSliderProps> = ({
    categories,
    onChange
  }) => {

    const [ratings, setRatings] = useState<number[]>(
      categories.map(() => 50)
    );

    const handleRatingChange = (index: number, value: number) => {
      const newRatings = [...ratings];
      newRatings[index] = value;
      setRatings(newRatings);
      onChange?.(newRatings);
    };

    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold mb-4">Job Performance Ratings</h2>
        {categories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">{category}</div>
              <div className="text-sm text-gray-600">{ratings[index]}%</div>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full">
              <div 
                className="absolute top-0 left-0 h-4 bg-gray-400 rounded-full" 
                style={{ width: `${ratings[index]}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full shadow-md" 
                style={{ left: `${ratings[index]}%`, transform: 'translate(-50%, -50%)' }}
              />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={ratings[index]}
                onChange={(e) => handleRatingChange(index, Number(e.target.value))}
                className="absolute top-0 left-0 w-full h-4 opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>
        ))}
      </div>
    );
};