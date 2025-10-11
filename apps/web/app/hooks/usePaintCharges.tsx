import { maxPaintCharges, rechargeTime_sec } from "@/components/canvas";
import { useUser } from "@/context/user.context";
import { getCooldownRemaining } from "@/utils/cooldownRemaining";
import { useEffect, useState } from "react";
import { useAppSounds } from "./useSounds";
import { queryKeysType } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { getPaintCharges } from "api/user.service";

export default function usePaintCharges() {
  const { user } = useUser();
  const [paintCharges, setPaintCharges] = useState<number>(0);
  const [cooldown, setCooldown] = useState<number>(0);
  const [shouldCountDown, setShouldCountDown] = useState<boolean>(false);
  const sounds = useAppSounds();

  const { data: paintChargesData, isSuccess } = useQuery<{ charges: number; cooldownUntil: Date }>({
    queryKey: queryKeysType.paintCharges,
    queryFn: () => getPaintCharges(user?.id),
    staleTime: Infinity, // This is the key setting
    enabled: !!user?.id,
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

  // if charges is less than max charges, start recharge the charges
  useEffect(() => {
    if (!shouldCountDown) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          setPaintCharges((current) => {
            if (current < maxPaintCharges) {
              sounds.playSuccess();
              return current + 1;
            }
            return current;
          });

          return paintCharges + 1 < maxPaintCharges ? rechargeTime_sec : 0; // stop cooldown if full
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [shouldCountDown]);

  return { paintCharges, setPaintCharges, cooldown, setCooldown };
}
