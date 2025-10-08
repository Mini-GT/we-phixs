import React from "react";
import clsx from "clsx";

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "submit" | "button";
  disabled?: boolean;
}

export default function IconButton({
  children,
  onClick,
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
      disabled={disabled}
      className={clsx("w-10 h-10 rounded-full bg-white", baseStyles, className)}
    >
      {children}
    </button>
  );
}
