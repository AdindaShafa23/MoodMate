"use client";

import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CopingPage() {
    const [scale, setScale] = useState(1);
    const router = useRouter();
    const audioRef = useRef<HTMLAudioElement>(null);

    // Animasi skala untuk Latihan Pernapasan
    useEffect(() => {
        const interval = setInterval(() => {
            setScale((prev) => (prev === 1 ? 1.5 : 1));
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Fungsi untuk memutar suara
    const playNatureSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // Reset ke awal
            audioRef.current.play().catch((error) => {
                console.error("Gagal memutar suara alam:", error);
            });
        }
    };

    const copingItems = [
        {
            emoji: null,
            label: "Latihan Pernapasan",
            type: "circle",
            onClick: () => {}, // Kosong seperti aslinya
        },
        {
            emoji: "🌊",
            label: "Suara Alam",
            onClick: playNatureSound, // Memutar suara alam
        },
        {
            emoji: "🧘‍♂️",
            label: "Istirahat Sensorik",
            onClick: () => router.push("/sensorik"), // Tidak berubah
        },
        {
            emoji: "📝",
            label: "Ekspresikan Perasaanmu",
            onClick: () => router.push("/ekspresikan"), // Tidak berubah
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 relative overflow-hidden">
            <Navbar />

            <main className="flex-grow p-8">
                <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
                    Panduan Coping
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
                    {copingItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white text-black text-center py-6 rounded-xl shadow-md text-base font-medium flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition"
                            onClick={item.onClick}
                        >
                            {item.type === "circle" ? (
                                <div
                                    className="w-12 h-12 rounded-full bg-blue-300 mb-3 transition-transform duration-[4000ms]"
                                    style={{ transform: `scale(${scale})` }}
                                />
                            ) : (
                                <div className="text-3xl mb-2">
                                    {item.emoji}
                                </div>
                            )}
                            {item.label}
                        </div>
                    ))}
                </div>

                {/* Elemen Audio */}
                <audio ref={audioRef} src="/sounds/ombak_laut.mp3" preload="none" />
            </main>

            <div className="absolute -bottom-16 -left-16 z-10">
                <Image
                    alt="star"
                    src="/images/Star-1.png"
                    width={400}
                    height={400}
                    className="object-contain"
                />
            </div>
        </div>
    );
}
