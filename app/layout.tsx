import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Playfair_Display, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { FloatingHeartsBackground } from "@/components/home/floating-hearts";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Send a Dedication ❤️ | Live TikTok Dedications",
    template: "%s | Say It",
  },
  description:
    "Send a heartfelt dedication to someone special and let us surprise them live on TikTok every Saturday.",
  applicationName: "Say It",
  keywords: ["TikTok live", "dedication", "love message", "surprise", "WhatsApp"],
  authors: [{ name: "Say It" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Say It",
    title: "Send a Dedication ❤️ | Live TikTok Dedications",
    description:
      "Send a heartfelt dedication to someone special and let us surprise them live on TikTok every Saturday.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Send a Dedication ❤️ | Live TikTok Dedications",
    description:
      "Send a heartfelt dedication to someone special and let us surprise them live on TikTok every Saturday.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jakarta.variable} ${playfair.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">
        <TooltipProvider>
          <Suspense fallback={null}>
            <PageViewTracker />
            <FloatingHeartsBackground />
          </Suspense>
          <div className="relative z-10 flex min-h-full flex-1 flex-col">
            <PageTransition>{children}</PageTransition>
          </div>
          <Toaster position="top-center" />
        </TooltipProvider>
      </body>
    </html>
  );
}
