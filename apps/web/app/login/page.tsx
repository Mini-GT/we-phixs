"use client";

import LoginForm from "@/components/form/loginForm";
import RegisterForm from "@/components/form/registerForm";
import PixelLoadingScreen from "@/components/pixelLoadingScreen";
import { useComponent } from "@/context/component.context";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { component, setComponent } = useComponent();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loginToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hasLoginToken="))
      ?.split("=")[1];

    let timer: NodeJS.Timeout | undefined;

    if (loginToken) {
      setIsLoading(true);
      timer = setTimeout(() => {
        redirect("/");
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return <PixelLoadingScreen />;
  }

  return (
    <>
      {component === "loginForm" && <LoginForm setComponent={setComponent} />}
      {component === "registerForm" && <RegisterForm setComponent={setComponent} />}
    </>
  );
}
