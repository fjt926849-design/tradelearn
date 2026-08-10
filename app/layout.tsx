import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "贸学 TradeLearn",
  description: "国际贸易实务学习工具 · Incoterms 2020",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
