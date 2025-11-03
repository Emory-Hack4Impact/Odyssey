"use client";
import React, { useState } from "react";
import { TextAreaWithDescription } from "../../Textarea";
import { PerformanceRatingSlider } from "./PerformanceRatingSliders";

interface Props {
  id: string;
  employeeId?: string | null;
  submitterId?: string | null; // person performing the submit (manager or HR)
  employeeFirstName: string;
  employeeLastName: string;
  year?: number;
  strengths?: string;
  weaknesses?: string;
  improvements?: string;
  notes?: string;
  communication?: number | string;
  leadership?: number | string;
  timeliness?: number | string;
  skill1?: number | string;
  skill2?: number | string;
  skill3?: number | string;
  submitterUsername?: string;
  submitterRole?: string;
}

export default function HRPerfEvalForm(props: Props) {
  const {
    id,
    employeeId = null,
    submitterId = null,
    employeeFirstName = "",
    employeeLastName = "",
    year = 2025,
    strengths = "",
    weaknesses = "",
    improvements = "",
    notes = "",
    communication = 0,
    leadership = 0,
    timeliness = 0,
    skill1 = 0,
    skill2 = 0,
    skill3 = 0,
  } = props;

  // normalize possible string props to numbers for internal state
  const communicationNum = typeof communication === "string" ? Number(communication) : communication ?? 0;
  const leadershipNum = typeof leadership === "string" ? Number(leadership) : leadership ?? 0;
  const timelinessNum = typeof timeliness === "string" ? Number(timeliness) : timeliness ?? 0;
  const skill1Num = typeof skill1 === "string" ? Number(skill1) : skill1 ?? 0;
  const skill2Num = typeof skill2 === "string" ? Number(skill2) : skill2 ?? 0;
  const skill3Num = typeof skill3 === "string" ? Number(skill3) : skill3 ?? 0;
  type State = {
    id: string;
    employeeId?: string | null;
    submitterId?: string | null;
    year: number;
    strengths: string;
    weaknesses: string;
    improvements: string;
    notes: string;
    communication: number;
    leadership: number;
    timeliness: number;
    skill1: number;
    skill2: number;
    skill3: number;
  };

  const [formData, setFormData] = useState<State>({
    id,
    employeeId,
    submitterId,
    year,
    strengths,
    weaknesses,
    improvements,
    notes,
    communication: communicationNum,
    leadership: leadershipNum,
    timeliness: timelinessNum,
    skill1: skill1Num,
    skill2: skill2Num,
    skill3: skill3Num,
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});

  const handleChange = (field: keyof State, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value } as unknown as State));
    if (formErrors[field as string]) setFormErrors((p) => ({ ...p, [field as string]: undefined }));
  };

  const handleRatingChange = (field: keyof State, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value } as unknown as State));
    if (formErrors[field as string]) setFormErrors((p) => ({ ...p, [field as string]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Partial<Record<string, string>> = {};
    if (!formData.strengths) errors.strengths = "*required";
    if (!formData.weaknesses) errors.weaknesses = "*required";
    if (!formData.improvements) errors.improvements = "*required";
    if (!formData.communication && formData.communication !== 0) errors.communication = "*required";
    if (!formData.leadership && formData.leadership !== 0) errors.leadership = "*required";
    if (!formData.timeliness && formData.timeliness !== 0) errors.timeliness = "*required";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const payload = {
        employeeId: formData.employeeId ?? undefined,
        submitterId: formData.submitterId ?? undefined,
        year: formData.year,
        strengths: formData.strengths,
        weaknesses: formData.weaknesses,
        improvements: formData.improvements,
        notes: formData.notes,
        communication: formData.communication,
        leadership: formData.leadership,
        timeliness: formData.timeliness,
        skill1: formData.skill1,
        skill2: formData.skill2,
        skill3: formData.skill3,
        submittedAt: new Date(),
      };

      const resp = await fetch("/api/employee-evals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, data: payload }),
      });
      const result = await resp.json();
      console.log("UpdateEmployeeEval result:", result);
      alert("Evaluation submitted successfully!");
      // optionally reset or close
    } catch (err) {
      console.error("Update error", err);
      alert("There was an error submitting the evaluation.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6 flex flex-col gap-6">
          <h3>Employee Performance Evaluation Review</h3>
          <div className="flex gap-2">
            <input
              type="text"
              className="w-[400px] rounded-3xl border-2 border-gray-400 bg-white px-3 py-2 text-gray-400"
              value={`${employeeFirstName} ${employeeLastName}`}
              readOnly
            />
          </div>

          <div className="w-36">
            <h3 className="mb-2">Year</h3>
            <div className="rounded-3xl border-2 bg-white px-3 py-2 text-gray-400">
              <select id="year" name="year" value={formData.year} onChange={(e) => handleChange("year", e.target.value)} disabled>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <TextAreaWithDescription
              label="Strengths"
              value={formData.strengths}
              placeholder="List employee's strengths."
              onChange={(value) => handleChange("strengths", value)}
            />
            {formErrors.strengths && <p className="text-sm text-red-500">{formErrors.strengths}</p>}
          </div>

          <div>
            <TextAreaWithDescription
              label="Weaknesses"
              placeholder="List employee's weaknesses."
              value={formData.weaknesses}
              onChange={(value) => handleChange("weaknesses", value)}
            />
            {formErrors.weaknesses && <p className="text-sm text-red-500">{formErrors.weaknesses}</p>}
          </div>

          <div>
            <TextAreaWithDescription
              label="Improvements"
              placeholder="List things the employee can improve on."
              value={formData.improvements}
              onChange={(value) => handleChange("improvements", value)}
            />
            {formErrors.improvements && <p className="text-sm text-red-500">{formErrors.improvements}</p>}
          </div>

          <div>
            <TextAreaWithDescription
              label="Other Notes (Optional)"
              placeholder="Other notes you want to include."
              value={formData.notes}
              onChange={(value) => handleChange("notes", value)}
            />
          </div>
        </div>

        <div className="mb-6 w-full md:w-[50%]">
          <h2 className="mb-4 text-lg font-semibold">Performance Ratings</h2>
          <div className="space-y-4">
            <div>
              <PerformanceRatingSlider
                category="Communication"
                value={formData.communication}
                onChange={(v) => handleRatingChange("communication", v)}
              />
              {formErrors.communication && <p className="text-sm text-red-500">{formErrors.communication}</p>}
            </div>

            <div>
              <PerformanceRatingSlider
                category="Leadership"
                value={formData.leadership}
                onChange={(v) => handleRatingChange("leadership", v)}
              />
              {formErrors.leadership && <p className="text-sm text-red-500">{formErrors.leadership}</p>}
            </div>

            <div>
              <PerformanceRatingSlider
                category="Timeliness"
                value={formData.timeliness}
                onChange={(v) => handleRatingChange("timeliness", v)}
              />
              {formErrors.timeliness && <p className="text-sm text-red-500">{formErrors.timeliness}</p>}
            </div>

            <div>
              <PerformanceRatingSlider
                category="Skill1"
                value={formData.skill1}
                onChange={(v) => handleRatingChange("skill1", v)}
              />
            </div>

            <div>
              <PerformanceRatingSlider
                category="Skill2"
                value={formData.skill2}
                onChange={(v) => handleRatingChange("skill2", v)}
              />
            </div>

            <div>
              <PerformanceRatingSlider
                category="Skill3"
                value={formData.skill3}
                onChange={(v) => handleRatingChange("skill3", v)}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-3xl border-2 px-3 py-2 text-gray-400 transition-all hover:border-black hover:text-black"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
