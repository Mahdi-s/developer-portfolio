import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mahdi Saeedi's Portfolio",
  description: "Collection of projects and blog posts by Mahdi Saeedi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
          <link rel="icon" href="/bitmoji.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
        </head>

        <body className={inter.className}>
          {children}
          <GoogleAnalytics gaId="G-BXMKDXTS1F" /> 
        </body>
    </html>
  );
}
