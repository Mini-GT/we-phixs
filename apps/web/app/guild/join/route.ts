import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_CLIENT_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cookieStore = await cookies();
  const loginToken = cookieStore.get("loginToken")?.value;

  const code = searchParams.get("code");
  let redirectPath = loginToken ? "/" : "/login";

  const destinationUrl = new URL(redirectPath, PUBLIC_DOMAIN);

  // 2. Perform the redirect
  const res = NextResponse.redirect(destinationUrl);

  // store cookie to be reuse once user has logged in
  if (code)
    res.cookies.set("guildInvite", code, {
      path: "/",
      httpOnly: true,
      secure: true,
    });

  return res;
}
