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
  openGraph: {
    title: "Mark Starr — Safety Engineer · Systems Thinker · Creator",
    description:
      "CSP, ISO Lead Auditor, EHS professional creating safer workplaces through systems thinking and technology.",
    type: "website",
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
