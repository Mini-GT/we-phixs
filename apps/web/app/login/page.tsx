"use client";

import LoginForm from "@/components/form/loginForm";
import RegisterForm from "@/components/form/registerForm";
import { useComponent } from "@/context/component.context";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { component, setComponent } = useComponent();

  useEffect(() => {
    const login = document.cookie
      .split("; ")
      .find((row) => row.startsWith("isLogin="))
      ?.split("=")[1];

    if (login) redirect("/");
  }, []);

  return (
    <>
      {component === "loginForm" && <LoginForm setComponent={setComponent} />}
      {component === "registerForm" && <RegisterForm setComponent={setComponent} />}
    </>
  );
}
