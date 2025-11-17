import { Dispatch, SetStateAction } from "react";
import { User } from "./users";

interface CreateCanvas {
  name: string;
  gridSize: string;
}

interface Pixel {
  color: string;
  user: User;
  x: number;
  y: number;
}

interface CanvasType extends CreateCanvas {
  id: number;
  pixels: Pixel[];
}

interface UpdateCanvasPixelProps extends Omit<Pixel, "user"> {
  canvasId: number;
}

interface InspectCanvas extends Omit<UpdateCanvasPixelProps, "user" | "color" | "userId"> {}

type ToolType = {
  tool: "inspect" | "paint";
  setTool: Dispatch<SetStateAction<ToolType["tool"]>>;
};

type Coordinantes = {
  x: number;
  y: number;
};

type ScaleProps = {
  canvas: HTMLCanvasElement;
  zoomDelta: number;
  panOffset: Coordinantes;
  setPanOffset: Dispatch<SetStateAction<Coordinantes>>;
  setScale: Dispatch<SetStateAction<number>>;
  centerX: number;
  centerY: number;
};

export type {
  CreateCanvas,
  Pixel,
  CanvasType,
  UpdateCanvasPixelProps,
  ToolType,
  InspectCanvas,
  Coordinantes,
  ScaleProps,
};
