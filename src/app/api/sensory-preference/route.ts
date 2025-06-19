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

        const { preferences, childProfileId } = await request.json();

        // Validasi input
        if (
            !Array.isArray(preferences) ||
            preferences.length === 0 ||
            !childProfileId
        ) {
            return NextResponse.json(
                { error: "Preferensi dan childProfileId wajib diisi" },
                { status: 400 }
            );
        }

        // Validasi childProfileId
        const childProfile = await prisma.childProfile.findUnique({
            where: { id: childProfileId },
        });
        if (!childProfile || childProfile.userId !== userId) {
            return NextResponse.json(
                { error: "Profil anak tidak ditemukan atau tidak diizinkan" },
                { status: 404 }
            );
        }

        // Simpan preferensi sensorik ke database
        await prisma.sensoryPreference.createMany({
            data: preferences.map((preference: string) => ({
                preference,
                childProfileId,
            })),
        });

        return NextResponse.json(
            { message: "Preferensi sensorik berhasil disimpan" },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menyimpan preferensi sensorik" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
