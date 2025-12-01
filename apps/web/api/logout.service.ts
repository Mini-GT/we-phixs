"use server";

import { cookies } from "next/headers";

export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    const domain = process.env.domainUrl;

    cookieStore.delete({
      name: "loginToken",
      path: "/",
      domain: domain,
    });

    cookieStore.delete({
      name: "hasLoginToken",
      path: "/",
      domain: domain,
    });

    return true;
  } catch (err: any) {
    return { error: err.message };
  }
}
