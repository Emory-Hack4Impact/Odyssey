import React, { useState } from 'react';
import PerformanceDetail from './PerformanceDetail';

const evaluations = [
  {
    id: 1,
    employeeName: "John Doe",
    year: 2024,
    a: "met",
    aComm: "Excellent work on project X",
    b: "exceed",
    bComm: "Outstanding teamwork",
    c: "met",
    cComm: "Good participation in training",
    d: "not met",
    dComm: "Needs improvement in time management"
  },
  {
    id: 2,
    employeeName: "Alice Johnson",
    year: 2024,
    a: "exceed",
    aComm: "Surpassed all targets for Q1",
    b: "met",
    bComm: "Reliable team player",
    c: "met",
    cComm: "Proactively engages in learning",
    d: "exceed",
    dComm: "Took on additional responsibilities"
  },
  {
    id: 3,
    employeeName: "Michael Smith",
    year: 2024,
    a: "met",
    aComm: "Meets all required standards",
    b: "not met",
    bComm: "Struggles with teamwork dynamics",
    c: "met",
    cComm: "Consistently seeks feedback",
    d: "met",
    dComm: "Adheres to job role expectations"
  }
];

const PerformanceList = () => {
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const handleOpenClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
  };

  const handleCloseClick = () => {
    setSelectedEvaluation(null); // Set to null to close the detailed view
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl mt-10">
        {selectedEvaluation ? (
          <div>
            <PerformanceDetail evaluation={selectedEvaluation} />
            <button
              onClick={handleCloseClick}
              className="mt-4 mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        ) : (
          evaluations.map((evaluation) => (
            <div key={evaluation.id} className="mb-4 p-4 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">{evaluation.employeeName}</h2>
                  <p className="text-gray-600">Submitted: {new Date().toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleOpenClick(evaluation)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                >
                  Open
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PerformanceList;