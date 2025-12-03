"use client";

import Link from "next/link";
import PrimaryButton from "./ui/primaryButton";
import { useComponent } from "@/context/component.context";

export default function LoginBtn() {
  const { setComponent } = useComponent();

  return (
    <Link href="/login" className="flex items-end justify-end">
      <PrimaryButton onClick={() => setComponent("loginForm")}>
        Log in
      </PrimaryButton>
    </Link>
  );
}
