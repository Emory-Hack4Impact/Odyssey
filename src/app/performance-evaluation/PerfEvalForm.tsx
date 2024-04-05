import { useState } from "react";
import DropdownSelect from "@/components/DropdownSelect";

interface FormData {
  time: number;
  a: string; // objective a
  b: string; // objective b
  c: string; // objective c
  d: string; // objective d
}

export default function PerfEvalForm() {
  // dropdown variables
  const rating = ["met", "partially met", "unmet"];
  const placeholder = "Select rating";
  // form variables
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    a: null,
    b: null,
    c: null,
    d: null,
  });

  return (
    <div>
      <form>
        <div className="mb-4">
          <label htmlFor="a">
            A. Employee contributes to the success of Odyssey’s mission and
            demonstrates core values
          </label>
          <DropdownSelect
            id="a"
            options={rating}
            placeholder={placeholder}
            required={true}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="b">
            B. Employee supports and sustains a team approach
          </label>
          <DropdownSelect
            id="b"
            options={rating}
            placeholder={placeholder}
            required={true}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="c">
            C. Employee cultivates an atmosphere that emphasizes ongoing
            learning and competence through training, supervision, consultation
            and feedback
          </label>
          <DropdownSelect
            id="c"
            options={rating}
            placeholder={placeholder}
            required={true}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="d">
            D. Employee has mastered the responsibilities as outlined in job
            description. Achievement of Goals (Last 12 Months)
          </label>
          <DropdownSelect
            id="d"
            options={rating}
            placeholder={placeholder}
            required={true}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
