import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bible Reader - Explore the Word of God",
  description:
    "Embark on a spiritual journey with our Bible Reader, and delve into the world of amazing grace.",
  keywords: [
    "Bible",
    "Reader",
    "Spiritual",
    "Journey",
    "Faith",
    "Religion",
    "Christianity",
    "Scripture",
    "Study",
    "Devotion",
  ],
  authors: [
    {
      name: "Gadisa Teklu",
      url: "https://gadisa.onrender.com",
    },
  ],
};

const spaceFont = Space_Mono({
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${spaceFont.className} antialiased h-[100dvh]`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
