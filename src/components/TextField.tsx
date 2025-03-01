// src/components/TextField/TextField.tsx
import React from "react";

export interface TextFieldProps {
  property1: "dropdown"; // extend this if you add more variants
  text: string; // label text
  text1: string; // default value for the dropdown
}

export const TextField: React.FC<TextFieldProps> = ({ property1, text, text1 }) => {
  if (property1 === "dropdown") {
    return (
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">{text}</label>
        <select
          defaultValue={text1}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
        >
          <option value={text1}>{text1}</option>
          {/* Add more <option> elements as needed */}
        </select>
      </div>
    );
  }
  return null;
};
