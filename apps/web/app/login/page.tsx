"use client";

import LoginForm from "@/components/form/loginForm";
import RegisterForm from "@/components/form/registerForm";
import PixelLoadingScreen from "@/components/loading/pixelLoadingScreen";
import { useComponent } from "@/context/component.context";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Slide, ToastContainer } from "react-toastify";

export default function LoginPage() {
  const { component, setComponent } = useComponent();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!component) setComponent("loginForm");
  }, [component]);

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
      <ToastContainer
        autoClose={3000}
        pauseOnHover={false}
        position="top-left"
        transition={Slide}
        closeButton={false}
        stacked
      />
      {component === "loginForm" && <LoginForm setComponent={setComponent} />}
      {component === "registerForm" && (
        <RegisterForm setComponent={setComponent} />
      )}
    </>
  );
}
