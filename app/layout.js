// app/layout.js

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
// 1. Ganti atau pastikan import Toaster berasal dari sonner
import { Toaster } from "@/components/ui/sonner"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DITA 2025 Dashboard",
  description: "Dashboard Data Metro",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* 2. Komponen Toaster ini sekarang berasal dari Sonner */}
        <Toaster /> 
      </body>
    </html>
  );
}