// lib/firebase.js

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 1. Konfigurasi Firebase dibaca dari file .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 2. Inisialisasi Firebase App
let app;
//    Pengecekan ini penting untuk mencegah inisialisasi berulang saat hot-reload
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Gunakan app yang sudah ada jika sudah diinisialisasi
}

// 3. Buat service Auth dan Firestore dari app yang sudah diinisialisasi
const auth = getAuth(app);
const db = getFirestore(app);

// 4. Lakukan export agar bisa digunakan di file lain
//    Pastikan menggunakan kurung kurawal (named export)
export { auth, db };