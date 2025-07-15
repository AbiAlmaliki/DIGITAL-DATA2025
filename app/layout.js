// app/layout.js

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header"; // <-- 1. IMPORT HEADER

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DITA 2025 Dashboard",
  description: "Dashboard Data Metro",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <AuthProvider>
          <Header /> {/* <-- 2. TAMBAHKAN HEADER DI SINI */}
          {children} {/* children sekarang akan dirender di bawah header */}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}