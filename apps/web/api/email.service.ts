import axios from "axios";

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? `${process.env.API_URL}/email`
  : `${process.env.NEXT_PUBLIC_API_URL}/email`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export async function forgotPassword(email: string | null) {
  const res = await api.post("/forgot/password", {
    email,
  });
  return res.data;
}
