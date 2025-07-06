import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "性別発表カード",
  description: "特別な瞬間をシェアできるジェンダーリビールカードサービス",
  openGraph: {
    title: "性別発表カード",
    description: "特別な瞬間をシェアできるジェンダーリビールカードサービス",
    type: "website",
    locale: "ja_JP",
    siteName: "性別発表カード",
  },
  twitter: {
    card: "summary_large_image",
    title: "性別発表カード",
    description: "特別な瞬間をシェアできるジェンダーリビールカードサービス",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
