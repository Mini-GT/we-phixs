"use client";

import { displayError } from "@/utils/displayError";
import { PixelType } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { inspectCanvasCell } from "api/canvas.service";
import { useState } from "react";
import { useSound } from "react-sounds";

export default function useInspect() {
  const [inspectedCellData, setInspectedCellData] = useState<PixelType | null>(null);
  const { play: playInspectPop } = useSound("/sounds/inspect_pop.mp3");
  const inspectMutation = useMutation({
    mutationFn: inspectCanvasCell,
    onSuccess: (data) => {
      playInspectPop();
      setInspectedCellData(data);
    },
    onError: (err) => {
      console.log(err);
      displayError(err);
    },
  });

  return { inspectMutation, inspectedCellData, setInspectedCellData };
}
