import React from "react";
import { TextField } from "src/components/TextField";
import { Tile } from "src/components/Tile";
import PerfEvalForm from "./PerfEvalForm";
import PerformanceBar from "./manage-evals/PerformanceBar"

export const RegularEmployee = (): JSX.Element => {
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
      <div className="inline-flex flex-col items-start gap-[15px] pl-[100px] pr-[50px] pt-0 pb-[35px]">
        <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-[22px] text-center tracking-[0] leading-[normal]">
          Job Performance Ratings
        </div>
        <PerformanceBar label="Communication" percentage={100} />
        <PerformanceBar label="Leadership" percentage={75} />
        <PerformanceBar label="Timeliness" percentage={90} />
        <PerformanceBar label="Skill" percentage={50} />
        <PerformanceBar label="Skill" percentage={50} />
        <PerformanceBar label="Skill" percentage={50} />

        <div className="inline-flex items-start gap-[25px] pl-[100px] pr-[50px] pt-0 pb-[35px] absolute top-0 left-0">
          <Tile property1="stat" text="80%" text1="Overall Rating" />
          <Tile property1="Profiles" text1="Reviewers" />
        </div>
      </div>

      <PerfEvalForm />
    </>
  );
};
export default RegularEmployee;

