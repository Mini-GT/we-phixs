"use client";

import { Presentation, UsersRound } from "lucide-react";
import { useState } from "react";
import IconButton from "../ui/iconButton";
import { useSelectedContent } from "@/context/selectedContent.context";

export default function AdminPanel() {
  const { setSelectedContent } = useSelectedContent();
  const [tab, setTab] = useState("Users");

  const tabs = ["Users", "Canvas"];

  return (
    <div className="flex flex-col gap-auto max-w-full h-[70vh] bg-white rounded-2xl">
      {/* Header */}

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-full p-1 space-x-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex gap-1 items-center justify-center px-3 py-1.5 w-full rounded-full cursor-pointer text-md font-medium ${
              tab === t ? "bg-white text-slate-800" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "Users" ? <UsersRound /> : <Presentation />}
            {t}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center w-full h-full">
        {tab === "Canvas" && (
          <IconButton
            onClick={() => setSelectedContent("createCanvas")}
            className="w-md max-w-1/3 border-none hover:scale-95 text-white px-3 py-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500  cursor-pointer"
          >
            Create Canvas +
          </IconButton>
        )}
      </div>
    </div>
  );
}
