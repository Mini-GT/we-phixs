import { CreateCanvas } from "@repo/types";
import axios from "axios";

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? `${process.env.API_URL}/canvas`
  : `${process.env.NEXT_PUBLIC_API_URL}/canvas`;

const api = axios.create({
  baseURL,
});

export async function updateCanvas(
  canvasId: string,
  x: number,
  y: number,
  color: string,
  userId: string
) {
  const res = await api.get("/paint", {
    params: { canvasId, x, y, color, userId },
  });
  console.log(res.data);
  // return res.data;
}

export async function createCanvas(canvasData: CreateCanvas | undefined) {
  const res = await api.post("/create", {
    ...canvasData,
  });
  return res.data;
}
