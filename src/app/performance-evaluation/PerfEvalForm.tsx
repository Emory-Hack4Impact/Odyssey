import { useState } from "react";
import DropdownSelect from "@/components/DropdownSelect";

interface FormData {
  year: number; // year of evaluation
  a: string; // objective a
  aComm: string; // comments for objective a
  b: string; // objective b
  bComm: string; // comments for objective b
  c: string; // objective c
  cComm: string; // comments for objective c
  d: string; // objective d
  dComm: string; // comments for objective d
}

export default function PerfEvalForm() {
  // dropdown variables
  const rating = ["not met", "met", "exceed"];
  const placeholder = "Select rating";
  // form variables
  const [formData, setFormData] = useState<FormData>({
    year: new Date().getFullYear(),
    a: "",
    aComm: "",
    b: "",
    bComm: "",
    c: "",
    cComm: "",
    d: "",
    dComm: "",
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
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
          <label htmlFor="year">Year</label>
          <input
            type="number"
            id="year"
            defaultValue={formData.year}
            max="9999"
            onChange={handleChange}
            className="block w-24 rounded-lg p-2 text-black"
            required
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
            className="my-2 rounded-lg p-2"
          />
          <label htmlFor="aComm">Comments:</label>
          <textarea
            id="aComm"
            placeholder="Add comments..."
            rows={4}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg p-2 text-black"
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
            className="my-2 rounded-lg p-2"
          />
          <label htmlFor="bComm">Comments:</label>
          <textarea
            id="bComm"
            placeholder="Add comments..."
            rows={4}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg p-2 text-black"
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
            className="my-2 rounded-lg p-2"
          />
          <label htmlFor="cComm">Comments:</label>
          <textarea
            id="cComm"
            placeholder="Add comments..."
            rows={4}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg p-2 text-black"
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
            className="my-2 rounded-lg p-2"
          />
          <label htmlFor="dComm">Comments:</label>
          <textarea
            id="dComm"
            placeholder="Add comments..."
            rows={4}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg p-2 text-black"
          />
        </div>
        <button type="submit" className="hover:text-gray-300">Submit</button>
      </form>
    </div>
  );
}
