import { useState } from "react";
import DropdownSelect from "@/components/DropdownSelect";

interface FormData {
  year: number;
  a: string; // objective a
  b: string; // objective b
  c: string; // objective c
  d: string; // objective d
}

export default function PerfEvalForm() {
  // dropdown variables
  const rating = ["not met", "met", "exceed"];
  const placeholder = "Select rating";
  // form variables
  const [formData, setFormData] = useState<FormData>({
    year: new Date().getFullYear(),
    a: "",
    b: "",
    c: "",
    d: "",
  });
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <div className="m-6">
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="year" className="block">
            Year
          </label>
          <input
            type="number"
            id="year"
            defaultValue={formData.year}
            size={4}
            maxLength={4}
            onChange={handleChange}
            className="block w-24 rounded-lg p-2 text-black"
          />
        </div>
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
