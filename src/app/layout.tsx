import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
import { GlobalNavbar } from "../components/GlobalNavbar";
import { Providers } from "./providers";
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
        </head>

        <body className={inter.className}>
          <Providers>
            <GlobalNavbar />
            {children}
            <GoogleAnalytics gaId="G-BXMKDXTS1F" /> 
          </Providers>
        </body>
    </html>
  );
}
