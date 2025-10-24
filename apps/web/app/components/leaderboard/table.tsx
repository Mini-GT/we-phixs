import { PlayersProps } from "@repo/types";
import DiscordTooltip from "./discordTooltip";
import FetchLoading from "../loading/fetchLoading";

export default function TableComponent({ users, isFetching }: PlayersProps) {
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
              <th className="text-right py-2 px-2">Pixels painted</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((row, i) => (
                <tr key={row.id} className="text-lg border-t border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-2">{i + 1}</td>
                  <td className="flex gap-1 items-center py-2 px-2">
                    <span className="mr-2">{row.name}</span>
                    {!row.discord?.username ? null : (
                      <div>
                        <DiscordTooltip username={row.discord.username} />
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-2 text-right font-medium">
                    {row.totalPixelsPlaced.toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
