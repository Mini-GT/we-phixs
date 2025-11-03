"use server";

import { cookies } from "next/headers";

export async function removeGuildInvitationCookie() {
  try {
    (await cookies()).delete("guildInvite");
  } catch (err: any) {
    return { error: err.message };
  }
}
