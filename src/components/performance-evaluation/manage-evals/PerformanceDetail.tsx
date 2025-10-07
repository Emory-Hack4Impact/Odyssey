import React from "react";

interface Evaluation {
  employeeName: string;
  year: number;
  a: string;
  aComm: string;
  b: string;
  bComm: string;
  c: string;
  cComm: string;
  d: string;
  dComm: string;
}

interface PerformanceDetailProps {
  evaluation: Evaluation;
}

// Assuming this structure for the evaluation details passed as props
const PerformanceDetail: React.FC<PerformanceDetailProps> = ({
  evaluation,
}) => {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Performance Evaluation Detail</h2>
      <div className="mb-4">
        <strong>Employee Name:</strong> {evaluation.employeeName}
      </div>
      <div className="mb-4">
        <strong>Year of Evaluation:</strong> {evaluation.year}
      </div>
      <div className="mb-4">
        <strong>Objectives and Comments:</strong>
        <ul className="list-disc pl-5">
          <li>
            <strong>A:</strong> {evaluation.a} - {evaluation.aComm}
          </li>
          <li>
            <strong>B:</strong> {evaluation.b} - {evaluation.bComm}
          </li>
          <li>
            <strong>C:</strong> {evaluation.c} - {evaluation.cComm}
          </li>
          <li>
            <strong>D:</strong> {evaluation.d} - {evaluation.dComm}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceDetail;
