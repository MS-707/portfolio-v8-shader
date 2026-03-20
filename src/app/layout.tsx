import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mark Starr — Safety Engineer · Systems Thinker · Creator",
  description:
    "Portfolio of Mark Starr — CSP, ISO Lead Auditor, EHS professional creating safer workplaces through systems thinking and technology.",
  keywords: ["EHS", "Safety Engineer", "CSP", "ISO Lead Auditor", "AI Safety", "Mark Starr"],
  authors: [{ name: "Mark Starr" }],
  openGraph: {
    title: "Mark Starr — Safety Engineer · Systems Thinker · Creator",
    description:
      "CSP, ISO Lead Auditor, EHS professional creating safer workplaces through systems thinking and technology.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Mark Starr — Safety Engineer · Systems Thinker · Creator",
    description:
      "CSP, ISO Lead Auditor, EHS professional creating safer workplaces through systems thinking and technology.",
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
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
