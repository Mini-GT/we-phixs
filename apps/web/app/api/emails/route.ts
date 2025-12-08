import ResetPasswordEmail from "@/emails/resetPasswordEmail";
import { forgotPassword } from "api/email.service";
import { isAxiosError } from "axios";
import { NextRequest } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";

const resend = new Resend(process.env.resendKey);

export async function POST(req: NextRequest) {
  try {
    const email = (await req.json()).email;

    const transporter = nodemailer.createTransport({
      host: process.env.TRANSPORT_HOST,
      // port: 587,
      port: 465,
      // secure: false, // true for 465, false for other ports
      secure: true,
      auth: {
        user: process.env.TRANSPORT_EMAIL_USER,
        pass: process.env.TRANSPORT_EMAIL_PASSWORD,
      },
    });

    const result = await forgotPassword(email);
    const { username, token } = result;
    const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;

    const resetLink = `${clientUrl}/password/reset?token=${encodeURIComponent(
      token
    )}&email=${encodeURIComponent(email)}`;

    const emailHtml = await render(ResetPasswordEmail({ username, resetLink }));

    await transporter.sendMail({
      from: `${process.env.TRANSPORT_FROM_NAME} <${process.env.TRANSPORT_FROM_EMAIL}>`,
      to: email,
      subject: "Password Reset",
      html: emailHtml,
    });

    // await resend.emails.send({
    //   from: "Phixel Paint <no-reply@phixelpaint.com>",
    //   to: email,
    //   subject: "Password Reset",
    //   react: ResetPasswordEmail({ username, resetLink }),
    // });

    return Response.json(
      {
        message: "Success! Please check your email inbox/spambox",
      },
      { status: 200 }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      return Response.json(
        { success: false, message: error.response?.data?.message },
        { status: error.response?.status ?? 500 }
      );
    }

    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
