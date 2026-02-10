import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const candidate = await prisma.candidate.findFirst({
        where: { userId: (session.user as any).id },
        include: { user: { select: { email: true, name: true, image: true } } }
    });

    if (!candidate) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    return NextResponse.json(candidate);
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "candidate") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { bio, skills, projects, experience, education, name } = body;

        // Find candidate first
        const candidate = await prisma.candidate.findFirst({
            where: { userId: (session.user as any).id }
        });

        if (!candidate) {
            return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
        }

        // Update specific candidate using ID (ensures unique update)
        const updated = await prisma.candidate.update({
            where: { id: candidate.id },
            data: {
                bio,
                skills,
                projects: projects || [],
                experience: experience || [],
                education: education || [],
                name
            }
        });

        // Also update User name if provided
        if (name) {
            await prisma.user.update({
                where: { id: (session.user as any).id },
                data: { name }
            });
        }

        return NextResponse.json({ success: true, updated });
    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({
            error: "Failed to update profile",
            details: error.message || String(error)
        }, { status: 500 });
    }
}
