type User = {
  id: string;
  createdAt: string;
  email: string;
  status: Status;
  role: Role;
  pixes_painted: number;
};

type Role = "USER" | "ADMIN" | "MODERATOR" | "DEMO";

type Status = "verified" | "unverified" | "banned" | "pending" | "suspended";

type DiscordFields = {
  discordId: string;
  username: string;
  global_name: string;
  avatar: string;
  verified: boolean;
};

type DiscordUser = User & DiscordFields;

export type { User, DiscordUser, Role, Status };
