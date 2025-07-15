// components/DashboardSidebar.js (Setelah Link Monitoring Dihapus)

"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Users, Building } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function DashboardSidebar() {
    const { userData } = useAuth();
    const [summaryData, setSummaryData] = useState({ totalStos: 0, totalUsers: 0, totalAdmins: 0 });
    const [loading, setLoading] = useState(true);

    const fetchSummaryData = async () => {
        setLoading(true);
        try {
            const stoQuerySnapshot = await getDocs(collection(db, "data_metro"));
            const userQuerySnapshot = await getDocs(collection(db, "users"));
            
            const totalStos = stoQuerySnapshot.size;
            const userList = userQuerySnapshot.docs.map(doc => doc.data());
            const totalUsers = userList.length;
            const totalAdmins = userList.filter(user => user.role === 'admin').length;

            setSummaryData({ totalStos, totalUsers, totalAdmins });
        } catch (error) {
            console.error("Gagal mengambil data ringkasan:", error);
        }
        setLoading(false);
    };
    
    return (
        <Sheet onOpenChange={(open) => { if (open) fetchSummaryData(); }}>
            <SheetTrigger asChild>
                <button className="p-2 rounded-md hover:bg-gray-200 transition-colors">
                    <Menu className="h-6 w-6" />
                </button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle className="text-2xl">Dashboard DITA 2025</SheetTitle>
                </SheetHeader>
                
                <div className="py-4 space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Ringkasan Data</h3>
                        <div className="space-y-3">
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                                <p className="font-medium text-gray-700">Total STO</p>
                                <p className="text-2xl font-bold text-blue-600">{loading ? '...' : summaryData.totalStos}</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                                <p className="font-medium text-gray-700">Total Pengguna</p>
                                <p className="text-2xl font-bold text-green-600">{loading ? '...' : summaryData.totalUsers}</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                                <p className="font-medium text-gray-700">Jumlah Admin</p>
                                <p className="text-2xl font-bold text-indigo-600">{loading ? '...' : summaryData.totalAdmins}</p>
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div>
                        <h3 className="font-semibold text-lg mb-3">Menu</h3>
                        <nav className="flex flex-col space-y-1">
                            <Link href="/">
                                <button className="w-full text-left p-3 rounded-md hover:bg-gray-100 transition-colors flex items-center">
                                    <Building className="h-5 w-5 mr-3" /> Halaman Utama
                                </button>
                            </Link>

                            {/* Menu Khusus Admin */}
                            {userData?.role === 'admin' && (
                                <>
                                    {/* LINK MONITORING KAMERA SUDAH DIHAPUS DARI SINI */}
                                    <Link href="/manage-users">
                                        <button className="w-full text-left p-3 rounded-md hover:bg-gray-100 transition-colors flex items-center">
                                            <Users className="h-5 w-5 mr-3" /> Kelola Pengguna
                                        </button>
                                    </Link>
                                    <Link href="/admin/sto">
                                        <button className="w-full text-left p-3 rounded-md hover:bg-gray-100 transition-colors flex items-center">
                                            <Building className="h-5 w-5 mr-3" /> Kelola STO
                                        </button>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
