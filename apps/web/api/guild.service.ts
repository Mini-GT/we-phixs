import axios from "axios";
import { CreateGuildType } from "@repo/types";

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
