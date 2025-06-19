"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PemicuMood() {
    const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
    const [error, setError] = useState("");
    const router = useRouter();

    // Cek autentikasi saat komponen dimuat
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
        }
    }, [router]);

    const toggleTrigger = (trigger: string) => {
        setSelectedTriggers((prev) =>
            prev.includes(trigger)
                ? prev.filter((t) => t !== trigger)
                : [...prev, trigger]
        );
    };

    const triggers = [
        {
            id: "perubahan-rutinitas",
            title: "Perubahan Rutinitas",
            description: "Ketika jadwal berubah tiba-tiba",
            emoji: "😟",
            bgColor: "bg-red-100",
        },
        {
            id: "lingkungan-ramai",
            title: "LingkObligasi Ramai",
            description: "Tempat dengan banyak orang",
            emoji: "😰",
            bgColor: "bg-yellow-100",
        },
        {
            id: "aktivitas-favorite",
            title: "Aktivitas Favorite",
            description: "Saat melakukan kegiatan yang disukai",
            emoji: "😊",
            bgColor: "bg-green-100",
        },
    ];

    const handleSubmit = async () => {
        setError("");

        // Validasi sisi klien
        if (selectedTriggers.length === 0) {
            setError("Pilih setidaknya satu pemicu mood");
            return;
        }

        const childProfileId = localStorage.getItem("childProfileId");
        if (!childProfileId) {
            setError("Profil anak tidak ditemukan");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/mood-trigger", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    triggers: selectedTriggers,
                    childProfileId: parseInt(childProfileId, 10),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Gagal menyimpan pemicu mood");
                return;
            }

            router.push("/strategicoping");
        } catch (err) {
            setError("Terjadi kesalahan saat menyimpan pemicu mood");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-300 to-blue-100">
            <div className="flex">
                <div className="w-1/2 flex flex-col items-center justify-center p-8">
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

                <div className="w-1/2 bg-white p-8 flex flex-col justify-between min-h-screen">
                    <div className="mb-8">
                        <div className="flex space-x-2">
                            <div className="flex-1 h-2 bg-blue-600 rounded"></div>
                            <div className="flex-1 h-2 bg-blue-600 rounded"></div>
                            <div className="flex-1 h-2 bg-gray-300 rounded"></div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h2 className="text-4xl font-bold text-blue-800 mb-4">
                            Pemicu Mood
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Pilih situasi yang biasanya mempengaruhi mood anak
                        </p>
                        {error && <p className="text-red-500 mb-4">{error}</p>}

                        <div className="space-y-4 mb-8">
                            {triggers.map((trigger) => (
                                <div
                                    key={trigger.id}
                                    onClick={() => toggleTrigger(trigger.id)}
                                    className={`cursor-pointer p-6 border rounded-lg flex items-center space-x-4 transition-all ${
                                        selectedTriggers.includes(trigger.id)
                                            ? "bg-blue-50 border-blue-500"
                                            : "hover:bg-gray-50 border-gray-200"
                                    }`}
                                >
                                    <div
                                        className={`w-16 h-16 ${trigger.bgColor} rounded-full flex items-center justify-center`}
                                    >
                                        <span className="text-2xl">
                                            {trigger.emoji}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                                            {trigger.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {trigger.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={() => router.push("/preferensisensorik")}
                            className="flex-1 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                        >
                            Kembali
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Selanjutnya
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
