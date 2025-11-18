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

export async function getMe() {
  const res = await api.get("/");
  return res.data;
}

export async function getPaintCharges() {
  const res = await api.get(`/paint-charges`);
  return res.data;
}

export async function updateProfile({ ...args }: UpdateProfie) {
  const res = await api.patch(`/profile/update`, {
    ...args,
  });
  return res.data;
}
