import React, { useState } from 'react';

interface FormData {
  leaveType: string;
  startDate: string;
  endDate: string;
  comments: string;
}

const TimeOffForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    leaveType: '',
    startDate: '',
    endDate: '',
    comments: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to backend
    console.log(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 pl-1">
          <label htmlFor="leaveType" className="block text-gray-700">Type of Leave:</label>
          <input
            type="text"
            id="leaveType"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="form-input mt-1 block w-full rounded-md border-gray-300 text-gray-700 pl-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-gray-700">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="form-input mt-1 block w-full rounded-md border-gray-300 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-gray-700">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="form-input mt-1 block w-full rounded-md border-gray-300 text-gray-700"
          />
        </div>
        <div className="mb-4 pl-1">
          <label htmlFor="comments" className="block text-gray-700">Comments:</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 text-gray-700 pl-1"
            rows={4}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit</button>
      </form>
    </div>
  );
};

export default TimeOffForm;
