"use client";

import { ChildrenProps, ComponentStateValue } from "@repo/types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type ComponentContextType = {
  component: ComponentStateValue;
  setComponent: Dispatch<SetStateAction<ComponentStateValue>>;
};

export const ComponentContext = createContext<ComponentContextType | undefined>(
  undefined
);

export function ComponentProvider({ children }: ChildrenProps) {
  const [component, setComponent] = useState<ComponentStateValue>(null);

  return (
    <ComponentContext value={{ component, setComponent }}>
      {children}
    </ComponentContext>
  );
}

export function useComponent() {
  const context = useContext(ComponentContext);

  if (context === undefined) {
    throw new Error("useComponent must be used within ComponentProvider");
  }

  return context;
}
