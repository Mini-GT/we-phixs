"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL as string;

if (!socketUrl) throw new Error("Socket url is empty");

export default function useSocket(hasLoginToken: string | undefined): Socket | null {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(socketUrl, {
        autoConnect: false,
      });
    }
    const socket = socketRef.current;

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

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [hasLoginToken]);

  return socketRef.current;
}
