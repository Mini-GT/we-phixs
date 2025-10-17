"use client";

import { PixelType } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { inspectCanvasCell } from "api/canvas.service";
import axios from "axios";
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
    onError: (_err) => {
      console.log(_err);
      if (axios.isAxiosError(_err)) {
        const apiError = _err.response?.data.message;
        console.log(apiError);
        return;
      }
    },
  });

  return { inspectMutation, inspectedCellData, setInspectedCellData };
}
