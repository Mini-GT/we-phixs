import { CreateCanvas, UpdateCanvasPixelProps } from "@repo/types";
import axios from "axios";

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? `${process.env.API_URL}/canvas`
  : `${process.env.NEXT_PUBLIC_API_URL}/canvas`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export async function updateCanvasPixel({ canvasId, x, y, color, userId }: UpdateCanvasPixelProps) {
  const res = await api.patch(`/${canvasId}`, {
    x,
    y,
    color,
    userId,
  });
  return res.data;
}

export async function createCanvas(canvasData: CreateCanvas | undefined) {
  const res = await api.post("/create", {
    ...canvasData,
  });
  return res.data;
}

export async function getCanvasById(canvasId: number): Promise<any> {
  const res = await api.get(`/${canvasId}`);
  return res.data;
}
