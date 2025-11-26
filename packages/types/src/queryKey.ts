export const queryKeysType = {
  me: (userId: string | undefined) => ["me", userId] as const,
  canvas: (canvasId: number) => ["canvas", canvasId] as const,
  guildByUserId: (userId: string | undefined) => ["guild", userId] as const,
  getGuildInviteCode: (guildId: number | undefined) => ["guildInvite", guildId] as const,
  getAllUsers: (page: number) => ["allUsers", page] as const,
  paintCharges: ["paintCharges"] as const,
  allLeaderboard: ["allLeaderboard"] as const,
  reports: (page: number) => ["reports", page] as const,
};
