import { User } from "./users";

type CreateCanvas = {
  name: string;
  gridSize: string;
};

type Pixel = {
  color: string;
  user: User;
  x: number;
  y: number;
};

type CanvasType = {
  gridSize: number;
  id: number;
  name: string;
  pixels: Pixel[];
};

type UpdateCanvasPixelProps = {
  canvasId: number;
  x: number;
  y: number;
  color: string;
  userId?: string;
};

export type { CreateCanvas, Pixel, CanvasType, UpdateCanvasPixelProps };
