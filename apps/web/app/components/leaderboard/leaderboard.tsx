"use client";
import { LeaderboardPeriods, queryKeysType } from "@repo/types";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getAllLeaderboard } from "api/leaderboard.service";
import { UserRound, UsersRound } from "lucide-react";
import { useState } from "react";
import TableComponent from "./table";

const periods: Periods[] = ["Today", "Week", "Month", "All time"];
const tabs = ["Players"] as const;
type Periods = "Today" | "Week" | "Month" | "All time";

export default function Leaderboard() {
  const [tab, setTab] = useState<"Players" | "Factions">("Players");
  const [period, setPeriod] = useState<Periods>("Today");

  const { data: leaderboardData, isFetching } = useQuery<LeaderboardPeriods>({
    queryKey: queryKeysType.allLeaderboard,
    queryFn: () => getAllLeaderboard(),
  });

  return (
    <div className="w-full bg-white rounded-2xl">
      {/* Tabs */}
      {/* <div className="flex justify-center w-full">
        <div className="flex items-center w-full max-w-1/2 bg-gray-100 rounded-full p-1 space-x-2 mb-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center justify-center px-3 py-1.5 w-full rounded-full cursor-pointer text-md font-medium ${
                tab === t ? "bg-white text-slate-800" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t === "Players" ? <UserRound /> : <UsersRound />}
              {t}
            </button>
          ))}
        </div>
      </div> */}

      {/* Periods */}
      <div className="flex space-x-4 border-b border-slate-200 mb-2">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`pb-1.5 text-md font-medium cursor-pointer border-b-2 transition-colors ${
              period === p
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="relative h-[70vh]">
        {period.toLowerCase() === "today" && (
          <TableComponent users={leaderboardData?.daily} isFetching={isFetching} />
        )}
        {period.toLowerCase() === "week" && (
          <TableComponent users={leaderboardData?.weekly} isFetching={isFetching} />
        )}
        {period.toLowerCase() === "month" && (
          <TableComponent users={leaderboardData?.monthly} isFetching={isFetching} />
        )}
        {period.toLowerCase() === "all time" && (
          <TableComponent users={leaderboardData?.allTime} isFetching={isFetching} />
        )}
      </div>
    </div>
  );
}
