import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { name, email, password, role } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 409 }
            );
        }

        // Create user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password, // Note: In production, hash this password!
                role: role as "recruiter" | "candidate",
                // Automatically create a candidate profile if role is candidate
                ...(role === "candidate"
                    ? {
                        candidates: {
                            create: {
                                name,
                                resumeUrl: "",
                                skills: [],
                            },
                        },
                    }
                    : {}),
            },
        });

        return NextResponse.json(
            { message: "User created successfully", userId: newUser.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
