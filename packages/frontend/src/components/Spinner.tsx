import React from "react";

export const Spinner: React.FC<IProps> = ({
  size = 12,
  color = "gray",
  className,
}) => {
  return (
    <div
      className={`border-4 border-${color}-300 rounded-full h-${size} w-${size} animate-spin ${className}`}
    ></div>
  );
};

interface IProps {
  size?: number;
  color?: string;
  className?: string;
}
