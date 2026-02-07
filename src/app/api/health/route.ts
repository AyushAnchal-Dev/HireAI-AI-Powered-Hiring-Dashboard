import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        await prisma.$connect();
        // Use a simple query to verify connection, e.g. count users
        const userCount = await prisma.user.count();
        return NextResponse.json(
            { status: "ok", message: "Database connected", userCount },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Database connection failed:", error);
        return NextResponse.json(
            { status: "error", message: "Database connection failed", error: error.message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
