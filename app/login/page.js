// Lokasi: app/login/page.js (Versi Final & Strikt)

"use client";

import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Cek apakah user sudah ada di sistem kita, baik via UID maupun Email
      const usersRef = collection(db, "users");
      const qByUid = query(usersRef, where("uid", "==", user.uid));
      const uidSnapshot = await getDocs(qByUid);
      let userDocSnap = uidSnapshot.docs[0];

      if (!userDocSnap) {
          const qByEmail = query(usersRef, where("email", "==", user.email));
          const emailSnapshot = await getDocs(qByEmail);
          if (!emailSnapshot.empty) {
              userDocSnap = emailSnapshot.docs[0];
              // Jika ditemukan via email (pra-registrasi), update datanya dengan UID
              await updateDoc(userDocSnap.ref, { 
                  uid: user.uid,
                  name: user.displayName 
              });
          }
      }

      // Final Check: Apakah user pada akhirnya ditemukan?
      if (userDocSnap) {
        // JIKA DITEMUKAN: Izinkan login
        router.push("/");
      } else {
        // JIKA TIDAK DITEMUKAN: Tolak login, tampilkan pesan, dan paksa logout
        alert("Login gagal. Akun Anda tidak terdaftar di sistem. Silakan hubungi admin.");
        await signOut(auth);
      }

    } catch (error) {
      console.error("Error selama Google login:", error);
      alert("Terjadi kesalahan saat login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">DITA 2025</h1>
        <p className="mb-6">Silakan login untuk melanjutkan</p>
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-5 h-5 mr-2" />
          Login dengan Google
        </button>
      </div>
    </div>
  );
}