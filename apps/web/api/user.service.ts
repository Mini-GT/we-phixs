"use server";

import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.API_URL}`,
});

export async function getMe(id: string) {
  const res = await api.get(`/users/${id}`);
  return res.data;
}
