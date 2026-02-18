import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "./globals.css";
import "../styles/toast.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { CartDrawer } from "@/components/cart";
import { ProfileDrawer } from "@/components/profile";
import { Toast } from "@/components/ui";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico"
});

const estedad = localFont({
  src: [
    {
      path: "../assets/fonts/Estedad-FD-Thin.woff2",
      weight: "100",
      style: "normal"
    },
    {
      path: "../assets/fonts/Estedad-FD-Regular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "../assets/fonts/Estedad-FD-Bold.woff2",
      weight: "700",
      style: "normal"
    }
  ],
  variable: "--font-estedad",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"]
});

const maneli = localFont({
  src: [
    {
      path: "../assets/fonts/Maneli.ttf",
      weight: "400",
      style: "normal"
    }
  ],
  variable: "--font-maneli",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"]
});

export const metadata = {
  title: "Abra - Premium Custom Clothing",
  description: "Premium custom clothing with professional printing quality."
};

export default async function RootLayout({ children }) {
  const messages = await getMessages();

  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} ${estedad.variable} ${maneli.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AuthProvider>
              <ProfileProvider>
                <CartProvider>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="grow bg-white">{children}</main>
                    <Footer />
                  </div>
                  <CartDrawer />
                  <ProfileDrawer />
                  <Toast />
                </CartProvider>
              </ProfileProvider>
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
