import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/providers/cart-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FDFBF7',
};

export const metadata: Metadata = {
  title: "Jagannath Publications — Books of Sri Srimad Gour Govinda Swami Maharaj",
  description:
    "Discover the spiritual wisdom of Sri Srimad Gour Govinda Swami Maharaj through his transcendental books. Jagannath Publications.",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Jagannath Publications',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfairDisplay.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
