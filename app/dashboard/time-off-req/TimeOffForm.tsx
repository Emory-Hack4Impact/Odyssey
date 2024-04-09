import React, { useState } from 'react';

interface FormData {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

    if (Object.keys(errors).length === 0) {
      console.log(formData);
      // Add submission logic here
    }
  };

  return (
    <div className="mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="flex">
        <div className="w-full md:w-1/2 pr-2 mb-4">
          <label htmlFor="leaveType" className="block text-gray-700">Leave Type:</label>
          <select
            id="leaveType"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="form-select mt-1 block w-full rounded-md border-gray-300 text-gray-700 pl-1"
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
          <div className="w-full md:w-1/2 pl-2 mb-4">
            <label htmlFor="otherLeaveType" className="block text-gray-700">Other Leave Type:</label>
            <input
              type="text"
              id="otherLeaveType"
              name="otherLeaveType"
              value={formData.otherLeaveType}
              onChange={handleChange}
              className="form-input mt-1 block w-full rounded-md border-gray-300 text-gray-700 pl-1"
            />
          </div>
        )}
        <div className="w-full md:w-1/2 pr-2 mb-4">
          <label htmlFor="startDate" className="block text-gray-700">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="form-input mt-1 block w-full rounded-md border-gray-300 text-gray-700"
          />
          {formErrors.startDate && <p className="text-red-500 text-sm">{formErrors.startDate}</p>}
        </div>
        <div className="w-full md:w-1/2 pl-2 mb-4">
          <label htmlFor="endDate" className="block text-gray-700">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="form-input mt-1 block w-full rounded-md border-gray-300 text-gray-700"
          />
          {formErrors.endDate && <p className="text-red-500 text-sm">{formErrors.endDate}</p>}
        </div>
        <div className="w-full pl-1">
          <label htmlFor="comments" className="block text-gray-700">Additional Information:</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 text-gray-700 pl-1"
            rows={4}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 block w-full mt-4">Submit</button>
      </form>
    </div>
  );
};

export default TimeOffForm;
