import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { CustomAuthProvider } from "./context/CustomAuthProvider";
import { AppPreferencesProvider } from "./context/AppPreferencesProvider";
import CsrfProvider from "./components/CsrfProvider";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-4248324124681580" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  const theme = localStorage.getItem("howtosay-theme") || "dark";
                  const locale = localStorage.getItem("howtosay-locale")
                    || (navigator.language.toLowerCase().startsWith("zh") ? "zh-CN" : "en");
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.lang = locale.startsWith("zh") ? "zh-CN" : "en";
                  document.documentElement.style.colorScheme = theme;
                } catch (error) {
                  document.documentElement.dataset.theme = "dark";
                  document.documentElement.lang = "en";
                  document.documentElement.style.colorScheme = "dark";
                }
              })();
            `,
          }}
        />
        {/* CSRF meta tag will be added dynamically by CsrfProvider */}
      </head>
      <body className={inter.className}>
        <AppPreferencesProvider>
          <CustomAuthProvider>
            <CsrfProvider>
              <div className="min-h-screen">
                {children}
              </div>

              <Analytics />
            </CsrfProvider>
          </CustomAuthProvider>
        </AppPreferencesProvider>
      </body>

    </html>
  );
}
