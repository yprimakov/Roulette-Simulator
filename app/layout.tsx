import type { Metadata } from "next";
import "./globals.css";
import "/public/fonts/GeneralSans_Complete/WEB/css/general-sans.css";

export const metadata: Metadata = {
  title: "Roulette Strategy Simulator",
  description: "Test and analyze roulette betting strategies with comprehensive statistics",
  keywords: ["roulette", "strategy", "simulator", "betting", "casino", "martingale"],
  authors: [{ name: "Roulette Simulator Team" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/icon.png', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "Roulette Strategy Simulator",
    description: "Test and analyze roulette betting strategies with comprehensive statistics",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 192,
        height: 192,
        alt: "Roulette Simulator",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Roulette Strategy Simulator",
    description: "Test and analyze roulette betting strategies with comprehensive statistics",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta name="apple-mobile-web-app-title" content="Roulette Simulator" />
      </head>
      <body className="font-general-sans">{children}</body>
    </html>
  );
}
