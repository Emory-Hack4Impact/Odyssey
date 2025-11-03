"use client";
import React, { useState } from "react";
import { TextAreaWithDescription } from "../../Textarea";
import { PerformanceRatingSlider } from "./PerformanceRatingSliders";

interface HRServicesProps {
  userId: string;
  username: string;
  userRole: string;
}

interface FormData {
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

export default function EmployeePerfEvalForm({
  userId: _userId,
  username: _username,
  userRole: _userRole,
}: HRServicesProps) {
  type State = {
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
    year: 2025,
    strengths: "",
    weaknesses: "",
    improvements: "",
    notes: "",
    communication: 50,
    leadership: 50,
    timeliness: 50,
    skill1: 50,
    skill2: 50,
    skill3: 50,
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  // No generic input handler required anymore (name/year/name fields removed)

  const handleTextAreaChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value } as unknown as State));

    if (formErrors[field as keyof FormData]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleRatingChange = (field: keyof State, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value } as unknown as State));

    if (formErrors[field as keyof FormData]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Partial<FormData> = {};

    if (!formData.strengths) {
      errors.strengths = "*required";
    }

    if (!formData.weaknesses) {
      errors.weaknesses = "*required";
    }

    if (!formData.improvements) {
      errors.improvements = "*required";
    }

    if (!formData.communication) {
      errors.communication = "*required";
    }

    if (!formData.leadership) {
      errors.leadership = "*required";
    }

    if (!formData.timeliness) {
      errors.timeliness = "*required";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log("Submitting form data:", formData);
      try {
        // attach submitter info from props (username, userRole). Email may not be available here; leave blank unless the caller passes it later.
        const payload = {
          employeeId: undefined,
          submitterId: undefined,
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
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const response = await resp.json();
        console.log(`Successfully submitted employee evaluation: ${response.id}`);
        alert("Evaluation submitted successfully!");

        // Reset form to defaults
        setFormData({
          year: 2025,
          strengths: "",
          weaknesses: "",
          improvements: "",
          notes: "",
          communication: 50,
          leadership: 50,
          timeliness: 50,
          skill1: 50,
          skill2: 50,
          skill3: 50,
        });
      } catch (error) {
        console.error("Error submitting evaluation:", error);
        alert("There was an error submitting the evaluation. Please try again.");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Header and name/year fields intentionally removed per UX request */}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <TextAreaWithDescription
              label="Strengths"
              placeholder="List employee's strengths."
              onChange={(value) => handleTextAreaChange("strengths", value)}
              value={formData.strengths}
            />
            {formErrors.strengths && <p className="text-sm text-red-500">{formErrors.strengths}</p>}
          </div>

          <div>
            <TextAreaWithDescription
              label="Weaknesses"
              placeholder="List employee's weaknesses."
              onChange={(value) => handleTextAreaChange("weaknesses", value)}
              value={formData.weaknesses}
            />
            {formErrors.weaknesses && (
              <p className="text-sm text-red-500">{formErrors.weaknesses}</p>
            )}
          </div>

          <div>
            <TextAreaWithDescription
              label="Improvements"
              placeholder="List things the employee can improve on."
              onChange={(value) => handleTextAreaChange("improvements", value)}
              value={formData.improvements}
            />
            {formErrors.improvements && (
              <p className="text-sm text-red-500">{formErrors.improvements}</p>
            )}
          </div>

          <div>
            <TextAreaWithDescription
              label="Other Notes (Optional)"
              placeholder="Other notes you want to include."
              value={formData.notes}
              onChange={(value) => handleTextAreaChange("notes", value)}
            />
          </div>
        </div>

        <div className="mb-6 w-full md:w-[50%]">
          <h2 className="mb-4 text-lg font-semibold">Performance Ratings</h2>
          <div className="space-y-4">
            <div>
              <PerformanceRatingSlider
                category="Communication"
                value={50}
                onChange={(value) => handleRatingChange("communication", value)}
              />
              {formErrors.communication && (
                <p className="text-sm text-red-500">{formErrors.communication}</p>
              )}
            </div>

            <div>
              <PerformanceRatingSlider
                category="Leadership"
                value={50}
                onChange={(value) => handleRatingChange("leadership", value)}
              />
              {formErrors.leadership && (
                <p className="text-sm text-red-500">{formErrors.leadership}</p>
              )}
            </div>

            <div>
              <PerformanceRatingSlider
                category="Timeliness"
                value={50}
                onChange={(value) => handleRatingChange("timeliness", value)}
              />
              {formErrors.timeliness && (
                <p className="text-sm text-red-500">{formErrors.timeliness}</p>
              )}
            </div>

            <div>
              <PerformanceRatingSlider
                category="Skill1"
                value={50}
                onChange={(value) => handleRatingChange("skill1", value)}
              />
            </div>

            <div>
              <PerformanceRatingSlider
                category="Skill2"
                value={50}
                onChange={(value) => handleRatingChange("skill2", value)}
              />
            </div>

            <div>
              <PerformanceRatingSlider
                category="Skill3"
                value={50}
                onChange={(value) => handleRatingChange("skill3", value)}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-3xl border-2 px-3 py-2 text-gray-400 transition-all hover:border-black hover:text-black"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
