import React from 'react'
import { PerformanceReviewDashboard } from './PerfReviewDashboard';

export default function PerfEvalEmployee() {

  const performanceData = {
    overallRating: 80,
    reviewerCount: 5,
    ratings: [
      { label: 'Communication', percentage: 100 },
      { label: 'Leadership', percentage: 75 },
      { label: 'Timeliness', percentage: 90 },
      { label: 'Skill', percentage: 50 },
      { label: 'Skill', percentage: 50 },
      { label: 'Skill', percentage: 50 }
    ],
   };

  return (
    <>
        <div className="relative flex w-full mb-6">
            <div>
                <h3 className="mb-2">Year</h3>
                <div className="border-2 border-gray-400 text-gray-400 px-3 py-2 rounded-3xl">
                    <select id="year" name="year">
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023" selected>2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                </div>
            </div>
            <h1 className="text-xl absolute left-1/2 transform -translate-x-1/2">Performance Evaluations</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div>
                <PerformanceReviewDashboard {...performanceData} />
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-xl mb-2">
                        Strengths
                    </h3>
                    <ul className="list-disc ml-4">
                        <li>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                        </li>
                        <li>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                        </li>
                        <li>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl mb-2">
                        Weaknesses
                    </h3>
                    <ul className="list-disc ml-4">
                        <li>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                        </li>
                        <li>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl mb-2">
                        Improvements
                    </h3>
                    <ul className="list-disc ml-4">
                        <li>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                        </li>
                        <li>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl mb-2">
                        Other Notes
                    </h3>
                    <ul className="list-disc ml-4">
                        <li>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                        </li>
                    </ul>
                </div>


            </div>
        </div>

        
    </>
  )
}
