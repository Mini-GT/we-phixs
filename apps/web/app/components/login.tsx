"use client"

import { ComponentState, Dispatch, SetStateAction } from "react";
import PrimaryButton from "./ui/primaryButton";

type LoginProps = {
  setComponent: Dispatch<SetStateAction<ComponentState>>
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