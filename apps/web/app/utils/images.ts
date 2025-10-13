import { User } from "@repo/types";

export const getProfileImage = (user: User | null) => {
  if (user?.profileImage) return user.profileImage;
  if (user?.discord?.avatar && user.discord?.discordId)
    return `https://cdn.discordapp.com/avatars/${user.discord?.discordId}/${user.discord?.avatar}?size=1024`;
  return "/imgs/defaultImage.jpg";
};
