import { ReactNode } from "react";

type ComponentStateValue = "loginForm" | "registerForm" | null;
type SelectedContentValue = "profileForm" | "leaderboard" | "adminPanel" | "createCanvas" | null;

type ChildrenProps = {
  children: ReactNode;
};

export type { ComponentStateValue, SelectedContentValue, ChildrenProps };
