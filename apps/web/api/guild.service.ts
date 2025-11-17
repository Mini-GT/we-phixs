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

export async function createGuild({ guildName }: CreateGuildType) {
  const res = await api.post(`/create`, {
    guildName,
  });
  return res.data;
}

export async function getGuildByUserId() {
  const res = await api.get("/");
  return res.data;
}

export async function getGuildInviteCode({ guildId }: GetInviteCode) {
  const res = await api.get(`/invite/${guildId}`);
  return res.data;
}

export async function joinGuildByInvite({ code }: JoinGuildByInvite) {
  const res = await api.post(`/join/${code}`);
  return res.data;
}

export async function leaveGuild({ guildId }: LeaveGuild) {
  const res = await api.delete(`/leave`, {
    params: { guildId },
  });
  return res.data;
}

export async function kickGuildMember({ memberId, guildId }: KickGuildMember) {
  const res = await api.delete(`/kick`, {
    params: { memberId, guildId },
  });
  return res.data;
}

export async function transferLeadership({ newLeaderId, guildId }: TransferLeadership) {
  const res = await api.patch(`/transfer/leadership`, {
    newLeaderId,
    guildId,
  });
  return res.data;
}

export async function updateGuildDescription({ guildId, description }: UpdateGuildDescription) {
  const res = await api.patch(`/description`, {
    guildId,
    description,
  });
  return res.data;
}
