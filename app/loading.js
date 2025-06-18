// Lokasi: app/loading.js

import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  // Komponen ini akan secara otomatis ditampilkan oleh Next.js
  // sebagai fallback saat konten halaman lain sedang disiapkan.
  return <LoadingSpinner />;
}