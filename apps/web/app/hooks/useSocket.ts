"use client";

import { Cell, Pixel } from "@repo/types";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL as string;

if (!socketUrl) throw new Error("Socket url is empty");

export default function useSocket(hasLoginToken: string | undefined) {
  const [filledCells, setFilledCells] = useState<Cell[]>([]);

  useEffect(() => {
    const socket = io(socketUrl, {
      autoConnect: false,
    });

    // if logged in connect
    if (hasLoginToken) {
      if (!socket.connected) {
        socket.connect();
      }
    } else {
      // if logged out disconnect
      if (socket.connected) {
        socket.disconnect();
      }
    }

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    // update current filled cells base on socket
    socket.on("updatedPixel", (data: Pixel) => {
      setFilledCells((prev) => {
        // overwrite if its filled with color instead of placing it on top
        const existingIndex = prev.findIndex((c) => c.x === data.x && c.y === data.y);

        if (existingIndex !== -1) {
          const updated = [...prev];
          const existingCell = updated[existingIndex]!; // non-null assertion, safe because of the check
          updated[existingIndex] = {
            x: existingCell.x,
            y: existingCell.y,
            color: data.color,
          };
          return updated;
        }

        return [...prev, { x: data.x, y: data.y, color: data.color }];
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [hasLoginToken]);

  return { filledCells, setFilledCells };
}
