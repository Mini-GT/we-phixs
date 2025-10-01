import { Dispatch, SetStateAction, useEffect, useState } from "react";
// import { type LoginRegisterFormProps } from "~/types/globals.type";
// import authService from "~/services/auth.service";
// import { usePopupButton } from "~/context/popupButtonContext";
import { CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import CardModal from "../cardModal";
import Image from "next/image";
import { pixelify_sans } from "@/fonts/fonts";
import { ComponentStateValue } from "@repo/types";
// import { useUser } from "~/context/userContext";

export type LoginRegisterFormProps = {
  setComponent: Dispatch<SetStateAction<ComponentStateValue>>;
}

export default function LoginForm({setComponent}: LoginRegisterFormProps) {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  // const { setPopupButton } = usePopupButton()
  // const navigation = useNavigation()
  // const { setUser } = useUser()
  // const fetcher = useFetcher()
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(loginFormData)
    // setError(null);
    // const res = await authService.login({ ...loginFormData });
    // if(res.status === 400) {
    //   setError(res.message.message.password[0])
    //   setEmailError(res.message.message.email[1] ?? res.message.message.email[0])
    // } 
    // else if(res.status === 401) {
    //   setError(res.message.message)
    // } 
    // else {
    //   const { accessToken, refreshToken, userData } = res
    //   fetcher.submit(
    //     { tokenData: JSON.stringify({accessToken, refreshToken })},
    //     { action: "/", method: "post" }
    //   )
    //   setUser(userData)
    //   setPopupButton(prevState => ({
    //     ...prevState,
    //     isLoginClicked: false,
    //   }))
    //   setLoginFormData({ email: "", password: "" });
    //   redirect("/")
    // }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
        setEmailError(null)
      }, 2000);
  
      return () => clearTimeout(timer)
    }
  }, [error]);

  return (
    <CardModal>
      <CardContent>
        <h2 className="relative flex items-center justify-center text-3xl font-bold text-center text-gray-900">
          <Image width={40} height={40} src="/imgs/logo.png" alt="wephix logo" />
          <span className={`${pixelify_sans.className}`}>Login</span>
        </h2>
        <form method="POST" onSubmit={handleSubmit} className="mt-4">
          <div className="relative mb-4">
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={loginFormData.email}
              onChange={handleChange}
              required
              className="w-full mt-1"
              placeholder="name@email.com"
            />
            {emailError && <p className="absolute text-[red] text-xs">{emailError}</p>}
          </div>
          <div className="relative mb-4">
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={loginFormData.password}
              onChange={handleChange}
              required
              className="w-full mt-1"
              placeholder="Password"
            />
            {error && <p className="absolute text-[red] text-xs">{error}</p>}
          </div>
          <div className="flex justify-between items-center text-sm mb-4">
            <Link 
              href="/password/forgot" 
              className="text-blue-600 hover:underline"
              // onClick={() => setPopupButton(prevState => ({
              //   ...prevState,
              //   isLoginClicked: false,
              // }))}
            >
              Forgot Password?
            </Link>
          </div>
          <Button
            type="submit" 
            className="w-full mb-4 cursor-pointer"
          >
            {/* {navigation.state === "loading"
            ? "Submitting..."
            : "Submit"} */}
            Submit
            {/* Login */}
          </Button>
          <Link
            className="flex items-center justify-center border-1 rounded-md cursor-pointer gap-2 overflow-hidden"
            href={`${process.env.NEXT_PUBLIC_discordRedirect}`}
          >
            <Image 
              width={32} 
              height={33} 
              src="/imgs/discord.png" 
              alt="google" 
              className="w-auto h-auto"
            />
            Continue with Discord
          </Link>
          
        </form>
        <div className="mt-4 flex justify-center gap-2 text-sm text-nowrap">
          <span>Don't have an account?</span>
          <button 
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => setComponent("registerForm")}
          >
            Register
          </button> 
        </div>
      </CardContent>
    </CardModal>
  );
}