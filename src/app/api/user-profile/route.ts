import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../auth/middleware";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        // Verifikasi token
        const authResult = authenticateToken(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const { userId } = authResult;

        // Ambil profil anak terkait pengguna
        const childProfiles = await prisma.childProfile.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                age: true,
                avatar: true,
                autism: true,
                adhd: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json({ childProfiles }, { status: 200 });
    } catch (error) {
        console.error("GET /api/user-profile error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mengambil profil anak" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
