// components/Header.js
"use client";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import DashboardSidebar from "./DashboardSidebar";

export default function Header() {
    const { user } = useAuth();

    const handleLogout = () => {
        if(confirm("Anda yakin ingin logout?")) {
            signOut(auth);
        }
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Sisi Kiri: Tombol Sidebar */}
                    <div className="flex items-center">
                        <DashboardSidebar />
                        <h1 className="text-xl font-bold ml-4">DITA 2025</h1>
                    </div>
                    
                    {/* Sisi Kanan: Info User & Tombol Logout */}
                    {user && (
                         <div className="flex items-center">
                            <span className="text-sm mr-4">Halo, {user.displayName}</span>
                            <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:text-red-800">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}   