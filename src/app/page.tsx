"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="flex flex-col items-center space-y-6">
        <div className="bg-blue-200 rounded-full w-40 h-40 flex items-center justify-center">
          <span className="text-6xl">😊</span>
        </div>
        <h1 className="text-4xl font-bold text-blue-800">MoodMate</h1>
        <p className="text-lg text-gray-600">Teman untuk mengenal emosimu</p>

        <button
          onClick={() => router.push("/sign-in")}
          className="w-60 bg-blue-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-800 transition"
        >
          Buat Akun Baru
        </button>

        <button
          onClick={() => router.push("/login")}
          className="w-60 bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-md hover:bg-blue-200 transition"
        >
          Masuk
        </button>
      </div>
    </div>
  );
}
