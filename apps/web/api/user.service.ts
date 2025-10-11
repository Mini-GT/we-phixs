import axios from "axios";

const isServer = typeof window === "undefined";
const baseURL = isServer ? `${process.env.API_URL}` : `${process.env.NEXT_PUBLIC_API_URL}`;

const api = axios.create({
  baseURL,
});

export async function getMe(id: string) {
  const res = await api.get(`/users/${id}`);
  return res.data;
}

export async function getPaintCharges(id: string | undefined) {
  const res = await api.get(`/users/paint-charges/${id}`);
  return res.data;
}
