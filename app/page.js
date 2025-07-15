// app/page.js (Versi Bersih)

"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  const [stos, setStos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stoQuerySnapshot = await getDocs(collection(db, "data_metro"));
        const stoList = stoQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStos(stoList);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Daftar STO
      </h1>
      <p className="text-gray-600 mb-6">Silakan pilih STO di bawah ini untuk melihat detailnya.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stos.length > 0 ? (
          stos.map((sto) => (
            <Link key={sto.id} href={`/sto/${sto.id}`}>
              <div className="bg-white p-6 border rounded-lg hover:bg-gray-50 hover:shadow-lg transition-all cursor-pointer text-center">
                <p className="font-bold text-lg text-gray-700">{sto.nama}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">Tidak ada data STO yang ditemukan.</p>
        )}
      </div>
    </main>
  );
}