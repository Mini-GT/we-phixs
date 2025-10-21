import { UpdateProfie } from "@repo/types";
import axios from "axios";

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? `${process.env.API_URL}/users`
  : `${process.env.NEXT_PUBLIC_API_URL}/users`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export async function getMe(id: string) {
  const res = await api.get(`/${id}`);
  return res.data;
}

export async function getPaintCharges(id: string | undefined) {
  const res = await api.get(`/paint-charges/${id}`);
  return res.data;
}

export async function updateProfile({ id, ...args }: UpdateProfie & { id: string }) {
  const res = await api.patch(`/profile/update/${id}`, {
    ...args,
  });
  return res.data;
}
