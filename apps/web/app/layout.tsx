import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ComponentProvider } from "./context/component.context";
import TanstackProvider from "./components/providers/tanstackProvider";

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
        <TanstackProvider>
          <ComponentProvider>
            {children}
          </ComponentProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
