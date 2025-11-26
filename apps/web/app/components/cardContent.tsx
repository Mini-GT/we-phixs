"use client";

import { useSelectedContent } from "@/context/selectedContent.context";
import { AnimatePresence } from "framer-motion";
import ProfileMotion from "./motion/profileMotion";
import { useEffect, useRef } from "react";
import LeaderboardMotion from "./motion/leaderboardMotion";
import AdminPanelMotion from "./motion/adminPanelMotion";
import { useUser } from "@/context/user.context";
import CreateCanvasMotion from "./motion/createCanvasMotion";
import { setSoundEnabled } from "react-sounds";
import CreateGuildMotion from "./motion/createGuildMotion";
import GuildMotion from "./motion/guildMotion";
import { useMutation } from "@tanstack/react-query";
import { joinGuildByInvite } from "api/guild.service";
import { getQueryClient } from "@/getQueryClient";
import { toast } from "react-toastify";
import { queryKeysType } from "@repo/types";
import { removeGuildInvitationCookie } from "api/removeGuildInvitation.service";
import { displayError } from "@/utils/displayError";
import ReportFormMotion from "./motion/reportMotion";

export default function CardContent({
  guildInvitationCode,
}: {
  guildInvitationCode: string | undefined;
}) {
  const { user, setUser } = useUser();
  const { selectedContent, setSelectedContent } = useSelectedContent();
  const cardRef = useRef<HTMLDivElement>(null);
  const queryClient = getQueryClient();

  const mutation = useMutation({
    mutationFn: joinGuildByInvite,
    onSuccess: (data) => {
      toast.success("Joined guild successfully");
      setSelectedContent("guild");
      queryClient.setQueryData(queryKeysType.guildByUserId(user?.id), data);
    },
    onError: (err) => {
      displayError(err);
      queryClient.invalidateQueries({
        queryKey: queryKeysType.guildByUserId(user?.id),
      });
    },
    onSettled: () => {
      removeGuildInvitationCookie();
    },
  });

  useEffect(() => {
    if (!user?.id || !guildInvitationCode) return;
    mutation.mutate({ code: guildInvitationCode });
  }, [user?.id, guildInvitationCode, mutation]);

  // close card if user clicks outside the card content
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        switch (selectedContent) {
          case "createCanvas":
            setSelectedContent("adminPanel");
            break;
          case "createGuild":
            setSelectedContent("guild");
            break;
          default:
            setSelectedContent(null);
        }
      }
    }

    if (selectedContent) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedContent, setSelectedContent]);

  useEffect(() => {
    // remove loginTimes to receive fresh login message when user logged in
    const loginToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hasLoginToken="))
      ?.split("=")[1];

    if (!loginToken) {
      localStorage.removeItem("loginTimes");
      setSoundEnabled(false);
      setUser(null);
    } else {
      setSoundEnabled(true);
    }
  });

  return (
    <AnimatePresence>
      {selectedContent === "profileForm" && <ProfileMotion cardRef={cardRef} />}
      {selectedContent === "leaderboard" && (
        <LeaderboardMotion cardRef={cardRef} />
      )}
      {selectedContent === "guild" && <GuildMotion cardRef={cardRef} />}
      {selectedContent === "createGuild" && (
        <CreateGuildMotion cardRef={cardRef} />
      )}
      {selectedContent === "report" && <ReportFormMotion cardRef={cardRef} />}
      {selectedContent === "adminPanel" && user?.role === "ADMIN" && (
        <AdminPanelMotion cardRef={cardRef} />
      )}
      {selectedContent === "createCanvas" && user?.role === "ADMIN" && (
        <CreateCanvasMotion cardRef={cardRef} />
      )}
    </AnimatePresence>
  );
}
