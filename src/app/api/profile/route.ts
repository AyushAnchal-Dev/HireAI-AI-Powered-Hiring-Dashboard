import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                profile: {
                    include: {
                        projects: true,
                        learning: true,
                        certs: true,
                    }
                }
            }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json({
            ...user.profile,
            role: user.role,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.error("[PROFILE_GET]", error);
        return NextResponse.json({ error: "Internal Error: " + (error as Error).message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { bio, skills, company, projects, learning, certs } = body;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Upsert Profile
        const profile = await prisma.profile.upsert({
            where: { userId: user.id },
            update: {
                bio,
                skills,
                company,
                // For nested relations, we might need more complex logic to update/delete, 
                // but for now let's simple recreation or separate endpoints for performance.
                // Assuming body contains full lists to replace:
                projects: {
                    deleteMany: {},
                    create: (projects || []).map((p: any) => {
                        const { id, profileId, ...rest } = p;
                        return rest;
                    })
                },
                learning: {
                    deleteMany: {},
                    create: (learning || []).map((l: any) => {
                        const { id, profileId, ...rest } = l;
                        return rest;
                    })
                },
                certs: {
                    deleteMany: {},
                    create: (certs || []).map((c: any) => {
                        const { id, profileId, ...rest } = c;
                        return { ...rest, issuer: rest.issuer || "Unknown" };
                    })
                }
            },
            create: {
                userId: user.id,
                bio,
                skills,
                company,
                projects: {
                    create: (projects || []).map((p: any) => {
                        const { id, profileId, ...rest } = p;
                        return rest;
                    })
                },
                learning: {
                    create: (learning || []).map((l: any) => {
                        const { id, profileId, ...rest } = l;
                        return rest;
                    })
                },
                certs: {
                    create: (certs || []).map((c: any) => {
                        const { id, profileId, ...rest } = c;
                        return { ...rest, issuer: rest.issuer || "Unknown" };
                    })
                }
            },
        });

        return NextResponse.json(profile);
    } catch (error) {
        console.error("[PROFILE_PUT]", error);
        return NextResponse.json({ error: "Internal Error: " + (error as Error).message }, { status: 500 });
    }
}
