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

        const { name, age, avatar, autism, adhd } = await request.json();

        // Validasi input
        if (!name || !age || avatar === null) {
            return NextResponse.json(
                { error: "Nama, usia, dan avatar wajib diisi" },
                { status: 400 }
            );
        }

        // Validasi usia sebagai angka
        const parsedAge = parseInt(age, 10);
        if (isNaN(parsedAge) || parsedAge < 0) {
            return NextResponse.json(
                { error: "Usia harus berupa angka yang valid" },
                { status: 400 }
            );
        }
        // Simpan profil anak ke database
        const childProfile = await prisma.childProfile.create({
            data: {
                name,
                age: parsedAge,
                avatar,
                autism,
                adhd,
                userId,
            },
        });

        return NextResponse.json(
            {
                message: "Profil anak berhasil disimpan",
                childProfileId: childProfile.id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menyimpan profil anak" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
