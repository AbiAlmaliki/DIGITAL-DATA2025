// Lokasi file: app/sto/[stoId]/edit/page.js (Versi Baru dengan Dropdown)

"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from 'next/link';

// PASTIKAN BARIS INI TERSALIN DENGAN BENAR
export default function EditStoPage() {
    const { userData } = useAuth();
    const params = useParams();
    const router = useRouter();
    const { stoId } = params;

    const [stoData, setStoData] = useState(null);
    const [selectedPort, setSelectedPort] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

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

    const oldDescription = useMemo(() => {
        if (!selectedPort || !stoData?.ports_data) return "--- Pilih port untuk melihat deskripsi ---";
        const foundPort = stoData.ports_data.find(p => p.port === selectedPort);
        return foundPort ? foundPort.deskripsi : "Deskripsi tidak ditemukan";
    }, [selectedPort, stoData]);

    const handlePortChange = (e) => {
        setSelectedPort(e.target.value);
        setNewDescription('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPort || !newDescription) {
            alert("Silakan pilih port dan isi deskripsi baru.");
            return;
        }
        setIsUpdating(true);
        
        const newPortsData = stoData.ports_data.map(portData => 
            portData.port === selectedPort ? { ...portData, deskripsi: newDescription } : portData
        );

        const docRef = doc(db, "data_metro", stoId);
        try {
            await updateDoc(docRef, { ports_data: newPortsData });
            alert(`Deskripsi untuk port ${selectedPort} berhasil diperbarui!`);
            setStoData(prev => ({ ...prev, ports_data: newPortsData }));
            setSelectedPort('');
            setNewDescription('');
        } catch (error) {
            console.error("Gagal update:", error);
            alert("Terjadi kesalahan saat memperbarui data.");
        } finally {
            setIsUpdating(false);
        }
    };
    
    if (userData && userData.role !== 'admin') {
        return <div className="p-8 text-center">Anda tidak memiliki akses ke halaman ini.</div>;
    }
    if (loading) {
        return <div className="p-8 text-center">Memuat data...</div>;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Edit Deskripsi Port: {stoData?.nama}</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <div>
                    <label htmlFor="port-select" className="block text-sm font-medium text-gray-700 mb-1">Pilih Port</label>
                    <select
                        id="port-select"
                        value={selectedPort}
                        onChange={handlePortChange}
                        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">-- Pilih salah satu port --</option>
                        {stoData?.ports_data.map((item) => (
                            <option key={item.port} value={item.port}>{item.port}</option>
                        ))}
                    </select>
                </div>

                {selectedPort && (
                    <div className="space-y-4">
                        <div>
                            <p className="block text-sm font-medium text-gray-700">Deskripsi Lama:</p>
                            <p className="mt-1 p-2 bg-gray-100 rounded-md border text-gray-600 min-h-[40px]">{oldDescription}</p>
                        </div>
                        <div>
                            <label htmlFor="new-description" className="block text-sm font-medium text-gray-700">Deskripsi Baru:</label>
                            <textarea
                                id="new-description"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                rows="3"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                placeholder="Ketik deskripsi baru di sini..."
                            />
                        </div>
                    </div>
                )}

                <hr/>

                <div className="flex justify-between items-center">
                    <Link href={`/sto/${stoId}/view`}>
                        <button type="button" className="text-blue-600 hover:underline">
                            &larr; Lihat Data
                        </button>
                    </Link>
                    <button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
                        disabled={isUpdating || !selectedPort}
                    >
                        {isUpdating ? 'Menyimpan...' : 'Update Deskripsi'}
                    </button>
                </div>
            </form>
        </div>
    );
}