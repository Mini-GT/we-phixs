"use client";

import { useState } from "react";
import { CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoginRegisterFormProps } from "./loginForm";
import CardModal from "../cardModal";
import { toast } from "react-toastify";
import { RegisterFormType } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { registerUser } from "api/auth.service";

export default function RegisterForm({ setComponent }: LoginRegisterFormProps) {
  const [registerFormData, setRegisterFormData] = useState<RegisterFormType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      setRegisterFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      toast.success(data);
    },
    onError: (err) => {
      console.error(err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.message[0] ?? "Please try again");
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterFormData({ ...registerFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !registerFormData.name ||
      !registerFormData.email ||
      !registerFormData.password ||
      !registerFormData.confirmPassword
    ) {
      toast.info("All fields are required.");
      return;
    }

    if (registerFormData.password !== registerFormData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (registerFormData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // optional: password complexity
    if (!/[A-Z]/.test(registerFormData.password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }

    // backend API call
    mutation.mutate(registerFormData);
  };

  return (
    <CardModal>
      <CardContent>
        <h2 className="text-2xl font-bold text-center text-gray-900">Create an Account</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={registerFormData.name}
              onChange={handleChange}
              required
              className="w-full mt-1"
              placeholder="Name"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="text"
              value={registerFormData.email}
              onChange={handleChange}
              required
              className="w-full mt-1"
              placeholder="name@email.com"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={registerFormData.password}
              onChange={handleChange}
              required
              className="w-full mt-1"
              placeholder="Password"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={registerFormData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full mt-1"
              placeholder="Confirm Password"
            />
          </div>
          <Button
            disabled={mutation.isPending}
            type="submit"
            className="w-full mb-4 cursor-pointer"
          >
            {mutation.isPending ? "Registering..." : "Register"}
          </Button>
        </form>
        <div className="mt-4 flex justify-center gap-2 text-sm text-nowrap">
          <span>Have an account?</span>
          <button
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => setComponent("loginForm")}
          >
            Login
          </button>
        </div>
      </CardContent>
    </CardModal>
  );
}
