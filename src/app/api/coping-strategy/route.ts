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

        const { strategies, childProfileId } = await request.json();

        // Validasi input
        if (
            !Array.isArray(strategies) ||
            strategies.length === 0 ||
            !childProfileId
        ) {
            return NextResponse.json(
                { error: "Strategi coping dan childProfileId wajib diisi" },
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

        // Simpan strategi coping ke database
        await prisma.copingStrategy.createMany({
            data: strategies.map((strategy: string) => ({
                strategy,
                childProfileId,
            })),
        });

        return NextResponse.json(
            { message: "Strategi coping berhasil disimpan" },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menyimpan strategi coping" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
