import { discordOauth } from "api/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const isProduction = process.env.NODE_ENV === "production" ? true : false;
  const domain = process.env.domainUrl;

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL}/login`);
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL}/login`);
  }

  try {
    const { token } = await discordOauth({ code });

    const res = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/login`
    );

    res.cookies.set("loginToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      domain: domain,
      path: "/",
    });

    res.cookies.set("hasLoginToken", "true", {
      httpOnly: false,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      domain: domain,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Discord OAuth error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/login?error=auth_failed`
    );
  }
}
