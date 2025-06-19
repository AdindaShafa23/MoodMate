"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
    isActive: boolean;
}

export const LogoutButton = ({ isActive }: LogoutButtonProps) => {
    const router = useRouter();

    const handleLogout = () => {
        // Hapus token dari localStorage
        localStorage.removeItem("token");
        // Redirect ke halaman login
        router.push("/");
    };

    return (
        <button
            onClick={handleLogout}
            className={`p-3 rounded-full transition-all ${
                isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            title="Logout"
        >
            <LogOut className="w-6 h-6" />
        </button>
    );
};
