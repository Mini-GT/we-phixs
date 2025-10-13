"use client";

import { maxPaintCharges, rechargeTime_sec } from "@/components/canvas";
import { useUser } from "@/context/user.context";
import { getCooldownRemaining } from "@/utils/cooldownRemaining";
import { useEffect, useState } from "react";
import { useAppSounds } from "./useSounds";
import { queryKeysType } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { getPaintCharges } from "api/user.service";
import { getQueryClient } from "@/getQueryClient";
import { useSound } from "react-sounds";

export default function usePaintCharges(hasLoginToken: string | undefined) {
  const { user } = useUser();
  const queryClient = getQueryClient();
  const [paintCharges, setPaintCharges] = useState<number>(0);
  const [cooldown, setCooldown] = useState<number>(0);
  const [shouldCountDown, setShouldCountDown] = useState<boolean>(false);
  const { play: playSuccess, stop } = useSound("/sounds/success.mp3");

  const { data: paintChargesData, isSuccess } = useQuery<{ charges: number; cooldownUntil: Date }>({
    queryKey: queryKeysType.paintCharges,
    queryFn: () => getPaintCharges(user?.id),
    staleTime: Infinity,
    enabled: !!user?.id,
    refetchOnWindowFocus: true,
  });

  // start countdown (we are separating this to stop the countdown from freezing the timer whenever user clicks)
  useEffect(() => {
    paintCharges < maxPaintCharges ? setShouldCountDown(true) : setShouldCountDown(false);
  }, [paintCharges]);

  // fetch initial paint charges
  useEffect(() => {
    if (isSuccess && paintChargesData) {
      const cooldownToSeconds = getCooldownRemaining(paintChargesData.cooldownUntil);
      if (cooldownToSeconds) {
        setCooldown(cooldownToSeconds);
      }

      setPaintCharges(paintChargesData.charges);
    }
  }, [isSuccess, paintChargesData]);

  useEffect(() => {
    if (paintCharges >= maxPaintCharges) {
      queryClient.invalidateQueries({ queryKey: queryKeysType.paintCharges });
    }
  }, [paintCharges]);

  // if charges is less than max charges, start recharge the charges
  useEffect(() => {
    if (!shouldCountDown) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          setPaintCharges((current) => (current < maxPaintCharges ? current + 1 : current));
          if (hasLoginToken) {
            playSuccess();
          } else {
            stop();
          }
          return rechargeTime_sec; // reset countdown
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      stop();
    };
  }, [shouldCountDown, hasLoginToken]);

  return { paintCharges, setPaintCharges, cooldown, setCooldown };
}
