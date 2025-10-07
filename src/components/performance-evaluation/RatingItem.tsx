import React from "react";

interface RatingItemProps {
  label: string;
  percentage: string;
}

export const RatingItem: React.FC<RatingItemProps> = ({
  label,
  percentage,
}) => {
  return (
    <div>
      <div className="w-32 text-sm text-gray-600">{label}</div>
      <div className="mb-2 flex items-center space-x-2 space-y-2">
        <div className="h-5 flex-1 rounded-full bg-gray-200">
          <div
            className="h-5 rounded-full bg-gray-400"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="w-10 text-right text-sm text-gray-600">
          {percentage}%
        </div>
      </div>
    </div>
  );
};
