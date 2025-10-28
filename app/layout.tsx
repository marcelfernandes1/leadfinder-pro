/**
 * Root Layout Component
 *
 * This is the main layout wrapper for the entire application.
 * It sets up the HTML structure, applies global styles, and wraps all pages.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeadFinder Pro - Discover Qualified Local Business Leads",
  description: "Automatically discover 1000+ qualified leads per week with contact info and buying probability scores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
