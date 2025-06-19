import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../auth/middleware";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const authResult = authenticateToken(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const { userId } = authResult;

        const { searchParams } = new URL(request.url);
        const childProfileId = searchParams.get("childProfileId");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        if (!childProfileId) {
            return NextResponse.json(
                { error: "childProfileId wajib diisi" },
                { status: 400 }
            );
        }

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

        const where: any = {
            childProfileId: parsedChildProfileId,
            emotion: { not: "unknown" },
        };

        if (startDate && endDate) {
            // Konversi ke UTC dengan offset WIB (+7 jam)
            const start = new Date(startDate);
            start.setHours(start.getHours() - 7);
            const end = new Date(endDate);
            end.setHours(end.getHours() - 7);
            where.createdAt = {
                gte: start,
                lte: end,
            };
        }

        console.log("Query params:", { childProfileId, startDate, endDate });
        console.log("Where clause:", where);

        const emotionRecords = await prisma.emotionRecord.findMany({
            where,
            select: {
                id: true,
                emotion: true,
                createdAt: true,
            },
            orderBy: { createdAt: "asc" },
        });

        console.log("Found records:", emotionRecords);

        const formattedRecords = emotionRecords.map((record) => ({
            id: record.id.toString(),
            date: record.createdAt.toISOString().split("T")[0],
            emotions: [record.emotion.toLowerCase()],
            timestamp: record.createdAt.getTime(),
        }));

        return NextResponse.json(formattedRecords, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mengambil data emosi" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
