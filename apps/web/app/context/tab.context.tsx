"use client";

import { ChildrenProps, TabValue } from "@repo/types";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type TabContextType = {
  tab: TabValue;
  setTab: Dispatch<SetStateAction<TabValue>>;
};

export const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: ChildrenProps) {
  const [tab, setTab] = useState<TabValue>("Users");

  return <TabContext value={{ tab, setTab }}>{children}</TabContext>;
}

export function useTab() {
  const context = useContext(TabContext);

  if (context === undefined) {
    throw new Error("useTab must be used within TabProvider");
  }

  return context;
}
