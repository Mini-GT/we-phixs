import { Card } from "../ui/card";
import IconButton from "../ui/iconButton";
import { useSelectedContent } from "@/context/selectedContent.context";
import { type RefObject } from "react";
import MotionComponent from "./motion";
import Image from "next/image";
import { MoreVertical, UserPlus, X } from "lucide-react";
import Guild from "../guild";
import GuildContent from "../guildContent";
import { useGuildData } from "@/context/guild.context";
import { useQuery } from "@tanstack/react-query";
import { queryKeysType } from "@repo/types";
import { getGuildByUserId } from "api/guild.service";
import { useUser } from "@/context/user.context";

export default function GuildMotion({ cardRef }: { cardRef: RefObject<HTMLDivElement | null> }) {
  const { user } = useUser();
  const { setSelectedContent } = useSelectedContent();
  // const { guildData, setGuildData } = useGuildData();

  const { data: guildData } = useQuery({
    queryKey: queryKeysType.guildByUserId(user?.id),
    queryFn: () => getGuildByUserId({ userId: user?.id }),
    enabled: !!user?.id,
  });

  return (
    <MotionComponent>
      <Card
        ref={cardRef}
        className={`relative w-[600px] max-w-2xl gap-4 overflow-y-auto scrollbar-custom p-6 bg-white border-cyan-300 rounded-4xl`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="gap-1 text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
              <Image src="/guild.svg" width={24} height={24} className="w-8" alt="Guild" />
              <h2 className="font-semibold text-slate-800">
                {guildData ? guildData.name.toUpperCase() : "Guild"}
              </h2>
            </div>
          </div>
          <div className="flex items-center">
            {guildData ? (
              <div className="flex">
                <IconButton className="top-2 right-2 shadow-none border-none text-gray-600 hover:text-gray-900">
                  <MoreVertical className="w-5 h-5" />
                </IconButton>
                <IconButton className="top-2 right-2 shadow-none border-none text-gray-600 hover:text-gray-900">
                  <UserPlus className="w-5 h-5" />
                </IconButton>
              </div>
            ) : null}

            <IconButton
              className="top-2 right-2 shadow-none border-none text-gray-600 hover:text-gray-900"
              aria-label="Close form"
              onClick={() => setSelectedContent(null)}
            >
              <X size={20} />
            </IconButton>
          </div>
        </div>

        {!guildData ? (
          <Guild />
        ) : (
          <GuildContent
            guildTotalPixelsPlaced={guildData.totalPixelsPlaced}
            members={guildData.members}
          />
        )}
        {/* <Guild /> */}
        {/* <GuildContent /> */}
      </Card>
    </MotionComponent>
  );
}
