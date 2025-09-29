"use client"

import { Dispatch, SetStateAction } from "react";
import PrimaryButton from "./ui/primaryButton";

type LoginProps = {
  setComponent: Dispatch<SetStateAction<"loginForm" | null>>
}

export default function Login({setComponent}: LoginProps) {

  return (
    <div>
      <PrimaryButton
        onClick={() => setComponent("loginForm")}
      >
        Log in
      </PrimaryButton>
    </div>
  )
}