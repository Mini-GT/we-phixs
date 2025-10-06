import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { UserRound, X } from "lucide-react";
import IconButton from "../ui/iconButton";
import { useSelectedContent } from "@/context/selectedContent.context";
import { type RefObject } from "react";
import Leaderboard from "../leaderboard/leaderboard";
import Image from "next/image";

export default function LeaderboardMotion({
  cardRef,
}: {
  cardRef: RefObject<HTMLDivElement | null>;
}) {
  const { setSelectedContent } = useSelectedContent();

  return (
    <motion.div
      className="absolute z-50 flex -inset-2 items-center justify-center backdrop-blur-xs shadow-lg bg-black/5"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        ref={cardRef}
        className={`relative w-[600px] max-w-2xl overflow-y-auto scrollbar-custom p-6 bg-white border-cyan-300 rounded-4xl`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="gap-1 text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
              <Image width={24} height={24} src="/leaderboard.svg" alt="Leaderboard" />
              <h2 className="font-semibold text-slate-800">Leaderboard</h2>
            </div>
          </div>
          <IconButton
            className="top-2 right-2 shadow-none border-none text-gray-600 hover:text-gray-900"
            aria-label="Close form"
            onClick={() => setSelectedContent(null)}
          >
            <X size={20} />
          </IconButton>
        </div>

        <Leaderboard />
      </Card>
    </motion.div>
  );
}
