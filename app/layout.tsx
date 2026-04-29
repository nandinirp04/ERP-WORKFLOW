import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Layout } from "@/components/layout/Layout";
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
  title: "ERP Workflow System",
  description: "Modern workflow management for ERP operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F3F6FB] text-[#0F172A]">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
