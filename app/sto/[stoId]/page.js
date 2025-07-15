// Lokasi: app/sto/[stoId]/page.js (Setelah Bagian Monitoring Dihapus)

"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from '@/components/LoadingSpinner';
import { db } from "@/lib/firebase"; 
import { doc, getDoc } from "firebase/firestore";

export default function StoDetailPage() {
  const { userData } = useAuth(); 
  const params = useParams();
  const { stoId } = params;
  
  const [stoData, setStoData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mengambil data detail STO dari Firestore
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

  // Tidak ada lagi fungsi handleTakePhoto

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      {/* Bagian Opsi Data */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold capitalize mb-6 text-gray-800">
          Opsi Data: {stoData?.nama || stoId.replace('-', ' ')}
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={`/sto/${stoId}/view`} className="w-full">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded w-full transition-colors">
              VIEW DATA METRO
            </button>
          </Link>
          {userData?.role === 'admin' && (
            <Link href={`/sto/${stoId}/edit`} className="w-full">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded w-full transition-colors">
                EDIT DATA METRO
              </button>
            </Link>
          )}
        </div>
      </div>
      
      {/* BAGIAN MONITORING RUANG METRO SUDAH DIHAPUS TOTAL DARI SINI */}
      
      {/* Tombol kembali */}
      <div className="text-center">
        <Link href="/">
            <button className="text-blue-600 hover:text-blue-800 hover:underline">
              &larr; Kembali ke Daftar STO
            </button>
        </Link>
      </div>
    </div>
  );
}
