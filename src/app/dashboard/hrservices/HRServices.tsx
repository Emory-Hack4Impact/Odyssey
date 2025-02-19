"use client"

import { User } from "@supabase/supabase-js"

export const HRServices({ user: User }) {
  const [timeOff, setTimeOff] = useState(true)
  const [careerDev, setCareerDev] = useState(false)
  const [perfEvals, setperfEvals] = useState(false)
  const [benefits, setBenefits] = useState(false)
  const [docs, setDocs] = useState(true)

  return (
    <div className="flex w-full h-screen items-start mt-12 px-4">
      <div className="animate-in flex flex-1 flex-col gap-20 px-3 opacity-0">
        {/* non-null assertion because middleware will redirect to signin if user doesn't exist */}
        <div className="flex justify-between border-b-2">
            {`HR Services for ${res}`}
            <div className="flex">
                <button className="px-4 py-2">Time Off</button>
                <button className="px-4 py-2">Career Development</button>
                <button className="px-4 py-2">Performance Evaluations</button>
                <button className="px-4 py-2">Benefits</button>
                <button className="px-4 py-2">Documents</button>
            </div>
        </div>
      </div>
    </div>
  );
}