// components/LoadingSpinner.js

import { LoaderCircle } from 'lucide-react';

// Komponen ini tugasnya hanya satu: menampilkan spinner di tengah layar.
export default function LoadingSpinner() {
  return (
    // div ini membuat spinner berada persis di tengah layar
    <div className="flex justify-center items-center h-screen w-full">
        {/* - animate-spin: kelas dari Tailwind CSS untuk membuat ikon berputar. Ajaib!
            - text-blue-600: memberi warna biru pada ikon.
            - h-12 w-12: mengatur ukuran ikon.
        */}
      <LoaderCircle className="animate-spin text-blue-600 h-12 w-12" />
    </div>
  );
}