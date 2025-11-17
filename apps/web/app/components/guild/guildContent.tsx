import { Users, Pencil, MoreVertical } from "lucide-react";
import { GuildContentProps, queryKeysType, User } from "@repo/types";
import { useState } from "react";
import { useUser } from "@/context/user.context";
import { useMutation } from "@tanstack/react-query";
import { kickGuildMember, transferLeadership, updateGuildDescription } from "api/guild.service";
import { toast } from "react-toastify";
import { displayError } from "@/utils/displayError";
import { getQueryClient } from "@/getQueryClient";
import DiscordTooltip from "../leaderboard/discordTooltip";
import { getRoleColor } from "@/utils/role";
import Image from "next/image";
import { getProfileImage } from "@/utils/images";
import { AnimatePresence } from "framer-motion";
import MotionComponent from "../motion/motion";
import { useToggle } from "@/hooks/useToggle";
import DescriptionComponent from "./descriptionComponent";

export default function GuildContent({
  guildTotalPixelsPlaced,
  members,
  guildLeaderId,
  guildId,
  descriptionData,
}: GuildContentProps) {
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState<string>(descriptionData || "No description");
  const queryClient = getQueryClient();
  const { user } = useUser();
  const descriptionToggle = useToggle();

  const handleToggle = (memberId: string) => {
    setActiveMemberId((prev) => (prev === memberId ? null : memberId));
  };

  const kickMutation = useMutation({
    mutationFn: kickGuildMember,
    onSuccess: (data) => {
      toast.success("You have kicked a member");

      queryClient.setQueryData(queryKeysType.guildByUserId(user?.id), data);
    },
    onError: (err) => {
      displayError(err);
    },
  });

  const descriptionMutate = useMutation({
    mutationFn: updateGuildDescription,
    onSuccess: (data) => {
      if (!data.description) {
        setDescription("No description");
      }
      toast.success("Description updated successfully");
      descriptionToggle.close();
    },
    onError: (err) => {
      displayError(err);
    },
  });

  const transferLeadershipMutation = useMutation({
    mutationFn: transferLeadership,
    onSuccess: (data) => {
      toast.success("Guild leadership transferred successfully.");

      queryClient.setQueryData(queryKeysType.guildByUserId(user?.id), data);
    },
    onError: (err) => {
      displayError(err);
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="w-full border-b border-gray-200">
        <div className="relative w-full flex items-center gap-2 text-gray-600 mb-4">
          {isEditingDescription ? (
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setIsEditingDescription(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditingDescription(false);
                }
              }}
              autoFocus
              className="text-md border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="w-full whitespace-normal break-words">
              <span className="text-md">{description}</span>
              <button
                onClick={descriptionToggle.toggle}
                className="hover:text-gray-800 cursor-pointer"
              >
                <Pencil className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>

        {/* Edit Guild Description */}
        <AnimatePresence>
          {descriptionToggle.isOpen && (
            <MotionComponent className="backdrop-blur-none shadow-none bg-transparent">
              <DescriptionComponent
                description={description}
                guildLeaderId={guildLeaderId}
                guildId={guildId}
                setDescription={setDescription}
                descriptionToggle={descriptionToggle}
                descriptionData={descriptionData}
                descriptionMutate={descriptionMutate}
              />
            </MotionComponent>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-md">
              Total pixels painted:{" "}
              <span className="text-gray-900 font-semibold">{guildTotalPixelsPlaced}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-5 h-5" />
            <span className="text-md">
              Members: <span className="text-blue-600 font-semibold">{members.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="space-y-3 mt-4">
        {members.map((member, index) => (
          <div
            key={member.id}
            className="relative p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <table className="w-full">
              {/* <thead>

              </thead> */}
              <tbody>
                <tr className="flex w-full items-center text-sm h-6">
                  <td className="flex items-center gap-2 w-full">
                    <span className="text-gray-500 font-medium w-6">#{index + 1}</span>
                    <div className="flex w-full items-center">
                      <div className="flex-shrink-0 overflow-hidden rounded-full mr-2">
                        <Image
                          className="w-8"
                          src={getProfileImage(member as User)}
                          width={1024}
                          height={1024}
                          alt="User image"
                        />
                      </div>
                      <div className="flex flex-wrap">
                        <span className="text-gray-900 font-medium mr-1">{member.name}</span>
                        <div
                          className={`relative flex items-center mr-6 text-[0.6rem] p-[0.1rem] rounded-sm font-bold ${getRoleColor(member.role)}`}
                        >
                          <span>{member.role.toUpperCase()}</span>
                        </div>
                        {!member.discord?.username ? null : (
                          <div>
                            <DiscordTooltip username={member.discord.username} />
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="flex items-center gap-2 relative">
                    <span className="text-gray-600 font-bold text-sm">
                      {member.totalPixelsPlaced.toLocaleString()}
                    </span>

                    {guildLeaderId === user?.id && (
                      <div tabIndex={0} onBlur={() => setActiveMemberId(null)} className="relative">
                        <MoreVertical
                          onClick={() => handleToggle(member.id)}
                          className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                        />

                        {activeMemberId === member.id && (
                          <div className="absolute right-0 top-6 w-40 bg-white border rounded-md shadow-md text-sm z-1">
                            <button
                              onMouseDown={() => {
                                kickMutation.mutate({
                                  memberId: member.id,
                                  guildId,
                                });
                              }}
                              className="block border cursor-pointer w-full px-3 py-2 hover:bg-gray-100 text-left"
                            >
                              Kick
                            </button>
                            <button
                              onMouseDown={() => {
                                transferLeadershipMutation.mutate({
                                  newLeaderId: member.id,
                                  guildId,
                                });
                              }}
                              className="block border cursor-pointer w-full px-3 py-2 text-nowrap hover:bg-gray-100 text-left"
                            >
                              Transfer leadership
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
