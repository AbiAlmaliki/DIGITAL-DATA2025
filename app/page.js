// app/page.js (Versi Final dengan Loading Spinner)

"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingSpinner from '@/components/LoadingSpinner'; // REVISI: Mengimpor komponen spinner

export default function HomePage() {
  const { userData } = useAuth(); 
  const [stos, setStos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Baris debug ini bisa Anda hapus jika sudah tidak diperlukan
  console.log("Mencoba render HomePage. Isi userData saat ini:", userData);

  useEffect(() => {
    const fetchData = async () => {
      // Kita tidak set loading di sini lagi agar tidak berkedip jika data cepat
      try {
        const stoQuerySnapshot = await getDocs(collection(db, "data_metro"));
        const stoList = stoQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStos(stoList);

        const userQuerySnapshot = await getDocs(collection(db, "users"));
        const userList = userQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);

      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalStos = stos.length;
  const totalUsers = users.length;
  const totalAdmins = users.filter(user => user.role === 'admin').length;

  // REVISI: Kondisi loading sekarang memanggil komponen LoadingSpinner
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Selamat Datang di DITA 2025, {userData?.name || "User"}!
      </h1>

      {/* Kontainer untuk tombol aksi */}
      <div className="flex space-x-4 mb-6">
        {/* Tombol Kelola Pengguna - hanya untuk admin */}
        {userData?.role === 'admin' && (
          <Link href="/manage-users">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors">
              Kelola Pengguna
            </button>
          </Link>
        )}
      </div>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-500">Total STO</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{totalStos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-500">Total Pengguna</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-500">Jumlah Admin</h3>
          <p className="text-4xl font-bold text-indigo-600 mt-2">{totalAdmins}</p>
        </div>
      </div>

      {/* Daftar STO */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Pilih STO</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stos.length > 0 ? (
            stos.map((sto) => (
              <Link key={sto.id} href={`/sto/${sto.id}`}>
                <div className="p-4 border rounded-lg hover:bg-gray-100 hover:shadow-lg transition-all cursor-pointer text-center">
                  <p className="font-bold text-lg text-gray-700">{sto.nama}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">Tidak ada data STO yang ditemukan.</p>
          )}
        </div>
      </div>
    </main>
  );
}