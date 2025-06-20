"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
    const [autism, setAutism] = useState(false);
    const [adhd, setAdhd] = useState(false);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const router = useRouter();

    // ✅ Ambil data dari localStorage di client side
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem("token");
            if (!storedToken) {
                router.push("/");
                return;
            }

            setToken(storedToken);

            const userString = localStorage.getItem("user");
            if (userString) {
                try {
                    const parsedUser = JSON.parse(userString);
                    if (parsedUser?.id) {
                        setUserId(parsedUser.id);
                    } else {
                        setError("Data user tidak valid");
                    }
                } catch {
                    setError("Gagal membaca user dari localStorage");
                }
            }
        }
    }, [router]);

    // ✅ Handler Submit
    const handleSubmit = async () => {
        setError("");

        if (!name || !age || selectedAvatar === null || !userId || !token) {
            setError("Nama, usia, avatar, dan token/userId wajib diisi");
            return;
        }

        const parsedAge = parseInt(age, 10);
        if (isNaN(parsedAge) || parsedAge < 0) {
            setError("Usia harus berupa angka yang valid");
            return;
        }

        try {
            const response = await fetch("/api/child-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    age: parsedAge,
                    avatar: selectedAvatar,
                    autism,
                    adhd,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Gagal menyimpan profil anak");
                return;
            }

            const childProfileId = data.childProfileId;
            if (childProfileId) {
                localStorage.setItem("childProfileId", childProfileId.toString());
                router.push("/preferensisensorik");
            } else {
                setError("ID profil anak tidak ditemukan");
            }
        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan saat menyimpan profil anak");
        }
    };

    // (Kode render form tetap sama)
}


    return (
        <div className="min-h-screen flex">
            <div className="w-1/2 bg-blue-200 flex flex-col justify-center items-center text-center px-8">
                <div className="bg-white rounded-full w-40 h-40 flex items-center justify-center shadow-md">
                    <span className="text-6xl">😊</span>
                </div>
                <h1 className="text-5xl font-bold text-blue-800 mt-6">
                    MoodMate
                </h1>
                <p className="text-xl text-white mt-2">
                    Teman untuk mengenal emosimu
                </p>
            </div>

            <div className="w-1/2 bg-white flex flex-col justify-center px-16">
                <h2 className="text-4xl font-bold text-blue-800 mb-8">
                    Daftar
                </h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="flex gap-4 mb-6">
                    {roles.map((role) => (
                        <button
                            key={role.label}
                            onClick={() => setSelectedRole(role.label)}
                            className={`flex flex-col items-center px-6 py-3 rounded-full border transition ${
                                selectedRole === role.label
                                    ? "bg-blue-100 border-blue-600 text-blue-800 font-semibold"
                                    : "bg-gray-100 border-transparent text-gray-600"
                            }`}
                        >
                            <span className="text-2xl">{role.icon}</span>
                            <span className="text-sm mt-1">{role.label}</span>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Nama Lengkap"
                            className="w-full border rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder={`Email ${
                                selectedRole === "Orang Tua"
                                    ? "Orang Tua / Pengasuh"
                                    : selectedRole
                            }`}
                            className="w-full border rounded-md px-4 py-2 focus:outline-none text-black focus:ring-2 focus:ring-blue-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-800 text-base tracking-wide">
                            Kata Sandi <span className="text-red-500">*</span>
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Kata Sandi"
                                className="w-full border border-gray-400 rounded-md px-4 py-2 pr-10 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Minimal 8 karakter
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition font-semibold"
                    >
                        Daftar
                    </button>
                </form>
            </div>
        </div>
    );
}
