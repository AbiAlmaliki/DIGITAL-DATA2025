// Lokasi: app/sto/[stoId]/view/page.js (dengan Filter Aman)

"use client";

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from 'next/link';

export default function ViewStoPage() {
    const params = useParams();
    const { stoId } = params;
    const [stoData, setStoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(''); 

    useEffect(() => {
        if (stoId) {
            const fetchStoData = async () => {
                const docRef = doc(db, "data_metro", stoId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setStoData(docSnap.data());
                }
                setLoading(false);
            };
            fetchStoData();
        }
    }, [stoId]);

    if (loading) { return <div className="p-8 text-center">Memuat data...</div>; }
    // Tambahkan pengecekan jika stoData atau ports_data tidak ada
    if (!stoData || !stoData.ports_data) { 
        return <div className="p-8 text-center">Data port untuk STO ini tidak ditemukan.</div>; 
    }

    // REVISI: Logika filter yang lebih aman
    const filteredPorts = stoData.ports_data.filter(item => {
        // Pertama, pastikan item.port ada dan bukan string kosong
        if (!item || typeof item.port === 'undefined' || item.port === null) {
            return false; // Jika tidak ada port, jangan tampilkan di hasil filter
        }
        // Jika ada, baru lanjutkan dengan logika filter
        return item.port.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Data Metro: {stoData.nama}</h1>

            <div className="mb-4">
              <input 
                type="text"
                placeholder="Cari port..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full md:w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Port</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Deskripsi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredPorts.length > 0 ? (
                            filteredPorts.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-700">{item.port}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.deskripsi}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center py-10 text-gray-500">
                                    Tidak ada port yang cocok dengan pencarian "{searchQuery}".
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-8">
                <Link href={`/sto/${stoId}`}><button className="text-blue-600 hover:text-blue-800 hover:underline">&larr; Kembali ke Opsi STO</button></Link>
            </div>
        </div>
    );
}