"use client";

import { ContextProviderProps } from "@/types/context";
import { SelectedContentValue } from "@repo/types";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type SelectedContentContextType = {
  selectedContent: SelectedContentValue;
  setSelectedContent: Dispatch<SetStateAction<SelectedContentValue>>;
};

export const SelectedContentContext = createContext<SelectedContentContextType | undefined>(
  undefined
);

export function SelectedContentProvider({ children }: ContextProviderProps) {
  const [selectedContent, setSelectedContent] = useState<SelectedContentValue>(null);

  return (
    <SelectedContentContext value={{ selectedContent, setSelectedContent }}>
      {children}
    </SelectedContentContext>
  );
}

export function useSelectedContent() {
  const context = useContext(SelectedContentContext);

  if (context === undefined) {
    throw new Error("useSelectedContent must be used within SelectedContentProvider");
  }

  return context;
}
