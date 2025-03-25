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
  title: "Cal AI Mobile",
  description: "Cal AI - Mobile phone experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 flex items-center justify-center min-h-screen p-4`}
      >
        <div className="phone-container">
          <div className="phone-notch"></div>
          <div className="phone-screen">
            {children}
          </div>
          <div className="phone-home-button"></div>
        </div>
      </body>
    </html>
  );
}
