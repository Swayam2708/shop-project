import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Omar Jewellers OJ | Gen Z Luxury Jewellery",
  description: "Experience modern luxury with Omar Jewellers OJ. Discover champagne gold, pearl white, and blush beige premium collections designed for the contemporary buyer.",
  keywords: ["jewellery", "luxury", "gen z", "gold", "pearls", "bridal collection", "daily wear", "omar jewellers", "oj"],
  openGraph: {
    title: "Omar Jewellers OJ | Gen Z Luxury Jewellery",
    description: "Premium handcrafted jewellery that blends timeless craftsmanship with Gen Z luxury aesthetics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} dark h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-[#dfba73] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
