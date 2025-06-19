import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function authenticateToken(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Token tidak ditemukan atau format tidak valid" },
                { status: 401 }
            );
        }

        const token = authHeader.replace("Bearer ", "");
        const payload = jwt.verify(token, JWT_SECRET) as {
            userId?: number;
            id?: number;
            sub?: string;
        };

        // Sesuaikan dengan struktur payload JWT
        const userId =
            payload.userId || payload.id || parseInt(payload.sub || "", 10);
        if (!userId || isNaN(userId)) {
            return NextResponse.json(
                { error: "User ID tidak ditemukan dalam token" },
                { status: 401 }
            );
        }

        return { userId };
    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json(
            { error: "Token tidak valid atau kadaluarsa" },
            { status: 401 }
        );
    }
}
