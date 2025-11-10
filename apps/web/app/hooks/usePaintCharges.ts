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
  const { play: playSuccess } = useSound("/sounds/success.mp3");
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

    // track last charge time to prevent duplicate increments
    let lastChargeIncrementTime = 0;

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const cooldownTime = new Date(cooldownUntil).getTime();
      const remainingTotalMs = cooldownTime - now;

      if (remainingTotalMs <= 0) {
        //fully recharged
        setDisplaySeconds(0);
        setCooldownUntil(null);
        setPaintCharges(maxCharges);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return;
      }

      // calculate remaining time for *current* 30s cycle
      const remainingMsThisCharge = remainingTotalMs % rechargeTime;

      // check if we just completed a charge cycle
      // only increment if we haven't incremented in the last 500ms (debounce)
      if (remainingMsThisCharge > rechargeTime - 100 && now - lastChargeIncrementTime > 500) {
        lastChargeIncrementTime = now;
        setPaintCharges((prev) => {
          const newCharges = Math.min(prev + 1, maxCharges);
          // play sound only on actual increment
          if (newCharges > prev && hasLoginToken && audioInitialized) {
            playSuccess();
          }
          return newCharges;
        });
      }

      // display seconds should never be 0 during cooldown
      const remainingSeconds = Math.max(1, Math.ceil(remainingMsThisCharge / 1000));
      setDisplaySeconds(remainingSeconds);
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [cooldownUntil, paintCharges, hasLoginToken, audioInitialized]);

  // set up audio context on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setAudioInitialized(true);

      // remove listeners after first interaction
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    // listen for various interaction types
    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);
  return {
    paintCharges,
    setPaintCharges,
    displaySeconds,
    setCooldownUntil,
  };
}
