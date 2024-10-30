import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import "./globals.css";
import { spaceFont } from "@/lib/fonts";
import { Toaster } from "@/components/ui/toaster";
import { AptabaseProvider } from "@aptabase/react";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Bible Reader",
  description:
    "This app is a comprehensive tool designed to assist you in maintaining a consistent Bible reading habit. It offers a range of features to help you stay on track, including personalized reading plans, and progress tracking.",
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
  generator: "Next.js",
  manifest: "/manifest.json",
  authors: [
    {
      name: "Gadisa Teklu",
      url: "https://gadisa.onrender.com",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    { rel: "icon", url: "/pwa-192x192.png" },
  ],
};

export const viewport = {
  themeColor: "#171717",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${spaceFont.className} antialiased h-[100dvh] overflow-x-hidden`}
      >
        <AptabaseProvider appKey={process.env.APTABASE_KEY!}>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AptabaseProvider>
      </body>
    </html>
  );
}
