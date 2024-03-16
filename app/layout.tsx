import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import AuthProvider from "./context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HowToSay - English Guessing Game",
  description: "Play the ultimate English guessing game on HowToSay. Guess words by their meanings, expand your vocabulary, and have fun while learning English. Test your knowledge and challenge yourself with various levels and categories. Join now and improve your language skills through an interactive and engaging game experience.",
  keywords: "English leanring, Guessing game, vocabulary training",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="google-adsense-account" content="ca-pub-4248324124681580" />
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
      </body>

    </html>
  );
}
