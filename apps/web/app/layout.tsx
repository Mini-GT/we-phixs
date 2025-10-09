import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ComponentProvider } from "./context/component.context";
import TanstackProvider from "./components/providers/tanstackProvider";
import { Suspense } from "react";
import { SelectedContentProvider } from "./context/selectedContent.context";
import { UserProvider } from "./context/user.context";
import PixelLoadingScreen from "./components/pixelLoadingScreen";
import { TabProvider } from "./context/tab.context";

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
        <Suspense fallback={<>...</>}>
          <TanstackProvider>
            <ComponentProvider>
              <UserProvider>
                <TabProvider>
                  <SelectedContentProvider>{children}</SelectedContentProvider>
                </TabProvider>
              </UserProvider>
            </ComponentProvider>
          </TanstackProvider>
        </Suspense>
      </body>
    </html>
  );
}
