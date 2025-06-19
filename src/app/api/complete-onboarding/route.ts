import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../auth/middleware";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // Verifikasi token
        const authResult = authenticateToken(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const { userId } = authResult;

        // Validasi userId
        if (!userId) {
            console.error("userId is undefined or null");
            return NextResponse.json(
                { error: "User ID tidak ditemukan dalam token" },
                { status: 401 }
            );
        }

        const parsedUserId = parseInt(userId.toString(), 10);
        if (isNaN(parsedUserId)) {
            console.error(`Invalid userId: ${userId}`);
            return NextResponse.json(
                { error: "User ID tidak valid" },
                { status: 400 }
            );
        }

        // Perbarui status isOnboarded pengguna
        const updatedUser = await prisma.user.update({
            where: { id: parsedUserId },
            data: { isOnboarded: true },
        });

        return NextResponse.json(
            { message: "Onboarding selesai", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error("POST /api/complete-onboarding error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menyelesaikan onboarding" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
