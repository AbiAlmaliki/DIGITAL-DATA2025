// Lokasi: app/sto/[stoId]/edit/page.js (Versi dengan Fitur Update)

"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EditStoPage() {
    const { userData } = useAuth();
    const params = useParams();
    const router = useRouter();
    const { stoId } = params;

    const [stoData, setStoData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // State untuk form tambah port baru
    const [newPort, setNewPort] = useState('');
    const [newDeskripsi, setNewDeskripsi] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // --- REVISI: State untuk mengelola mode edit ---
    const [editingPort, setEditingPort] = useState(null); // Menyimpan objek port yang sedang diedit
    const [editedDeskripsi, setEditedDeskripsi] = useState(''); // Menyimpan deskripsi baru saat diedit

    // Mengambil data STO saat halaman dimuat
    useEffect(() => {
        if (stoId) {
            const fetchStoData = async () => {
                const docRef = doc(db, "data_metro", stoId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    // Mengurutkan ports_data berdasarkan nama port
                    const data = docSnap.data();
                    if (data.ports_data) {
                        data.ports_data.sort((a, b) => a.port.localeCompare(b.port, undefined, {numeric: true}));
                    }
                    setStoData({ id: docSnap.id, ...data });
                }
                setLoading(false);
            };
            fetchStoData();
        }
    }, [stoId]);
    
    // Fungsi untuk menambah port baru
    const handleAddPort = async (e) => {
        e.preventDefault();
        if (!newPort || !newDeskripsi) {
            toast.warning("Input Tidak Lengkap", { description: "Mohon isi Port dan Deskripsi." });
            return;
        }
        setIsAdding(true);
        const docRef = doc(db, "data_metro", stoId);
        const newPortObject = { port: newPort, deskripsi: newDeskripsi };

        try {
            await updateDoc(docRef, {
                ports_data: arrayUnion(newPortObject)
            });
            
            const updatedPorts = [...stoData.ports_data, newPortObject].sort((a, b) => a.port.localeCompare(b.port, undefined, {numeric: true}));

            setStoData(prev => ({ ...prev, ports_data: updatedPorts }));
            toast.success("Sukses!", { description: "Port baru berhasil ditambahkan." });
            setNewPort('');
            setNewDeskripsi('');
        } catch (error) {
            console.error("Gagal menambah port: ", error);
            toast.error("Gagal", { description: "Terjadi kesalahan saat menambah port." });
        } finally {
            setIsAdding(false);
        }
    };

    // Fungsi untuk menghapus port
    const handleDeletePort = async (portObject) => {
        if (!confirm(`Anda yakin ingin menghapus port ${portObject.port}?`)) return;
        const docRef = doc(db, "data_metro", stoId);
        try {
            await updateDoc(docRef, {
                ports_data: arrayRemove(portObject)
            });
            setStoData(prev => ({
                ...prev,
                ports_data: prev.ports_data.filter(p => p.port !== portObject.port)
            }));
            toast.success("Sukses!", { description: `Port ${portObject.port} berhasil dihapus.` });
        } catch (error) {
            console.error("Gagal menghapus port: ", error);
            toast.error("Gagal", { description: "Terjadi kesalahan saat menghapus port." });
        }
    };

    // --- FUNGSI BARU UNTUK UPDATE ---
    const handleBeginEdit = (portObject) => {
        setEditingPort(portObject);
        setEditedDeskripsi(portObject.deskripsi);
    };

    const handleCancelEdit = () => {
        setEditingPort(null);
        setEditedDeskripsi('');
    };

    const handleUpdatePort = async () => {
        if (!editedDeskripsi) {
            toast.warning("Deskripsi tidak boleh kosong.");
            return;
        }

        const docRef = doc(db, "data_metro", stoId);
        const oldPortObject = editingPort;
        const newPortObject = { ...editingPort, deskripsi: editedDeskripsi };

        try {
            // Hapus objek lama dan tambahkan objek baru untuk update
            await updateDoc(docRef, { ports_data: arrayRemove(oldPortObject) });
            await updateDoc(docRef, { ports_data: arrayUnion(newPortObject) });

            const updatedPorts = stoData.ports_data.map(p => p.port === oldPortObject.port ? newPortObject : p).sort((a,b) => a.port.localeCompare(b.port, undefined, {numeric: true}));

            setStoData(prev => ({ ...prev, ports_data: updatedPorts }));
            toast.success("Sukses!", { description: `Deskripsi port ${oldPortObject.port} berhasil diperbarui.` });
            handleCancelEdit();
        } catch (error) {
            console.error("Gagal memperbarui port: ", error);
            toast.error("Gagal", { description: "Terjadi kesalahan saat memperbarui port." });
        }
    };
    // --- AKHIR FUNGSI BARU ---

    if (loading) return <LoadingSpinner />;
    if (!stoData) return <div className="p-8 text-center">Data STO tidak ditemukan.</div>;
    if (userData?.role !== 'admin') return <div className="p-8 text-center">Anda tidak memiliki izin.</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Edit Data Metro: {stoData.nama}</h1>

            {/* Form untuk menambah port baru */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Tambah Port Baru</h2>
                <form onSubmit={handleAddPort} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="port" className="block text-sm font-medium text-gray-700">Port (format x/x/x)</label>
                        <input type="text" id="port" value={newPort} onChange={e => setNewPort(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <input type="text" id="deskripsi" value={newDeskripsi} onChange={e => setNewDeskripsi(e.target.value)} className="mt-1 block w-full p-2 border rounded-md"/>
                    </div>
                    <div className="md:col-start-3">
                        <button type="submit" disabled={isAdding} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
                            {isAdding ? 'Menambahkan...' : '+ Tambah Port'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabel berisi daftar port yang sudah ada */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left font-semibold">Port</th>
                            <th className="px-6 py-3 text-left font-semibold">Deskripsi</th>
                            <th className="px-6 py-3 text-left font-semibold">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {stoData.ports_data && stoData.ports_data.length > 0 ? (
                            stoData.ports_data.map((p, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 font-mono">{p.port}</td>
                                    <td className="px-6 py-4">
                                        {/* REVISI: Tampilkan input jika dalam mode edit */}
                                        {editingPort && editingPort.port === p.port ? (
                                            <input 
                                                type="text" 
                                                value={editedDeskripsi} 
                                                onChange={(e) => setEditedDeskripsi(e.target.value)}
                                                className="w-full p-1 border rounded-md"
                                            />
                                        ) : (
                                            p.deskripsi
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* REVISI: Tampilkan tombol Simpan/Batal atau Edit/Hapus */}
                                        {editingPort && editingPort.port === p.port ? (
                                            <div className="flex space-x-2">
                                                <button onClick={handleUpdatePort} className="text-green-600 hover:text-green-800 font-semibold">Simpan</button>
                                                <button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-800 font-semibold">Batal</button>
                                            </div>
                                        ) : (
                                            <div className="flex space-x-4">
                                                <button onClick={() => handleBeginEdit(p)} className="text-blue-600 hover:text-blue-800 font-semibold">Edit</button>
                                                <button onClick={() => handleDeletePort(p)} className="text-red-500 hover:text-red-700 font-semibold">Hapus</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-10 text-gray-500">
                                    Belum ada data port untuk STO ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="text-center mt-8">
                <Link href={`/sto/${stoId}`}><button className="text-blue-600 hover:underline">&larr; Kembali ke Opsi STO</button></Link>
            </div>
        </div>
    );
}
