import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  onBlur?: () => void;
  onMouseDown?: () => void;
  className?: string;
  type?: "submit" | "button";
  disabled?: boolean;
}

export default function IconButton({
  children,
  onClick,
  onBlur,
  onMouseDown,
  className,
  disabled = false,
  type = "button",
}: IconButtonProps) {
  const baseStyles =
    "flex items-center justify-center shadow-md border-3 border-gray-200 hover:bg-gray-200 hover:scale-90 active:scale-100 transition cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      onBlur={onBlur}
      onMouseDown={onMouseDown}
      disabled={disabled}
      className={twMerge(
        clsx("w-10 h-10 rounded-full bg-white", baseStyles, className)
      )}
    >
      {children}
    </button>
  );
}
