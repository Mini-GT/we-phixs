import { Dispatch, ReactNode, SetStateAction } from "react";
import { PixelType } from "./cell";
import { UpdateProfie, User, UsersLeaderboardType } from "./users";

type ComponentStateValue = "loginForm" | "registerForm" | null;
type SelectedContentValue =
  | "profileForm"
  | "leaderboard"
  | "adminPanel"
  | "createCanvas"
  | "createGuild"
  | "guild"
  | null;
type TabValue = "Users" | "Canvas";

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
  period: Periods;
};

type GuildDataType = {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  totalPixelsPlaced: number;
  guildLeaderId: string;
  members: Pick<User, "id" | "name" | "role" | "totalPixelsPlaced" | "discord">[];
};

type GuildContentProps = {
  members: GuildDataType["members"];
  guildTotalPixelsPlaced: GuildDataType["totalPixelsPlaced"];
  guildLeaderId: GuildDataType["guildLeaderId"];
  guildId: number | undefined;
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
  GuildDataType,
  GuildContentProps,
  AvatarPickerProps,
};
