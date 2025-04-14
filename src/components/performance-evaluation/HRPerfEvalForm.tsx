"use client"
import React, { useState} from 'react'
import { TextAreaWithDescription } from '../Textarea'
import { PerformanceRatingSlider } from './PerformanceRatingSliders'
import { EmployeeEval, SubmitEmployeeEval, UpdateEmployeeEval } from '@/app/api/employee-evals'

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

interface FetchedEval {
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

export default function HRPerfEvalForm({
    id,
    employeeId,
    year, 
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
  }: FetchedEval
) {


  const [formData, setFormData] = useState<FetchedEval>({
    id,
    employeeId,
    year: 2025,
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
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleTextAreaChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (formErrors[field as keyof FormData]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleRatingChange = (field: keyof EmployeeEval, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.toString()
    }));
    
    if (formErrors[field as keyof FormData]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
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
        const response = await UpdateEmployeeEval(formData.id, formData);
        console.log(`Successfully submitted employee evaluation: ${response.id}`);
        alert("Evaluation submitted successfully!");
        
        // Reset form
        setFormData({
          id: 0,
          employeeId: "",
          year: 2025,
          strengths: "",
          weaknesses: "",
          improvements: "",
          notes: "",
          communication: "",
          leadership: "",
          timeliness: "",
          skill1: "",
          skill2: "",
          skill3: "",
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
        <div className="flex flex-col gap-6 mb-6">
          <h3>Employee Performance Evaluation Review</h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="border-2 border-gray-400 bg-white text-gray-400 px-3 py-2 rounded-3xl w-[400px]" 
              value={employeeId}
            />
            {/* <button 
              type="button" 
              className="border-2 text-gray-400 px-3 py-2 rounded-3xl hover:text-black hover:border-black transition-all" 
              disabled
            >
              +
            </button> */}
          </div>
          <div className="w-36">
            <h3 className="mb-2">Year</h3>
            <div className="border-2 text-gray-400 bg-white px-3 py-2 rounded-3xl">
              <select 
                id="year" 
                name="year" 
                value={formData.year} 
                onChange={handleChange}
                disabled
              >
                <option value="" disabled>Select Year</option>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <TextAreaWithDescription
              label="Strengths"
              value={formData.strengths}
              placeholder="List employee's strengths."
              onChange={(value) => handleTextAreaChange("strengths", value)}
            />
            {formErrors.strengths && <p className="text-red-500 text-sm">{formErrors.strengths}</p>}
          </div>
          
          <div>
            <TextAreaWithDescription
              label="Weaknesses"
              placeholder="List employee's weaknesses."
              value={formData.weaknesses}
              onChange={(value) => handleTextAreaChange("weaknesses", value)}
            />
            {formErrors.weaknesses && <p className="text-red-500 text-sm">{formErrors.weaknesses}</p>}
          </div>
          
          <div>
            <TextAreaWithDescription
              label="Improvements"
              placeholder="List things the employee can improve on."
              value={formData.improvements}
              onChange={(value) => handleTextAreaChange("improvements", value)}
            />
            {formErrors.improvements && <p className="text-red-500 text-sm">{formErrors.improvements}</p>}
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

        <div className="w-full md:w-[50%] mb-6">
          <h2 className="text-lg font-semibold mb-4">Performance Ratings</h2>
          <div className="space-y-4">
            <div>
              <PerformanceRatingSlider 
                category="Communication" 
                value={Number(formData.communication)}
                onChange={(value) => handleRatingChange("communication", value)} 
              />
              {formErrors.communication && <p className="text-red-500 text-sm">{formErrors.communication}</p>}
            </div>
            
            <div>
              <PerformanceRatingSlider 
                category="Leadership" 
                value={Number(formData.leadership)}
                onChange={(value) => handleRatingChange("leadership", value)}
              />
              {formErrors.leadership && <p className="text-red-500 text-sm">{formErrors.leadership}</p>}
            </div>
            
            <div>
              <PerformanceRatingSlider 
                category="Timeliness" 
                value={Number(formData.timeliness)}
                onChange={(value) => handleRatingChange("timeliness", value)} 
              />
              {formErrors.timeliness && <p className="text-red-500 text-sm">{formErrors.timeliness}</p>}
            </div>
            
            <div>
              <PerformanceRatingSlider 
                category="Skill1" 
                value={Number(formData.skill1)}
                onChange={(value) => handleRatingChange("skill1", value)} 
              />
            </div>
            
            <div>
              <PerformanceRatingSlider 
                category="Skill2" 
                value={Number(formData.skill2)}
                onChange={(value) => handleRatingChange("skill2", value)} 
              />
            </div>
            
            <div>
              <PerformanceRatingSlider 
                category="Skill3" 
                value={Number(formData.skill3)}
                onChange={(value) => handleRatingChange("skill3", value)} 
              />
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="border-2 text-gray-400 px-3 py-2 rounded-3xl hover:text-black hover:border-black transition-all"
        >
          Submit Review
        </button>
      </form>
    </div>
  )
}