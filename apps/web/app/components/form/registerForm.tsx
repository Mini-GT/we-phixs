"use client";

import { useEffect, useState } from "react";
import { CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoginRegisterFormProps } from "./loginForm";
import { registerUser } from "api/auth";
import CardModal from "../cardModal";

export default function RegisterForm({ setComponent }: LoginRegisterFormProps) {
  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterFormData({ ...registerFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 
    if (!registerFormData.name || !registerFormData.email || !registerFormData.password || !registerFormData.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (registerFormData.password !== registerFormData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerFormData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // optional: password complexity
    if (!/[A-Z]/.test(registerFormData.password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    // backend API call
    try {
      const res = await registerUser({
        name: registerFormData.name,
        email: registerFormData.email,
        password: registerFormData.password,
        confirmPassword: registerFormData.confirmPassword,
      });
      console.log(res)
      if (!res) throw new Error("Something went wrong");

      setSuccess("Account created successfully!");
      // setRegisterFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      console.log(err)
      setError("Failed to create account.");
    }
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
  
      return () => clearTimeout(timer)
    }
  }, [error, success]);

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
          {error && <p className="text-[red] text-sm">{error}</p>}
          {success && <p className="text-[green] text-sm">{success}</p>}
          <Button type="submit" className="w-full mb-4 cursor-pointer">Register</Button>
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