// src/components/Tile/Tile.tsx
import React from "react";

export interface TileProps {
  property1: "stat" | "Profiles";
  text?: string;
  text1: string;
}

export const Tile: React.FC<TileProps> = ({ property1, text, text1 }) => {
  if (property1 === "stat") {
    return (
      <div className="border border-gray-300 rounded p-4 text-center">
        {text && <div className="text-2xl font-bold">{text}</div>}
        <div className="text-base font-medium">{text1}</div>
      </div>
    );
  } else if (property1 === "Profiles") {
    return (
      <div className="border border-gray-300 rounded p-4 text-center">
        <div className="text-base font-medium">{text1}</div>
      </div>
    );
  }
  return null;
};
