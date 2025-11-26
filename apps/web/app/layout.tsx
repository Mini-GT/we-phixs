import type { Metadata } from "next";
import "./globals.css";
import { ComponentProvider } from "./context/component.context";
import TanstackProvider from "./components/providers/tanstackProvider";
import { Suspense } from "react";
import { SelectedContentProvider } from "./context/selectedContent.context";
import { UserProvider } from "./context/user.context";
import { TabProvider } from "./context/tab.context";
import { robotoMono } from "./fonts/fonts";
import { GuildDataProvider } from "./context/guild.context";

export const metadata: Metadata = {
  title: "Phixel Paint",
  description: "A collaborative pixel art that turns your imagination into pixels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
      <body className={`${robotoMono.variable}`}>
        <Suspense fallback={<>...</>}>
          <TanstackProvider>
            <ComponentProvider>
              <UserProvider>
                <TabProvider>
                  <GuildDataProvider>
                    <SelectedContentProvider>{children}</SelectedContentProvider>
                  </GuildDataProvider>
                </TabProvider>
              </UserProvider>
            </ComponentProvider>
          </TanstackProvider>
        </Suspense>
      </body>
    </html>
  );
}
