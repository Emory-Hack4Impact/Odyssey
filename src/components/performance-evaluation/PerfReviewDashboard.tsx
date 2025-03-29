import React from "react";
import { RatingItem } from './RatingItem';

interface PerformanceReviewDashboardProps {
    overallRating: number;
    reviewerCount: number;
    ratings: {
      label: string;
      percentage: number;
    }[];
  }
  
  export const PerformanceReviewDashboard: React.FC<PerformanceReviewDashboardProps> = ({
    overallRating,
    reviewerCount,
    ratings
  }) => {
    return (
      <div className="rounded-lg p-6 mx-auto">
        {/* Overall Rating and Reviewers Section */}
        <div className="flex justify-center gap-6 items-center mb-8">
          <div className="flex flex-col items-center border-2 px-4 py-4 rounded-3xl">
            <div className="text-4xl font-bold text-black">{overallRating}%</div>
            <div className="text-lg text-black">Overall Rating</div>
          </div>
          <div className="flex flex-col items-center border-2 px-4 py-4 rounded-3xl">
            <div className="flex space-x-1">
                {[...Array(5)].map((_, index) => (
                <div 
                    key={index} 
                    className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"
                ></div>
                ))}
            </div>
            <h3 className="text-lg">Reviewers</h3>
          </div>
        </div>
  
        {/* Job Performance Ratings Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Job Performance Ratings</h2>
          {ratings.map((rating, index) => (
            <RatingItem 
              key={index}
              label={rating.label} 
              percentage={rating.percentage} 
            />
          ))}
        </div>
      </div>
    );
  };