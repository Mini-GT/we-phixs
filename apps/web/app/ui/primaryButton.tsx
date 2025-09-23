import React from "react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function PrimaryButton({ children, onClick, className }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full bg-blue-600 text-white font-medium shadow hover:bg-blue-700 hover:scale-95 active:scale-100 transition cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}