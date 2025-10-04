import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ComponentProvider } from "./context/component.context";
import TanstackProvider from "./components/providers/tanstackProvider";
import { Suspense } from "react";
import { SelectedContentProvider } from "./context/selectedContent.context";
import { UserProvider } from "./context/user.context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "WePhix",
  description: "A collaborative pixel art that turns your imagination into pixels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={<div className="w-screen h-screen bg-amber-300">loading...</div>}>
          <TanstackProvider>
            <ComponentProvider>
              <UserProvider>
                <SelectedContentProvider>{children}</SelectedContentProvider>
              </UserProvider>
            </ComponentProvider>
          </TanstackProvider>
        </Suspense>
      </body>
    </html>
  );
}
