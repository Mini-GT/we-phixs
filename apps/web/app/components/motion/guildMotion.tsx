import { Card } from "../ui/card";
import IconButton from "../ui/iconButton";
import { useSelectedContent } from "@/context/selectedContent.context";
import { type RefObject } from "react";
import MotionComponent from "./motion";
import Image from "next/image";
import { X } from "lucide-react";
import Guild from "../guild";

export default function GuildMotion({ cardRef }: { cardRef: RefObject<HTMLDivElement | null> }) {
  const { setSelectedContent } = useSelectedContent();

  return (
    <MotionComponent>
      <Card
        ref={cardRef}
        className={`relative w-[600px] max-w-2xl overflow-y-auto scrollbar-custom p-6 bg-white border-cyan-300 rounded-4xl`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="gap-1 text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
              <Image src="/guild.svg" width={24} height={24} className="w-8" alt="Guild" />
              <h2 className="font-semibold text-slate-800">Guild</h2>
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

        <Guild />
      </Card>
    </MotionComponent>
  );
}
