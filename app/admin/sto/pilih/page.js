// Lokasi: app/admin/sto/pilih/page.js

"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SelectStoToManagePage() {
    const { userData } = useAuth();
    const [stos, setStos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "data_metro"));
                const stoList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setStos(stoList);
            } catch (error) {
                console.error("Gagal mengambil data STO:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStos();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (userData?.role !== 'admin') return <div className="p-8 text-center">Anda tidak memiliki izin.</div>;

    return (
        <main className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
                Pilih STO untuk Dikelola
            </h1>
            <p className="text-gray-600 mb-6">Pilih salah satu STO di bawah ini untuk menambah atau menghapus data port.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stos.length > 0 ? (
                    stos.map((sto) => (
                        // Link ini akan mengarahkan ke halaman edit yang sudah kita upgrade
                        <Link key={sto.id} href={`/sto/${sto.id}/edit`}>
                            <div className="bg-white p-6 border rounded-lg hover:bg-gray-50 hover:shadow-lg transition-all cursor-pointer text-center">
                                <p className="font-bold text-lg text-gray-700">{sto.nama}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-gray-500">Tidak ada data STO yang ditemukan.</p>
                )}
            </div>
             <div className="text-center mt-12">
                <Link href="/admin/sto">
                    <button className="text-blue-600 hover:text-blue-800 hover:underline">
                        &larr; Kembali ke Menu Pengelolaan
                    </button>
                </Link>
            </div>
        </main>
    );
}
