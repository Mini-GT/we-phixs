import { Users, Pencil, MoreVertical } from "lucide-react";
import { GuildContentProps, queryKeysType } from "@repo/types";
import { useState } from "react";
import { useUser } from "@/context/user.context";
import { useMutation } from "@tanstack/react-query";
import { kickGuildMember } from "api/guild.service";
import { toast } from "react-toastify";
import { displayError } from "@/utils/displayError";
import { getQueryClient } from "@/getQueryClient";

export default function GuildContent({
  guildTotalPixelsPlaced,
  members,
  guildLeaderId,
  guildId,
}: GuildContentProps) {
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const queryClient = getQueryClient();
  const { user } = useUser();

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

  return (
    <div className="h-[600px]">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <span className="text-md">No description</span>
          <button className="hover:text-gray-800">
            <Pencil className="w-3 h-3" />
          </button>
        </div>

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
            className="relative flex items-center justify-between p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-500 font-medium w-6">#{index + 1}</span>
              <span className="text-gray-900 font-medium">{member.name}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">{member.role}</span>
            </div>

            <div className="flex items-center gap-2 relative">
              <span className="text-gray-600 text-sm">
                {member.totalPixelsPlaced.toLocaleString()}
              </span>

              {guildLeaderId === user?.id && (
                <MoreVertical
                  onClick={() => handleToggle(member.id)}
                  className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                />
              )}

              {activeMemberId === member.id && (
                <div className="absolute right-0 top-6 w-40 bg-white border rounded-md shadow-md text-sm z-1">
                  <button
                    onClick={() =>
                      kickMutation.mutate({
                        leaderId: guildLeaderId,
                        memberId: member.id,
                        guildId,
                      })
                    }
                    className="block border cursor-pointer w-full px-3 py-2 hover:bg-gray-100 text-left"
                  >
                    Kick
                  </button>
                  <button className="block border cursor-pointer w-full px-3 py-2 text-nowrap hover:bg-gray-100 text-left">
                    Transfer leadership
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
