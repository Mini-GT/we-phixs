"use client";

import { useUser } from "@/context/user.context";
import { useEffect, useRef, useState } from "react";
import { queryKeysType } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { getPaintCharges } from "api/user.service";
import { useSound } from "react-sounds";

export type PaintChargesDataType = {
  charges: number;
  cooldownUntil: string | null;
};

const maxCharges = 30;
const rechargeTime = 30000; // 30 miliseconds(30 seconds) per charge

export default function usePaintCharges(hasLoginToken: string) {
  const { user } = useUser();

  const [paintCharges, setPaintCharges] = useState(0);
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<string | null>(null);
  const { play: playSuccess, stop } = useSound("/sounds/success.mp3");
  const [audioInitialized, setAudioInitialized] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // browser has policy that need users to have interaction in the app first in order to play sounds
  const initializeAudio = () => {
    if (!audioInitialized) {
      setAudioInitialized(true);
    }
  };

  const { data, isSuccess } = useQuery<PaintChargesDataType>({
    queryKey: queryKeysType.paintCharges,
    queryFn: () => getPaintCharges(user?.id),
    // enabled: !!user?.id,
  });

  // fetch initial paint data
  useEffect(() => {
    if (!isSuccess || !data) return;

    setPaintCharges(data.charges);
    setCooldownUntil(data.cooldownUntil);

    // calculate initial display seconds
    if (data.cooldownUntil && data.charges < maxCharges) {
      const cooldownTime = new Date(data.cooldownUntil).getTime();
      const now = Date.now();
      const remainingMs = Math.max(0, cooldownTime - now);
      setDisplaySeconds(Math.ceil(remainingMs / 1000));
    } else {
      setDisplaySeconds(0);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!cooldownUntil || paintCharges >= maxCharges) {
      setDisplaySeconds(0);
      return;
    }

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const cooldownTime = new Date(cooldownUntil).getTime();
      const remainingTotalMs = cooldownTime - now;

      if (remainingTotalMs <= 0) {
        //fully recharged
        setDisplaySeconds(0);
        setCooldownUntil(null);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return;
      }

      // calculate remaining time for *current* 30s cycle
      const remainingMsThisCharge = remainingTotalMs % rechargeTime;
      // when remainingMsThisCharge is close to 0, add one charge
      if (remainingMsThisCharge / 1000 < 0.1) {
        if (hasLoginToken && audioInitialized) {
          playSuccess();
          setPaintCharges((prev) => Math.min(prev + 1, maxCharges));
        } else {
          stop();
        }
      }

      const remainingSeconds = Math.ceil(remainingMsThisCharge / 1000);
      setDisplaySeconds(remainingSeconds || 30);
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [cooldownUntil, paintCharges, hasLoginToken, audioInitialized]);

  return {
    paintCharges,
    setPaintCharges,
    displaySeconds,
    setCooldownUntil,
    initializeAudio,
  };
}
