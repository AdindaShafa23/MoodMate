"use client";

import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import { Trash2, Edit3, Calendar, Save, X, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface SavedEntry {
    id: string;
    title: string;
    text: string;
    timestamp: number;
    date: string;
}

export default function EkspresikanPage() {
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [saved, setSaved] = useState(false);
    const [savedEntries, setSavedEntries] = useState<SavedEntry[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [error, setError] = useState("");
    const [childProfileId, setChildProfileId] = useState<string | null>(null);
    const router = useRouter();

    // Load childProfileId and entries on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
            return;
        }

        const fetchChildProfileAndEntries = async () => {
            try {
                // Ambil profil anak dari backend
                const response = await fetch("/api/user-profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.error || "Gagal mengambil profil anak"
                    );
                }
                if (data.childProfiles.length === 0) {
                    setError(
                        "Tidak ada profil anak. Silakan buat profil anak terlebih dahulu."
                    );
                    router.push("/profilanak");
                    return;
                }
                const profileId = data.childProfiles[0].id.toString();
                setChildProfileId(profileId);

                // Ambil catatan dari backend
                const entriesResponse = await fetch(
                    `/api/expression-records?childProfileId=${profileId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const entriesData = await entriesResponse.json();
                if (!entriesResponse.ok) {
                    throw new Error(
                        entriesData.error || "Gagal mengambil catatan"
                    );
                }
                setSavedEntries(entriesData);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Terjadi kesalahan yang tidak diketahui");
                }
            }
        };

        fetchChildProfileAndEntries();
    }, [router]);

    const handleSave = async () => {
        if (text.trim() === "" || !childProfileId) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/expression-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: title.trim(),
                    text: text.trim(),
                    childProfileId,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Gagal menyimpan catatan");
            }

            setSavedEntries((prev) => [data, ...prev]);
            setText("");
            setTitle("");
            setSaved(true);
            setError("");
            setTimeout(() => setSaved(false), 3000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Terjadi kesalahan yang tidak diketahui");
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/expression-records?id=${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Gagal menghapus catatan");
            }

            setSavedEntries((prev) => prev.filter((entry) => entry.id !== id));
            setError("");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Terjadi kesalahan yang tidak diketahui");
            }
        }
    };

    const handleEdit = (entry: SavedEntry) => {
        setEditingId(entry.id);
        setEditTitle(entry.title || "");
        setEditText(entry.text);
    };

    const handleSaveEdit = async (id: string) => {
        if (editText.trim() === "" || !childProfileId) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/expression-records", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id,
                    title: editTitle.trim(),
                    text: editText.trim(),
                    childProfileId,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Gagal memperbarui catatan");
            }

            setSavedEntries((prev) =>
                prev.map((entry) => (entry.id === id ? data : entry))
            );
            setEditingId(null);
            setEditText("");
            setEditTitle("");
            setError("");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Terjadi kesalahan yang tidak diketahui");
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText("");
        setEditTitle("");
    };

    const filteredEntries = savedEntries.filter(
        (entry) =>
            (entry.title || "Tanpa Judul")
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            entry.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!childProfileId && !error) {
        return <div className="text-center py-10">Memuat profil anak...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
                    Ekspresikan Perasaanmu
                </h1>

                {/* Error Message */}
                {error && (
                    <div className="max-w-3xl mx-auto mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {/* Input Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 max-w-3xl mx-auto">
                    <input
                        type="text"
                        className="w-full p-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4"
                        placeholder="Judul catatan (opsional)..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        className="w-full p-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[200px] resize-none"
                        placeholder="Tulis perasaanmu di sini..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500">
                            {text.length} karakter
                        </span>
                        <button
                            onClick={handleSave}
                            disabled={text.trim() === "" || !childProfileId}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Simpan
                        </button>
                    </div>
                    {saved && (
                        <div className="mt-3 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                            ✅ Catatan berhasil disimpan!
                        </div>
                    )}
                </div>

                {savedEntries.length > 0 && (
                    <div className="max-w-3xl mx-auto mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Cari berdasarkan judul atau isi catatan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {filteredEntries.length > 0 && (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <Calendar className="w-6 h-6" />
                            Catatan Tersimpan ({filteredEntries.length}
                            {searchQuery && ` dari ${savedEntries.length}`})
                        </h2>

                        <div className="space-y-4">
                            {filteredEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="bg-white rounded-2xl p-6 shadow-sm"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                {entry.title || "Tanpa Judul"}
                                            </h3>
                                            <span className="text-sm text-gray-500">
                                                {entry.date}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(entry)
                                                }
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit catatan"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(entry.id)
                                                }
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Hapus catatan"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {editingId === entry.id ? (
                                        <div>
                                            <input
                                                type="text"
                                                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300 mb-3"
                                                placeholder="Judul catatan..."
                                                value={editTitle}
                                                onChange={(e) =>
                                                    setEditTitle(e.target.value)
                                                }
                                            />
                                            <textarea
                                                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[120px] resize-none"
                                                value={editText}
                                                placeholder="isi"
                                                onChange={(e) =>
                                                    setEditText(e.target.value)
                                                }
                                            />
                                            <div className="flex justify-end gap-2 mt-3">
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Batal
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleSaveEdit(entry.id)
                                                    }
                                                    disabled={
                                                        editText.trim() ===
                                                            "" ||
                                                        !childProfileId
                                                    }
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center gap-2"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    Simpan
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                            {entry.text}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {savedEntries.length === 0 && (
                    <div className="max-w-3xl mx-auto text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Calendar className="w-16 h-16 mx-auto" />
                        </div>
                        <p className="text-gray-500 text-lg">
                            Belum ada catatan tersimpan. Mulai ekspresikan
                            perasaanmu!
                        </p>
                    </div>
                )}

                {savedEntries.length > 0 &&
                    filteredEntries.length === 0 &&
                    searchQuery && (
                        <div className="max-w-3xl mx-auto text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Search className="w-16 h-16 mx-auto" />
                            </div>
                            <p className="text-gray-500 text-lg">
                                Tidak ada catatan yang cocok dengan pencarian &quot;{searchQuery}&quot;
                            </p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-4 text-blue-600 hover:text-blue-700 underline"
                            >
                                Hapus pencarian
                            </button>
                        </div>
                    )}
            </main>
        </div>
    );
}
