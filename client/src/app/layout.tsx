import type { Metadata } from "next";
import { Press_Start_2P, DotGothic16 } from "next/font/google";
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const dotGothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  preload: false, // 日本語フォントはpreload: false推奨
  variable: "--font-dot-gothic",
});

export const metadata: Metadata = {
  title: "にゃいんスイーパー",
  description: "ねこ踏まにゃい！",
  icons: {
    icon: "/paw.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${pixelFont.variable} ${dotGothic.variable} h-[100svh] overflow-hidden`}
    >
      <body className="bg-[#c0c0c0] h-[100svh] overflow-hidden">
        {children}
      </body>
    </html>
  );
}
