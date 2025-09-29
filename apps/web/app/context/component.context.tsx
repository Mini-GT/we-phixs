"use client"

import { ContextProviderProps } from "@/types/context";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type ComponentContextType = {
  component: "loginForm" | null,
  setComponent: Dispatch<SetStateAction<"loginForm" | null>>
}

export const ComponentContext = createContext<ComponentContextType | undefined>(undefined)

export function ComponentProvider({ children }: ContextProviderProps) {
  const [component, setComponent] = useState<"loginForm" | null>(null)
  
  return (
    <ComponentContext value={{ component, setComponent }}>
      {children}
    </ComponentContext>
  );
}

export function useComponent() {
  const context = useContext(ComponentContext);

  if (context === undefined) {
    throw new Error('useComponent must be used within CurrentItemsProvider');
  }
  
  return context;
}