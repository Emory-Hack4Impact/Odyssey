// src/components/NavButton/NavButton.tsx
import React from "react";

export interface NavButtonProps {
  property1: "main" | "sub" | "sub-selected";
  text: string;
}

export const NavButton: React.FC<NavButtonProps> = ({ property1, text }) => {
  let classes = "cursor-pointer focus:outline-none ";

  switch (property1) {
    case "main":
      classes += "text-base font-medium text-black hover:text-blue-500";
      break;
    case "sub":
      classes += "text-[22px] font-medium text-black hover:text-blue-500";
      break;
    case "sub-selected":
      classes += "text-[22px] font-medium text-white bg-black px-5 py-4 rounded";
      break;
    default:
      break;
  }

  return <button className={classes}>{text}</button>;
};
