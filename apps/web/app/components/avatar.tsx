"use client";

import { useToggle } from "@/hooks/useToggle";
import { DiscordUser, queryKeysType, User } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "api/user.service";
import { Paintbrush } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import IconButton from "./ui/iconButton";
import LogoutBtn from "./logoutBtn";
import { useSelectedContent } from "@/context/selectedContent.context";
import { useUser } from "@/context/user.context";

type AvatarProps = {
  userId: string | null;
};

export default function Avatar({ userId }: AvatarProps) {
  const { setUser } = useUser();
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

  const { data } = useQuery({
    queryKey: queryKeysType.me(userId!),
    queryFn: () => getMe(userId!),
    enabled: !!userId,
  });

  const { avatar, discordId, global_name, username, email, pixes_painted } =
    data.user as DiscordUser;

  useEffect(() => {
    setUser(data.user);
  }, [data.user]);

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
            width={30}
            height={30}
            src={`https://cdn.discordapp.com/avatars/${discordId}/${avatar}`}
            alt="User Avatar"
            className="w-full h-full rounded-full object-cover border-1 border-gray-600"
            loading="lazy"
          />
        </button>
      </div>

      <div
        className={`absolute right-0 mt-1 w-sm bg-white rounded-xl shadow-lg p-4 z-50 transition-all duration-300 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-start gap-2">
          <Image
            width={1024}
            height={1024}
            src={`https://cdn.discordapp.com/avatars/${discordId}/${avatar}?size=1024`}
            alt="User Avatar"
            className="w-20 mt-1 h-auto rounded-full object-cover border-1 border-gray-600"
            loading="lazy"
          />
          <div className="flex flex-col items-start mb-4">
            <p className="text-gray-800 font-bold text-2xl">{global_name}</p>
            <p className="text-gray-400 font-semibold text-md">{username}</p>
            <p className="text-gray-400 font-semibold text-md">{email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <Paintbrush />
            <div className="text-gray-800 text-md font-semibold flex gap-1">
              Pixels painted:
              <span className="text-blue-500 font-bold">{pixes_painted ?? 0}</span>
            </div>
          </div>
          {/* <ProtectedRoute requiredRoles={["ADMIN", "MODERATOR"]} requiredPermission={PERMISSIONS.VIEW_USERS} >
            <Link
              href="/users"
              className="text-left px-4 py-2 rounded hover:bg-gray-700 text-white"
              // onClick={() => setOpen(prev => ({...prev, isProfileMenu: false}))} // Close the dropdown when navigating
            >
              Users
            </Link>
          </ProtectedRoute>
          <ProtectedRoute requiredRoles={["ADMIN", "MODERATOR"]} requiredPermission={PERMISSIONS.VIEW_DEVICES} >
            <Link
              href="/devices"
              className="text-left px-4 py-2 rounded hover:bg-gray-700 text-white"
              // onClick={() => setOpen(prev => ({...prev, isProfileMenu: false}))} // Close the dropdown when navigating
            >
              Devices
            </Link>
          </ProtectedRoute> */}
          {/* <Link
            href="/user/profile"
            className="text-left px-4 py-2 rounded hover:bg-gray-700 text-white"
            // onClick={() => setOpen(prev => ({...prev, isProfileMenu: false}))} // Close the dropdown when navigating
          >
            Profile
          </Link>
          <Link
            href="/user/notification"
            className="flex text-left px-4 py-2 rounded hover:bg-gray-700 text-white"
            // onClick={() => setOpen(prev => ({...prev, isProfileMenu: false}))} // Close the dropdown when navigating
          >
            Notification
          </Link>
          <Link
            href="/user/settings"
            className="text-left px-4 py-2 rounded hover:bg-gray-700 text-white"
            // onClick={() => setOpen(prev => ({...prev, isProfileMenu: false}))} // Close the dropdown when navigating
          >
            Settings
          </Link> */}
          <IconButton className="w-full hover:scale-97">
            <div
              className="text-left px-4 py-2 rounded-full w-full font-semibold hover:bg-gray-700 text-red-400 cursor-pointer "
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
