"use client";

import { useSelectedContent } from "@/context/selectedContent.context";
import { AnimatePresence } from "framer-motion";
import ProfileMotion from "./motion/profileMotion";

export default function CardContent() {
  const { selectedContent, setSelectedContent } = useSelectedContent();

  return (
    <AnimatePresence>{selectedContent === "profileForm" && <ProfileMotion />}</AnimatePresence>
  );
}
