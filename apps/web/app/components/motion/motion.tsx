import { ChildrenProps } from "@repo/types";
import { motion } from "framer-motion";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function MotionComponent({ children, className }: ChildrenProps) {
  return (
    <motion.div
      className={twMerge(
        clsx(
          "absolute z-50 flex inset-0 items-center justify-center backdrop-blur-xs shadow-lg bg-black/5",
          className
        )
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
