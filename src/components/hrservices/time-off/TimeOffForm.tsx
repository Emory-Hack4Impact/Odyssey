"use client";

import { SubmitTimeOff, type SubmitTimeOffRequest } from "@/app/api/time-off-req";
import React, { useState } from "react";

export interface FormData {
  leaveType: string;
  otherLeaveType: string;
  startDate: string;
  endDate: string;
  comments: string;
}

interface TimeOffFormProps {
  employeeId: string;
  onSuccess?: () => void;
}

const TimeOffForm = ({ employeeId, onSuccess }: TimeOffFormProps) => {
  const [formData, setFormData] = useState<SubmitTimeOffRequest>({
    id: employeeId,
    leaveType: "",
    otherLeaveType: "",
    startDate: "",
    endDate: "",
    comments: "",
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
    } else {
      // Validate date format
      const date = new Date(formData.startDate);
      if (isNaN(date.getTime())) {
        errors.startDate = "*invalid date";
      }
    }

    if (!formData.endDate) {
      errors.endDate = "*required";
    } else {
      // Validate date format
      const date = new Date(formData.endDate);
      if (isNaN(date.getTime())) {
        errors.endDate = "*invalid date";
      }
    }

    // Validate end date is after start date
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
        errors.endDate = "*end date must be after start date";
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        console.log("Submitting form data:", formData);
        const result = await SubmitTimeOff(formData);
        console.log(`Successfully submitted time off request: ${result.id}`);

        // Reset form
        setFormData({
          id: employeeId,
          leaveType: "",
          otherLeaveType: "",
          startDate: "",
          endDate: "",
          comments: "",
        });
        setShowOtherLeaveTypeField(false);
        setFormErrors({});
        setCharacterCount(0);

        // Trigger refresh callback
        if (onSuccess) {
          onSuccess();
        }
      } catch (e) {
        console.error("Error submitting request:", e);
        const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
        alert(`Failed to submit request: ${errorMessage}. Please try again.`);
      }
    } else {
      console.log("Form validation errors:", errors);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h2 className="mb-6 text-lg font-semibold text-gray-800">Request Time Off</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="leaveType" className="mb-1 block text-sm font-medium text-gray-700">
              Leave Type
            </label>
            <select
              id="leaveType"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:outline-none ${formErrors.leaveType
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
            >
              <option value="">Select a Type</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Bereavement">Bereavement</option>
              <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
              <option value="Jury Duty">Jury Duty</option>
              <option value="Optional Holiday">Optional Holiday</option>
              <option value="Other">Other</option>
            </select>
            {formErrors.leaveType && (
              <p className="mt-1 text-xs text-red-500">{formErrors.leaveType}</p>
            )}
          </div>

          {showOtherLeaveTypeField && (
            <div>
              <label
                htmlFor="otherLeaveType"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Specify Leave Type
              </label>
              <input
                type="text"
                id="otherLeaveType"
                name="otherLeaveType"
                value={formData.otherLeaveType}
                onChange={handleChange}
                placeholder="Enter leave type"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-gray-700">
                Date From
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:outline-none ${formErrors.startDate
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
              />
              {formErrors.startDate && (
                <p className="mt-1 text-xs text-red-500">{formErrors.startDate}</p>
              )}
            </div>
            <div>
              <label htmlFor="endDate" className="mb-1 block text-sm font-medium text-gray-700">
                Date To
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:outline-none ${formErrors.endDate
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
              />
              {formErrors.endDate && (
                <p className="mt-1 text-xs text-red-500">{formErrors.endDate}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="comments" className="mb-1 block text-sm font-medium text-gray-700">
              Additional Information
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              maxLength={150}
              placeholder="Notes"
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none"
            />
            <div className="mt-1 flex justify-end">
              <p
                className={`text-xs ${characterCount >= maxChars ? "text-red-500" : "text-gray-500"}`}
              >
                {characterCount}/{maxChars}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeOffForm;
