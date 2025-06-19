"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EmotionRecord {
    id: string;
    emotion: string;
    detectionType: string;
    childProfileId: string;
    timestamp: number;
    date: string;
}

export default function MoodPage() {
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
    const [hasStartedDetection, setHasStartedDetection] =
        useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});
    const [childProfileId, setChildProfileId] = useState<string | null>(null);
    const [emotionRecords, setEmotionRecords] = useState<EmotionRecord[]>([]);
    const [error, setError] = useState("");
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Pemetaan emoticon ke teks emosi
    const emotionMap: { [key: string]: string } = {
        "😠": "Marah",
        "😊": "Senang",
        "😢": "Sedih",
        "😨": "Kaget",
    };

    // Cek autentikasi dan ambil childProfileId serta riwayat emosi
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
            return;
        }

        const fetchChildProfileAndEmotions = async () => {
            try {
                // Ambil profil anak
                const profileResponse = await fetch("/api/user-profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const profileData = await profileResponse.json();
                if (!profileResponse.ok) {
                    throw new Error(
                        profileData.error || "Gagal mengambil profil anak"
                    );
                }
                if (profileData.childProfiles.length === 0) {
                    setError(
                        "Tidak ada profil anak. Silakan buat profil anak terlebih dahulu."
                    );
                    router.push("/profilanak");
                    return;
                }
                const profileId = profileData.childProfiles[0].id.toString();
                setChildProfileId(profileId);

                // Ambil rekaman emosi
                const emotionResponse = await fetch(
                    `/api/emotion-record?childProfileId=${profileId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const emotionData = await emotionResponse.json();
                if (!emotionResponse.ok) {
                    throw new Error(
                        emotionData.error || "Gagal mengambil rekaman emosi"
                    );
                }
                setEmotionRecords(emotionData);
            } catch (err: any) {
                setError(err.message || "Terjadi kesalahan saat memuat data");
            }
        };

        fetchChildProfileAndEmotions();
    }, [router]);

    // Cleanup stream saat komponen di-unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    // Modal helper
    const openModal = (message: string, confirmAction: () => void) => {
        setModalMessage(message);
        setOnConfirm(() => confirmAction);
        setShowModal(true);
    };

    const startCamera = async () => {
        try {
            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {
                throw new Error("Browser tidak mendukung akses kamera.");
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play().catch((e) => {
                    setError(`Gagal memutar video: ${e.message}`);
                });
            }
        } catch (err: any) {
            setError(
                `Gagal mengakses kamera: ${err.message}. Pastikan izin kamera diizinkan.`
            );
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const handleDetectClick = () => {
        openModal(
            "Kamu yakin ingin mulai deteksi emosi melalui kamera?",
            async () => {
                setHasStartedDetection(true);
                await startCamera();
            }
        );
    };

    const handleStopDetection = () => {
        openModal(
            "Selesai menggunakan kamera dan simpan deteksi?",
            async () => {
                stopCamera();
                setHasStartedDetection(false);
                await saveEmotion("unknown", "camera");
            }
        );
    };

    const handleEmojiClick = (emoji: string) => {
        const emotionText = emotionMap[emoji];
        openModal(`Kamu memilih emosi ${emotionText}. Lanjutkan?`, async () => {
            setSelectedEmotion(emoji);
            await saveEmotion(emotionText, "manual");
        });
    };

    const saveEmotion = async (emotion: string, detectionType: string) => {
        setError("");
        if (!childProfileId) {
            setError("Profil anak tidak ditemukan");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/emotion-record", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    emotion,
                    detectionType,
                    childProfileId: parseInt(childProfileId, 10),
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Gagal menyimpan emosi");
                return;
            }

            // Tambahkan emosi baru ke riwayat
            setEmotionRecords((prev) => [data, ...prev]);
        } catch (err) {
            setError("Terjadi kesalahan saat menyimpan emosi");
        }
    };

    if (!childProfileId && !error) {
        return <div className="text-center py-10">Memuat profil anak...</div>;
    }

    return (
        <div className="relative flex flex-col min-h-screen bg-gray-50 overflow-hidden">
            <Navbar />

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center">
                        <p className="text-lg text-gray-800 mb-6">
                            {modalMessage}
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                onClick={() => {
                                    onConfirm();
                                    setShowModal(false);
                                }}
                            >
                                Ya
                            </button>
                            <button
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
                                onClick={() => setShowModal(false)}
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Konten Utama */}
            <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-bold text-center text-[#4A6FA5] mb-10">
                    Bagaimana Perasaanmu?
                </h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="bg-[#DDE8F7] rounded-xl shadow-md px-8 py-10 flex flex-col items-center justify-center mb-10 w-full max-w-md">
                    {!hasStartedDetection ? (
                        <>
                            <Image
                                src="/images/camera.png"
                                alt="Camera"
                                width={40}
                                height={40}
                                className="mb-4"
                            />
                            <button
                                onClick={handleDetectClick}
                                className="text-[#4A6FA5] font-semibold text-lg"
                            >
                                Mulai Deteksi
                            </button>
                        </>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                className="w-full max-w-xs rounded-lg mb-4"
                                autoPlay
                                muted
                                playsInline
                            />
                            <button
                                onClick={handleStopDetection}
                                className="text-[#4A6FA5] font-semibold text-lg"
                            >
                                Selesai Deteksi
                            </button>
                        </>
                    )}
                </div>

                <p className="text-gray-600 text-center mb-1">
                    Deteksi Emosi dari Ekspresi Wajahmu
                </p>
                <p className="text-gray-600 text-center mb-10">
                    atau <br /> Pilih Emosi Kamu Hari Ini
                </p>

                <div className="flex gap-6">
                    {[
                        { emoji: "😠", bg: "bg-red-400" },
                        { emoji: "😊", bg: "bg-green-400" },
                        { emoji: "😢", bg: "bg-blue-400" },
                        { emoji: "😨", bg: "bg-purple-400" },
                    ].map(({ emoji, bg }, index) => (
                        <div
                            key={index}
                            onClick={() => handleEmojiClick(emoji)}
                            className={`${bg} rounded-full w-16 h-16 flex items-center justify-center text-2xl shadow-sm hover:scale-110 transition-transform cursor-pointer`}
                        >
                            {emoji}
                        </div>
                    ))}
                </div>

                {(selectedEmotion || hasStartedDetection) && (
                    <div className="mt-10 text-center text-blue-700 text-lg font-medium">
                        {selectedEmotion && (
                            <p>
                                Emosi yang dipilih:{" "}
                                {emotionMap[selectedEmotion]}
                            </p>
                        )}
                        {hasStartedDetection && (
                            <p>Deteksi emosi sedang berlangsung.</p>
                        )}
                    </div>
                )}

                {emotionRecords.length === 0 && (
                    <div className="max-w-md mt-10 text-center">
                        <p className="text-gray-500 text-lg">
                            Belum ada suasana hati yang dicatat. Mulai sekarang!
                        </p>
                    </div>
                )}
            </div>

            {/* Ornamen Star */}
            <div className="absolute -bottom-16 -right-16 z-0">
                <Image
                    alt="star"
                    src="/images/Star-7.png"
                    width={500}
                    height={500}
                    className="object-contain"
                />
            </div>

            <div className="absolute -top-16 -left-48">
                <Image
                    alt="star"
                    src="/images/Star-7.png"
                    width={500}
                    height={500}
                    className="object-contain"
                />
            </div>
        </div>
    );
}
