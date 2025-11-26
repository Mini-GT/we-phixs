import { PlayersProps, User } from "@repo/types";
import DiscordTooltip from "./discordTooltip";
import FetchLoading from "../loading/fetchLoading";
import Image from "next/image";
import { getProfileImage } from "@/utils/images";

export default function TableComponent({ users, isFetching, period }: PlayersProps) {
  if (isFetching || !users) {
    return <FetchLoading />;
  }

  return (
    <div>
      {/* Table */}
      <div className="overflow-auto scrollbar-custom">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-md text-slate-500">
              <th className="text-left py-2 px-2">#</th>
              <th className="text-left py-2 px-2">Painters</th>
              <th className="text-right py-2 px-2 text-nowrap">Pixels painted</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((row, i) => (
                <tr
                  key={row.id}
                  className="text-md sm:text-lg border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="py-2 px-2">{i + 1}</td>
                  <td className="flex h-14 sm:h-full items-center py-1 px-2">
                    <div className="flex-shrink-0 overflow-hidden rounded-full mr-2">
                      <Image
                        className="w-8"
                        src={getProfileImage(row as User)}
                        width={1024}
                        height={1024}
                        alt="User image"
                      />
                    </div>
                    <div className="flex flex-wrap items-center">
                      <span className="truncate mr-2">{row.name}</span>
                      {!row.discord?.username ? null : (
                        <div className="flex-shrink-0">
                          <DiscordTooltip username={row.discord.username} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right font-medium">
                    {row.totalPixelsPlaced.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-slate-400">
                  No pixels painted {period === "Today" ? "today" : `this ${period?.toLowerCase()}`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
