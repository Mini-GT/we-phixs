import { Card } from "../ui/card";
import IconButton from "../ui/iconButton";
import { useSelectedContent } from "@/context/selectedContent.context";
import { type RefObject } from "react";
import MotionComponent from "./motion";
import Image from "next/image";
import { MoreVertical, UserPlus, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GuildDataType, queryKeysType } from "@repo/types";
import { getGuildByUserId, getGuildInviteCode, leaveGuild } from "api/guild.service";
import { useUser } from "@/context/user.context";
import { useToggle } from "@/hooks/useToggle";
import InviteLinkCard from "../inviteLinkCard";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { getQueryClient } from "@/getQueryClient";
import { displayError } from "@/utils/displayError";
import Guild from "../guild/guild";
import GuildContent from "../guild/guildContent";

export default function GuildMotion({ cardRef }: { cardRef: RefObject<HTMLDivElement | null> }) {
  const { user } = useUser();
  const { setSelectedContent } = useSelectedContent();
  const guildInvitationToggle = useToggle();
  const dotMenu = useToggle();
  const queryClient = getQueryClient();
  // const { guildData, setGuildData } = useGuildData();

  const {
    data: guildData,
    isError,
    error,
  } = useQuery<GuildDataType>({
    queryKey: queryKeysType.guildByUserId(user?.id),
    queryFn: () => getGuildByUserId(),
    enabled: !!user?.id,
  });

  const {
    refetch,
    isError: isInviteError,
    error: inviteError,
  } = useQuery({
    queryKey: queryKeysType.getGuildInviteCode(guildData?.id),
    queryFn: () => getGuildInviteCode({ guildId: guildData?.id }),

    // disable auto refetch
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  if (isError || isInviteError) {
    if (error) displayError(error);
    if (inviteError) displayError(inviteError);
  }

  const mutation = useMutation({
    mutationFn: leaveGuild,
    onSuccess: (data) => {
      toast.success(data);

      // queryClient.invalidateQueries({ queryKey: queryKeysType.guildByUserId(user?.id) });
      queryClient.setQueryData(queryKeysType.guildByUserId(user?.id), null);
    },
    onError: (err) => {
      displayError(err);
    },
  });

  return (
    <MotionComponent>
      <Card
        ref={cardRef}
        className={`relative w-[95vw] max-w-[600px] h-[90vh]  gap-4 scrollbar-custom p-3 bg-white border-cyan-300 rounded-4xl`}
      >
        {/* Invitation Card */}
        <AnimatePresence>
          {guildInvitationToggle.isOpen && (
            <MotionComponent className="backdrop-blur-none shadow-none bg-transparent">
              <div className="absolute flex items-center justify-center h-full w-full">
                <InviteLinkCard
                  guildId={guildData?.id}
                  guildInvitationToggle={guildInvitationToggle.close}
                />
              </div>
            </MotionComponent>
          )}
        </AnimatePresence>

        {/* Guild Card */}
        <div className="h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
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
                <div className="relative flex">
                  <IconButton
                    onClick={dotMenu.toggle}
                    onBlur={dotMenu.close}
                    className="top-2 right-2 shadow-none border-none text-gray-600 hover:text-gray-900"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </IconButton>
                  {guildData.guildLeaderId === user?.id && ( // disable invite btn as only guild leader can generate an invite link
                    <IconButton
                      onClick={() => {
                        guildInvitationToggle.toggle();
                        refetch();
                      }}
                      className="top-2 right-2 shadow-none border-none text-gray-600 hover:text-gray-900"
                    >
                      <UserPlus className="w-5 h-5" />
                    </IconButton>
                  )}
                  {dotMenu.isOpen && (
                    <div className="absolute top-[90%] z-1 right-[60%] bg-white border border-gray-200 rounded-md shadow-md text-gray-700 text-sm text-nowrap cursor-pointer">
                      <button
                        className="w-full text-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                        onMouseDown={() =>
                          mutation.mutate({ userId: user?.id, guildId: guildData.id })
                        }
                      >
                        Leave guild
                      </button>
                    </div>
                  )}
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
              guildLeaderId={guildData.guildLeaderId}
              guildId={guildData.id}
              descriptionData={guildData.description}
            />
          )}
        </div>
      </Card>
    </MotionComponent>
  );
}
