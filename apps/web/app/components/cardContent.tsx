"use client";

import { useSelectedContent } from "@/context/selectedContent.context";
import { AnimatePresence } from "framer-motion";
import ProfileMotion from "./motion/profileMotion";
import { useEffect, useRef } from "react";
import LeaderboardMotion from "./motion/leaderboardMotion";
import AdminPanelMotion from "./motion/adminPanelMotion";
import { useUser } from "@/context/user.context";
import CreateCanvasMotion from "./motion/createCanvasMotion";

export default function CardContent() {
  const { user } = useUser();
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
      {selectedContent === "adminPanel" && user?.role === "ADMIN" && (
        <AdminPanelMotion cardRef={cardRef} />
      )}
      {selectedContent === "createCanvas" && user?.role === "ADMIN" && (
        <CreateCanvasMotion cardRef={cardRef} />
      )}
    </AnimatePresence>
  );
}
