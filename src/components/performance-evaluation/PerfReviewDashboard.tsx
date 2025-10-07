import React from "react";
import { RatingItem } from "./RatingItem";

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

export const PerformanceReviewDashboard: React.FC<
  PerformanceReviewDashboardProps
> = ({
  strengths,
  weaknesses,
  improvements,
  notes,
  communication,
  leadership,
  timeliness,
  skill1,
  skill2,
  skill3,
}) => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <div className="mx-auto rounded-lg p-6">
          {/* Overall Rating and Reviewers Section */}
          <div className="mb-8 flex items-center justify-center gap-6">
            <div className="flex flex-col items-center rounded-3xl border-2 px-4 py-4">
              <div className="text-4xl font-bold text-black">
                {Math.round(
                  (Number(communication) +
                    Number(leadership) +
                    Number(timeliness) +
                    Number(skill1) +
                    Number(skill2) +
                    Number(skill3)) /
                    6,
                )}
                %
              </div>
              <div className="text-lg text-black">Overall Rating</div>
            </div>
            <div className="flex flex-col items-center rounded-3xl border-2 px-4 py-4">
              <div className="flex space-x-1">
                {[...Array(2)].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-10 rounded-full border-2 border-white bg-gray-300"
                  ></div>
                ))}
              </div>
              <h3 className="text-lg">Reviewers</h3>
            </div>
          </div>

          {/* Job Performance Ratings Section */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">
              Job Performance Ratings
            </h2>
            <RatingItem
              key={1}
              label="Communication"
              percentage={communication}
            />
            <RatingItem key={2} label="Leadership" percentage={leadership} />
            <RatingItem key={3} label={"Timeliness"} percentage={timeliness} />
            <RatingItem key={4} label="Skill1" percentage={skill1} />
            <RatingItem key={5} label="Skill2" percentage={skill2} />
            <RatingItem key={6} label="Skill2" percentage={skill3} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-xl">Strengths</h3>
          <ul className="ml-4 list-disc text-sm">
            {strengths.split(".").map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-xl">Weaknesses</h3>
          <ul className="ml-4 list-disc text-sm">
            {weaknesses.split(".").map((weakness) => (
              <li key={weakness}>{weakness}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-xl">Improvements</h3>
          <ul className="ml-4 list-disc text-sm">
            {improvements.split(".").map((improvement) => (
              <li key={improvement}>{improvement}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-xl">Other Notes</h3>
          <ul className="ml-4 list-disc text-sm">
            {notes.split(".").map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
