import { Dispatch, SetStateAction } from "react";
import { User } from "./users";

type CreateGuildType = {
  guildName: string;
  userId: User["id"];
};

type GetGuildByUserId = {
  userId: string | undefined;
};

type GetInviteCode = {
  guildId: number | undefined;
};

type JoinGuildByInvite = {
  code: string;
};

type LeaveGuild = GetGuildByUserId & GetInviteCode;

type KickGuildMember = {
  memberId: string | undefined;
  guildId: GetInviteCode["guildId"];
};

type TransferLeadership = Omit<KickGuildMember, "memberId"> & {
  newLeaderId: string | undefined;
};

type UpdateGuildDescription = Omit<TransferLeadership, "newLeaderId"> & {
  description: string;
};

type InviteLinkCardProps = {
  guildId: number | undefined;
  guildInvitationToggle: () => void;
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
  descriptionData: GuildDataType["description"];
};

type DescriptionProps = Pick<GuildDataType, "description"> &
  Pick<GuildContentProps, "guildId" | "guildLeaderId"> & {
    setDescription: Dispatch<SetStateAction<string>>;
    descriptionToggle: {
      close: () => void;
    };
    descriptionData: string | null;
    descriptionMutate: {
      mutate: (UpdateGuildDescription: any) => void;
    };
  };

export type {
  CreateGuildType,
  GetGuildByUserId,
  InviteLinkCardProps,
  GetInviteCode,
  JoinGuildByInvite,
  LeaveGuild,
  KickGuildMember,
  TransferLeadership,
  UpdateGuildDescription,
  GuildDataType,
  GuildContentProps,
  DescriptionProps,
};
