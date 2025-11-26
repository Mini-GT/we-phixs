import { Dispatch, ReactNode, SetStateAction } from "react";
import { PixelType } from "./cell";
import { UpdateProfie, UsersLeaderboardType } from "./users";

type ComponentStateValue = "loginForm" | "registerForm" | null;
type SelectedContentValue =
  | "profileForm"
  | "leaderboard"
  | "adminPanel"
  | "createCanvas"
  | "createGuild"
  | "guild"
  | "report"
  | null;

type TabValue = "Users" | "Canvas" | "Reports";

type ChildrenProps = {
  children: ReactNode;
  className?: string;
};

type InspectCardProps = {
  inspectedCellData: PixelType | null;
  setInspectedCellData: Dispatch<SetStateAction<InspectCardProps["inspectedCellData"]>>;
};

type Periods = "Today" | "Week" | "Month" | "All time";

type PlayersProps = {
  users: UsersLeaderboardType[] | undefined;
  isFetching: boolean;
  period?: Periods;
};

type AvatarPickerProps = {
  setFormData: Dispatch<SetStateAction<UpdateProfie>>;
  onClose: () => void;
};

export type {
  ComponentStateValue,
  SelectedContentValue,
  ChildrenProps,
  TabValue,
  PlayersProps,
  InspectCardProps,
  Periods,
  AvatarPickerProps,
};
