"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PreferensiSensorik() {
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
        []
    );
    const [error, setError] = useState("");
    const router = useRouter();

    // Cek autentikasi saat komponen dimuat
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
        }
    }, [router]);

    const togglePreference = (preference: string) => {
        setSelectedPreferences((prev) =>
            prev.includes(preference)
                ? prev.filter((p) => p !== preference)
                : [...prev, preference]
        );
    };

    const preferences = [
        { id: "suara-lembut", label: "Suara Lembut", icon: "🔊" },
        { id: "tanpa-suara", label: "Tanpa Suara", icon: "🔇" },
        { id: "warna-lembut", label: "Warna Lembut", icon: "🎨" },
        { id: "warna-cerah", label: "Warna Cerah", icon: "🌈" },
        { id: "tekstur-halus", label: "Tekstur Halus", icon: "🧸" },
        { id: "tekstur-kasar", label: "Tekstur Kasar", icon: "🪨" },
    ];

    const handleSubmit = async () => {
        setError("");

        // Validasi sisi klien
        if (selectedPreferences.length === 0) {
            setError("Pilih setidaknya satu preferensi");
            return;
        }

        const childProfileId = localStorage.getItem("childProfileId");
        if (!childProfileId) {
            setError("Profil anak tidak ditemukan");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/sensory-preference", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    preferences: selectedPreferences,
                    childProfileId: parseInt(childProfileId, 10),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Gagal menyimpan preferensi sensorik");
                return;
            }

            router.push("/pemicumood");
        } catch (err) {
            setError("Terjadi kesalahan saat menyimpan preferensi sensorik");
        }
    };

    return (
        <div className="h-screen bg-gradient-to-r from-blue-300 to-blue-100">
            <div className="flex h-full">
                {/* Kiri */}
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

                {/* Kanan */}
                <div className="w-1/2 bg-white p-8 flex flex-col justify-between h-full">
                    <div>
                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex space-x-2">
                                <div className="flex-1 h-2 bg-blue-600 rounded"></div>
                                <div className="flex-1 h-2 bg-gray-300 rounded"></div>
                                <div className="flex-1 h-2 bg-gray-300 rounded"></div>
                            </div>
                        </div>

                        <h2 className="text-4xl font-bold text-blue-800 mb-4">
                            Preferensi Sensorik
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Pilih preferensi yang sesuai dengan kebutuhan anak
                        </p>
                        {error && <p className="text-red-500 mb-4">{error}</p>}

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {preferences.map((pref) => (
                                <div
                                    key={pref.id}
                                    onClick={() => togglePreference(pref.id)}
                                    className={`p-6 text-center border rounded-lg cursor-pointer transition-all ${
                                        selectedPreferences.includes(pref.id)
                                            ? "bg-blue-100 border-blue-500"
                                            : "hover:bg-gray-50 border-gray-200"
                                    }`}
                                >
                                    <div className="text-3xl mb-3">
                                        {pref.icon}
                                    </div>
                                    <p className="text-gray-700 font-medium">
                                        {pref.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tombol Navigasi */}
                    <div className="flex space-x-4">
                        <button
                            onClick={() => router.push("/profilanak")}
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
