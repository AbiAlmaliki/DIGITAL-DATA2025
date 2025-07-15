

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import mqtt from "mqtt";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";


const MQTT_BROKER_URL = "wss://broker.hivemq.com:8884/mqtt";
const MQTT_TOPIC = "dita/kamera/perintah"; 

export default function MonitoringPage() {
    const { userData } = useAuth();
    const [mqttClient, setMqttClient] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState("Menyambungkan...");
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        // Hubungkan ke MQTT Broker saat halaman dimuat
        const client = mqtt.connect(MQTT_BROKER_URL);

        client.on('connect', () => {
            console.log('Terhubung ke MQTT Broker!');
            setConnectionStatus("Terhubung");
            setMqttClient(client);
        });

        client.on('error', (err) => {
            console.error('Koneksi MQTT Error: ', err);
            setConnectionStatus("Gagal Terhubung");
            client.end();
        });

       
        return () => {
            if (client) {
                client.end();
            }
        };
    }, []);

    const handleTakePhoto = () => {
        if (!mqttClient || !mqttClient.connected) {
            toast.error("Gagal", { description: "Tidak terhubung ke server pemicu." });
            return;
        }

        setIsSending(true);
        const message = "ambil_foto";

        // Kirim (publish) pesan ke topik
        mqttClient.publish(MQTT_TOPIC, message, (err) => {
            setIsSending(false);
            if (err) {
                console.error('Gagal mengirim perintah:', err);
                toast.error("Gagal", { description: "Perintah tidak terkirim." });
            } else {
                console.log('Perintah "ambil_foto" berhasil dikirim!');
                toast.success("Perintah Terkirim!", {
                    description: "ESP32-CAM akan segera merespons."
                });
            }
        });
    };
    
   
    if (!userData) return <LoadingSpinner />;
    if (userData.role !== 'admin') {
      return <div className="p-8 text-center">Hanya admin yang bisa mengakses halaman ini.</div>
    }

    return (
        <div className="p-8 max-w-lg mx-auto">
            <h1 className="text-3xl font-bold text-center mb-2">Pemicu Kamera Jarak Jauh</h1>
            <p className="text-center text-gray-500 mb-6">Status Koneksi: {connectionStatus}</p>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold mb-4">Monitoring Ruang Metro PMU</h2>
                <p className="text-gray-600 mb-6">Tekan tombol di bawah untuk mengambil foto dari kamera di STO Pasir Maung dan mengirimkannya ke channel Telegram.</p>
                <button
                    onClick={handleTakePhoto}
                    disabled={isSending || connectionStatus !== "Terhubung"}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-6 rounded-lg text-lg shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSending ? 'Mengirim...' : 'AMBIL FOTO SEKARANG'}
                </button>
            </div>
            
            <div className="text-center mt-8">
                <Link href="/">
                    <button className="text-blue-600 hover:text-blue-800 hover:underline">
                        &larr; Kembali ke Halaman Utama
                    </button>
                </Link>
            </div>
        </div>
    );
}