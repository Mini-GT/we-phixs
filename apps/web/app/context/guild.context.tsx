"use client";

import { ChildrenProps, GuildDataType } from "@repo/types";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type GuildDataContextType = {
  guildData: GuildDataType | null;
  setGuildData: Dispatch<SetStateAction<GuildDataType | null>>;
};

export const GuildDataContext = createContext<GuildDataContextType | undefined>(undefined);

export function GuildDataProvider({ children }: ChildrenProps) {
  const [guildData, setGuildData] = useState<GuildDataType | null>(null);

  return <GuildDataContext value={{ guildData, setGuildData }}>{children}</GuildDataContext>;
}

export function useGuildData() {
  const context = useContext(GuildDataContext);

  if (context === undefined) {
    throw new Error("useGuildData must be used within GuildDataProvider");
  }

  return context;
}
