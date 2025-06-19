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
        const { title, text, childProfileId } = await request.json();

        // Validasi input
        if (!text || text.trim() === "") {
            return NextResponse.json(
                { error: "Teks catatan wajib diisi" },
                { status: 400 }
            );
        }
        if (!childProfileId) {
            return NextResponse.json(
                { error: "childProfileId wajib diisi" },
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

        // Simpan catatan
        const expressionRecord = await prisma.expressionRecord.create({
            data: {
                userId,
                childProfileId: parseInt(childProfileId, 10),
                title: title?.trim() || "Tanpa Judul",
                text: text.trim(),
            },
        });

        // Format respons sesuai frontend
        const response = {
            id: expressionRecord.id.toString(),
            title: expressionRecord.title,
            text: expressionRecord.text,
            timestamp: expressionRecord.createdAt.getTime(),
            date: expressionRecord.createdAt.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error("POST error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menyimpan catatan" },
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

        // Pengecekan model ExpressionRecord
        if (!prisma.expressionRecord) {
            console.error(
                "Model ExpressionRecord tidak ditemukan di Prisma Client"
            );
            return NextResponse.json(
                { error: "Model ExpressionRecord tidak tersedia" },
                { status: 500 }
            );
        }

        // Ambil semua catatan
        const expressionRecords = await prisma.expressionRecord.findMany({
            where: {
                childProfileId: parsedChildProfileId,
                userId,
            },
            orderBy: { createdAt: "desc" },
        });

        // Format respons
        const formattedRecords = expressionRecords.map((record) => ({
            id: record.id.toString(),
            title: record.title,
            text: record.text,
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
    } catch (error) {
        console.error("GET error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mengambil catatan" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(request: Request) {
    try {
        // Verifikasi token
        const authResult = authenticateToken(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const { userId } = authResult;

        // Ambil data dari body
        const { id, title, text, childProfileId } = await request.json();

        // Validasi input
        if (!id) {
            return NextResponse.json(
                { error: "ID catatan wajib diisi" },
                { status: 400 }
            );
        }
        if (!text || text.trim() === "") {
            return NextResponse.json(
                { error: "Teks catatan wajib diisi" },
                { status: 400 }
            );
        }
        if (!childProfileId) {
            return NextResponse.json(
                { error: "childProfileId wajib diisi" },
                { status: 400 }
            );
        }

        // Validasi catatan
        const parsedId = parseInt(id, 10);
        const expressionRecord = await prisma.expressionRecord.findUnique({
            where: { id: parsedId },
        });
        if (!expressionRecord || expressionRecord.userId !== userId) {
            return NextResponse.json(
                { error: "Catatan tidak ditemukan atau tidak diizinkan" },
                { status: 404 }
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

        // Perbarui catatan
        const updatedRecord = await prisma.expressionRecord.update({
            where: { id: parsedId },
            data: {
                title: title?.trim() || "Tanpa Judul",
                text: text.trim(),
                childProfileId: parsedChildProfileId,
            },
        });

        // Format respons
        const response = {
            id: updatedRecord.id.toString(),
            title: updatedRecord.title,
            text: updatedRecord.text,
            timestamp: updatedRecord.updatedAt.getTime(),
            date: updatedRecord.updatedAt.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("PUT error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat memperbarui catatan" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request: Request) {
    try {
        // Verifikasi token
        const authResult = authenticateToken(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const { userId } = authResult;

        // Ambil id dari query
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "ID catatan wajib diisi" },
                { status: 400 }
            );
        }

        // Validasi catatan
        const parsedId = parseInt(id, 10);
        const expressionRecord = await prisma.expressionRecord.findUnique({
            where: { id: parsedId },
        });
        if (!expressionRecord || expressionRecord.userId !== userId) {
            return NextResponse.json(
                { error: "Catatan tidak ditemukan atau tidak diizinkan" },
                { status: 404 }
            );
        }

        // Hapus catatan
        await prisma.expressionRecord.delete({
            where: { id: parsedId },
        });

        return NextResponse.json(
            { message: "Catatan berhasil dihapus" },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menghapus catatan" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
