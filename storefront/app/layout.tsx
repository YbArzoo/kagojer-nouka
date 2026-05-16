import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kagojer Nouka | Aesthetic Stationery Store",
  description: "Handpicked kawaii stationery treasures from China to Bangladesh.",
};

// --- GLOBAL NAV FETCH ---
async function getNavigationData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/navigation`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Nav Fetch Error:", error);
    return [];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Fetch the data globally!
  const categories = await getNavigationData();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#fffafb] antialiased`}>
        {/* 2. Actually pass the data to your beautiful Navbar! */}
        <Navbar categories={categories} />
        {children}
        <Footer />
      </body>
    </html>
  );
}