import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        include: { profile: true }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Sanitize
    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser);
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "recruiter") {
        // Allow self-update for name regardless of role? No, keep it role-scoped if specific endpoint
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, company } = body;

        // Update User
        await prisma.user.update({
            where: { id: (session.user as any).id },
            data: { name }
        });

        // Update Profile (Upsert)
        // Schema: user has profile Profile?
        // if user.profile is null, create.

        await prisma.profile.upsert({
            where: { userId: (session.user as any).id },
            create: {
                userId: (session.user as any).id,
                company: company
            },
            update: {
                company: company
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
