import { useState } from "react";
import { Button } from "./ui/button";
import { useUser } from "@/context/user.context";
import Image from "next/image";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AvatarPickerProps, queryKeysType, User } from "@repo/types";
import { getMe } from "api/user.service";

const avatars: AvatarTypes[] = [
  "/imgs/profile/image1.png",
  "/imgs/profile/image2.png",
  "/imgs/profile/image3.png",
  "/imgs/profile/image4.png",
  "/imgs/profile/image5.png",
  "/imgs/profile/image6.png",
  "/imgs/profile/image7.png",
  "/imgs/profile/image8.png",
  "/imgs/profile/image9.png",
];

export type AvatarTypes =
  | "/imgs/profile/image1.png"
  | "/imgs/profile/image2.png"
  | "/imgs/profile/image3.png"
  | "/imgs/profile/image4.png"
  | "/imgs/profile/image5.png"
  | "/imgs/profile/image6.png"
  | "/imgs/profile/image7.png"
  | "/imgs/profile/image8.png"
  | "/imgs/profile/image9.png";

export default function AvatarPickera({ setFormData, onClose }: AvatarPickerProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarTypes>();
  const { user, setUser } = useUser();

  const { data } = useSuspenseQuery<User>({
    queryKey: queryKeysType.me(user?.id),
    queryFn: () => getMe(user?.id!),
  });

  const handleSelect = (avatar: AvatarTypes) => {
    setSelectedAvatar(avatar);
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, profileImage: avatar };
    });
    setFormData((prev) => ({
      ...prev,
      newProfileImage: avatar,
    }));
  };

  const handleCancel = () => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, profileImage: data?.profileImage || null };
    });
    onClose();
  };

  return (
    <div className="absolute max-w-1/2 top-25 p-3 bg-white shadow-lg border rounded-xl grid grid-cols-3 gap-3">
      {avatars.map((avatar) => (
        <Image
          key={avatar}
          src={avatar}
          width={1024}
          height={1024}
          alt="Avatar option"
          loading="lazy"
          className={`object-fill w-full h-full rounded-full border cursor-pointer transition hover:scale-110 ${
            avatar === selectedAvatar ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => handleSelect(avatar)}
        />
      ))}
      <div className="flex justify-center gap-7 col-span-3">
        {/* <Button className="w-20">Save</Button> */}
        <Button
          className="w-20 cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
