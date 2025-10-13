import axios from "axios";
import { loginFormType, RegisterFormType } from "@repo/types";

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? `${process.env.API_URL}/auth`
  : `${process.env.NEXT_PUBLIC_API_URL}/auth`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export async function loginUser({ email, password }: loginFormType) {
  const res = await api.post("/login", {
    email,
    password,
  });
  return res.data;
}

export async function registerUser({ name, email, password, confirmPassword }: RegisterFormType) {
  const res = await api.post("/register", {
    name,
    email,
    password,
    confirmPassword,
  });
  return res.data;
}
