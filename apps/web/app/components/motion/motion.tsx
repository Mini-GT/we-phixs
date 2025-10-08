import { ChildrenProps } from "@repo/types";
import { motion } from "framer-motion";

export default function MotionComponent({ children }: ChildrenProps) {
  return (
    <motion.div
      className="absolute z-50 flex -inset-2 items-center justify-center backdrop-blur-xs shadow-lg bg-black/5"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
