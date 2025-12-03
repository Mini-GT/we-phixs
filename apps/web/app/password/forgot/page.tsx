"use client";

import { displayError } from "@/utils/displayError";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (email: string | null) => {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      displayError(error);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(email);
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
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Forgot Password
        </h2>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Enter your email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                e.preventDefault();
                setEmail(e.target.value);
              }}
              className={`mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-wrap gap-5 text-nowrap">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {mutation.isPending ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              // href={`${process.env.NEXT_PUBLIC_CLIENT_URL}`}
              onClick={() => redirect("/login")}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              Return to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
