// Lokasi: app/admin/sto/page.js

"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ManageStoHubPage() {
    const { userData } = useAuth();

    // Proteksi halaman, hanya admin yang boleh akses
    if (!userData) return <LoadingSpinner />;
    if (userData.role !== 'admin') {
        return <div className="p-8 text-center">Anda tidak memiliki izin untuk mengakses halaman ini.</div>;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Pengelolaan STO</h1>
            
            {/* REVISI: Menggunakan flexbox dan gap untuk jarak yang pasti */}
            <div className="flex flex-col gap-y-6">
                {/* Opsi 1: Kelola STO yang Sudah Ada */}
                <Link href="/admin/sto/pilih">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                        <h2 className="text-xl font-bold text-gray-800">KELOLA DATA STO</h2>
                        <p className="text-xs text-red-600 mt-1">
                            * menambah atau menghapus port pada STO yang tersedia
                        </p>
                    </div>
                </Link>

                {/* Opsi 2: Buat STO Baru */}
                <Link href="/admin/sto/buat">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                        <h2 className="text-xl font-bold text-gray-800">BUAT DATA STO BARU</h2>
                         <p className="text-xs text-red-600 mt-1">
                            * mendaftarkan STO baru dari awal
                        </p>
                    </div>
                </Link>
            </div>
             <div className="text-center mt-12">
                <Link href="/">
                    <button className="text-blue-600 hover:text-blue-800 hover:underline">
                        &larr; Kembali ke Halaman Utama
                    </button>
                </Link>
            </div>
        </div>
    );
}
