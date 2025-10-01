"use client"

import { useState } from "react";
// import Image, { type ImageProps } from "next/image";
import Canvas from "./components/canvas";
import Login from "./components/login";
import LoginForm from "./components/form/loginForm";
import CardModal from "./components/cardModal";
import { useComponent } from "./context/component.context";
import RegisterForm from "./components/form/registerForm";

// type Props = Omit<ImageProps, "src"> & {
//   srcLight: string;
//   srcDark: string;
// };

// const ThemeImage = (props: Props) => {
//   const { srcLight, srcDark, ...rest } = props;

//   return (
//     <>
//       <Image {...rest} src={srcLight} className="imgLight" />
//       <Image {...rest} src={srcDark} className="imgDark" />
//     </>
//   );
// };

export default function Home() {
  const { component, setComponent } = useComponent()

  return (
    <div className="flex flex-col items-center border-black w-full">
      {component === "loginForm" && <LoginForm setComponent={setComponent} />}
      {component === "registerForm" && <RegisterForm setComponent={setComponent} />}
      <Canvas>
        <Login setComponent={setComponent} />
      </Canvas>
    </div>
  );
}
