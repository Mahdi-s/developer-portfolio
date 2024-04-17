import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mahdi Saeedi&apos;s Portfolio",
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
          <title>Mahdi Saeedi&apos;s Portfolio</title>  
          <link rel="icon" href="/bitmoji.png" />
        </head>

        <body className={inter.className}>{children}</body>
    </html>
  );
}
