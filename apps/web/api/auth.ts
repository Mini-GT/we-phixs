"use server"

import axios from 'axios';
import { loginFormType, RegisterFormType } from '@repo/types';

const api = axios.create({
  baseURL: `${process.env.API_URL}/auth`,
});

export async function loginUser(data: loginFormType) {
  try {
    const res = await api.post('/login', data);
    return { ok: true, data: res.data };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function registerUser(data: RegisterFormType) {
  try {
    const res = await api.post('/register', data);
    return { ok: true, data: res.data };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function logoutUser() {
  try {
    const res = await api.get('/logout');
    return { ok: true, data: res.data };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}