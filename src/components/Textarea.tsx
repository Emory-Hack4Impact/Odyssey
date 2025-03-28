import React from 'react';

interface TextAreaProps {
  label?: string;
  rows?: number;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const TextAreaWithDescription: React.FC<TextAreaProps> = ({
  label,
  rows = 8,
  placeholder,
  onChange
}) => {
  return (
    <div className="w-full max-w-2xl space-y-2">
      <div className="space-y-1">
        <label className="text-sm font-medium">{label}</label>
      </div>
      <textarea
        placeholder={placeholder}
        rows={rows}
        className="resize-none w-full border-2 border-gray-400 rounded-2xl px-4 py-2"
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};