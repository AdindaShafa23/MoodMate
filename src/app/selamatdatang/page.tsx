"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SelamatDatang() {
    const [error, setError] = useState("");
    const router = useRouter();

    // Cek autentikasi saat komponen dimuat
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
        }
    }, [router]);

    const handleCompleteOnboarding = async () => {
        setError("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/complete-onboarding", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Gagal menyelesaikan onboarding");
                return;
            }

            router.push("/homepage");
        } catch (err) {
            setError("Terjadi kesalahan saat menyelesaikan onboarding");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-8">
            <div className="text-center space-y-8 max-w-md">
                {/* Success Icon */}
                <div className="w-48 h-48 bg-blue-300 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <div className="w-24 h-24 bg-green-500 rounded-2xl flex items-center justify-center">
                        <svg
                            className="w-14 h-14 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                {/* Success Message */}
                <div className="space-y-4">
                    <h1 className="text-5xl font-bold text-blue-800">
                        Selamat Datang!
                    </h1>
                    <p className="text-xl text-gray-600">
                        Profil kamu sudah siap digunakan
                    </p>
                    {error && <p className="text-red-500">{error}</p>}
                </div>

                {/* Action Button */}
                <button
                    onClick={handleCompleteOnboarding}
                    className="w-full max-w-sm py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition duration-200"
                >
                    Mulai Menggunakan MoodMate
                </button>
            </div>
        </div>
    );
}
