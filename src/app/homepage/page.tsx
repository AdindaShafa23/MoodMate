"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const [userData, setUserData] = useState<{
        name: string;
        childProfiles: { id: number; name: string; avatar: number }[];
    } | null>(null);
    const [error, setError] = useState("");

    // Cek autentikasi dan ambil data pengguna
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/user-profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.error || "Gagal mengambil data pengguna"
                    );
                }
                setUserData(data.user);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Terjadi kesalahan saat mengambil data pengguna");
                }
            }
        };

        fetchUserData();
    }, [router]);

    const menu = [
        { emoji: "😊", label: "Mood", path: "/mood" },
        { emoji: "📊", label: "Statistik", path: "/stats" },
        { emoji: "💆🏻", label: "Coping", path: "/coping" },
        { emoji: "🚨", label: "Bantuan", path: "/help" },
    ];

    return (
        <div className="relative flex flex-col min-h-screen items-center justify-center bg-white">
            {/* Avatar pojok kanan atas */}
            <Link href="/profil">
                <div className="absolute top-6 right-6 flex flex-col items-center cursor-pointer">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl">
                            {userData?.childProfiles?.[0]?.avatar ? `👦` : "👩🏻"}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                        {userData?.name || "Profil"}
                    </span>
                </div>
            </Link>

            {/* Awan kiri atas */}
            <div className="absolute -top-64 -left-48">
                <Image
                    src="/images/Star-7.png"
                    alt="cloud"
                    width={600}
                    height={600}
                    className="object-contain"
                />
            </div>

            {/* Awan kanan bawah */}
            <div className="absolute -bottom-36 -right-32">
                <Image
                    src="/images/Star-7.png"
                    alt="cloud"
                    width={600}
                    height={600}
                    className="object-contain"
                />
            </div>

            {/* Judul */}
            <h1 className="text-5xl font-bold text-blue-700 mb-10">MoodMate</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Menu */}
            <div className="flex flex-col items-center gap-8">
                {/* Baris 1: 3 item */}
                <div className="flex gap-16">
                    {menu.slice(0, 2).map((item, index) => (
                        <div
                            key={index}
                            onClick={() => router.push(item.path)}
                            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                        >
                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center shadow-md mb-2">
                                <span className="text-6xl">{item.emoji}</span>
                            </div>
                            <span className="text-base font-medium text-gray-800">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Baris 2: Sisa item */}
                <div className="flex gap-16">
                    {menu.slice(2, 4).map((item, index) => (
                        <div
                            key={index}
                            onClick={() => router.push(item.path)}
                            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                        >
                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center shadow-md mb-2">
                                <span className="text-6xl">{item.emoji}</span>
                            </div>
                            <span className="text-base font-medium text-gray-800">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
