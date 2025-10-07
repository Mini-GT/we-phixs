type User = {
  id: string;
  createdAt: Date;
  email: string;
  name: string;
  profileImage: string | null;
  status: string;
  role: string;
  totalPixelsPlaced: number;
  discord: DiscordFields | null;
  charges: number;
  cooldownUntil: Date | null;
};

type Role = "USER" | "ADMIN" | "MODERATOR" | "DEMO";

type Status = "verified" | "unverified" | "banned" | "pending" | "suspended";

type CalculateChargesType = {
  charges: User["charges"];
  cooldownUntil: User["cooldownUntil"];
};

type DiscordFields = {
  discordId: string;
  username: string;
  global_name: string;
  avatar: string;
};

export type { User, Role, Status, DiscordFields, CalculateChargesType };
