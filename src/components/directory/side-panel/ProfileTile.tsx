"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { DirectoryEmployee } from "../types";
import { getEmployeeName } from "../types";

type ProfileTileProps = {
  currentUserId: string;
  selectedEmployee: DirectoryEmployee | null;
  onSaveEmployee: (employee: DirectoryEmployee) => void;
};

export default function ProfileTile({
  currentUserId,
  selectedEmployee,
  onSaveEmployee,
}: ProfileTileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<DirectoryEmployee | null>(selectedEmployee);

  useEffect(() => {
    setIsEditing(false);
    setDraft(selectedEmployee);
  }, [selectedEmployee]);

  const isCurrentUser = selectedEmployee?.id === currentUserId;

  const initials = useMemo(() => {
    if (!selectedEmployee) return "?";
    const first = selectedEmployee.firstName.charAt(0).toUpperCase();
    const last = selectedEmployee.lastName.charAt(0).toUpperCase();
    return `${first}${last}`.trim() || "?";
  }, [selectedEmployee]);

  if (!selectedEmployee || !draft) {
    return (
      <div className="card border border-base-content/5 bg-base-100 shadow-xl min-[1088px]:w-96">
        <div className="card-body p-6">
          <p className="text-sm text-base-content/60">
            Select an employee to view profile details.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    onSaveEmployee(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(selectedEmployee);
    setIsEditing(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      setDraft((prev) => {
        if (!prev) return prev;
        return { ...prev, avatarUrl: result };
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="card border border-base-content/5 bg-base-100 shadow-xl min-[1088px]:w-96">
      <div className="card-body gap-6 p-6">
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold tracking-wide text-base-content/60 uppercase">
            Profile Panel
          </p>

          {isCurrentUser ? (
            <div className="flex gap-2">
              {!isEditing ? (
                <button className="btn btn-sm btn-neutral" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              ) : (
                <>
                  <button className="btn btn-sm" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="btn btn-sm btn-neutral" onClick={handleSave}>
                    Save
                  </button>
                </>
              )}
            </div>
          ) : (
            <span className="text-xs font-medium text-base-content/50">Viewing only</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-base-200">
            {draft.avatarUrl ? (
              <Image
                src={draft.avatarUrl}
                alt={`${getEmployeeName(draft)} avatar`}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-base-content/60">
                {initials}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-base-content">{getEmployeeName(draft)}</h3>
            <p className="text-sm text-base-content/70">{draft.position}</p>
            <p className="mt-1 text-xs text-base-content/50">{draft.department}</p>
          </div>
        </div>

        {isEditing && isCurrentUser ? (
          <label className="form-control">
            <span className="mb-1 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
              Profile Picture
            </span>
            <input
              type="file"
              accept="image/*"
              className="file-input-bordered file-input w-full"
              onChange={handleAvatarUpload}
            />
          </label>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="form-control">
            <span className="mb-1 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
              First Name
            </span>
            <input
              value={draft.firstName}
              disabled={!isEditing || !isCurrentUser}
              onChange={(event) => setDraft({ ...draft, firstName: event.target.value })}
              className="input-bordered input w-full"
            />
          </label>

          <label className="form-control">
            <span className="mb-1 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
              Last Name
            </span>
            <input
              value={draft.lastName}
              disabled={!isEditing || !isCurrentUser}
              onChange={(event) => setDraft({ ...draft, lastName: event.target.value })}
              className="input-bordered input w-full"
            />
          </label>

          <label className="form-control sm:col-span-2">
            <span className="mb-1 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
              Position
            </span>
            <input
              value={draft.position}
              disabled={!isEditing || !isCurrentUser}
              onChange={(event) => setDraft({ ...draft, position: event.target.value })}
              className="input-bordered input w-full"
            />
          </label>

          <label className="form-control">
            <span className="mb-1 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
              Department
            </span>
            <input
              value={draft.department}
              disabled={!isEditing || !isCurrentUser}
              onChange={(event) => setDraft({ ...draft, department: event.target.value })}
              className="input-bordered input w-full"
            />
          </label>

          <label className="form-control">
            <span className="mb-1 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
              Location
            </span>
            <input
              value={draft.location}
              disabled={!isEditing || !isCurrentUser}
              onChange={(event) => setDraft({ ...draft, location: event.target.value })}
              className="input-bordered input w-full"
            />
          </label>

          <label className="form-control sm:col-span-2">
            <span className="mb-1 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
              Bio
            </span>
            <textarea
              value={draft.bio}
              disabled={!isEditing || !isCurrentUser}
              onChange={(event) => setDraft({ ...draft, bio: event.target.value })}
              className="textarea-bordered textarea min-h-24 w-full"
            />
          </label>
        </div>

        <div className="divider my-0" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="form-control">
            <span className="mb-1 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
              Work Number
            </span>
            <input
              value={draft.workNumber}
              disabled={!isEditing || !isCurrentUser}
              onChange={(event) => setDraft({ ...draft, workNumber: event.target.value })}
              className="input-bordered input w-full"
            />
          </label>

          <label className="form-control">
            <span className="mb-1 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
              Mobile
            </span>
            <input
              value={draft.mobile}
              disabled={!isEditing || !isCurrentUser}
              onChange={(event) => setDraft({ ...draft, mobile: event.target.value })}
              className="input-bordered input w-full"
            />
          </label>

          <label className="form-control">
            <span className="mb-1 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
              Birthday
            </span>
            <input
              type="date"
              value={draft.birthday}
              disabled={!isEditing || !isCurrentUser}
              onChange={(event) => setDraft({ ...draft, birthday: event.target.value })}
              className="input-bordered input w-full"
            />
          </label>
        </div>

        <div className="divider my-0" />

        <div className="rounded-box border border-base-content/10 bg-base-200/40 p-3">
          <p className="mb-2 text-xs font-semibold tracking-wide text-base-content/60 uppercase">
            Non-Mutable Fields
          </p>
          <p className="text-sm text-base-content/80">
            <span className="font-medium">Employee ID:</span> {draft.id}
          </p>
          <p className="text-sm text-base-content/80">
            <span className="font-medium">Email:</span> {draft.email}
          </p>
        </div>
      </div>
    </div>
  );
}
