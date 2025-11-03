import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const res = NextResponse.redirect(new URL("/login", request.url));

  // store cookie to be reuse once user has logged in
  if (code) res.cookies.set("guildInvite", code, { path: "/", httpOnly: true, secure: true });

  return res;
}
