import React from "react";

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function IconButton({ children, onClick }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-200 hover:scale-90 active:scale-100 transition cursor-pointer"
    >
      {children}
    </button>
  );
}