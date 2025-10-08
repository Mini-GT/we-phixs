import { ReactNode } from "react";

type ComponentStateValue = "loginForm" | "registerForm" | null;
type SelectedContentValue = "profileForm" | "leaderboard" | "adminPanel" | null;

type ChildrenProps = {
  children: ReactNode;
};

export type { ComponentStateValue, SelectedContentValue, ChildrenProps };
