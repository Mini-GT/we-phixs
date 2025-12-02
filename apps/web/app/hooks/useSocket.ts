"use client";

import { Cell, Pixel } from "@repo/types";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL as string;

if (!socketUrl) throw new Error("Socket url is empty");

export default function useSocket(hasLoginToken: string | undefined) {
  const [filledCells, setFilledCells] = useState<Cell[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(socketUrl, {
        autoConnect: false,
      });

      const socket = socketRef.current;

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
          const existingIndex = prev.findIndex(
            (c) => c.x === data.x && c.y === data.y
          );

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
    }

    const socket = socketRef.current;
    // if logged in connect
    if (hasLoginToken) {
      if (!socket.connected) {
        socket.connect();
      }
    }
    // if logged out disconnect
    else {
      if (socket.connected) {
        socket.disconnect();
      }
    }

    // return () => {
    //   // DO NOT recreate socket. just clean listeners.
    //   if (socket) {
    //     socket.off("connect");
    //     socket.off("disconnect");
    //     socket.off("updatedPixel");
    //   }
    // };
  }, [hasLoginToken]);

  // separate cleanup on component unmount
  useEffect(() => {
    return () => {
      const socket = socketRef.current;
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("updatedPixel");
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return { filledCells, setFilledCells };
}
