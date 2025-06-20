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

        // Ambil data dari body
        const { emotion, detectionType, childProfileId } = await request.json();

        // Validasi input
        if (!emotion || emotion.trim() === "") {
            return NextResponse.json(
                { error: "Emosi wajib diisi" },
                { status: 400 }
            );
        }
        if (!childProfileId) {
            return NextResponse.json(
                { error: "childProfileId wajib diisi" },
                { status: 400 }
            );
        }
        if (!["manual", "camera"].includes(detectionType)) {
            return NextResponse.json(
                { error: "Tipe deteksi tidak valid" },
                { status: 400 }
            );
        }

        // Validasi childProfile
        const childProfile = await prisma.childProfile.findUnique({
            where: { id: parseInt(childProfileId, 10) },
        });
        if (!childProfile || childProfile.userId !== userId) {
            return NextResponse.json(
                { error: "Profil anak tidak ditemukan atau tidak diizinkan" },
                { status: 404 }
            );
        }

        // Simpan emosi
        const emotionRecord = await prisma.emotionRecord.create({
            data: {
                childProfileId: parseInt(childProfileId, 10),
                emotion: emotion.trim(),
                detectionType: detectionType || "manual",
            },
        });

        // Format respons
        const response = {
            id: emotionRecord.id.toString(),
            emotion: emotionRecord.emotion,
            detectionType: emotionRecord.detectionType,
            childProfileId: emotionRecord.childProfileId.toString(),
            timestamp: emotionRecord.createdAt.getTime(),
            date: emotionRecord.createdAt.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("POST /api/emotion-record error:", error.message);
        } else {
            console.error("POST /api/emotion-record error:", error);
        }
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menyimpan emosi" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET(request: Request) {
    try {
        // Verifikasi token
        const authResult = authenticateToken(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const { userId } = authResult;

        // Ambil childProfileId dari query
        const { searchParams } = new URL(request.url);
        const childProfileId = searchParams.get("childProfileId");

        if (!childProfileId) {
            return NextResponse.json(
                { error: "childProfileId wajib diisi" },
                { status: 400 }
            );
        }

        // Validasi childProfile
        const parsedChildProfileId = parseInt(childProfileId, 10);
        const childProfile = await prisma.childProfile.findUnique({
            where: { id: parsedChildProfileId },
        });
        if (!childProfile || childProfile.userId !== userId) {
            return NextResponse.json(
                { error: "Profil anak tidak ditemukan atau tidak diizinkan" },
                { status: 404 }
            );
        }

        // Ambil semua emosi
        const emotionRecords = await prisma.emotionRecord.findMany({
            where: {
                childProfileId: parsedChildProfileId,
            },
            orderBy: { createdAt: "desc" },
        });

        // Format respons
        const formattedRecords = emotionRecords.map((record) => ({
            id: record.id.toString(),
            emotion: record.emotion,
            detectionType: record.detectionType,
            childProfileId: record.childProfileId.toString(),
            timestamp: record.createdAt.getTime(),
            date: record.createdAt.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
        }));

        return NextResponse.json(formattedRecords, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("POST /api/emotion-record error:", error.message);
        } else {
            console.error("POST /api/emotion-record error:", error);
        }
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menyimpan emosi" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
