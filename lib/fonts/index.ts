import { Inter, League_Spartan, Space_Mono } from "next/font/google";

export const spaceFont = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "auto",
});

export const spartanFont = League_Spartan({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "auto",
});

export const interFont = Inter({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});
