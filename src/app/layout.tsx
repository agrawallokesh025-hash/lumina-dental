import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import GlobalWrapper from "@/components/GlobalWrapper";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Lumina Dental | World-Class Dentistry",
  description: "World-Class Dentistry Powered By Innovation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${manrope.variable} font-sans antialiased bg-background text-foreground selection:bg-accent/20 selection:text-accent min-h-screen`}>
        <GlobalWrapper>
          <Navigation />
          {children}
          <Footer />
        </GlobalWrapper>
      </body>
    </html>
  );
}
