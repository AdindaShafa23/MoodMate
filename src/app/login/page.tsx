"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login gagal");
                return;
            }

            // Simpan token dan data pengguna di localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            router.push("/selamatdatang");
        } catch (err) {
            setError("Terjadi kesalahan saat login");
        }
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/2 bg-blue-200 flex flex-col items-center justify-center text-center px-8">
                <div className="bg-white rounded-full w-40 h-40 flex items-center justify-center mb-6">
                    <span className="text-6xl">😊</span>
                </div>
                <h1 className="text-4xl font-bold text-blue-800">MoodMate</h1>
                <p className="text-lg text-blue-900 mt-2">
                    Teman untuk mengenal emosimu
                </p>
            </div>

            <div className="w-1/2 bg-white flex flex-col justify-center px-12">
                <h2 className="text-3xl font-bold text-blue-900 mb-8">Masuk</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-semibold text-gray-800 text-base tracking-wide">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Email Orang Tua / Pengasuh"
                            className="w-full border border-black-400 rounded-md px-4 py-2 mt-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={() => setRemember(!remember)}
                            className="mr-2 w-4 h-4"
                        />
                        <span className="text-base text-gray-800 tracking-wide">
                            Ingatkan Saya
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
                    >
                        Masuk
                    </button>
                </form>
            </div>
        </div>
    );
}
