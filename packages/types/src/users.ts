type User = {
  id: string;
  createdAt: Date;
  email: string;
  name: string;
  profileImage: string | null;
  status: string;
  role: Role;
  totalPixelsPlaced: number;
  discord: DiscordFields | null;
};

type Role = "USER" | "ADMIN" | "MODERATOR" | "DEMO" | "LEADER" | "MEMBER";

type Status = "verified" | "unverified" | "banned" | "pending" | "suspended";

type CalculateChargesInput = {
  charges: number;
  cooldownMs: number;
  lastCooldownUpdate: Date | null;
};

type CalculateChargesOutput = {
  charges: number;
  cooldownMs: number; // Just return total remaining cooldown
  lastCooldownUpdate: Date;
};

// type CalculateChargesType = {
//   charges: number;
//   cooldownUntil: Date | null;
// };

type DiscordFields = {
  discordId: string;
  username: string;
  global_name: string;
  avatar: string;
};

type LeaderboardPeriods = {
  allTime: UsersLeaderboardType[];
  daily: UsersLeaderboardType[];
  weekly: UsersLeaderboardType[];
  monthly: UsersLeaderboardType[];
};

type UsersLeaderboardType = {
  id: User["id"];
  name: User["name"];
  profileImage: User["profileImage"];
  totalPixelsPlaced: User["totalPixelsPlaced"];
  discord?: DiscordFields;
};

type UpdateProfie = {
  currentName: string;
  newName: string | null;
  currentPassword: string | null;
  newPassword: string | null;
  confirmNewPassword: string | null;
  currentProfileImage: string;
  newProfileImage: string | null;
};

export type {
  User,
  Role,
  Status,
  DiscordFields,
  CalculateChargesInput,
  CalculateChargesOutput,
  UsersLeaderboardType,
  LeaderboardPeriods,
  UpdateProfie,
};
