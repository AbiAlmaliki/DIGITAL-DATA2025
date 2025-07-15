// Lokasi: functions/index.js

// 1. Impor "perkakas" yang kita butuhkan dari Firebase
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentWritten} = require("firebase-functions/v2/firestore");

const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

// 2. Inisialisasi Firebase Admin SDK
// Ini memberikan Cloud Function kita akses ke layanan Firebase lain seperti Firestore
admin.initializeApp();


// ========================================================================
// === INI FUNGSI "ASISTEN" YANG AKAN DIPANGGIL OLEH ESP32 ANDA ===
// ========================================================================
// Kita beri nama fungsinya 'checkCommand'
exports.checkCommand = onRequest(
  // Menambahkan pengaturan CORS agar bisa dipanggil dari mana saja
  {cors: true},
  async (req, res) => {
    // Tulis log ke console Firebase Functions untuk debugging
    logger.info("Fungsi checkCommand dipanggil!", {structuredData: true});

    try {
      // Tentukan path ke dokumen perintah kita di Firestore
      const docRef = admin.firestore()
          .collection("perintah_iot")
          .doc("kamera_metro_1");

      // Ambil data dari dokumen tersebut
      const docSnap = await docRef.get();

      // Periksa apakah dokumennya ada dan field 'ambil_foto' bernilai true
      if (docSnap.exists && docSnap.data().ambil_foto === true) {
        // Jika ya, kirim jawaban "ambil_foto"
        logger.info("Perintah 'ambil_foto' ditemukan, mengirim respons positif.");
        res.json({perintah: "ambil_foto"});
      } else {
        // Jika tidak, kirim jawaban "tunggu"
        logger.info("Tidak ada perintah, mengirim respons tunggu.");
        res.json({perintah: "tunggu"});
      }
    } catch (error) {
      // Jika terjadi error saat membaca database
      logger.error("Error saat mengakses Firestore:", error);
      res.status(500).json({perintah: "error", detail: error.message});
    }
  },
);