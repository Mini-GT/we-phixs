import axios from "axios";
import {
  CreateGuildType,
  GetGuildByUserId,
  GetInviteCode,
  JoinGuildByInvite,
  KickGuildMember,
  LeaveGuild,
  TransferLeadership,
  UpdateGuildDescription,
} from "@repo/types";

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? `${process.env.API_URL}/guild`
  : `${process.env.NEXT_PUBLIC_API_URL}/guild`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export async function createGuild({ guildName, userId }: CreateGuildType) {
  const res = await api.post(`/create/${userId}`, {
    guildName,
  });
  return res.data;
}

export async function getGuildByUserId({ userId }: GetGuildByUserId) {
  const res = await api.get(`/${userId}`);
  return res.data;
}

export async function getGuildInviteCode({ guildId }: GetInviteCode) {
  const res = await api.get(`/invite/${guildId}`);
  return res.data;
}

export async function joinGuildByInvite({ userId, code }: JoinGuildByInvite) {
  const res = await api.post(`/join/${userId}/${code}`);
  return res.data;
}

export async function leaveGuild({ userId, guildId }: LeaveGuild) {
  const res = await api.delete(`/leave/${userId}`, {
    params: { guildId },
  });
  return res.data;
}

export async function kickGuildMember({ leaderId, memberId, guildId }: KickGuildMember) {
  const res = await api.delete(`/kick`, {
    params: { leaderId, memberId, guildId },
  });
  return res.data;
}

export async function transferLeadership({ leaderId, newLeaderId, guildId }: TransferLeadership) {
  const res = await api.patch(`/transfer/leadership`, {
    leaderId,
    newLeaderId,
    guildId,
  });
  return res.data;
}

export async function updateGuildDescription({
  leaderId,
  guildId,
  description,
}: UpdateGuildDescription) {
  const res = await api.patch(`/description`, {
    leaderId,
    guildId,
    description,
  });
  return res.data;
}
