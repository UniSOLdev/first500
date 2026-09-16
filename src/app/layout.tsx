import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { PRODUCT } from "@/config/product";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "FIRST $500 | Build Your Local Service Business in 7 Days",
  description:
    "A step-by-step 7-day challenge to build your local service offer, pricing, customer outreach system, and path toward your first paying customers.",
  openGraph: {
    title: "FIRST $500 | Build Your Local Service Business in 7 Days",
    description:
      "A step-by-step 7-day challenge to build your local service offer, pricing, customer outreach system, and path toward your first paying customers.",
    type: "website",
    siteName: PRODUCT.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "FIRST $500 | Build Your Local Service Business in 7 Days",
    description:
      "Work toward your first $500 in booked revenue with a focused 7-day local service business challenge.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
