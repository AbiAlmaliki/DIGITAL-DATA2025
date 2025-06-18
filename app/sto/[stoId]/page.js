// Lokasi file: app/sto/[stoId]/page.js

"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useParams } from "next/navigation";

// PASTIKAN ADA "export default" DI SINI
export default function StoDetailPage() {
  const { userData } = useAuth();
  const params = useParams();
  const { stoId } = params;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold capitalize mb-6 text-gray-800">
          Opsi untuk STO: {stoId.replace('-', ' ')}
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          {(userData?.role === "admin" || userData?.role === "user") && (
            <Link href={`/sto/${stoId}/view`} className="w-full">
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded w-full transition-colors">
                VIEW DATA METRO
              </button>
            </Link>
          )}
          {userData?.role === "admin" && (
            <Link href={`/sto/${stoId}/edit`} className="w-full">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded w-full transition-colors">
                EDIT DATA METRO
              </button>
            </Link>
          )}
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link href="/"><button className="text-blue-600 hover:text-blue-800 hover:underline">&larr; Kembali ke Daftar STO</button></Link>
      </div>
    </div>
  );
}