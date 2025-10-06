"use client";
import { UserRound, UsersRound } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const leaderboardData = [
  {
    rank: 1,
    flag: "🇯🇵",
    region: "Matsue #8",
    pixels: 423967,
  },
  {
    rank: 2,
    flag: "🇦🇷",
    region: "Buenos Aires #3",
    pixels: 392954,
  },
  {
    rank: 3,
    flag: "🇲🇽",
    region: "Monterrey #1",
    pixels: 369726,
  },
  {
    rank: 4,
    flag: "🇨🇱",
    region: "Santiago #7",
    pixels: 365148,
  },
  {
    rank: 5,
    flag: "🇵🇪",
    region: "Lima #1",
    pixels: 346136,
  },
  {
    rank: 6,
    flag: "🇵🇪",
    region: "Lima #2",
    pixels: 339846,
  },
  {
    rank: 7,
    flag: "🇧🇷",
    region: "Guarapari #30",
    pixels: 338443,
  },
  {
    rank: 8,
    flag: "🇯🇵",
    region: "Tokyo #1",
    pixels: 323493,
  },
  {
    rank: 9,
    flag: "🇦🇷",
    region: "Buenos Aires #4",
    pixels: 278367,
  },
  {
    rank: 10,
    flag: "🇲🇽",
    region: "Mexico City #1",
    pixels: 256415,
  },
];

export default function Leaderboard() {
  const [tab, setTab] = useState("Regions");
  const [period, setPeriod] = useState("Today");

  const tabs = ["Players", "Factions"];
  const periods = ["Today", "Week", "Month", "All time"];

  return (
    <div className="max-w-full h-[70vh] bg-white rounded-2xl">
      {/* Header */}

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-full p-1 space-x-2 mb-4">
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

      {/* Table */}
      <div className="overflow-auto scrollbar-custom">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-md text-slate-500">
              <th className="text-left py-2 px-2">#</th>
              <th className="text-left py-2 px-2">Region</th>
              <th className="text-right py-2 px-2">Pixels painted</th>
              {/* <th className="py-2 px-2"></th> */}
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((row) => (
              <tr key={row.rank} className="text-lg border-t border-slate-100 hover:bg-slate-50">
                <td className="py-2 px-2">{row.rank}</td>
                <td className="py-2 px-2">
                  <span className="mr-2">{row.flag}</span>
                  {row.region}
                </td>
                <td className="py-2 px-2 text-right font-medium">{row.pixels.toLocaleString()}</td>
                {/* <td className="py-2 px-2 text-right">
                  <button className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm">
                    Visit
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
