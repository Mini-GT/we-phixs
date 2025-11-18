"use client";

import { useToggle } from "@/hooks/useToggle";
import { DiscordFields, queryKeysType, User } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "api/user.service";
import { Paintbrush, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import IconButton from "./ui/iconButton";
import LogoutBtn from "./logoutBtn";
import { useSelectedContent } from "@/context/selectedContent.context";
import { useUser } from "@/context/user.context";
import { toast } from "react-toastify";
import { getProfileImage } from "@/utils/images";
import { getQueryClient } from "@/getQueryClient";
import { displayError } from "@/utils/displayError";

type AvatarProps = {
  userId: string | null;
};

export default function Avatar({ userId }: AvatarProps) {
  const queryClient = getQueryClient();
  const { user, setUser } = useUser();
  const { setSelectedContent } = useSelectedContent();
  const { isOpen, toggle, close } = useToggle();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        close();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const { data, isError, error } = useQuery<User>({
    queryKey: queryKeysType.me(userId!),
    queryFn: () => getMe(),
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });

  if (isError) {
    displayError(error);
  }

  let discordData: DiscordFields | null;

  if (data?.discord) {
    discordData = data.discord;
  } else {
    discordData = null;
  }

  const email = data?.email;
  const totalPixelsPlaced = data?.totalPixelsPlaced;

  useEffect(() => {
    if (!data) return;
    // say welcome message if first login
    const loginTimes = Number(localStorage.getItem("loginTimes"));

    if (loginTimes < 1) {
      toast.success(`Successfully logged in as ${data?.name || data?.discord?.global_name}`);

      // invalidate user data to get a fresh user's cooldown and charges
      queryClient.invalidateQueries({ queryKey: queryKeysType.me(user?.id) });

      const current = Number(localStorage.getItem("loginTimes")) || 0;
      localStorage.setItem("loginTimes", String(current + 1));
    }

    setUser(data);
  }, [data]);

  return (
    <div ref={menuRef}>
      <div>
        <button
          onClick={toggle}
          className="flex items-center justify-center cursor-pointer w-10 h-10 rounded-full bg-gray-700 hover:opacity-90 active:scale-97 active:opacity-80 focus:outline-none"
          // aria-expanded={open.isProfileMenu}
          aria-haspopup="true"
        >
          <Image
            width={1024}
            height={1024}
            src={getProfileImage(user)}
            alt="User Avatar"
            className="w-full h-full rounded-full object-cover border-1 border-gray-600"
            priority
          />
        </button>
      </div>

      <div
        className={`absolute flex flex-col gap-2 right-0 mt-1 w-xs sm:w-sm bg-white border border-cyan-300 rounded-xl shadow-lg p-4 z-50 transition-all duration-300 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="relative flex items-start gap-2">
          <div className="absolute right-0">
            <IconButton
              className="top-2 right-2 border-none shadow-none text-gray-600 hover:text-gray-900"
              aria-label="Close form"
              onClick={() => close()}
            >
              <X size={20} />
            </IconButton>
          </div>
          <Image
            width={1024}
            height={1024}
            src={getProfileImage(user)}
            alt="User Avatar"
            className="w-20 mt-1 h-auto rounded-full object-cover border border-cyan-700"
            priority
          />
          <div className="flex flex-col items-start mb-4">
            <p className="text-gray-800 font-bold text-2xl">
              {user?.name || discordData?.global_name}
            </p>
            <p className="text-gray-400 font-semibold text-md">{discordData?.username}</p>
            <p className="text-gray-400 font-semibold text-md">{email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <Paintbrush />
            <div className="text-gray-800 text-md font-semibold flex gap-1">
              Pixels painted:
              <span className="text-blue-500 font-bold">{totalPixelsPlaced ?? 0}</span>
            </div>
          </div>
          <IconButton className="w-full border-none hover:scale-97 ">
            <div
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-full transition-all shadow-lg hover:shadow-blue-500/30 cursor-pointer"
              onClick={() => {
                setSelectedContent("profileForm");
                close();
              }}
            >
              Profile
            </div>
          </IconButton>
          <LogoutBtn />
        </div>
      </div>
    </div>
  );
}
