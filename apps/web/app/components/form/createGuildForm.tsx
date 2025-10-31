import { useSelectedContent } from "@/context/selectedContent.context";
import { useUser } from "@/context/user.context";
import { CreateGuildType, GuildDataType } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { createGuild } from "api/guild.service";
import { useState } from "react";
import { toast } from "react-toastify";
import DotsLoader from "../loading/dotsLoading";
import { displayError } from "@/utils/displayError";
import { useGuildData } from "@/context/guild.context";

export default function CreateGuildForm() {
  const [guildName, setGuildName] = useState("");
  const { user } = useUser();
  const { setGuildData } = useGuildData();
  const { setSelectedContent } = useSelectedContent();

  const mutation = useMutation({
    mutationFn: async (guildPayload: CreateGuildType) => {
      const res = createGuild(guildPayload);
      return res;
    },
    onSuccess: (data: GuildDataType) => {
      console.log(data);
      toast.success("Guild created successfully");
      setGuildName("");
      setGuildData(data);
      setSelectedContent("guild");
    },
    onError: (err) => {
      displayError(err);
    },
  });

  const handleCreate = () => {
    if (!user) {
      toast.error("Couldn't find user");
      return;
    }
    mutation.mutate({ guildName, userId: user.id });
  };

  return (
    <div className="bg-white w-full max-w-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-6">Create guild</h3>

      {/* Input Field */}
      <div className="mb-6">
        {/* <label className="block mt-2 ml-4 text-sm text-gray-500">Name</label> */}
        <div className="relative">
          <input
            type="text"
            value={guildName}
            onChange={(e) => setGuildName(e.target.value)}
            placeholder="Guild Name"
            maxLength={16}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            {guildName.length}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setSelectedContent("guild")}
          className="py-2 w-23 h-10 text-center bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          className="py-2 w-23 h-10 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <DotsLoader /> : "Create"}
        </button>
      </div>
    </div>
  );
}
