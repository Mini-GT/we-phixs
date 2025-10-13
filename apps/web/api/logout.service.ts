"use server";

import { cookies } from "next/headers";

export async function logoutUser() {
  try {
    (await cookies()).delete("loginToken");
    (await cookies()).delete("hasLoginToken");

    return true;
  } catch (err: any) {
    return { error: err.message };
  }
}
