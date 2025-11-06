import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cookieStore = await cookies();
  const loginToken = cookieStore.get("loginToken")?.value;

  const code = searchParams.get("code");
  let res;
  if (loginToken) {
    res = NextResponse.redirect(new URL("/", request.url));
  } else {
    res = NextResponse.redirect(new URL("/login", request.url));
  }

  // store cookie to be reuse once user has logged in
  if (code) res.cookies.set("guildInvite", code, { path: "/", httpOnly: true, secure: true });

  return res;
}
