import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "にゃいんスイーパー",
  description: "ねこ踏まにゃい！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${pixelFont.variable} h-full`}>
      <body className="min-h-full bg-[#c0c0c0]">{children}</body>
    </html>
  );
}