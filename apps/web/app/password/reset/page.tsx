"use client";

import { displayError } from "@/utils/displayError";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "api/auth.service";
import { redirect, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token");
  const email = useSearchParams().get("email");
  const [isResetSuccess, setIsResetSuccess] = useState<boolean>(false);
  const [passFormData, setPassFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  if (!token) redirect("/");

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(data);
      setPassFormData({
        newPassword: "",
        confirmNewPassword: "",
      });
      setIsResetSuccess(true);
    },
    onError: (error) => {
      displayError(error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassFormData({ ...passFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ ...passFormData, email, token });
  };

  const handleClick = () => {
    redirect("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <ToastContainer
        autoClose={3000}
        pauseOnHover={false}
        position="top-left"
        transition={Slide}
        closeButton={false}
        stacked
      />
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex flex-col mb-6 text-md font-bold text-gray-800 gap-1">
          <span>Resetting Password for:</span>
          <span className="font-normal">{email || "example@email.com"}</span>
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-5 mb-5">
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="password"
              name="newPassword"
              type="password"
              value={passFormData.newPassword}
              disabled={isResetSuccess}
              onChange={handleChange}
              className={`mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Password"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmNewPassword"
              type="password"
              value={passFormData.confirmNewPassword}
              disabled={isResetSuccess}
              onChange={handleChange}
              className={`mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Password"
            />
          </div>

          {!isResetSuccess && (
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {mutation.isPending ? "Sending..." : "Reset Password"}
            </button>
          )}
        </form>
        {isResetSuccess && (
          <button
            onClick={handleClick}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}
