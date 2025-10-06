"use client";

import { useSelectedContent } from "@/context/selectedContent.context";
import { AnimatePresence } from "framer-motion";
import ProfileMotion from "./motion/profileMotion";
import { useEffect, useRef } from "react";
import LeaderboardMotion from "./motion/leaderboardMotion";

export default function CardContent() {
  const { selectedContent, setSelectedContent } = useSelectedContent();
  const cardRef = useRef<HTMLDivElement>(null);

  // close card if user clicks outside the card content
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setSelectedContent(null);
      }
    }

    if (selectedContent) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedContent]);

  return (
    <AnimatePresence>
      {selectedContent === "profileForm" && <ProfileMotion cardRef={cardRef} />}
      {selectedContent === "leaderboard" && <LeaderboardMotion cardRef={cardRef} />}
    </AnimatePresence>
  );
}
