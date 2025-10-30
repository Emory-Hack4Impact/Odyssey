import { SubmitTimeOff, type SubmitTimeOffRequest } from "@/app/api/time-off-req";
import React, { useState } from "react";

export interface FormData {
  leaveType: string;
  otherLeaveType: string;
  startDate: string;
  endDate: string;
  comments: string;
  approved: boolean;
}

const TimeOffForm: React.FC = () => {
  const [formData, setFormData] = useState<SubmitTimeOffRequest>({
    id: "00000000-0000-0000-0000-000000000001",
    leaveType: "",
    otherLeaveType: "",
    startDate: "",
    endDate: "",
    comments: "",
    approved: false,
  });

  const [showOtherLeaveTypeField, setShowOtherLeaveTypeField] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const [characterCount, setCharacterCount] = useState(0); // Track character count
  const maxChars = 150; // Maximum character limit

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "leaveType" && value === "Other") {
      setShowOtherLeaveTypeField(true);
    } else if (name === "leaveType" && value !== "Other") {
      setShowOtherLeaveTypeField(false);
      setFormData((prevState) => ({
        ...prevState,
        otherLeaveType: "",
      }));
    }

    if (name === "comments") {
      setCharacterCount(value.length); // Update character count
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Partial<FormData> = {};

    if (!formData.leaveType) {
      errors.leaveType = "*required";
    }

    if (!formData.startDate) {
      errors.startDate = "*required";
    }

    if (!formData.endDate) {
      errors.endDate = "*required";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log(formData);
      // TODO: do something on success
      await SubmitTimeOff(formData)
        .then((r) => console.log(`successfully submitted time off request: ${r.id}`))
        .catch((e) => console.error(e));
    }
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="leaveType" className="block text-lg text-gray-700">
            Leave Type:
          </label>
          <select
            id="leaveType"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="form-select mt-1 block w-full rounded-md border border-gray-300 p-2 text-lg text-gray-700"
          >
            <option value="">Select Leave Type</option>
            <option value="Annual Leave">Annual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Bereavement">Bereavement</option>
            <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
            <option value="Jury Duty">Jury Duty</option>
            <option value="Optional Holiday">Optional Holiday</option>
            <option value="Other">Other</option>
          </select>
          {formErrors.leaveType && <p className="text-sm text-red-500">{formErrors.leaveType}</p>}
        </div>
        {showOtherLeaveTypeField && (
          <div className="mb-4">
            <label htmlFor="otherLeaveType" className="block text-lg text-gray-700">
              Other Leave Type:
            </label>
            <input
              type="text"
              id="otherLeaveType"
              name="otherLeaveType"
              value={formData.otherLeaveType}
              onChange={handleChange}
              className="form-input mt-1 block w-full rounded-md border border-gray-300 p-2 text-lg text-gray-700"
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-lg text-gray-700">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="form-input mt-1 block w-full rounded-md border border-gray-300 p-2 text-lg text-gray-700"
          />
          {formErrors.startDate && <p className="text-sm text-red-500">{formErrors.startDate}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-lg text-gray-700">
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="form-input mt-1 block w-full rounded-md border border-gray-300 p-2 text-lg text-gray-700"
          />
          {formErrors.endDate && <p className="text-sm text-red-500">{formErrors.endDate}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="comments" className="block text-lg text-gray-700">
            Additional Information:
          </label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            maxLength={150}
            className="form-textarea mt-1 block w-full rounded-md border border-gray-300 p-2 text-lg text-gray-700"
            rows={4}
          />
          <p className="text-right text-sm text-gray-600">
            Characters remaining: {maxChars - characterCount}
          </p>
        </div>
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-lg text-white hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TimeOffForm;
