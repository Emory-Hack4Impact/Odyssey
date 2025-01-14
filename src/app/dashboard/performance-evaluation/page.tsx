"use client";
import PerfEvalForm from "./PerfEvalForm";

export default function PerformanceEvaluation() {
  return (
    <>
      <div className="w-9/12 py-4">
        <div>
          <h1 className="font-playfair text-light-maroon">
            <b>MAJOR JOB OBJECTIVES</b>
          </h1>
          <ol style={{ listStyleType: "upper-alpha" }} className="mb-2 ml-6">
            <li key="A">
              Contributes to the success of Odyssey’s mission and demonstrates
              core values
            </li>
            <li key="B">Supports and sustains a team approach</li>
            <li key="C">
              Cultivates an atmosphere that emphasizes ongoing learning and
              competence through training, supervision, consultation and
              feedback
            </li>
            <li key="D">
              Master responsibilities as outlined in job description
            </li>
          </ol>
        </div>
        <div className="mb-2">
          <h1 className="font-playfair text-light-maroon">
            <b>MISSION STATEMENT</b>
          </h1>
          <p>
            “Odyssey seeks to improve the well-being of individuals and families
            by providing comprehensive behavioral health services.”
          </p>
        </div>
        <div>
          <h1 className="font-playfair text-light-maroon">
            <b>CORE VALUES</b>
          </h1>
          <p>
            Odyssey is guided by the values of respect, diversity, integrity and
            care. Odyssey’s core values form the foundation on which we work and
            conduct ourselves. We have an entire universe of values, but some of
            them are so primary, so important to us that throughout the changes
            in society, government, politics, and technology these are STILL the
            core values we abide by. These values underlie our work, how we
            interact with each other, and the strategies we employ to fulfill
            our mission. The core values are the basic elements of how we go
            about our work. They are the practices we strive to use every day in
            everything we do.
          </p>
        </div>
      </div>
      <PerfEvalForm />
    </>
  );
}
