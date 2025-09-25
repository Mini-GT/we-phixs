import React from "react";
import clsx from "clsx";

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function IconButton({ children, onClick, className }: IconButtonProps) {
  const baseStyles = "flex items-center justify-center shadow-md hover:bg-gray-200 hover:scale-90 active:scale-100 transition cursor-pointer";

  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-10 h-10 rounded-full bg-white",
        baseStyles,
        className
      )}
    >
      {children}
    </button>
  );
}