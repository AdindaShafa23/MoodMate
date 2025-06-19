import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
    try {
        const { name, email, password, role } = await request.json();

        // Validasi input
        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { error: "Semua field wajib diisi" },
                { status: 400 }
            );
        }

        // Validasi panjang kata sandi
        if (password.length < 8) {
            return NextResponse.json(
                { error: "Kata sandi minimal 8 karakter" },
                { status: 400 }
            );
        }

        // Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: "Email sudah terdaftar" },
                { status: 400 }
            );
        }

        // Hash kata sandi
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan pengguna ke database
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });

        // Buat token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" } // Token berlaku 7 hari
        );

        return NextResponse.json(
            {
                message: "Pendaftaran berhasil",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token, // Kembalikan token
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/register error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mendaftar" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
