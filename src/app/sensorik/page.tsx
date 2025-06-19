
"use client";

import { Navbar } from "@/components/Navbar";

export default function SensorikPage() {
  return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-10 text-center">
              <h1 className="text-3xl font-bold text-purple-700 mb-6">
                  Istirahat Sensorik
              </h1>
              <p className="mb-6 text-gray-700 max-w-xl mx-auto">
                  Arahkan perhatianmu pada inderamu. Matikan notifikasi.
                  Perhatikan suara, tekstur benda, atau aroma di sekitarmu.
                  Nikmati sesaat istirahat ini.
              </p>
              <iframe
                  width={300}
                  height={300}
                  className="mx-auto mb-4"
                  src="https://www.youtube.com/embed/SCWtZihkAE8?si=EMLzJyUC3bsU3Z6m"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
              ></iframe>
              <p className="text-gray-500">
                  Coba pejamkan mata selama 1 menit dan fokus pada napasmu...
              </p>
          </main>
      </div>
  );
}