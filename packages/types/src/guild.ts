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
  userId: string | undefined;
  code: string;
};

type LeaveGuild = {
  userId: string | undefined;
  guildId: number | undefined;
};

type KickGuildMember = {
  leaderId: string | undefined;
  memberId: string | undefined;
  guildId: number | undefined;
};

type TransferLeadership = {
  leaderId: string | undefined;
  newLeaderId: string | undefined;
  guildId: number | undefined;
};

type InviteLinkCardProps = {
  guildId: number | undefined;
  guildInvitationToggle: () => void;
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
};
