import React from "react";
import { RatingItem } from './RatingItem';
import { time } from "console";

interface PerformanceReviewDashboardProps {
  id: number;
  employeeId: string;
  year: number;
  strengths: string;
  weaknesses: string;
  improvements: string;
  notes: string;
  communication: string;
  leadership: string;
  timeliness: string;
  skill1: string;
  skill2: string;
  skill3: string;
}
  
  export const PerformanceReviewDashboard: React.FC<PerformanceReviewDashboardProps> = ({
    strengths,
    weaknesses,
    improvements,
    notes,
    communication,
    leadership,
    timeliness,
    skill1,
    skill2,
    skill3
  }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="rounded-lg p-6 mx-auto">
            {/* Overall Rating and Reviewers Section */}
            <div className="flex justify-center gap-6 items-center mb-8">
              <div className="flex flex-col items-center border-2 px-4 py-4 rounded-3xl">
                <div className="text-4xl font-bold text-black">{Math.round((Number(communication) + Number(leadership) + Number(timeliness) + Number(skill1) + Number(skill2) + Number(skill3)) / 6)}%</div>
                <div className="text-lg text-black">Overall Rating</div>
              </div>
              <div className="flex flex-col items-center border-2 px-4 py-4 rounded-3xl">
                <div className="flex space-x-1">
                    {[...Array(2)].map((_, index) => (
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
                <RatingItem 
                  key={1}
                  label="Communication" 
                  percentage={communication}
                />
                <RatingItem 
                  key={2}
                  label="Leadership" 
                  percentage={leadership}
                />
                <RatingItem 
                  key={3}
                  label={"Timeliness"} 
                  percentage={timeliness} 
                />
                <RatingItem 
                  key={4}
                  label="Skill1"
                  percentage={skill1} 
                />
                <RatingItem 
                  key={5}
                  label="Skill2"
                  percentage={skill2} 
                />
                <RatingItem 
                  key={6}
                  label="Skill2"
                  percentage={skill3} 
                />
            </div>
          </div>
        </div>
      
        <div className="space-y-6">
            <div>
                <h3 className="text-xl mb-2">
                    Strengths
                </h3>
                <ul className="list-disc ml-4 text-sm">
                    {strengths.split(".").map((strength) => (
                      <li>
                        {strength}
                      </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3 className="text-xl mb-2">
                    Weaknesses
                </h3>
                <ul className="list-disc ml-4 text-sm">
                  {weaknesses.split(".").map((weakness) => (
                    <li>
                      {weakness}
                    </li>
                  ))}
                </ul>
            </div>

            <div>
                <h3 className="text-xl mb-2">
                    Improvements
                </h3>
                <ul className="list-disc ml-4 text-sm">
                  {improvements.split(".").map((improvement) => (
                    <li>
                      {improvement}
                    </li>
                  ))}
                </ul>
            </div>

            <div>
                <h3 className="text-xl mb-2">
                    Other Notes
                </h3>
                <ul className="list-disc ml-4 text-sm">
                  {notes.split(".").map((note) => (
                    <li>
                      {note}
                    </li>
                  ))}
                </ul>
            </div>
        </div>
      </div>
    );
  };