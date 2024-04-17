import React, { useState } from 'react';

export interface FormData {
  leaveType: string;
  otherLeaveType: string;
  startDate: string;
  endDate: string;
  comments: string;
}

const TimeOffForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    leaveType: '',
    otherLeaveType: '',
    startDate: '',
    endDate: '',
    comments: ''
  });

  const [showOtherLeaveTypeField, setShowOtherLeaveTypeField] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'leaveType' && value === 'Other') {
      setShowOtherLeaveTypeField(true);
    } else if (name === 'leaveType' && value !== 'Other') {
      setShowOtherLeaveTypeField(false);
      setFormData(prevState => ({
        ...prevState,
        otherLeaveType: ''
      }));
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Partial<FormData> = {};

    if (!formData.leaveType) {
      errors.leaveType = '*required';
    }

    if (!formData.startDate) {
      errors.startDate = '*required';
    }

    if (!formData.endDate) {
      errors.endDate = '*required';
    }

    setFormErrors(errors);

    // TODO: returns 404 atm, routing is incorrect in /api/time-off-req/
    if (Object.keys(errors).length === 0) {
      console.log(formData);
      // Add submission logic here
      try {
        const response = await fetch('/api/time-off-req', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          console.log(response.status);
          throw new Error('Error submitting time off request');
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error submitting time off request', error);
      }
    }
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-2xl p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="leaveType" className="block text-gray-700 text-lg">Leave Type:</label>
          <select
            id="leaveType"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="form-select mt-1 block w-full rounded-md border border-gray-300 text-gray-700 text-lg p-2"
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
          {formErrors.leaveType && <p className="text-red-500 text-sm">{formErrors.leaveType}</p>}
        </div>
        {showOtherLeaveTypeField && (
          <div className="mb-4">
            <label htmlFor="otherLeaveType" className="block text-gray-700 text-lg">Other Leave Type:</label>
            <input
              type="text"
              id="otherLeaveType"
              name="otherLeaveType"
              value={formData.otherLeaveType}
              onChange={handleChange}
              className="form-input mt-1 block w-full rounded-md border border-gray-300 text-gray-700 text-lg p-2"
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-gray-700 text-lg">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="form-input mt-1 block w-full rounded-md border border-gray-300 text-gray-700 text-lg p-2"
          />
          {formErrors.startDate && <p className="text-red-500 text-sm">{formErrors.startDate}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-gray-700 text-lg">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="form-input mt-1 block w-full rounded-md border border-gray-300 text-gray-700 text-lg p-2"
          />
          {formErrors.endDate && <p className="text-red-500 text-sm">{formErrors.endDate}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="comments" className="block text-gray-700 text-lg">Additional Information:</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className="form-textarea mt-1 block w-full rounded-md border border-gray-300 text-gray-700 text-lg p-2"
            rows={4}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white text-lg px-4 py-2 rounded hover:bg-blue-600">Submit</button>
      </form>
    </div>
  );
};

export default TimeOffForm;
