import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Validasi input
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email dan kata sandi wajib diisi" },
                { status: 400 }
            );
        }

        // Cari pengguna berdasarkan email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json(
                { error: "Email atau kata sandi salah" },
                { status: 401 }
            );
        }

        // Verifikasi kata sandi
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Email atau kata sandi salah" },
                { status: 401 }
            );
        }

        // Buat JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || "",
            { expiresIn: "1h" }
        );

        return NextResponse.json(
            {
                message: "Login berhasil",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat login" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
