import axios from "axios";
import { CreateReportType } from "@repo/types";

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? `${process.env.API_URL}/reports`
  : `${process.env.NEXT_PUBLIC_API_URL}/reports`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export async function createReport({ ...data }: CreateReportType) {
  const res = await api.post(`/`, {
    ...data,
  });
  return res.data;
}

export async function getReports(page: number) {
  const res = await api.get("/", {
    params: { page },
  });
  return res.data;
}
