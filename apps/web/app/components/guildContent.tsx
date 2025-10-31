import { Users, Pencil } from "lucide-react";
import { GuildContentProps } from "@repo/types";

export default function GuildContent({ guildTotalPixelsPlaced, members }: GuildContentProps) {
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
            {/* <Pencil className="w-4 h-4" /> */}
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
      <div>
        {/* Members List */}
        <div className="space-y-3 mt-4">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-medium w-6">#{index + 1}</span>
                {/* <div
              className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-white font-semibold text-sm`}
            >
              {member.name[0]}
            </div> */}
                <span className="text-gray-900 font-medium">{member.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">
                  {member.totalPixelsPlaced.toLocaleString()}
                </span>
                <Pencil className="w-3 h-3 text-gray-400 hover:text-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
