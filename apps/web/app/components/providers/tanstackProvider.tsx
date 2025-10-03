"use client";

import { getQueryClient } from "@/getQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export default function TanstackProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
