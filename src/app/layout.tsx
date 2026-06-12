import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "TypeRush - 打字练习",
  description: "提高你的打字速度和准确率",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-[#0a0a0a] text-gray-100 antialiased">
        <SessionProvider>
          <Header />
          <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
