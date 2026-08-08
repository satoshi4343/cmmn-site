import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Navbar from "./components/Navbar";
import SaleBanner from "./components/SaleBanner";
import { CurrencyProvider, type Country } from "./context/CurrencyContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CMMN.",
  description: "Designed for perspective.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const rawCountry = cookieStore.get("cmmn_country")?.value ?? "JP";
  const initialCountry: Country = rawCountry === "US" ? "US" : "JP";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ overflowX: "hidden", maxWidth: "100vw" }}>
        <CurrencyProvider initialCountry={initialCountry}>
          <SaleBanner />
          <Navbar />
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
