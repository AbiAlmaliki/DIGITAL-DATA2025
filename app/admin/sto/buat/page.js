// Lokasi: app/admin/sto/buat/page.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CreateStoPage() {
    const { userData } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(1); 
    const [stoId, setStoId] = useState('');
    const [stoName, setStoName] = useState('');
    const [ports, setPorts] = useState([]);
    const [currentPort, setCurrentPort] = useState('');
    const [currentDeskripsi, setCurrentDeskripsi] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNextStep = async (e) => {
        e.preventDefault();
        if (!stoId || !stoName) {
            toast.error("Gagal", { description: "ID STO dan Nama STO wajib diisi." });
            return;
        }
        const formattedStoId = stoId.toLowerCase().replace(/\s+/g, '-');
        
        const docRef = doc(db, "data_metro", formattedStoId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            toast.error("Gagal", { description: `STO dengan ID '${formattedStoId}' sudah ada.` });
            return;
        }
        
        setStoId(formattedStoId);
        setStep(2);
    };

    const handleAddPort = () => {
        if (!currentPort || !currentDeskripsi) {
            toast.warning("Input Tidak Lengkap", { description: "Mohon isi Port dan Deskripsi." });
            return;
        }
        setPorts([...ports, { port: currentPort, deskripsi: currentDeskripsi }]);
        setCurrentPort('');
        setCurrentDeskripsi('');
    };

    const handleSaveSto = async () => {
        if (ports.length === 0) {
            if (!confirm("Anda belum menambahkan port sama sekali. Tetap simpan STO ini?")) {
                return;
            }
        }
        
        setIsSubmitting(true);
        const docRef = doc(db, "data_metro", stoId);

        try {
            await setDoc(docRef, {
                nama: stoName,
                memilikiKamera: false,
                ports_data: ports
            });
            toast.success("Sukses!", { description: `STO ${stoName} berhasil ditambahkan.` });
            router.push('/');
        } catch (error) {
            console.error("Gagal menambah STO: ", error);
            toast.error("Gagal", { description: "Terjadi kesalahan saat menyimpan data." });
            setIsSubmitting(false);
        }
    };

    if (!userData) return <LoadingSpinner />;
    if (userData.role !== 'admin') {
        return <div className="p-8 text-center">Anda tidak memiliki izin untuk mengakses halaman ini.</div>;
    }

    if (step === 1) {
        return (
            <div className="p-8 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Buat STO Baru (Tahap 1/2)</h1>
                <form onSubmit={handleNextStep} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <div>
                        <label htmlFor="sto-id" className="block text-sm font-medium text-gray-700">ID STO (unik, huruf kecil, tanpa spasi)</label>
                        <input type="text" id="sto-id" value={stoId} onChange={e => setStoId(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="contoh: cibinong"/>
                    </div>
                    <div>
                        <label htmlFor="sto-name" className="block text-sm font-medium text-gray-700">Nama Lengkap STO</label>
                        <input type="text" id="sto-name" value={stoName} onChange={e => setStoName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="contoh: STO Cibinong"/>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                        <Link href="/admin/sto"><button type="button" className="text-gray-600 hover:underline">&larr; Batal</button></Link>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Selanjutnya &rarr;
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Tambah Data Port untuk {stoName}</h1>
            <p className="text-gray-500 mb-6">(Tahap 2/2)</p>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Input Port Baru</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="port" className="block text-sm font-medium text-gray-700">Port (format x/x/x)</label>
                        <input type="text" id="port" value={currentPort} onChange={e => setCurrentPort(e.target.value)} className="mt-1 block w-full p-2 border rounded-md"/>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <input type="text" id="deskripsi" value={currentDeskripsi} onChange={e => setCurrentDeskripsi(e.target.value)} className="mt-1 block w-full p-2 border rounded-md"/>
                    </div>
                </div>
                <div className="text-right mt-4">
                    <button onClick={handleAddPort} type="button" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        + Tambah Port ke Daftar
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Daftar Port yang Akan Disimpan</h2>
                {ports.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2">
                        {ports.map((p, index) => (
                            <li key={index}><strong>{p.port}:</strong> {p.deskripsi}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Belum ada port yang ditambahkan.</p>
                )}
            </div>

            <div className="flex justify-between items-center pt-8">
                <button onClick={() => setStep(1)} className="text-gray-600 hover:underline">&larr; Kembali</button>
                <button onClick={handleSaveSto} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg disabled:bg-gray-400">
                    {isSubmitting ? 'Menyimpan...' : 'Simpan STO Baru'}
                </button>
            </div>
        </div>
    );
}
