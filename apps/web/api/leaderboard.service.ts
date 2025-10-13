import axios from "axios";

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? `${process.env.API_URL}/leaderboard`
  : `${process.env.NEXT_PUBLIC_API_URL}/leaderboard`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export async function getAllLeaderboard() {
  const res = await api.get("/");
  return res.data;
}
