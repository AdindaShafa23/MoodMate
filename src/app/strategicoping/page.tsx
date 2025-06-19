"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StrategiCoping() {
    const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
    const [error, setError] = useState("");
    const router = useRouter();

    // Cek autentikasi saat komponen dimuat
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
        }
    }, [router]);

    const toggleStrategy = (strategy: string) => {
        setSelectedStrategies((prev) =>
            prev.includes(strategy)
                ? prev.filter((s) => s !== strategy)
                : [...prev, strategy]
        );
    };

    const strategies = [
        {
            id: "pernapasan-dalam",
            title: "Pernapasan Dalam",
            description: "Latihan pernapasan untuk menenangkan",
            icon: "🧘",
            bgColor: "bg-purple-100",
        },
        {
            id: "mendengarkan-musik",
            title: "Mendengarkan Musik",
            description: "Lagu favorite atau suara alam",
            icon: "🎧",
            bgColor: "bg-purple-100",
        },
        {
            id: "aktivitas-berulang",
            title: "Aktivitas Berulang",
            description: "Kegiatan yang menyenangkan",
            icon: "🧩",
            bgColor: "bg-green-100",
        },
    ];

    const handleSubmit = async () => {
        setError("");

        // Validasi sisi klien
        if (selectedStrategies.length === 0) {
            setError("Pilih setidaknya satu strategi coping");
            return;
        }

        const childProfileId = localStorage.getItem("childProfileId");
        if (!childProfileId) {
            setError("Profil anak tidak ditemukan");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/coping-strategy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    strategies: selectedStrategies,
                    childProfileId: parseInt(childProfileId, 10),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Gagal menyimpan strategi coping");
                return;
            }

            router.push("/selamatdatang");
        } catch (err) {
            setError("Terjadi kesalahan saat menyimpan strategi coping");
        }
    };

    return (
        <div className="h-screen bg-gradient-to-r from-blue-300 to-blue-100">
            <div className="flex h-full">
                <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-300 to-blue-100">
                    <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-8">
                        <span className="text-8xl">😊</span>
                    </div>
                    <h1 className="text-6xl font-bold text-blue-800 mb-4">
                        MoodMate
                    </h1>
                    <p className="text-white text-xl">
                        Teman untuk mengenal emosimu
                    </p>
                </div>

                <div className="w-1/2 bg-white p-8 flex flex-col justify-between h-full">
                    <div>
                        <div className="mb-8">
                            <div className="flex space-x-2">
                                <div className="flex-1 h-2 bg-blue-600 rounded"></div>
                                <div className="flex-1 h-2 bg-blue-600 rounded"></div>
                                <div className="flex-1 h-2 bg-blue-600 rounded"></div>
                            </div>
                        </div>

                        <h2 className="text-4xl font-bold text-blue-800 mb-4">
                            Strategi Coping
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Pilih strategi yang bisa digunakan anak saat merasa
                            tidak nyaman
                        </p>
                        {error && <p className="text-red-500 mb-4">{error}</p>}

                        <div className="space-y-4 mb-8">
                            {strategies.map((strategy) => (
                                <div
                                    key={strategy.id}
                                    className={`cursor-pointer border rounded-lg transition-all ${
                                        selectedStrategies.includes(strategy.id)
                                            ? "bg-blue-50 border-blue-500 border-2"
                                            : "hover:bg-gray-50 border-gray-200"
                                    }`}
                                    onClick={() => toggleStrategy(strategy.id)}
                                >
                                    <div className="p-6 flex items-center space-x-4">
                                        <div
                                            className={`w-16 h-16 ${strategy.bgColor} rounded-full flex items-center justify-center`}
                                        >
                                            <span className="text-2xl">
                                                {strategy.icon}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                {strategy.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {strategy.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-auto">
                        <button
                            onClick={() => router.push("/pemicumood")}
                            className="flex-1 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
                        >
                            Kembali
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                        >
                            Selesai
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
