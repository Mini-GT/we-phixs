import { Doto, Pixelify_Sans, Roboto_Mono } from "next/font/google";

export const pixelify_sans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const doto = Doto({
  subsets: ["latin"],
  weight: ["700"],
});

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-roboto-mono",
});
