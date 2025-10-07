"use client";

import { ContextProviderProps } from "@/types/context";
import { User } from "@repo/types";
import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";

type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: ContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  return <UserContext value={{ user, setUser }}>{children}</UserContext>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}
