"use client";

import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export default function HelpPage() {
    const [scale, setScale] = useState(1);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Animasi skala tombol
    useEffect(() => {
        const interval = setInterval(() => {
            setScale((prev) => (prev === 1 ? 1.2 : 1));
        }, 500); // animasi cepat

        return () => clearInterval(interval);
    }, []);

    // Fungsi untuk memutar suara
    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // Reset ke awal
            audioRef.current.play().catch((error) => {
                console.error("Gagal memutar suara:", error);
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
            <Navbar />

            <main className="flex-grow px-16 py-16 flex flex-col items-center text-center">
                {/* Judul */}
                <h1 className="text-4xl font-bold text-blue-700 mb-10">
                    Tombol Bantuan
                </h1>

                {/* Ikon Sirine - Tombol yang dapat diklik */}
                <button
                    onClick={playSound}
                    className="rounded-full bg-red-200 w-40 h-40 flex items-center justify-center transition-transform duration-300 focus:outline-none cursor-pointer hover:bg-red-300"
                    style={{ transform: `scale(${scale})` }}
                >
                    <div className="text-6xl">🆘</div>
                </button>

                {/* Deskripsi */}
                <p className="mt-10 text-gray-700 text-2xl max-w-prose">
                    Tekan tombol ini jika kamu merasa <i>overwhelmed</i> atau
                    membutuhkan bantuan
                </p>

                {/* Elemen Audio */}
                <audio ref={audioRef} src="/sounds/sos.mp3" preload="auto" />
            </main>

            {/* Dekorasi */}
            <div className="absolute -bottom-24 -left-24 z-0">
                <Image
                    alt="star"
                    src="/images/Star-7.png"
                    width={400}
                    height={400}
                    className="object-contain"
                />
            </div>

            <div className="absolute -top-16 -right-16 z-0">
                <Image
                    alt="star"
                    src="/images/Star-7.png"
                    width={400}
                    height={400}
                    className="object-contain"
                />
            </div>
        </div>
    );
}
