import React from "react";

interface TextAreaProps {
  label?: string;
  rows?: number;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const TextAreaWithDescription: React.FC<TextAreaProps> = ({
  label,
  rows = 8,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="w-full max-w-2xl space-y-2">
      <div className="space-y-1">
        <label className="text-sm font-medium">{label}</label>
      </div>
      <textarea
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-2xl border-2 border-gray-400 px-4 py-2"
        onChange={(e) => onChange?.(e.target.value)}
        value={value}
      />
    </div>
  );
};
