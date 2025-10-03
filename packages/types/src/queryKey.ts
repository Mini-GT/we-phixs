export const queryKeysType = {
  me: (userId: string) => ["me", userId] as const,
};
