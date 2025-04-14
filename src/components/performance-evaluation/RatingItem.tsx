import React from "react";

interface RatingItemProps {
    label: string;
    percentage: string;
  }
  
export const RatingItem: React.FC<RatingItemProps> = ({ label, percentage }) => {
    return (
      <div>
        <div className="w-32 text-sm text-gray-600">{label}</div>
        <div className="flex items-center space-x-2 mb-2 space-y-2">
            <div className="flex-1 bg-gray-200 rounded-full h-5">
            <div 
                className="bg-gray-400 h-5 rounded-full" 
                style={{ width: `${percentage}%` }}
            ></div>
            </div>
            <div className="w-10 text-sm text-gray-600 text-right">{percentage}%</div>
        </div>
      </div>
    );
};