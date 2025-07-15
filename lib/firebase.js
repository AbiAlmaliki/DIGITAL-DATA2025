// lib/firebase.js

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Pastikan storage juga diimpor jika Anda menggunakannya
import { getDatabase } from "firebase/database"; // <-- IMPORT BARU untuk Realtime Database

// Konfigurasi Firebase Anda yang lengkap
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // --- BARIS BARU DITAMBAHKAN DI SINI ---
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, 
};

// Inisialisasi Firebase App
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Inisialisasi semua layanan yang kita butuhkan
const auth = getAuth(app);        // Untuk Autentikasi
const db = getFirestore(app);     // Untuk Firestore Database (data metro, users)
const storage = getStorage(app);  // Untuk Cloud Storage (jika nanti dipakai untuk foto)
const rtdb = getDatabase(app);    // <-- LAYANAN BARU: untuk Realtime Database (saklar kamera)

// Ekspor semua layanan agar bisa digunakan di seluruh aplikasi
export { auth, db, storage, rtdb };
