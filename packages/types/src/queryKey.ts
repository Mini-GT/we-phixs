export const queryKeysType = {
  me: (userId: string) => ["me", userId] as const,
  canvas: (canvasId: number) => ["canvas", canvasId] as const,
  paintCharges: ["canvas"] as const,
};
