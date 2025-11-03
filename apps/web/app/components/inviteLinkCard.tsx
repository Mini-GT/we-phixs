import { useEffect, useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { toast } from "react-toastify";
import { GetInviteCode, InviteLinkCardProps, queryKeysType } from "@repo/types";
import IconButton from "./ui/iconButton";
import { useQuery } from "@tanstack/react-query";
import { getGuildInviteCode } from "api/guild.service";
import FetchLoading from "./loading/fetchLoading";

const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;

export default function InviteLinkCard({ guildId, guildInvitationToggle }: InviteLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: queryKeysType.getGuildInviteCode(guildId),
    queryFn: () => getGuildInviteCode({ guildId }),

    // disable auto refetch
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!data) return;
    setInviteUrl(`${clientUrl}/guild/join?code=${data.inviteCode}`);
  }, [data]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (err) {
      toast.error("Something went wrong. Failed to copy");
    }
  };

  return (
    <div className="border bg-neutral-50 rounded-lg shadow-lg p-6 w-full max-w-md relative">
      {/* Close button */}
      <IconButton
        onClick={() => guildInvitationToggle()}
        className="absolute top-4 right-4 shadow-none border-none bg-transparent"
      >
        <X size={20} />
      </IconButton>

      {/* Title */}
      <h2 className="text-gray-900 text-xl font-semibold mb-2">Invite link</h2>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-6">
        Send the link below to everybody you want to invite to the guild
      </p>

      {/* Link input with copy button */}
      <div className="flex items-center justify-center w-full h-10">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <FetchLoading />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full gap-2">
            <input
              type="text"
              value={inviteUrl}
              readOnly
              className="flex-1 bg-gray-50 text-gray-800 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400"
            />
            <button
              onClick={handleCopy}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2 min-w-[100px] justify-center cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={18} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
