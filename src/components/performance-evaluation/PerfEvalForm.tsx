"use client"
import React, { useState} from 'react'
import { TextAreaWithDescription } from '../Textarea'
import { PerformanceRatingSlider } from './PerformanceRatingSliders'

interface HRServicesProps {
  username: string;
  userRole: string;
}

export default function PerfEvalForm({ username, userRole }: HRServicesProps) {

  let employee;

  if (username === 'Employee') {
    employee = username
  }

  const [year, setYear] = useState(userRole === "Employee" ? "2025" : "")
  const [strengths, setStrengths] = useState("")
  const [weaknesses, setWeaknesses] = useState("")
  const [improvements, setImprovements] = useState("")
  const [notes, setNotes] = useState("")
  const [ratings, setRatings] = useState<number[]>([])

  return (
    <div>
     <div className="flex flex-col gap-6 mb-6">
        <h3>Create Employee Performance Evaluation</h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            className="border-2 border-gray-400 bg-white text-gray-400 px-3 py-2 rounded-3xl max-w-80" 
            placeholder={userRole === "Employee" ? username : "Search Employee"}
            disabled={userRole === "Employee"}
          />
          <button className="border-2 text-gray-400 px-3 py-2 rounded-3xl hover:text-black hover:border-black transition-all" disabled={userRole === "Employee"}>+</button>
        </div>
        <div className="w-36">
            <h3 className="mb-2">Year</h3>
            <div className="border-2 text-gray-400 bg-white px-3 py-2 rounded-3xl">
                <select id="year" name="year" disabled={userRole === "Employee"}>
                    <option value="" disabled>Select Year</option>
                    <option value="2020" onChange={() => setYear("2020")}>2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025" selected={userRole === "Employee"}>2025</option>
                </select>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <TextAreaWithDescription
          label="Strengths"
          placeholder="List employee's strengths."
          onChange={(value) => setStrengths(value)}
        />
        <TextAreaWithDescription
          label="Weaknesses"
          placeholder="List employee's weaknesses."
          onChange={(value) => setStrengths(value)}
        />
        <TextAreaWithDescription
          label="Improvements"
          placeholder="List things the employee can improve on."
          onChange={(value) => setImprovements(value)}
        />
        <TextAreaWithDescription
          label="Other Notes (Optional)"
          placeholder="Other notes you want to include."
          onChange={(value) => setNotes(value)}
        />
      </div>

      <div className="w-[50%] mb-6">
        <PerformanceRatingSlider 
          categories={['Communication', 'Leadership', 'Timeliness', 'Skill', 'Skill', 'Skill']} 
          onChange={(value: number[]) => setRatings(value)}
        />
      </div>
      <button type="submit" className="border-2 text-gray-400 px-3 py-2 rounded-3xl hover:text-black hover:border-black transition-all">Submit</button>
    </div>
  )
}
