"use client";

import { Inter } from "next/font/google";
import "./globals.scss";
import { AppProvider } from "@/Context/AppContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "@neynar/react/dist/style.css";
import NeynarProviderWrapper from "@/Context/NeynarProviderWrapper";
import { base } from "viem/chains";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <title>Cast OSRS</title>
        <meta name="description" content="Share your achievements" />
    
        <meta name="apple-mobile-web-app-title" content={process.env.NEXT_PUBLIC_APP_NAME || 'Your App Name'} />
        <meta property="og:image" content="/og-image-v1.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:title" content="Cast OSRS" />
        <meta property="og:description" content="Share your achievements" />
        <meta property="og:url" content="https://castosrs.xyz" />
        <meta property="og:type" content="website" />
        <meta property="og:image:alt" content="Cast OSRS" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="castosrs.xyz" />
        <meta property="twitter:url" content="https://castosrs.xyz" />
        <meta name="twitter:title" content="Cast OSRS" />
        <meta name="twitter:description" content="Share your achievements" />
        <meta name="twitter:image" content="https://castosrs.xyz/og-image-v1.png" />
      </head>
      <body className={inter.className}>
        <AppProvider>
            <NeynarProviderWrapper>
              {children}
              <ToastContainer />
            </NeynarProviderWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
