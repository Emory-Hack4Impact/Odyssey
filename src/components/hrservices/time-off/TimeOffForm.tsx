import { SubmitTimeOff, type SubmitTimeOffRequest } from "@/app/api/time-off-req";
import { type Dispatch, type SetStateAction, useState } from "react";

export interface FormData {
  leaveType: string;
  otherLeaveType: string;
  startDate: Date;
  endDate: Date;
  comments: string;
  approved: boolean;
}

export type TimeOffRequest = FormData & {
  id: number;
  employeeId: string;
  startDate: Date;
  endDate: Date;
};

type FormError = Partial<
  Omit<FormData, "startDate" | "endDate"> & { startDate: string; endDate: string }
>;

const validDate = (
  startDate: string,
  endDate: string,
  daysAvailable: number,
): { field: "startDate" | "endDate"; message: string } | null => {
  const today = new Date();
  const endOfYear = new Date(today.getFullYear(), 11, 31);

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start < today) return { field: "startDate", message: "Start date must be in the future." };
  if (end < start) return { field: "endDate", message: "End date cannot be before start date." };
  if (end > endOfYear) return { field: "endDate", message: "End date must be before December 31." };

  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  if (diffDays > daysAvailable)
    return { field: "endDate", message: `You only have ${daysAvailable} day(s) remaining.` };

  return null;
};

const TimeOffForm = ({
  setRequests,
  requests,
  userId,
}: {
  setRequests: Dispatch<SetStateAction<TimeOffRequest[]>>;
  requests: TimeOffRequest[];
  userId: string;
}) => {
  const [formData, setFormData] = useState<SubmitTimeOffRequest>({
    id: userId,
    leaveType: "",
    otherLeaveType: "",
    startDate: "",
    endDate: "",
    comments: "",
    approved: false,
  });

  const [showOtherLeaveTypeField, setShowOtherLeaveTypeField] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormError>({});

  const [characterCount, setCharacterCount] = useState(0);
  const maxChars = 150;

  const daysAvailable = () => {
    const approved = requests.filter((requests) => requests.approved);

    const totalDays = approved.reduce((total, request) => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);

      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      return total + days;
    }, 0);

    return 20 - totalDays;
  };

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
      setCharacterCount(value.length);
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: FormError = {};

    if (!formData.leaveType) {
      errors.leaveType = "*required";
    }

    if (!formData.startDate) {
      errors.startDate = "*required";
    }

    if (!formData.endDate) {
      errors.endDate = "*required";
    }

    const dateError = validDate(formData.startDate, formData.endDate, daysAvailable());
    if (dateError) {
      errors[dateError.field] = dateError.message;
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const newRequest = await SubmitTimeOff(formData);
        setRequests((prev) => [newRequest, ...prev]);
        setFormData({
          id: formData.id,
          leaveType: "",
          otherLeaveType: "",
          startDate: "",
          endDate: "",
          comments: "",
          approved: false,
        });
        setCharacterCount(0);
      } catch (e) {
        console.error("Error submitting time off request:", e);
      }
    }
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-2xl">
      <div className="card rounded-box border border-base-content/5 bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="mb-4 card-title text-2xl">Request Time Off</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg">Leave Type</span>
              </label>
              <select
                id="leaveType"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="select-bordered select w-full"
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
              {formErrors.leaveType && (
                <p className="mt-1 text-sm text-error">{formErrors.leaveType}</p>
              )}
            </div>

            {showOtherLeaveTypeField && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg">Other Leave Type</span>
                </label>
                <input
                  type="text"
                  id="otherLeaveType"
                  name="otherLeaveType"
                  value={formData.otherLeaveType}
                  onChange={handleChange}
                  className="input-bordered input w-full"
                />
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg">Start Date</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input-bordered input w-full"
              />
              {formErrors.startDate && (
                <p className="mt-1 text-sm text-error">{formErrors.startDate}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg">End Date</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="input-bordered input w-full"
              />
              {formErrors.endDate && (
                <p className="mt-1 text-sm text-error">{formErrors.endDate}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg">Additional Information</span>
              </label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                maxLength={150}
                rows={4}
                className="textarea-bordered textarea w-full"
              />
              <label className="label justify-end">
                <span className="label-text-alt text-gray-500">
                  Characters remaining: {maxChars - characterCount}
                </span>
              </label>
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn text-lg btn-primary">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TimeOffForm;
