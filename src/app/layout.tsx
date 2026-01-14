import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4F46E5',
};

export const metadata: Metadata = {
  title: "SkyPulse - Find & Compare Flight Deals",
  description: "Search and compare flights from hundreds of airlines. Find the best prices on your next trip with real-time pricing and flexible filters.",
  keywords: ["flight search", "cheap flights", "airline tickets", "travel deals", "flight comparison"],
  authors: [{ name: "SkyPulse" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo.png",
  },
  openGraph: {
    title: "SkyPulse - Find & Compare Flight Deals",
    description: "Search and compare flights from hundreds of airlines. Find the best prices.",
    type: "website",
    locale: "en_US",
    siteName: "SkyPulse",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkyPulse - Find & Compare Flight Deals",
    description: "Search and compare flights from hundreds of airlines.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${mono.variable} font-sans antialiased`}>
        <QueryProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
